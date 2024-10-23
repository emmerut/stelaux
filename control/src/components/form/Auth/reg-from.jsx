import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { AuthContext } from '@/App';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Button from '@/components/ui/Button';
import { InputLogin, BirthDateField } from "@/components/form/Form";

const SignupForm = () => {
  
  const { setIsRegistered } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialValues = {
    email_or_phone: '',
    password: '',
    day: '',
    month: '',
    year: '',
    first_name: '',
    last_name: '',
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


    if (!values.password) {
      errors.password = 'La nueva contraseña es obligatoria';
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(values.password)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial (@$!%*?&).';
  }

    if (!values.first_name) {
      errors.first_name = 'El nombre es obligatorio';
    }

    if (!values.last_name) {
      errors.last_name = 'El apellido es obligatorio';
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
    const customValues = {
      ...values,
      template_id: import.meta.env.VITE_TEMPLATE_ID,
      from: import.meta.env.VITE_FROM,
      from_name: import.meta.env.VITE_FROM_NAME,
      twilio_sid: import.meta.env.VITE_TWILIO_SID,
      twilio_auth_token: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
      service_sid_sms: import.meta.env.VITE_TWILIO_SERVICE_SID,
      service_sid_email: import.meta.env.VITE_TWILIO_SERVICE_SID_EMAIL
    };
    try {
      const res = await axios.post('https://api.stelaux.com/v1/auth/register/', customValues);
      setIsRegistered(true);
      toast.success('Cuenta creada exitosamente');
      navigate(`/auth/verify?type=${res.data.call}&uid=${res.data.token}`);
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
            name="first_name"
            type="text"
            placeholder="Nombre"
            className="mb-4"
          />
          <InputLogin
            name="last_name"
            type="text"
            placeholder="Apellido"
            className="mb-4"
          />
          <p className="text-sm text-gray-600 mb-4">
            Al hacer clic en "Registrarte", aceptas nuestras
            <Link to="/auth/privacy" className="text-blue-500 hover:text-blue-700"> Condiciones, la Política de privacidad y la Política de cookies</Link>. 
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