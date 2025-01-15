from django.urls import path
from .views import TicketListView, TicketDetailView

urlpatterns = [
    path('', TicketListView.as_view(), name='ticket-list'),
    path('<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
]