import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { AuthContext } from '@/App';
import { useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import Loading from "@/components/Loading";
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal";
import CheckoutForm from "@/components/form/Payments/CheckoutForm"
import { useNavigate } from "react-router-dom";
import { createPaymentIntent } from "@/constant/apiData";


function Checkout({ purchaseData, userData }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]); 
    const [cardPaymentDefault, setCardPaymentDefault] = useState(false);
    const [googlePaymentDefault, setGooglePaymentDefault] = useState(false);
    const [applePaymentDefault, setApplePaymentDefault] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State for loading
    
    const { isPaymentSet } = useContext(AuthContext);

    const [clientSecret, setClientSecret] = useState(null);

    const stripePromise = loadStripe('pk_test_51KBfHRJv2H8qjTLAIS6S63B7D2FA6xxAiqALqjgYjrTd7cdeCUxIBUjBJ4lqlgBlA3uPVSsGExqtjf7C9SyEhiz300cg6ioA1m');

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0570de',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            fontFamily: 'Arial, sans-serif',
            spacingUnit: '2px',
        },
        rules: {
            '.Label': {
                color: '#30313d',
            }
        }
    };

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const res = await createPaymentIntent(purchaseData.total_amount, purchaseData.currency); // Replace with your actual endpoint
                setClientSecret(res.client_secret);
            } catch (error) {
                console.error('Error fetching client secret:', error);
                setError(error);
            }
        };

        fetchClientSecret();
    }, [purchaseData]);

    const openModal = () => {
        setShowModal(true);
    };


    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (isPaymentSet) {
            closeModal(); 
        }
    }, [isPaymentSet]);

    const [sendingForm, setSendingForm] = useState(false); // State for button loading

    const handlePayment = async () => {

        setSendingForm(true); // Set button loading state to true
        // Your payment processing logic here
        // ...
        // Example:
        // try {
        //   const response = await axios.post('/api/payment', {
        //     // Payment data
        //   });
        //   // Handle success
        // } catch (error) {
        //   // Handle error
        // } finally {
        //   setSendingForm(false); // Set button loading state to false
        // }
    };

    return (
        <div className="flex flex-col items-center min-h-screen px-4 md:px-8 relative z-10">
            {isLoading || !clientSecret ? ( // Render loading state if isLoading is true
                <Loading />
            ) : ( // Render checkout content if isLoading is false
                <div className="flex flex-col items-center min-h-screen px-4 md:px-8 relative z-10"> {/* Añadido padding responsive */}
                    <h1 className="text-3xl font-bold text-gray-800 mt-10 text-center">
                        Pasarela de Pago
                    </h1>
                    <div className="w-full max-w-2xl text-center mt-4"> {/* Añadido text-center */}
                        <p className="text-gray-700">
                            Su método de pago va a ser capturado para formalizar su plan de
                            suscripción, no se hará ningún cargo durante la prueba gratuita.
                        </p>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row justify-center space-x-0 md:space-x-6 w-full max-w-5xl my-10 space-y-6 md:space-y-0"> {/* Modificado para responsive */}
                        <div className="flex flex-col space-y-6 w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl h-full">
                            <div className="flex flex-col space-y-4">
                                <h2 className="text-xl font-bold">
                                    Mis tarjetas de crédito y débito
                                </h2>
                                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                                    <button
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center"
                                        onClick={openModal}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.707a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </button>
                                    <div>
                                        <span>Agregar una tarjeta de crédito o débito</span>
                                        <p className="text-gray-500 text-sm">
                                            Stela acepta las principales tarjetas de débito o crédito.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <h2 className="text-xl font-bold">Otros métodos de pago</h2>

                                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center">
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.707a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </button>
                                    <div>
                                        <span>Google Pay</span>
                                        <p className="text-gray-500 text-sm">
                                            Acceso a ofertas exclusivas de financiación. Sin tarifa anual.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center">
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.707a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </button>
                                    <div>
                                        <span>Apple Pay</span>
                                        <p className="text-gray-500 text-sm">
                                            Acceso a ofertas exclusivas de financiación. Sin tarifa anual.
                                        </p>
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Ingresa el código promocional"
                                        className="border rounded-l-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button className="bg-indigo-900 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-md">
                                        Usar
                                    </button>
                                </div>
                            </div>

                            <Button
                                ariaLabel="botón del formulario"
                                isLoading={sendingForm}
                                type={sendingForm || !isPaymentSet ? 'button' : 'submit'}
                                className={`text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md px-6 font-medium font-oxanium rounded-none uppercase text-[11px] float-end ${sendingForm ? "disabled" : ""
                                    }`}
                                disabled={sendingForm || !isPaymentSet} // Desactiva el botón si isPaymentSet es falso
                                text="Activar Suscripción"
                                color="#fff"
                                size="md"
                                onClick={isPaymentSet ? handlePayment : () => { }}  // Call handlePayment on click
                            />
                        </div>
                        <div className="w-full max-w-xs p-6 bg-gray-100 rounded-lg shadow-md  md:mt-0"> {/* Quitado margen izquierdo en pantallas medianas */}
                            <div className="mt-6 p-4 bg-white rounded-lg shadow-inner">
                                <h3 className="text-lg font-bold mb-4">Costos de Suscripción</h3>

                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <dt>Facturación:</dt>
                                    <dd className="text-right">
                                        {purchaseData.annually ? "Anual" : "Mensual"}
                                    </dd>
                                    <dt>Subtotal:</dt>
                                    <dd className="text-right">US${purchaseData.amount}</dd>
                                    <dt>Impuestos:</dt>
                                    <dd className="text-right">US${purchaseData.tax_amount}</dd>
                                    <dt>Fee:</dt>
                                    <dd className="text-right">US${purchaseData.fee_amount}</dd>
                                    <dt></dt>
                                    <dd className="text-right"><a className='text-blue-500 text-sm cursor-pointer' onClick={() => navigate('/plans')}>Modificar Plan</a></dd> {/* Link para modificar plan */}
                                </dl>
                                <hr className="my-4" />
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <dt className="font-bold">Total:</dt>
                                    <dd className="text-right font-bold">US${purchaseData.total_amount}</dd>
                                </dl>
                                <hr className="my-4" />
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <dt className="text-xs">Fecha de Importe:</dt>
                                    <dd className="text-right text-xs">2024-03-10</dd>
                                </dl>
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 my-3">
                                    <dt className="text-xs">Emmerut Pay</dt>
                                    <dd className="text-right text-xs">Emmerut LLC &copy;</dd>
                                </dl>
                                <div class="text-center mt-2 text-blue-500">
                                    <a href="/terminos-y-condiciones" className="text-xs underline">Términos y Condiciones</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        activeModal={showModal}
                        onClose={closeModal}
                        centered={true}
                        className="max-w-2xl modal-scroll"
                        title="Agregar Tarjeta"
                        themeClass="bg-indigo-900"
                        scrollContent={true}
                    >
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                            <CheckoutForm userData={userData} /> {/* Pasa la función setIsPaymentSet al CheckoutForm */}
                        </Elements>
                    </Modal>
                </div>

            )}
        </div>
    );
}

export default Checkout;
