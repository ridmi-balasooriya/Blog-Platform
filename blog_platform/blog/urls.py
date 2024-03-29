from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.contrib.auth import views as auth_views


router = DefaultRouter()
router.register(r'posts', views.PostModelViewSet)
router.register(r'my_posts', views.PostModelViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'tags', views.TagViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'likes', views.LikeViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'author_profile', views.AuthorProfileModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('postlist', views.PostListView.as_view(), name='postlist'),
    path('postlist/<int:id>/',
         views.PostDetailView.as_view(), name='post_detail'),
    path('featuredpost', views.FeaturedPostView.as_view(), name='feaured_post'),
    path('recentposts', views.RecentPostsView.as_view(), name='recent_posts'),
    path('popular_categories', views.PopularCategoriesView.as_view(),
         name='popular_categories'),

    path('top_authors', views.TopAuthorViewSet.as_view(), name='top_authors'),

    # Start - User Authenticatio Related Urls
    path('token', views.CustomAuthToken.as_view(), name='token_obtain'),
    path('register', views.UserRegistrationView.as_view(), name='register'),
    path('logout', views.LogOutView.as_view(), name='logout'),
    path('password_reset', views.password_reset, name='password_reset'),
    path('password_reset/confirm/<str:uidb64>/<str:token>/',
         views.password_reset_confirm, name='password_reset_confirm'),


    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(),
         name='password_reset_done'),

    path('password-reset-complete/', auth_views.PasswordResetCompleteView.as_view(),
         name='password_reset_complete'),
    # END - User Authenticatio Related Urls
]
