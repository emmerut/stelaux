import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import { homepageData } from '../../../data/homepageData';

// Asumiendo que tienes estos componentes definidos
import { Input, FileInput } from '../Form';
import Buttons from '../Button/Buttons';

const MyForm = () => {
    const [dataForm, setData] = useState(null);
    const [isLoadingForm, setIsLoadingForm] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const homepageDataResult = await homepageData();
                const heroSlider = homepageDataResult.base.filter(item => item.component === 'hero_slider');
                setData(heroSlider);

            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setError(error);
            } finally {
                setIsLoadingForm(false);

            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (values) => {
        setIsLoadingForm(true);
        const formData = new FormData();
        values.inputs.forEach((input, index) => {
            formData.append(`inputs[${index}][id]`, input.id);
            formData.append(`inputs[${index}][product]`, input.title);
            formData.append(`inputs[${index}][size]`, input.subtitle);
            formData.append(`inputs[${index}][color]`, 'hero_slider');
            formData.append(`inputs[${index}][price]`, 'hero_slider');
            formData.append(`inputs[${index}][quantity]`, 'hero_slider');
            formData.append(`inputs[${index}][content_type]`, 'content_base');
            formData.append(`inputs[${index}][image]`, selectedFile);
           
        });
        const formDataObject = {};
        for (const [key, value] of formData.entries()) {
            formDataObject[key] = value;
        }

        // Mostrar el objeto plano en la consola
        console.log('Valores del formulario:', formDataObject);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/v1/stela-editor/create_content/', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Error en la solicitud: ${res.status}`);
            }
            const homepageDataResult = await homepageData();
            const heroSlider = homepageDataResult.base.filter(item => item.component === 'hero_slider');
            setData(heroSlider);

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsLoadingForm(false);
        }
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
    };

    const initialValues = { inputs: dataForm?.length > 0 ? dataForm : [{ title: '', subtitle: '', main_image: '', component: 'hero_slider' }] };


    const validate = (values) => {
        let errors = {};

        values.inputs.forEach((input, index) => {
            if (!input.title) {
                errors[`inputs.${index}.title`] = 'El campo título es requerido';
            } else if (input.title.length > 30) {
                errors[`inputs.${index}.title`] = 'El título no puede exceder los 30 caracteres';
            }

            if (!input.subtitle) {
                errors[`inputs.${index}.subtitle`] = 'El campo subtítulo es requerido';
            } else if (input.subtitle.length > 50) {
                errors[`inputs.${index}.subtitle`] = 'El subtítulo no puede exceder los 50 caracteres';
            }

            if (selectedFile) {
                if (selectedFile.size > 1048576) {
                    errors[`inputs.${index}.main_image`] = 'El archivo no debe exceder 1MB';
                } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile.name.split('.').pop().toLowerCase())) {
                    errors[`inputs.${index}.main_image`] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
                }
            }
        });

        if (values.inputs.length < 3) {
            errors.inputs = 'Se necesitan al menos 3 objetos';
        }

        return errors;
    };

    const removeObject = async (objID, contentType) => {
        setIsLoadingForm(true)
        try {
            const res = await fetch('http://127.0.0.1:8000/api/v1/stela-editor/delete_content/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', // Especifica que el cuerpo es JSON
                },
                body: JSON.stringify({
                    id: objID, // Incluye el ID del objeto
                    type: contentType // Incluye el tipo de contenido
                }),
            });

            if (!res.ok) {
                throw new Error(`Error en la solicitud: ${res.status}`);
            }
            const homepageDataResult = await homepageData();
            const heroSlider = homepageDataResult.base.filter(item => item.component === 'hero_slider');
            setData(heroSlider);

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsLoadingForm(false);
        }
    }
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
                    {({ values, errors }) => (
                        <Form className="mb-5">
                            <h3 className="text-lg text-center font-bold text-slate-800 font-oxanium">
                                Objetivo: Llenar datos para Slider (Requerido)
                            </h3>

                            <FieldArray name="inputs">
                                {({ insert, remove, push }) => (
                                    <>
                                        {values.inputs.map((input, index) => (

                                            <div key={index}>

                                                <Input
                                                    name={`inputs.${index}.title`}
                                                    label={`Paso Titulo ${index + 1}`}
                                                />
                                                {errors[`inputs.${index}.title`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.${index}.title`]}
                                                    </div>
                                                )}
                                                <Input
                                                    name={`inputs.${index}.subtitle`}
                                                    label={`Paso Subtitulo ${index + 1}`}
                                                />
                                                {errors[`inputs.${index}.subtitle`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.${index}.subtitle`]}
                                                    </div>
                                                )}
                                                {input.main_image && (
                                                    <p>
                                                        Actual: <a href={input.main_image}>{input.main_image}</a>
                                                    </p>
                                                )}
                                                <FileInput
                                                    name={`inputs.${index}.main_image`}
                                                    helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                                                    onFileChange={handleFileChange}
                                                />
                                                {errors[`inputs.${index}.main_image`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.${index}.main_image`]}
                                                    </div>
                                                )}
                                                <button type="button" onClick={() => {
                                                    if (values.inputs.length < 3) {
                                                        push({ title: '', subtitle: '', main_image: '' });
                                                    }
                                                }} className="mt-2">
                                                    <span className="text-green-500">+</span> Añadir
                                                </button>

                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        className="ml-2 float-right"
                                                        onClick={input.id ? () => removeObject(input.id, 'content_base') : () => remove(index)}
                                                    >
                                                        <span className="text-red-500">- Eliminar</span>
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                    </>
                                )}
                            </FieldArray>

                            <hr className="m-3" />
                            <Buttons
                                ariaLabel="botón del formulario"
                                type="submit"
                                className={`font-medium font-oxanium rounded-none uppercase text-[11px] float-end`}
                                themeColor={['#2f1875', '#2f1875']}
                                size="md"
                                color="#fff"
                                title="Guardar"
                                disabled={Object.keys(errors).length > 0}
                            />
                        </Form>
                    )}
                </Formik>
            )}

        </div>
    );
};

export default MyForm;