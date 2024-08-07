import React, { useState, useContext } from 'react';
import { AuthContext } from '@/App';
import { createPaymentMethod } from "@/constant/apiData"; // Assuming these functions handle Stripe integration
import { useStripe, useElements, PaymentElement, CardElement } from '@stripe/react-stripe-js';
import Loading from "@/components/PaymentsLoader";
import Button from "@/components/ui/Button"
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ userData }) => {

  const [isConnect, setisConnect] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [error, setError] = useState(null); // State for errors

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const { setIsPaymentSignal } = useContext(AuthContext);

  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setisConnect(true);

    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded or paymentElement is not mounted.');
      return;
    }

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        cons
      } else if (setupIntent.status === 'succeeded') {
        try {
          const res = await createPaymentMethod({
            type: 'card',
            setup_id: setupIntent.id,
          });

          if (res.message === "method_created_successfully") {
            setIsSuccess(true);
            setTimeout(() => {
              setisConnect(false);
            }, 4000);
            setIsPaymentSignal(true);

          } else if (res.message === "method_failed") {
            setIsFailed(true);
            setTimeout(() => {
              setisConnect(false);
            }, 4000);
          }
        } catch (error) {
          console.error('Error:', error);
          setError('Hubo un error al procesar la tarjeta.');
          setisConnect(false);
        }

      } else {
        console.log('Estado del SetupIntent:', setupIntent.status);
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un error al procesar la tarjeta.');
      setisConnect(false);
    }
  };

  return (
    <div>
      {isConnect && <Loading loadCall='connect' />}
      {isSuccess && <Loading loadCall='success' />}
      {isFailed && <Loading loadCall='failed' />}
      <form onSubmit={handleSubmit}
        className={`${isConnect || isSuccess || isFailed ? 'hidden' : ''}`}>
        <PaymentElement className={`my-4`} />
        <Button
          ariaLabel="botón del formulario"
          isLoading={isConnect}
          type={isConnect ? 'button' : 'submit'}
          className={`text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md px-6 font-medium font-oxanium rounded-none uppercase text-[11px] float-end ${isConnect ? "disabled" : ""
            }`}
          disabled={isConnect}
          text="guardar"
          color="#fff"
          size="xs"
        />
      </form>
    </div>
  );
};

export default CheckoutForm;
