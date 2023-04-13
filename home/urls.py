from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name="home"),
    path('get_products/<q>', views.get_products, name='get_products'),
    path('get_test_products', views.get_test_products, name='get_test_products'),
]
