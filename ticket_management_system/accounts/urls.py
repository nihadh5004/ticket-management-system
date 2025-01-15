from django.urls import path
from .views import LoginView, RefreshTokenView, SignupView, ReadAllUsersView,EditUserPermissionsView


urlpatterns = [
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh_token'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', SignupView.as_view(), name='signup'),
    path('users/', ReadAllUsersView.as_view(), name='read-users'),
    path('users/<int:user_id>/permissions/', EditUserPermissionsView.as_view(), name='edit-user-permissions'),


]