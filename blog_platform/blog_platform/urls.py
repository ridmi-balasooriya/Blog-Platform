"""
URL configuration for blog_platform project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
# from blog_platform.view import FrontEndAppView

# Image Sevrve and Debuging
from django.views.static import serve
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('media/<path>', serve, {'document_root': settings.MEDIA_ROOT}),
    path('api/', include('blog.urls')),
    # re_path(r'^', FrontEndAppView.as_view(), name='frontend-app-view'),
]

# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Image Debuging
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
