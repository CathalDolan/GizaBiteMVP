from django.shortcuts import render
from .models import Products, Allergens
from django.db.models import Prefetch
from django.http import HttpResponseRedirect, JsonResponse
from django.db.models import Q
import json
from . serializers import ProductsSerializer


# Create your views here.
def index(request):
    product = Products.objects.all()[30:40].prefetch_related('Allergens')
    # print(product)
    # for item in product:
    #     print(item, item.Allergens.all())
    context = {
        'product': product
    }
    return render(request, "home/index.html", context)


def get_products(request, q):
    print("getProducts = ", q)
    products = Products.objects.all().filter(Q(product_name__icontains=q)).prefetch_related('Allergens')
    json_products = ProductsSerializer(products, many=True).data
    return JsonResponse({"products": json_products}, safe=False)
