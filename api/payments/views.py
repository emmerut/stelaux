from rest_framework import viewsets, status
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.translation import gettext_lazy as _
from decimal import Decimal
from .models import PaymentIntent, PaymentMethods
from functions import get_user_from_token
from .serializers import (
    PaymentIntentSerializer,
    PaymentMethodSerializer,
)  # Import the serializer
import stripe  # Import the Stripe SDK

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentsViewSet(viewsets.ViewSet):

    @action(detail=False, methods=["get"])
    def get_purchase(self, request):
        """
        Retrieves the latest PaymentIntent for the authenticated user.
        """
        user_token = request.META.get("HTTP_AUTHORIZATION")
        if not user_token:
            return Response(
                {"error": _("Token is required.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_user_from_token(user_token)
        if not user:
            return Response(
                {"error": _("Invalid token.")},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Get the latest PaymentIntent for the user
        payment_intent = (
            PaymentIntent.objects.filter(user=user).order_by("-created_at").first()
        )

        if payment_intent:
            serializer = PaymentIntentSerializer(payment_intent)
            return Response(serializer.data)
        else:
            return Response(
                {"error": _("No payment intents found for this user.")},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["get"])
    def get_payment_methods(self, request):
        """
        Retrieves all payment methods for the authenticated user.
        """
        user_token = request.META.get("HTTP_AUTHORIZATION")
        if not user_token:
            return Response(
                {"error": _("Token is required.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_user_from_token(user_token)
        if not user:
            return Response(
                {"error": _("Invalid token.")},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Get all payment methods for the user
        payment_methods = PaymentMethods.objects.filter(user=user)
        serializer = PaymentMethodSerializer(payment_methods, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=["post"])
    def create_purchase(self, request):
        call_type = request.data.get("type")

        if call_type == "newcomerPlan":
            title = request.data.get("title")
            price = Decimal(request.data.get("price"))
            annually = request.data.get("annually")
            user_token = request.data.get("token")

            try:
                amount = price * 12 if annually else price
            except (ValueError, TypeError):
                return Response(
                    {
                        "error": _(
                            "Invalid price format. Please provide a valid number."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = get_user_from_token(user_token)

            # Check if a pending subscription payment intent exists
            existing_intent = PaymentIntent.objects.filter(
                user=user, status="pending", transaction_type="subscription"
            ).first()

            if existing_intent:
                existing_intent.delete()

            # Create a new payment intent

            payment_intent = PaymentIntent.objects.create(
                user=user,
                product_name=title,
                amount=amount,
                currency="usd",  # Assuming USD currency
                transaction_type="subscription",
                annually=annually,
            )
            payment_intent.save()
            return Response(
                {"ok": True, "message": "Purchase created successfully"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"error": _("Invalid call type. Please use param call.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["post"])
    def create_payment_intent(self, request):
        """
        Creates a new PaymentIntent for the authenticated user.
        """
        user_token = request.META.get("HTTP_AUTHORIZATION")
        if not user_token:
            return Response(
                {"error": _("Token is required.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_user_from_token(user_token)
        if not user:
            return Response(
                {"error": _("Invalid token.")},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Get data from the request
        amount = request.data.get("amount")
        currency = request.data.get("currency", "usd") 
        try:
            amount = Decimal(amount)
        except (ValueError, TypeError):
            return Response(
                {"error": _("Invalid amount format. Please provide a valid number.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create the PaymentIntent using Stripe SDK
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert amount to cents
                currency=currency,
                payment_method_types=["card"],
            )
        except stripe.error.CardError as e:
            # Since it's a decline, stripe.error.CardError will be caught
            return Response(
                {"error": e.json_body.get("error", {}).get("message")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            return Response(
                {"error": _("Too many requests. Please try again later.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.InvalidRequestError as e:
            # Invalid parameters were supplied to Stripe's API
            return Response(
                {"error": e.json_body.get("error", {}).get("message")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            return Response(
                {"error": _("Authentication error. Please try again later.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            return Response(
                {"error": _("Network error. Please try again later.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            return Response(
                {"error": _("Something went wrong. Please try again later.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            # Something else happened, completely unrelated to Stripe
            return Response(
                {"error": _("Something went wrong. Please try again later.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"client_secret": payment_intent.client_secret}, status=status.HTTP_201_CREATED)