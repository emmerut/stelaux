import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { AuthContext } from '@/App';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { InputLogin } from '@/components/form/Form';
import Button from '@/components/ui/Button';

const NewPassword = ({ uid }) => {
    const { setIsRecovery } = useContext(AuthContext);
    const navigate = useNavigate();
    const initialValues = {
        new_password: '',
    };

    const validate = (values) => {
        const errors = {};

        if (!values.new_password) {
            errors.new_password = 'La nueva contraseña es obligatoria';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(values.new_password)) {
            errors.new_password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial (@$!%*?&).';
        }

        return errors;
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const customValues = {
            ...values,
            token: uid
        };
        try {
            const res = await axios.post('https://api.stelaux.com/v1/auth/new_password/', customValues);
            toast.success(res.data.detail);
            navigate(`/console`);
            setIsRecovery(false);
            setSubmitting(false);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Error al establecer nueva contraseña');
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
                        name="new_password"
                        type="password"
                        placeholder="Contraseña nueva"
                        className="mb-4"
                        hasIcon
                    />
                    <Button
                        type="submit"
                        text="Restablecer Contraseña"
                        className="btn bg-indigo-900 text-white hover:bg-indigo-800 block w-full text-center"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    />
                </Form>
            )}
        </Formik>
    );
};

export default NewPassword;