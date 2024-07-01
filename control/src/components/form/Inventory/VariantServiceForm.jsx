import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios';
import FixedBar from '@/components/ui/ProgressBar/FixedBarAlert'

// Asumiendo que tienes estos componentes definidos
import { Input, FileInput, SelectInput, TextArea, DecimalInput } from '@/components/form/Form';
import { serviceData } from "@/constant/sessionData";
import Buttons from '@/components/ui/Button';

const MyForm = ({ objID, refreshData, closeModal }) => {
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [sendingForm, setSendingForm] = useState(false);
    const [formData, setFormData] = useState([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingForm(true);
                const res = await serviceData();
                console.log(res.variants)
                const filteredItems = res.variants.filter(item => item.id === objID);
                setFormData(filteredItems[0]);

            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setIsLoadingForm(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (values) => {
        setSendingForm(true);
        const formData = new FormData();

        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        formData.append('parent_id', values.formData.id);
        formData.append('status', values.formData.status);
        formData.append(`title`, values.formData.title);
        formData.append(`description`, values.formData.description);
        formData.append(`price`, values.formData.price);
        formData.append('parent_type', 'variant_service')

        const formDataObject = {};
        for (const [key, value] of formData.entries()) {
            formDataObject[key] = value;
        }

        // Mostrar el objeto plano en la consola
        console.log('Valores del formulario:', formDataObject);

        try {
            const response = await axios.post('http://127.0.0.1:8000/v1/inventory/create_service/', formData, {
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
            refreshData();
            closeModal();
        }
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
    };

    const initialValues = { formData };

    const validate = (values) => {
        let errors = {};
        if (!values.formData.title) {
            errors['formData.title'] = 'El título es requerido';
        } else if (values.formData.title.length > 80) {
            errors['formData.title'] = 'El título no puede exceder los 80 caracteres';
        }
        if (!values.formData.description) {
            errors['formData.description'] = 'La descripción es requerida';
        }
        if (!values.formData.price) {
            errors['formData.price'] = 'El precio es requerido';
        }
        if (!values.formData.image) {
            errors['formData.image'] = 'El campo image es requerido';
        }

        if (selectedFile) {
            if (selectedFile.size > 1048576) {
                errors['formData.image'] = 'El archivo no debe exceder 1MB';
            } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile.name.split('.').pop().toLowerCase())) {
                errors['formData.image'] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
            }
        }

        return errors;
    };

    const status = [
        { value: '', label: 'Seleccionar Estado', disabled: true },
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' },
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
                            <h3 className="text-lg text-center font-bold text-slate-800 font-oxanium mb-5">
                                Objetivo: Llenar los campos de las Variantes.
                            </h3>
                            <SelectInput
                                label={`Estado`}
                                name={`formData.status`}
                                options={status}
                            />
                            {errors[`formData.status`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`formData.status`]}
                                </div>
                            )}
                            <Input
                                name='formData.title'
                                label={`Título Principal`}
                            />
                            {errors['formData.title'] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors['formData.title']}
                                </div>
                            )}
                            <TextArea
                                initialValue={formData.description}
                                name='formData.description'
                                label={`Descripción`}
                                onEditorChange={(content) => setFieldValue('formData.description', content)}
                            />
                            {errors['formData.description'] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors['formData.description']}
                                </div>
                            )}
                            <DecimalInput
                                name={`formData.price`}
                                label={`Precio`}
                            />
                            {errors[`formData.price`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`formData.price`]}
                                </div>
                            )}
                            <FileInput
                                name='formData.image'
                                helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                                onFileChange={handleFileChange}
                            />
                            {values.formData.image && (
                                <p>
                                    Actual: <a href={values.formData.image}>{values.formData.image}</a>
                                </p>
                            )}
                            {errors['formData.image'] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors['formData.image']}
                                </div>
                            )}
                            <hr className='my-5' />
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