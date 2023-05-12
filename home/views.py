from django.shortcuts import render
from .models import Products, MainCategories, SubCategories, CookedOrRaw, Source, Allergens, ProductTest, AllergenTest  #, ProductAllergens, AllergenGroup, 
from django.db.models import Prefetch
from django.http import HttpResponseRedirect, JsonResponse
from django.db.models import Q
import json
from . serializers import ProductsSerializer, ProductTestSerializer
import gspread
from django.contrib.auth.decorators import login_required


# Create your views here.
def index(request):
    print("INDEX")
    context = {
        # 'products': products
    }
    return render(request, "home/index.html", context)


def about(request):
    print("ABOUT")
    context = {
        # 'products': products
    }
    return render(request, "home/about.html", context)


def how_to(request):
    print("HOW TO")
    context = {
        # 'products': products
    }
    return render(request, "home/how_to.html", context)


def help_us_test(request):
    print("HELP US TEST")
    context = {
        # 'products': products
    }
    return render(request, "home/help_us_test.html", context)


def get_products(request, q):
    print("getProducts = ", q)
    products = Products.objects.all().select_related('category', 'sub_category', 'cooked_or_raw', 'source').prefetch_related('allergen')
    # products = Products.objects.all().filter(Q(name__icontains=q)).select_related('category', 'sub_category', 'cooked_or_raw', 'source').prefetch_related('allergen')
    replacements = [("'", ""), ("-", "")]
    for char, replacement in replacements:
        if char in q:
            q = q.replace(char, replacement)
    keywords = q.split()
    for word in keywords:
        print("word = ", word)
        if word == '&' or word == '+':
            print("IF")
            word = 'and'
        if len(word) > 1:
            if word.endswith('s') or word.endswith('d'):
                word = word[:-1]
        print("word = ", word)
        products = products.filter(Q(name__icontains=word))
    json_products = ProductsSerializer(products, many=True).data
    # return JsonResponse({"products": json_products, "q": q}, safe=False)
    qr_json = json.dumps(list(json_products), ensure_ascii=False, default=str)
    return JsonResponse({"products": qr_json, "q": q}, safe=False)


def get_test_products(request):
    print("TEST PRODUCTS")
    products = Products.objects.all()
    json_products = ProductsSerializer(products, many=True).data
    return JsonResponse({"products": json_products}, safe=False)


@login_required
def product_admin(request):
    if 'task' in request.GET:
        sa = gspread.service_account(filename="config/gspread/service_account.json")
        sh = sa.open("cinqual")
        wks = sh.worksheet("Sheet1")
        records = wks.get_all_records()
        task = request.GET['task']
        print("task = ", task)
        if task == 'add_all_products':
            print("add_all_products")
            main_categories = MainCategories.objects.count()
            sub_categories = SubCategories.objects.count()
            sources = Source.objects.count()
            cooked_raw = CookedOrRaw.objects.count()
            allergens = Allergens.objects.count()
            print("main_categories = ", main_categories)
            print("sub_categories = ", sub_categories)
            print("sources = ", sources)
            print("cooked_raw = ", cooked_raw)
            print("allergens = ", allergens)
            if main_categories > 0 and sub_categories > 0 and sources > 0 and cooked_raw > 0 and allergens > 0:
                print("Add products start")
                products = Products.objects.all()
                # for product in products:
                #     product.delete()
                for record in records:
                    # print(record)
                    category = MainCategories.objects.get(name=record['Main_Category'])
                    sub_category = SubCategories.objects.get(name=record['Sub_Category'])
                    name = record['Product_Name'].title()
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
                    product = Products.objects.create(
                        product_id=record['ID'],
                        category=category,
                        sub_category=sub_category,
                        cooked_or_raw=cooked_raw,
                        source=source,
                        name=name,
                        portion_size=record['Portion_Size'],
                        energy_kcal=record['Energy_Kcal_decimal_point'],
                        fat=record['Fat_with_decimal_point'],
                        protein=record['Protein_with_decimal_point'],
                        carbohydrates=record['Carbs_with_decimal_point'],
                        salt=None,  # record['Salt_(g/100g)'],
                        sugars=None,  # record['Sugars_(g/100g)'],
                        fibre=None,  # record['Fibres_(g/100g)'],
                        deep_frying_index=record['Deep_Frying'],
                    )

                    if record['Allergens'] != '':
                        allergens_split = record['Allergens'].split(',')
                        for item in allergens_split:
                            sub_allergen = item.split('/')
                            if len(sub_allergen) > 1:
                                # print(sub_allergen)
                                # allergen_group = sub_allergen[0]
                                allergen_group = sub_allergen[0]
                                for index, x in enumerate(sub_allergen):
                                    if index != 0:
                                        allergen = Allergens.objects.get(name=x, group=allergen_group)
                                        product.allergen.add(allergen)
                            else:
                                print(sub_allergen)
                                print(sub_allergen[0])
                                allergen_group = sub_allergen[0]
                                name = None
                                allergen = Allergens.objects.get(name=name, group=allergen_group)
                                product.allergen.add(allergen)
        if task == 'delete_all_products':
            print("delete_all_products")
            products = Products.objects.all()
            for product in products:
                product.delete()
        if task == 'add_all_main_categories':
            print("add_all_main_categories")
            main_categories = MainCategories.objects.all()
            for category in main_categories:
                # pass
                category.delete()
            mainCategoriesArray = []
            for record in records:
                if record['Main_Category'] not in mainCategoriesArray:
                    mainCategoriesArray.append(record['Main_Category'])
            print(mainCategoriesArray)
            for item in mainCategoriesArray:
                MainCategories.objects.create(
                    name=item,
                )
        if task == 'delete_all_main_categories':
            print("delete_all_main_categories")
            main_categories = MainCategories.objects.all()
            for category in main_categories:
                # pass
                category.delete()
        if task == 'add_all_sub_categories':
            print("add_all_sub_categories")
            sub_categories = MainCategories.objects.all()
            for category in sub_categories:
                # pass
                category.delete()
            subCategoriesArray = []
            for record in records:
                if record['Sub_Category'] not in subCategoriesArray:
                    subCategoriesArray.append(record['Sub_Category'])
            print(subCategoriesArray)
            for item in subCategoriesArray:
                SubCategories.objects.create(
                    name=item,
                )
        if task == 'delete_all_sub_categories':
            print("delete_all_sub_categories")
            sub_categories = SubCategories.objects.all()
            for category in sub_categories:
                # pass
                category.delete()
        if task == 'add_all_sources':
            print("add_all_sources")
            sources = Source.objects.all()
            for category in sources:
                # pass
                category.delete()
            sourcesArray = []
            for record in records:
                if record['Source'] not in sourcesArray:
                    sourcesArray.append(record['Source'])
            print(sourcesArray)
            for item in sourcesArray:
                Source.objects.create(
                    name=item,
                )
        if task == 'delete_all_sources':
            print("delete_all_sources")
            sources = Source.objects.all()
            for source in sources:
                # pass
                source.delete()
        if task == 'add_all_cooked_raw':
            print("add_all_cooked_raw")
            cookedRaw = CookedOrRaw.objects.all()
            for category in cookedRaw:
                # pass
                category.delete()
            cookedRawArray = []
            for record in records:
                if record['Cooked_or_Raw'] not in cookedRawArray:
                    cookedRawArray.append(record['Cooked_or_Raw'])
            print(cookedRawArray)
            for item in cookedRawArray:
                CookedOrRaw.objects.create(
                    name=item,
                )
        if task == 'delete_all_cooked_raw':
            print("delete_all_cooked_raw")
            cookedRaw = CookedOrRaw.objects.all()
            for category in cookedRaw:
                # pass
                category.delete()
        if task == 'add_all_allergens':
            allergens = Allergens.objects.all()
            for allergen in allergens:
                allergen.delete()
            wks = sh.worksheet("Sheet2")
            allergen_data = wks.get_all_records()
            for row in allergen_data:
                if row['name'] == '':
                    row['name'] = None
                if row['US_Index'] == '':
                    row['US_Index'] = None
                Allergens.objects.create(
                    name=row['name'],
                    group=row['allergen_group'],
                    eu_index=row['EU_Index'],
                    us_index=row['US_Index'],
                )
        if task == 'delete_all_allergens':
            allergens = Allergens.objects.all()
            for allergen in allergens:
                allergen.delete()
        print("OPERATIONS DONE")
    products = Products.objects.count()
    main_categories = MainCategories.objects.count()
    sub_categories = SubCategories.objects.count()
    sources = Source.objects.count()
    cooked_raw = CookedOrRaw.objects.count()
    allergens = Allergens.objects.count()
    context = {
        'total_items': products,
        'main_categories': main_categories,
        'sub_categories': sub_categories,
        'sources': sources,
        'cooked_raw': cooked_raw,
        'allergens': allergens
    }
    return render(request, "home/product-admin.html", context)
