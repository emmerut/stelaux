import React, { useState, useEffect } from 'react';
import { createPaymentIntent } from "@/constant/apiData"; // Assuming these functions handle Stripe integration
import Loading from "@/components/PaymentsLoader";

const CheckoutForm = ({ amount, currency, setIsPaymentSet }) => {
  const [stripe, setStripe] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  useEffect(() => {
    // Fetch the client secret from your backend
    const fetchClientSecret = async () => {
      try {
        const res = await createPaymentIntent(amount, currency); // Replace with your actual endpoint
        setClientSecret(res);
      } catch (error) {
        console.error('Error fetching client secret:', error);
        setError(error);
      }
    };

    fetchClientSecret();
  }, []);

  useEffect(() => {
    if (clientSecret) {
      // Initialize Stripe.js when the client secret is available
      const stripeScript = document.createElement('script');
      stripeScript.src = 'https://js.stripe.com/v3/';
      stripeScript.onload = () => {
        setStripe(window.Stripe('pk_test_51KBfHRJv2H8qjTLAIS6S63B7D2FA6xxAiqALqjgYjrTd7cdeCUxIBUjBJ4lqlgBlA3uPVSsGExqtjf7C9SyEhiz300cg6ioA1m')); // Replace with your actual publishable key
        setIsLoading(false);
      };
      document.body.appendChild(stripeScript);
    }
  }, [clientSecret]);

  useEffect(() => {
    if (stripe && clientSecret) {
      // Render the card element when Stripe is initialized and clientSecret is available
      const elements = stripe.elements();
      const cardElement = elements.create('card');
      cardElement.mount('#card-element');
    }
  }, [stripe, clientSecret]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !clientSecret) {
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      // ... (rest of the handleSubmit logic remains the same)
    } catch (error) {
      // ... (error handling remains the same)
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <div id="card-element"></div> {/* This div will now contain the card element */}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Guardar'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
