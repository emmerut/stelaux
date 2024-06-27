import React from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { toast } from "react-toastify";
import { InputLogin } from "@/components/form/Form";
import Button from '@/components/ui/Button';

const ForgotPass = () => {
  const initialValues = {
    email_or_phone: '',
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email_or_phone) {
      errors.email_or_phone = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email_or_phone = 'El email no es válido';
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post('http://localhost:8000/v1/auth/forgot-password/', values);
      toast.success("Acceso Validado");
      setSubmitting(false);
    } catch (error) {
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