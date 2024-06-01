import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { homepageData } from '@/constant/homepageData';

// Asumiendo que tienes estos componentes definidos
import { FileInput, SelectInput, DecimalInput, NumberInput } from '@/components/form/Form';
import Buttons from '@/components/ui/Button';

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
            formData.append(`inputs[${index}][product]`, input.product);
            formData.append(`inputs[${index}][color]`, input.color);
            formData.append(`inputs[${index}][size]`, input.size);
            formData.append(`inputs[${index}][price]`, input.price);
            formData.append(`inputs[${index}][stock]`, input.stock);
            formData.append(`inputs[${index}][image]`, selectedFile);
            formData.append(`inputs[${index}][content_type]`, 'variant');

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

    const initialValues = { inputs: dataForm?.length > 0 ? dataForm : [{ product: '', color: '', size: '', price: '', stock: '', image: '' }] };


    const validate = (values) => {
        let errors = {};

        values.inputs.forEach((input, index) => {
            if (!input.product) {
                errors[`inputs.${index}.product`] = 'El campo producto es requerido';
            }
            if (!input.color) {
                errors[`inputs.${index}.color`] = 'El campo color es requerido';
            }
            if (!input.size) {
                errors[`inputs.${index}.size`] = 'El campo tamaño es requerido';
            }
            if (!input.price) {
                errors[`inputs.${index}.price`] = 'El campo precio es requerido';
            }
            if (!input.stock) {
                errors[`inputs.${index}.stock`] = 'El campo stock es requerido';
            }
            if (!input.image) {
                errors[`inputs.${index}.image`] = 'El campo imagen es requerido';
            }
            if (selectedFile) {
                if (selectedFile.size > 1048576) {
                    errors[`inputs.${index}.image`] = 'El archivo no debe exceder 1MB';
                } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile.name.split('.').pop().toLowerCase())) {
                    errors[`inputs.${index}.image`] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
                }
            }
        });

        return errors;
    };

    const options = [
        { value: '', label: 'Elige una categoría', disabled: true },
        { value: 'line-icon-Cursor-Click2 text-[#27ae60]', label: 'Click' },
        { value: 'line-icon-Bakelite text-[#27ae60]', label: 'Locker' },
        { value: 'line-icon-Boy text-[#27ae60]', label: 'User' },
    ];
    const options2 = [
        { value: '', label: 'Elige una categoría', disabled: true },
        { value: 'line-icon-Cursor-Click2 text-[#27ae60]', label: 'Click' },
        { value: 'line-icon-Bakelite text-[#27ae60]', label: 'Locker' },
        { value: 'line-icon-Boy text-[#27ae60]', label: 'User' },
    ];
    const options3 = [
        { value: '', label: 'Elige una categoría', disabled: true },
        { value: 'line-icon-Cursor-Click2 text-[#27ae60]', label: 'Click' },
        { value: 'line-icon-Bakelite text-[#27ae60]', label: 'Locker' },
        { value: 'line-icon-Boy text-[#27ae60]', label: 'User' },
    ]

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
                        <Form className="mb-5 pb-5">
                            <h3 className="text-lg text-center font-bold text-slate-800 font-oxanium">
                                Objetivo: Llenar variantes de productos (Puedes añadir los sets que requieras)
                            </h3>

                            <FieldArray name="inputs">
                                {({ insert, remove, push }) => (
                                    <>
                                        {values.inputs.map((input, index) => (

                                            <div key={index}>
                                                <SelectInput
                                                    label={`Parent ${index + 1}`}
                                                    name={`inputs.child.${index}.product`}
                                                    options={options}
                                                />
                                                {errors[`inputs.child.${index}.product`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.product`]}
                                                    </div>
                                                )}
                                                <SelectInput
                                                    label={`Color ${index + 1}`}
                                                    name={`inputs.child.${index}.color`}
                                                    options={options2}
                                                />
                                                {errors[`inputs.child.${index}.color`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.color`]}
                                                    </div>
                                                )}
                                                <SelectInput
                                                    label={`Talla ${index + 1}`}
                                                    name={`inputs.child.${index}.size`}
                                                    options={options3}
                                                />
                                                {errors[`inputs.child.${index}.size`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.size`]}
                                                    </div>
                                                )}
                                                <DecimalInput
                                                    name={`inputs.child.${index}.price`}
                                                    label={`Precio ${index + 1}`}
                                                />
                                                {errors[`inputs.child.${index}.price`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.price`]}
                                                    </div>
                                                )}
                                                <NumberInput
                                                    name={`inputs.child.${index}.stock`}
                                                    label={`Stock ${index + 1}`}
                                                />
                                                {errors[`inputs.child.${index}.stock`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.stock`]}
                                                    </div>
                                                )}
                                                {input.image && (
                                                    <p>
                                                        Actual: <a href={input.image}>{input.image}</a>
                                                    </p>
                                                )}
                                                <FileInput
                                                    name={`inputs.${index}.image`}
                                                    helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                                                    onFileChange={handleFileChange}
                                                />
                                                {errors[`inputs.${index}.image`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.${index}.image`]}
                                                    </div>
                                                )}
                                                <button type="button" onClick={() => {
                                                    push({ product: '', color: '', size: '', price: '', stock: '', image: '' });

                                                }} className="mt-2">
                                                    <span className="text-green-500">+</span> Añadir
                                                </button>

                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        className="ml-2 float-right"
                                                        onClick={input.id ? () => removeObject(input.id, 'product') : () => remove(index)}
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
                                className={`text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md px-6 font-medium font-oxanium rounded-none uppercase text-[11px] float-end ${Object.keys(errors).length > 0 ? "disabled" : ""
                                    }`}
                                disabled={Object.keys(errors).length > 0} // Proper disabled attribute
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