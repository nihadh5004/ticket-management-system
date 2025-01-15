from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication

from tickets.models import Ticket
from tickets.serializers import TicketSerializer,TicketReadSerializer
from tickets.utils.filter_data import build_query_filters
from tickets.utils.response_messages import (internal_server_error_response, invalid_input,
                                            validation_error,forbidden_error,tickets_list_success,tickets_creation_success, tickets_detail_success,
                                            tickets_delete_success,tickets_update_success)


class TicketListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            is_admin = user.is_superuser  

            filters = {}
            if not is_admin:
                filters['user'] = user  

            # Add any additional filters from query parameters
            additional_filters = build_query_filters(request.query_params)
            filters.update(additional_filters)

            tickets = Ticket.objects.filter(**filters)
            serializer = TicketReadSerializer(tickets, many=True)

            return Response(tickets_list_success(serializer.data),status=status.HTTP_200_OK)
        except Exception as e:
            return Response(internal_server_error_response(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def post(self, request):
        try:
            serializer = TicketSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                
                return Response(tickets_creation_success(serializer.data),status=status.HTTP_201_CREATED)
            return Response(invalid_input(serializer.errors),status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response(validation_error(e.detail.get('message', "Validation error")),status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(internal_server_error_response(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TicketDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        try:
            ticket = get_object_or_404(Ticket, pk=pk)
            serializer = TicketReadSerializer(ticket)

            return Response(tickets_detail_success(serializer.data),status=status.HTTP_200_OK)
        except Exception as e:
            return Response(internal_server_error_response(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk):
        try:
            ticket = get_object_or_404(Ticket, pk=pk)
            
            # Check if the user has permission to update the ticket
            if not request.user.has_perm('tickets.update_ticket'):
                return Response(forbidden_error("You do not have permission to update this ticket"),status=status.HTTP_403_FORBIDDEN)

            serializer = TicketSerializer(ticket, data=request.data, context={'request': request}, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(tickets_update_success(serializer.data),status=status.HTTP_200_OK)

            # Handle invalid input
            return Response(invalid_input(serializer.errors),status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response(validation_error(e.detail.get('message', "Validation error")),status=status.HTTP_409_CONFLICT)

        except Exception as e:
            return Response(internal_server_error_response(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        try:
            ticket = get_object_or_404(Ticket, pk=pk)
            
            # Check if the user has permission to delete the ticket
            if not request.user.has_perm('tickets.delete_ticket'):
                return Response(forbidden_error( "You do not have permission to delete this ticket"),status=status.HTTP_403_FORBIDDEN)
            
            ticket.delete()
            return Response(tickets_delete_success(),status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(internal_server_error_response(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)
