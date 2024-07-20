import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import axios from 'axios';
import FixedBar from '@/components/ui/ProgressBar/FixedBarAlert'
import { Input, FileInput, TextArea, SelectInput, NestedSelectInput, CountrySelect } from '@/components/form/Form';
import { fetchCountries } from "@/constant/data";
import Buttons from '@/components/ui/Button';

const MyForm = ({ objID, closeModal }) => {
    const [regionsData, setRegionsData] = useState([]);
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [sendingForm, setSendingForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState([]);
    const [progress, setProgress] = useState(0);

    const formikObj = [];

    // Función para obtener las regiones de la API
    const fetchRegions = async (countryCode) => {
        setRegionsData([]);
        if (countryCode) {
            try {
                const cities = await fetchCountries({ countryCode: countryCode });
                setRegionsData(cities);
            } catch (error) {
                console.error('Error al obtener las ciudades:', error);
            }
        }
    };

    const handleSubmit = async (values) => {
        setSendingForm(true);
        const full_name = values.first_name + ' ' + values.last_name;
        const selectedFile = selectedFile;
        const formData = new FormData();
        formData.append('full_name', full_name);
        formData.append(`email`, values.email);
        formData.append(`phone`, values.phone);
        formData.append('avatar', selectedFile);
        formData.append(`address`, values.address);
        formData.append('city', values.city);
        formData.append('country', values.country);
        formData.append('parent_type', 'profile')

        const formDataObject = {};
        for (const [key, value] of formData.entries()) {
            formDataObject[key] = value;
        }

        // Mostrar el objeto plano en la consola
        console.log('Valores del formulario:', formDataObject);

        try {
            const response = await axios.post('http://127.0.0.1:8000/v1/user/business/', formData, {
                onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setProgress(percent);
                },
            });

            if (!response.status >= 200 && response.status < 300) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        } finally {
            setSendingForm(false);
            closeModal();
        }
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
    };

    const initialValues = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        avatar: '',
        address: '',
        city: '',
        country: '',
    };

    const validate = (values) => {
        let errors = {};

        if (!values.first_name) {
            errors.first_name = 'El nombre es requerido';
        }
        if (!values.last_name) {
            errors.last_name = 'El apellido es requerido';
        }
        if (!values.email) {
            errors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'El correo electrónico no es válido';
        }
        if (!values.phone) {
            errors.phone = 'Este campo es requerido';
        }
        if (!values.avatar) {
            errors.avatar = 'Este campo es requerido';
        }
        if (!values.address) {
            errors.address = 'Este campo es requerido';
        }
        if (!values.city) {
            errors.city = 'Este campo es requerido';
        }
        if (!values.country) {
            errors.country = 'Este campo es requerido';
        }

        return errors;
    };

    return (
        <div>
            {isLoadingForm && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
            {!isLoadingForm && (
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validate={validate}
                >
                    {({ values, errors, setFieldValue }) => (
                        <Form className="mb-5 pb-5">
                            <h3 className="text-lg text-center font-bold text-slate-800 font-oxanium">
                                Objetivo: Llenar datos del negocio.
                            </h3>
                            <Input
                                name={`first_name`}
                                label={`Nombre`}
                            />
                            {errors[`first_name`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`first_name`]}
                                </div>
                            )}
                            <Input
                                name={`last_name`}
                                label={`Apellido`}
                            />
                            {errors[`last_name`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`last_name`]}
                                </div>
                            )}
                            <Input
                                name={`email`}
                                label={`Nombre del negocio`}
                            />
                            {errors[`email`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`email`]}
                                </div>
                            )}
                            <Input
                                name={`phone`}
                                label={`Nombre del negocio`}
                            />
                            {errors[`phone`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`phone`]}
                                </div>
                            )}
                            <FileInput
                                label={`Avatar`}
                                name={`avatar`}
                                helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                                onFileChange={handleFileChange}
                            />
                            {errors[`avatar`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`avatar`]}
                                </div>
                            )}
                            <CountrySelect fetchRegions={fetchRegions} />
                            {errors[`country`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`country`]}
                                </div>
                            )}
                            {regionsData.length > 0 && (
                                <NestedSelectInput
                                    name="state"
                                    label="Estado"
                                    options={regionsData.map(geo => ({ value: geo.name, label: geo.name }))}
                                    disabled={!values.country}
                                    onChange={(e) => setFieldValue('region', e.target.value)}
                                />
                            )}
                            <Input
                                name={`address`}
                                label={`Dirección`}
                            />
                            {errors[`address`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`address`]}
                                </div>
                            )}
                            <hr className="m-3" />
                            <FixedBar sendingForm={sendingForm} progress={progress} />
                            <Buttons
                                ariaLabel="botón del formulario"
                                isLoading={sendingForm}
                                type={sendingForm || Object.keys(errors).length > 0 ? 'button' : 'submit'}
                                className={`text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md px-6 font-medium font-oxanium rounded-none uppercase text-[11px] float-end ${Object.keys(errors).length > 0 ? "disabled" : ""
                                    }`}
                                disabled={sendingForm || Object.keys(errors).length > 0}
                                text="Guardar"
                                color="#fff"
                                size="md"
                            />
                        </Form>
                    )}
                </Formik>
            )}

        </div>
    );
};

export default MyForm;