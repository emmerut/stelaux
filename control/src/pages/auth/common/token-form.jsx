import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { InputLogin } from "@/components/form/Form";
import Button from '@/components/ui/Button';

const VerificationForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    code: ['', '', '', '', '', ''],
  };

  const validate = (values) => {
    const errors = {};

    // Validación para el código de verificación
    if (values.code.some((val) => !val)) {
      errors.code = 'Por favor ingresa el código de verificación';
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const code = values.code.join('');
    try {
      // Aquí realizas la llamada a la API para verificar el código
      await axios.post('http://localhost:8000/v1/auth/verify/', { code });
      navigate("/console");
      setSubmitting(false);
    } catch (error) {
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