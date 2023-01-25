from django.shortcuts import render
from .models import Products, Allergens
from django.db.models import Prefetch


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

