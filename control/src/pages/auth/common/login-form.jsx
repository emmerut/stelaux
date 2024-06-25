import React from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { InputLogin } from "@/components/form/Form";
import Button from '@/components/ui/Button';

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: '',
    keepMeSignedIn: false
  };

  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = 'El nombre de usuario, email o teléfono es requerido';
    }

    if (!values.password) {
      errors.password = 'La contraseña es requerida';
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:8000/v1/auth/login/', values);
      navigate("/console");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setSubmitting(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error de autenticación');
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
        <Form>
          <InputLogin
            name="username"
            type="text"
            placeholder="Ingresa con tu email o teléfono"
            className="mb-4"
          />
          <InputLogin
            name="password"
            type="password"
            placeholder="Ingrese su contraseña"
            className="mb-4"
            hasIcon
          />
          <div className="flex justify-end my-4">
            <Link
              to="/auth/reset-password"
              className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
            >
              Recuperar Acceso{" "}
            </Link>
          </div>
          <Button
            type="submit"
            text="Ingresar"
            className="btn bg-indigo-900 text-white hover:bg-indigo-800 block w-full text-center"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default Login;