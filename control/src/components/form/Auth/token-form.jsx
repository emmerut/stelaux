import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '@/App';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { setCookie } from '@/constant/sessions';
import Button from '@/components/ui/Button';

const VerificationForm = ({ type, uid }) => {
  const { setIsRegistered, setIsRecovery, isRegistered } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log(isRegistered)

  const navigate = useNavigate();
  
  const initialValues = {
    code: ['', '', '', '', '', ''],
  };

  const validate = (values) => {
    const errors = {};
    if (values.code.some((val) => !val)) {
      errors.code = 'Por favor ingresa el código de verificación';
    }
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const code = values.code.join('');
    try {
      let response;

      if (type === 'email' || type === 'phone') {
        response = await axios.post('http://localhost:8000/v1/auth/verify/', {
          code,
          twilio_sid: import.meta.env.VITE_TWILIO_SID,
          twilio_auth_token: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
          service_sid_email: import.meta.env.VITE_TWILIO_SERVICE_SID_EMAIL,
          service_sid_sms: import.meta.env.VITE_TWILIO_SERVICE_SID_SMS,
          token: uid

        });
        if (response.data.token) {
          const authToken = response.data.token;
          setCookie('user_token', authToken, 1);
          toast.success('Cuenta activada');
          setIsAuthenticated(true);
          setIsRegistered(false);
          navigate("/console");
        } else {
          toast.error('Error al recibir el token de autenticación');
        }
      } else if (type === 'email_reset' || type === 'phone_reset') {
        response = await axios.post('http://localhost:8000/v1/auth/password_reset_confirm/', {
          code,
          twilio_sid: import.meta.env.VITE_TWILIO_SID,
          twilio_auth_token: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
          service_sid_email: import.meta.env.VITE_TWILIO_SERVICE_SID_EMAIL,
          service_sid_sms: import.meta.env.VITE_TWILIO_SERVICE_SID,
          token: uid,
        });
        if (response.data.token) {
          const authToken = response.data.token;
          setCookie('user_token', authToken, 1);
          setIsRecovery(true);
          toast.success('Cuenta recuperada');
          navigate(`/auth/reset-confirm?&uid=${response.data.token}`);
        } else {
          toast.error('Error al recibir el token de autenticación');
        }
      } else {
        throw new Error('Invalid verification type');
      }
    } catch (error) {
      setIsRecovery(false);
      toast.error(error.response?.data?.detail || 'Error de verificación');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
            <p className="text-gray-600 mb-6">
              Para continuar, escribe el código de verificación de 6 dígitos.
            </p>
            <div className="grid grid-cols-6 gap-2">
              {values.code.map((_, index) => (
                <Field
                  key={index}
                  type="text"
                  name={`code[${index}]`}
                  className="w-12 h-12 border rounded px-3 py-2 text-center"
                  maxLength="1"
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^[0-9]$/.test(value) || value === '') {
                      setFieldValue(`code[${index}]`, value);
                      if (value !== '' && index < 5) {
                        document.getElementsByName(`code[${index + 1}]`)[0].focus();
                      }
                    }
                  }}
                />
              ))}
            </div>
            <ErrorMessage name="code" component="div" className="text-red-500 mt-2" />
            <Button
              type="submit"
              text="Continuar"
              className="btn bg-indigo-900 text-white hover:bg-indigo-800 block w-full text-center mt-6"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VerificationForm;