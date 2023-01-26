from django.shortcuts import render
from .models import Products, Allergens
from django.db.models import Prefetch
from django.http import HttpResponseRedirect, JsonResponse
from django.db.models import Q


# Create your views here.
def index(request):
    product = Products.objects.all()[30:40].prefetch_related('Allergens')
    # print(product)
    for item in product:
        print(item, item.Allergens.all())
    context = {
        'product': product
    }
    return render(request, "home/index.html", context)


# @csrf_exempt
def get_products(request, q):
    print("getProducts = ", q)
    products = Products.objects.all().filter(Q(product_name__icontains=q)).values()
    for item in products:
        print("item = ", item)
    return JsonResponse({"products": list(products)}, safe=False)
