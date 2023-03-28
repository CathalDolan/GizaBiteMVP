from django.shortcuts import render
from .models import Products, MainCategories, SubCategories, CookedOrRaw, ProductAllergens, Source, Allergens, AllergenGroup
from django.db.models import Prefetch
from django.http import HttpResponseRedirect, JsonResponse
from django.db.models import Q
import json
# from . serializers import ProductsSerializer
import gspread


# Create your views here.
def index(request):
    print("INDEX")
    sa = gspread.service_account(filename="config/gspread/service_account.json")
    sh = sa.open("cinqual")
    wks = sh.worksheet("Sheet1")
    # print('Rows: ', wks.row_count)
    # print('Cols: ', wks.col_count)
    # products = Products.objects.all()
    # for product in products:
    #     product.delete()
    # print(wks.get('A2:Y5193'))
    # print(wks.get_all_records())
    # allergen_group = []
    # allergen = []
    records = wks.get_all_records()
    # records = wks.get('A2:Y100')
    for record in records:
        category = MainCategories.objects.get(name=record['Main_Category'])
        sub_category = SubCategories.objects.get(name=record['Sub-Category'])
        if record['Cooked_or_Raw'] == '':
            cooked_raw = None
        else:
            cooked_raw = CookedOrRaw.objects.get(name=record['Cooked_or_Raw'])
        source = Source.objects.get(name=record['Source'])
        if record['Energy_Kcal_decimal_point'] == '':
            record['Energy_Kcal_decimal_point'] = None
        if record['Fat_with_decimal_point'] == '':
            record['Fat_with_decimal_point'] = None
        if record['Protein_with_decimal_point'] == '':
            record['Protein_with_decimal_point'] = None
        if record['Carbs_with_decimal_point'] == '':
            record['Carbs_with_decimal_point'] = None
        if record['Salt_(g/100g)'] == '':
            record['Salt_(g/100g)'] = None
        if record['Sugars_(g/100g)'] == '':
            record['Sugars_(g/100g)'] = None
        if record['Fibres_(g/100g)'] == '':
            record['Fibres_(g/100g)'] = None
        # product = Products.objects.create(
        #     product_id=record['ID'],
        #     category=category,
        #     sub_category=sub_category,
        #     cooked_or_raw=cooked_raw,
        #     source=source,
        #     product_name=record['Product_Name'],
        #     portion_size=record['Portion_Size'],
        #     energy_kcal=record['Energy_Kcal_decimal_point'],
        #     fat=record['Fat_with_decimal_point'],
        #     protein=record['Protein_with_decimal_point'],
        #     carbohydrates=record['Carbs_with_decimal_point'],
        #     salt=record['Salt_(g/100g)'],
        #     sugars=record['Sugars_(g/100g)'],
        #     fibre=record['Fibres_(g/100g)'],
        #     deep_frying_index=record['Deep_Frying'],
        # )

        if record['Allergens'] != '':
            allergens_split = record['Allergens'].split(',')
            for item in allergens_split:
                sub_allergen = item.split('/')
                if len(sub_allergen) > 1:
                    # print(sub_allergen)
                    # allergen_group = sub_allergen[0]
                    allergen_group = AllergenGroup.objects.get(name=sub_allergen[0])
                    for index, x in enumerate(sub_allergen):
                        if index != 0:
                            print(allergen_group, x)
                            allergen = Allergens.objects.get(name=x)
                            print(allergen)
                            # m1 = ProductAllergens(
                            #     product=product,
                            #     allergen=allergen,
                            #     allergen_group=allergen_group,
                            # )
                            # m1.save()
                else:
                    allergen_group = AllergenGroup.objects.get(name=sub_allergen[0])
                    allergen = Allergens.objects.get(name=sub_allergen[0])
                    # print("ELse")
                    # m1 = ProductAllergens(
                    #     product=product,
                    #     allergen=allergen,
                    #     allergen_group=allergen_group,
                    # )
                    # m1.save()

    context = {
        # 'product': product
    }
    return render(request, "home/index.html", context)


def get_products(request, q):
    print("getProducts = ", q)
    products = Products.objects.all().filter(Q(product_name__icontains=q)).prefetch_related('Allergens')
    json_products = ProductsSerializer(products, many=True).data
    return JsonResponse({"products": json_products}, safe=False)
