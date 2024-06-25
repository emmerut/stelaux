import React from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Button from '@/components/ui/Button';
import { InputLogin, BirthDateField } from "@/components/form/Form";

const SignupForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    email_or_phone: '',
    password: '',
    day: '',
    month: '',
    year: '',
    firstName: '',
    lastName: '',
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email_or_phone) {
      errors.email_or_phone = 'El correo electrónico o número de teléfono es obligatorio';
    }

    if (!values.password) {
      errors.password = 'La contraseña es obligatoria';
    }

    if (!values.firstName) {
      errors.firstName = 'El nombre es obligatorio';
    }

    if (!values.lastName) {
      errors.lastName = 'El apellido es obligatorio';
    }

    // Validaciones para los campos de fecha
    if (!values.day) {
      errors.day = 'El día es obligatorio';
    }

    if (!values.month) {
      errors.month = 'El mes es obligatorio';
    }

    if (!values.year) {
      errors.year = 'El año es obligatorio';
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post('http://localhost:8000/v1/auth/register/', values);
      if (res.data.call === "email") {
        navigate('/auth/confirm-email'); 
      } else if (res.data.call === "phone") {
        navigate('/auth/confirm-phone');
      } else {
        navigate('/auth/login'); 
      }
      toast.success('Cuenta creada exitosamente');
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data.email_or_phone[0] || error.response?.data.birthday[0] || 'Error al crear la cuenta');
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputLogin
            name="email_or_phone"
            type="text"
            placeholder="Número de celular o correo electrónico"
            className="mb-4"
          />
          <InputLogin
            name="password"
            type="password"
            placeholder="Contraseña nueva"
            className="mb-4"
            hasIcon
          />
          <BirthDateField />
          <InputLogin
            name="firstName"
            type="text"
            placeholder="Nombre"
            className="mb-4"
          />
          <InputLogin
            name="lastName"
            type="text"
            placeholder="Apellido"
            className="mb-4"
          />
          <p className="text-sm text-gray-600 mb-4">
            Al hacer clic en "Registrarte", aceptas nuestras
            <Link to="/auth/privacy" className="text-blue-500 hover:text-blue-700"> Condiciones, la Política de privacidad y la Política de cookies</Link>. Es posible que te enviemos notificaciones por
            SMS, que puedes desactivar cuando quieras.
          </p>
          <Button
            type="submit"
            text="Registrarte"
            className="btn bg-indigo-900 text-white hover:bg-indigo-800 block w-full text-center"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
          <p className="text-center mt-4">
          <Link to="/auth/login" className="text-blue-500 hover:text-blue-700">¿Ya tienes una cuenta?</Link>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;