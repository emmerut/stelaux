from rest_framework import viewsets, status
from django.utils import timezone
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
        new_customer = None

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
                user=user, status="pending", transaction_type="setup"
            ).first()

            if existing_intent:
                existing_intent.delete()
            else:
                new_customer = stripe.Customer.create(
                    name=user.first_name + " " + user.last_name,
                    email=user.email,
                    metadata={"pk": user.pk},
                )
            payment_intent = PaymentIntent.objects.create(
                user=user,
                product_name=title,
                amount=amount,
                currency="usd",
                transaction_type="setup",
                annually=annually,
            )
            payment_intent.save()

            if new_customer:
                user.customer_id = new_customer.id
                user.save()

            return Response(
                {"ok": True, "message": "Subscription created successfully"},
                status=status.HTTP_201_CREATED,
            )

        else:
            return Response(
                {"error": _("Invalid call type. Please use param call.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["post"])
    def create_setup_intent(self, request):
        """
        Creates a new SetupIntent for the authenticated user.
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

        try:
            setup_intent = stripe.SetupIntent.create(
                payment_method_types=["card"],
            )
            get_setup_intent = PaymentIntent.objects.filter(
                user=user, status="pending", transaction_type="setup"
            ).first()
            get_setup_intent.setup_intent_id = setup_intent.id
            get_setup_intent.save()

        except stripe.error.CardError as e:
            print(e)
            # Since it's a decline, stripe.error.CardError will be caught
            return Response(
                {"error": e.json_body.get("error", {}).get("message")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.RateLimitError as e:
            print(e)
            # Too many requests made to the API too quickly
            return Response(
                {"error": _("Too many requests. Please try again later.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.InvalidRequestError as e:
            print(e)
            # Invalid parameters were supplied to Stripe's API
            return Response(
                {"error": e.json_body.get("error", {}).get("message")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.AuthenticationError as e:
            print(e)
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            return Response(
                {"error": _("Authentication error. Please try again later.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.APIConnectionError as e:
            print(e)
            # Network communication with Stripe failed
            return Response(
                {"error": _("Network error. Please try again later.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.StripeError as e:
            print(e)
            # yourself an email
            return Response(
                {"error": _("Something went wrong. Please try again later.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            print(e)
            # Something else happened, completely unrelated to Stripe
            return Response(
                {"error": _("Something went wrong. Please try again later.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "client_secret": setup_intent.client_secret,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["post"])
    def create_payment_method(self, request):
        """
        Retrieves a payment method based on the request data.
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

        payment_method_type = request.data.get("type")

        if payment_method_type == "card":
            setup_intent_id = request.data.get("setup_id")
            setup_intent = stripe.SetupIntent.retrieve(setup_intent_id)
            # Create a PaymentMethods object
            get_payment_method = PaymentMethods.objects.filter(
                user=user, method_type="card", token=setup_intent["payment_method"]
            )

            if get_payment_method.exists():
                return Response(
                    {"message": "method_failed"},
                    status=status.HTTP_409_CONFLICT,
                )
            attach=stripe.PaymentMethod.attach(
                setup_intent["payment_method"], customer=user.customer_id
            )
            payment_method = PaymentMethods.objects.create(
                user=user,
                method_type="card",
                provider="Stripe",  # Assuming Stripe is the provider
                token=setup_intent["payment_method"],
                last_4_digits=attach["card"]["last4"],
                expiry_date=f"{attach['card']['exp_month']}/{attach['card']['exp_year']}",
                is_default=True,
                # ... (Other card details) ...
            )
            return Response({'message': 'method_created_successfully'}, status=status.HTTP_201_CREATED)

        elif payment_method_type == "google_pay":
            # Retrieve Google Pay payment method
            google_pay_token = request.data.get("token")
            if not google_pay_token:
                return Response(
                    {"error": _("Google Pay token is required.")},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # You'll need to implement logic to retrieve the Google Pay details
            # based on the google_pay_token. This might involve interacting with
            # Google Pay API.
            # ... (Retrieve Google Pay details) ...

            # Create a PaymentMethods object
            payment_method = PaymentMethods.objects.create(
                user=user,
                method_type="google_pay",
                provider="Google Pay",
                token=google_pay_token,
                # ... (Other Google Pay details) ...
            )
            serializer = PaymentMethodSerializer(payment_method)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        elif payment_method_type == "apple_pay":
            # Retrieve Apple Pay payment method
            apple_pay_token = request.data.get("token")
            if not apple_pay_token:
                return Response(
                    {"error": _("Apple Pay token is required.")},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # You'll need to implement logic to retrieve the Apple Pay details
            # based on the apple_pay_token. This might involve interacting with
            # Apple Pay API.
            # ... (Retrieve Apple Pay details) ...

            # Create a PaymentMethods object
            payment_method = PaymentMethods.objects.create(
                user=user,
                method_type="apple_pay",
                provider="Apple Pay",
                token=apple_pay_token,
                # ... (Other Apple Pay details) ...
            )
            serializer = PaymentMethodSerializer(payment_method)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else:
            return Response(
                {"error": _("Invalid payment method type.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
