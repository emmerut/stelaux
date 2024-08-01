import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { AuthContext } from '@/App';
import { Elements } from '@stripe/react-stripe-js';
import Loading from "@/components/Loading";
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal";
import CheckoutForm from "@/components/form/Payments/CheckoutForm"
import { useNavigate } from "react-router-dom";
import {
    createPaymentIntent, getPaymentMethods, deletePaymentMethod,
    getPlans, handlerCoupon, createSubscription
}
    from "@/constant/apiData";
import Checkbox from "@/components/ui/Checkbox"
import { toast, ToastContainer } from "react-toastify";


function Checkout({ purchaseData, userData }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [isPaymentSet, setIsPaymentSet] = useState(false);
    const [isCoupon, setIsCoupon] = useState(null);

    const { isPaymentSignal, setIsPaymentSignal, setIsActivePlan} = useContext(AuthContext);
    const [clientSecret, setClientSecret] = useState(null);
    const stripePromise = loadStripe('pk_test_51KBfHRJv2H8qjTLAIS6S63B7D2FA6xxAiqALqjgYjrTd7cdeCUxIBUjBJ4lqlgBlA3uPVSsGExqtjf7C9SyEhiz300cg6ioA1m');

    const handlePaymentMethodChange = (paymentMethodId) => {
        setSelectedPaymentMethod(paymentMethodId);
    };

    const appearance = {
        theme: 'flat',
        variables: {
            colorPrimary: '#312e81',
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Promise.all([
                    createPaymentIntent(purchaseData.total_amount, purchaseData.currency,), // Replace with your actual endpoint
                    getPaymentMethods(),
                    getPlans()
                ]);

                setClientSecret(res[0].client_secret);
                setPaymentMethods(res[1]); // Assuming getPaymentMethods returns an array of payment methods

            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
            }
        };

        fetchData();
    }, [purchaseData, isPaymentSignal]);

    useEffect(() => {
        if (paymentMethods && paymentMethods.length > 0) {
            setIsPaymentSignal(false);
            setSelectedPaymentMethod(paymentMethods[paymentMethods.length - 1].id);
            setIsPaymentSet(true);
        }
    }, [paymentMethods]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (isPaymentSignal) {
            closeModal();
        }
    }, [isPaymentSignal]);

    const [sendingForm, setSendingForm] = useState(false); // State for button loading

    const handleDeletePaymentMethod = async (paymentMethodId) => {
        try {
            await deletePaymentMethod(paymentMethodId);
            setIsPaymentSignal(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error);
        }
    };

    const handleCoupon = async () => {
        const couponCode = document.querySelector('input[type="text"]').value;
        try {
            const { data } = await handlerCoupon(couponCode);
            setIsCoupon({
                id: data[0].id,
                coupon: {
                    amount_off: data[0].coupon.amount_off,
                    duration: data[0].coupon.duration,
                    duration_in_months: data[0].coupon.duration_in_months,
                    percent_off: data[0].coupon.percent_off,
                    valid: data[0].coupon.valid
                }
            });
            toast.success('Código promocional activado');
        } catch (error) {
            setIsCoupon(null);
            toast.warning('Código promocional no válido');
        }
    };

    const handlePayment = async () => {

        setSendingForm(true);

        try {
            // Check if isCoupon exists before using it
            const couponId = isCoupon ? isCoupon.id : null;
            await createSubscription(purchaseData.id, couponId);
            toast.success('Suscripción activada');
            setIsActivePlan(true);
            setTimeout(() => {
                navigate('/console');
              }, 4000); 
        } catch (error) {
            toast.warning('Error al activar la suscripción');
        } finally {
            setSendingForm(false); // Reset sendingForm state
        }

    };

    return (
        <div className="flex flex-col items-center min-h-screen px-4 md:px-8 relative z-10">
            <ToastContainer />
            {isLoading || !clientSecret ? ( // Render loading state if isLoading is true
                <Loading />
            ) : ( // Render checkout content if isLoading is false
                <div className="flex flex-col items-center min-h-screen px-4 md:px-8 relative z-10 lg:w-[80%] md:w-[100%] w-[100%]"> {/* Añadido padding responsive */}
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
                                        <span>Agregar Nuevo Metodo de Pago</span>

                                    </div>
                                </div>
                            </div>
                            {paymentMethods.slice(-3).length === 1 ? (
                                // Render only the payment method if there's only one
                                <div key={paymentMethods[0].id} className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                                    <Checkbox
                                        id={`paymentMethod-${paymentMethods[0].id}`}
                                        value={selectedPaymentMethod === paymentMethods[0].id}
                                        onChange={() => handlePaymentMethodChange(paymentMethods[0].id)}
                                        disabled={false} // Set to true if you want to disable a specific payment method
                                    />
                                    <label htmlFor={`paymentMethod-${paymentMethods[0].id}`} className="flex items-center ml-2">
                                        <span className='font-oxanium'>{paymentMethods[0].provider}</span>
                                        <p className="text-gray-500 text-sm">
                                            ****-****-****-{paymentMethods[0].last_4_digits}
                                        </p>
                                    </label>
                                </div>
                            ) : (
                                // Render all three payment methods with "Eliminar"
                                paymentMethods.slice(-3).map((paymentMethod) => (
                                    <div key={paymentMethod.id} className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                                        <Checkbox
                                            id={`paymentMethod-${paymentMethod.id}`}
                                            value={selectedPaymentMethod === paymentMethod.id}
                                            onChange={() => handlePaymentMethodChange(paymentMethod.id)}
                                            disabled={false}
                                        />
                                        <label htmlFor={`paymentMethod-${paymentMethod.id}`} className="flex items-center mx-2">
                                            <span className='font-oxanium'>{paymentMethod.provider}</span>
                                            <p className="text-gray-500 text-sm">
                                                ****-****-****-{paymentMethod.last_4_digits}
                                            </p>
                                            <span className="ml-2 text-sm text-sky-500 cursor-pointer" onClick={() => handleDeletePaymentMethod(paymentMethod.id)}>
                                                Eliminar
                                            </span>
                                        </label>
                                    </div>
                                ))
                            )}

                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Ingresa el código promocional"
                                        className="border rounded-l-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button className="bg-indigo-900 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-md" onClick={handleCoupon}>
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
                                {isCoupon &&
                                    <div class="text-center mt-2 text-blue-500">
                                        < span className="text-xs">Cupón Promocional</span>
                                    </div>}
                                {isCoupon &&
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        <dt className="text-xs">Descuento:</dt>
                                        <dd className="text-right text-xs">{isCoupon.coupon.percent_off ? isCoupon.coupon.percent_off + "%" : "US$" + isCoupon.coupon.amount_off}</dd>
                                    </dl>}
                                {isCoupon &&
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        <dt className="text-xs">Duración:</dt>
                                        <dd className="text-right text-xs">{isCoupon.coupon.duration_in_months ? isCoupon.coupon.duration_in_months + " Meses" : isCoupon.coupon.duration}</dd>
                                    </dl>}
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
                        title=""
                        themeClass="bg-indigo-900"
                        scrollContent={true}
                    >
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                            <CheckoutForm userData={userData} clientSecret={clientSecret} /> {/* Pasa la función setIsPaymentSet al CheckoutForm */}
                        </Elements>
                    </Modal>
                </div>

            )}
        </div>
    );
}

export default Checkout;
