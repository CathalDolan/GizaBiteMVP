from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name="home"),
    path('about.html', views.about, name="about"),
    path('how_to.html', views.how_to, name="how_to"),
    path('help_us_test.html', views.help_us_test, name="help_us_test"),
    path('get_products/<q>', views.get_products, name='get_products'),
    path('get_test_products', views.get_test_products, name='get_test_products'),
    path('product_admin', views.product_admin, name='product_admin'),
]
