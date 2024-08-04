import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import axios from 'axios';
import FixedBar from '@/components/ui/ProgressBar/FixedBarAlert'
import { Input, FileInput, TextArea, SelectInput } from '@/components/form/Form';
import { productData } from "@/constant/apiData";
import Buttons from '@/components/ui/Button';

const MyForm = ({ objID, closeModal }) => {
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [sendingForm, setSendingForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFile2, setSelectedFile2] = useState(null);
    const [formData, setFormData] = useState([]);
    const [progress, setProgress] = useState(0);


    const formikObj = [];

    const handleSubmit = async (values) => {
        setSendingForm(true);
        const formData = new FormData();
        formData.append('parent_id', values.inputs.parent.id);
        formData.append(`category`, values.inputs.parent.category);
        formData.append(`title`, values.inputs.parent.title);
        formData.append('logo', selectedFile);
        formData.append('logo2', selectedFile2);
        formData.append(`description`, values.inputs.parent.description);
        formData.append('website', values.inputs.parent.website);
        formData.append('parent_type', 'business')

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

    const handleFileChange2 = (file) => {
        setSelectedFile2(file);
    };

    const initialValues = {
        inputs: formData && formData.length > 0
            ? {
                parent: formData[0] || { category: '', title: '', description: '', logo: '', dark_logo: '', website: '' },
            }
            : {
                parent: { category: '', title: '', description: '', logo: '', dark_logo: '', website: '' },
            }
    };

    const validate = (values) => {

        let errors = {};
        if (!values.inputs.parent.category) {
            errors['inputs.parent.category'] = 'la categoría es requerida';
        }
        if (!values.inputs.parent.title) {
            errors['inputs.parent.title'] = 'El título es requerido';
        } else if (values.inputs.parent.title.length > 80) {
            errors['inputs.parent.title'] = 'El título no puede exceder los 80 caracteres';
        }
        if (!values.inputs.parent.description) {
            errors['inputs.parent.description'] = 'La descripción es requerida';
        }
        if (!values.inputs.parent.logo) {
            errors['inputs.parent.logo'] = 'El campo image es requerido';
        }
        if (!values.inputs.parent.dark_logo) {
            errors['inputs.parent.dark_logo'] = 'El campo image es requerido';
        }
        if (!values.inputs.parent.website) {
            errors['inputs.parent.website'] = 'El campo website es requerido';
        }

        if (selectedFile) {
            if (selectedFile.size > 1048576) {
                errors['inputs.parent.logo'] = 'El archivo no debe exceder 1MB';
            } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile.name.split('.').pop().toLowerCase())) {
                errors['inputs.parent.logo'] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
            }
        }
        if (selectedFile2) {
            if (selectedFile2.size > 1048576) {
                errors['inputs.parent.dark_logo'] = 'El archivo no debe exceder 1MB';
            } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile2.name.split('.').pop().toLowerCase())) {
                errors['inputs.parent.dark_logo'] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
            }
        }

        return errors;
    };

    const category = [
        { value: '', label: 'Seleccione Categoría', disabled: true },
        { value: 'Consultoría', label: 'Consultoría' },
        { value: 'Marketing Digital', label: 'Marketing Digital' },
        { value: 'Desarrollo de Software', label: 'Desarrollo de Software' },
        { value: 'Contabilidad', label: 'Contabilidad' },
        { value: 'Asesoría Legal', label: 'Asesoría Legal' },
        { value: 'Ecommerce', label: 'Ecommerce' },
        { value: 'Tecnología', label: 'Tecnología' }, // Ejemplo
        { value: 'Salud', label: 'Salud' }, // Ejemplo
        { value: 'Educación', label: 'Educación' }, // Ejemplo
        { value: 'Finanzas', label: 'Finanzas' }, // Ejemplo
    ];

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
                            <SelectInput
                                label={`Tipo de negocio`}
                                name={`inputs.parent.category`}
                                options={category}
                            />
                            {errors[`inputs.parent.category`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`inputs.parent.category`]}
                                </div>
                            )}
                            <Input
                                name={`inputs.parent.title`}
                                label={`Nombre del negocio`}
                            />
                            {errors[`inputs.parent.title`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`inputs.parent.title`]}
                                </div>
                            )}
                            <TextArea
                                initialValue={formData?.[0]?.description ?? ''}
                                name={`inputs.parent.description`}
                                label={`Descripción`}
                                onEditorChange={(content) => {
                                    setFieldValue(`inputs.parent.description`, content);
                                }}
                            />
                            {errors[`inputs.parent.description`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`inputs.parent.description`]}
                                </div>
                            )}
                            {values.inputs.parent.logo && (
                                <p>
                                    Actual: <a href={values.inputs.parent.logo}>{values.inputs.parent.logo}</a>
                                </p>
                            )}
                            <FileInput
                                label={`Logo para fondo claro`}
                                name={`inputs.parent.logo`}
                                helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                                onFileChange={handleFileChange}
                            />
                            {errors[`inputs.parent.logo`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`inputs.parent.logo`]}
                                </div>
                            )}
                            {values.inputs.parent.dark_logo && (
                                <p>
                                    Actual: <a href={values.inputs.parent.dark_logo}>{values.inputs.parent.dark_logo}</a>
                                </p>
                            )}
                            <FileInput
                                label={`Logo para fondo oscuro`}
                                name={`inputs.parent.dark_logo`}
                                helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                                onFileChange={handleFileChange2}
                            />
                            {errors[`inputs.parent.dark_logo`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`inputs.parent.dark_logo`]}
                                </div>
                            )}
                            <Input
                                name={`inputs.parent.website`}
                                label={`Website`}
                            />
                            {errors[`inputs.parent.website`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`inputs.parent.website`]}
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