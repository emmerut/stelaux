import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { AuthContext } from '@/App';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { InputLogin } from "@/components/form/Form";
import Button from '@/components/ui/Button';

const ForgotPass = () => {
  const { setIsRecovery } = useContext(AuthContext);
  const navigate = useNavigate();
  const initialValues = {
    email_or_phone: '',
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email_or_phone) {
      errors.email_or_phone = 'El correo electrónico o número de teléfono es obligatorio';
    } else {
      const combinedRegex = /^(\+58\d{10}|\+1\d{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/;
      
      if (!combinedRegex.test(values.email_or_phone)) {
        errors.email_or_phone = 'Por favor ingrese un valor válido. Debe tener el código de área o ser un número de teléfono válido de Venezuela (+58) o Estados Unidos (+1). Ejemplos: +581234567891, +11234567891 o example@dominio.com';
      }
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const customValues = {
      ...values,
      template_id: import.meta.env.VITE_PW_RECOVERY,
      from: import.meta.env.VITE_FROM,
      from_name: import.meta.env.VITE_FROM_NAME,
      twilio_sid: import.meta.env.VITE_TWILIO_SID,
      twilio_auth_token: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
      service_sid_sms: import.meta.env.VITE_TWILIO_SERVICE_SID,
      service_sid_email: import.meta.env.VITE_TWILIO_SERVICE_SID_EMAIL
    };
    try {
      setIsRecovery(true);
      const res = await axios.post('http://localhost:8000/v1/auth/password_reset_request/', customValues);
      toast.success("Acceso Validado");
      navigate(`/auth/reset-verify?type=${res.data.call}&uid=${res.data.token}`);
      setSubmitting(false);
    } catch (error) {
      setIsRecovery(false);
      toast.error(error.response?.data?.detail || 'Error al enviar correo de recuperación');
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form className="space-y-4">
          <InputLogin
            name="email_or_phone"
            type="text"
            placeholder="Ingresa tu email o numero de telefono"
            className="mb-4 h-[48px]"
          />
          <Button
            type="submit"
            text="Recuperar"
            className="btn bg-indigo-900 text-white hover:bg-indigo-800 block w-full text-center"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPass;