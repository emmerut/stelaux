import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import { homepageData } from '../../../data/homepageData';

// Asumiendo que tienes estos componentes definidos
import { Input, SelectInput } from './Form';
import Buttons from '../Button/Buttons';

const MyForm = () => {
    const [dataForm, setData] = useState(null);
    const [isLoadingForm, setIsLoadingForm] = useState(true);
    const [error, setError] = useState(null);

    const formikObj = [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const homepageDataResult = await homepageData();
                let parent = homepageDataResult.base.filter(item => item.component === 'infocards');
                if (parent.length === 1) {
                    parent = parent[0];

                    // Filter child components based on the parent's ID
                    const child = homepageDataResult.info_components.filter(item => item.parent === parent.id);

                    // Add parent and child to formikObj
                    formikObj.push(parent);
                    formikObj.push(child);
                    setData(formikObj)
                } else {
                    console.warn("No 'infocards' component found!");
                }

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
        formData.append('parent_id', values.inputs.parent.id);
        formData.append('parent_type', 'content_base')
        formData.append('component', 'infocardsV1');
        
        values.inputs.child.forEach((input, index) => {
            formData.append(`inputs[${index}][id]`, input.id);
            formData.append(`inputs[${index}][title_bullet]`, input.title_bullet);
            formData.append(`inputs[${index}][content_bullet]`, input.content_bullet);
            formData.append(`inputs[${index}][icons]`, input.icons);
            formData.append(`inputs[${index}][content_type]`, 'info_component');
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
            let parent = homepageDataResult.base.filter(item => item.component === 'infocardsV1');
            if (parent.length === 1) {
                parent = parent[0];

                // Filter child components based on the parent's ID
                const child = homepageDataResult.info_components.filter(item => item.parent === parent.id);

                // Add parent and child to formikObj
                formikObj.push(parent);
                formikObj.push(child);
                setData(formikObj)
            } else {
                console.warn("No 'infocardsV1' component found!");
            }

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsLoadingForm(false);
        }
    };
    const initialValues = {
        inputs: dataForm?.length > 0
            ? { parent: dataForm[0], child: dataForm[1] }
            : { parent: [{ id: '' }], child: [{ title_bullet: '', content_bullet: '', icons: '', content_type: 'info_component' }] },
    };

    const validate = (values) => {
        let errors = {};

        values.inputs.child.forEach((input, index) => {
            if (!input.title_bullet) {
                errors[`inputs.child.${index}.title_bullet`] = 'El campo título es requerido';
            } else if (input.title_bullet.length > 20) {
                errors[`inputs.child.${index}.title_bullet`] = 'El título no puede exceder los 20 caracteres';
            }

            if (!input.content_bullet) {
                errors[`inputs.child.${index}.content_bullet`] = 'El campo contenido es requerido';
            } else if (input.content_bullet.length > 30) {
                errors[`inputs.child.${index}.content_bullet`] = 'El contenido no puede exceder los 30 caracteres';
            }
            if (!input.icons) {
                errors[`inputs.child.${index}.icons`] = 'Por favor, seleccione una opción del menú desplegable.';
            }
        });

        if (values.inputs.child.length < 3) {
            errors.inputs = 'Se necesitan al menos 3 formsets';
        }
        return errors;
    };

    const removeObject = async (objID, contentType, parentID, parenty) => {
        setIsLoadingForm(true)
        try {
            const res = await fetch('http://127.0.0.1:8000/api/v1/stela-editor/delete_content/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', // Especifica que el cuerpo es JSON
                },
                body: JSON.stringify({
                    parent_type: parenty,
                    parent_id: parentID, // Incluye el ID del objeto
                    id: objID, // Incluye el ID del objeto
                    type: contentType, // Incluye el tipo de contenido
                }),
            });

            if (!res.ok) {
                throw new Error(`Error en la solicitud: ${res.status}`);
            }
            const homepageDataResult = await homepageData();
            let parent = homepageDataResult.base.filter(item => item.component === 'infocardsV1');
            if (parent.length === 1) {
                parent = parent[0];

                // Filter child components based on the parent's ID
                const child = homepageDataResult.info_components.filter(item => item.parent === parent.id);

                // Add parent and child to formikObj
                formikObj.push(parent);
                formikObj.push(child);
                setData(formikObj)
            } else {
                console.warn("No 'infocardsV1' component found!");
            }

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsLoadingForm(false);
        }
    }

    const options = [
        { value: '', label: 'Elige un Icono', disabled: true },
        { value: 'line-icon-Cursor-Click2 text-[#27ae60]', label: 'Click' },
        { value: 'line-icon-Bakelite text-[#27ae60]', label: 'Locker' },
        { value: 'line-icon-Boy text-[#27ae60]', label: 'User' },
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
                    {({ values, errors }) => (
                        <Form className="mb-5">
                            <h3 className="text-lg text-center font-bold text-slate-800 font-oxanium">
                                Objetivo: Llenar datos para Infocards (Requerido)
                            </h3>
                            {errors.inputs && (
                                <div className="text-red-500 text-xs mt-1 text-center">
                                    {errors.inputs}
                                </div>
                            )}
                            <FieldArray name="inputs.child">
                                {({ insert, remove, push }) => (
                                    <>
                                        {values.inputs.child.map((input, index) => (

                                            <div key={index}>
                                                <SelectInput
                                                    label={`Icono ${index + 1}`}
                                                    name={`inputs.child.${index}.icons`}
                                                    options={options}
                                                    showErrorMsg={true}
                                                />
                                                {errors[`inputs.child.${index}.icons`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.icons`]}
                                                    </div>
                                                )}
                                                <Input
                                                    name={`inputs.child.${index}.title_bullet`}
                                                    label={`Info title ${index + 1}`}
                                                />
                                                {errors[`inputs.child.${index}.title_bullet`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.title_bullet`]}
                                                    </div>
                                                )}
                                                <Input
                                                    name={`inputs.child.${index}.content_bullet`}
                                                    label={`Info Subtitulo ${index + 1}`}
                                                />
                                                {errors[`inputs.child.${index}.content_bullet`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.content_bullet`]}
                                                    </div>
                                                )}
                                                <button type="button" onClick={() => {
                                                    if (values.inputs.child.length < 3) {
                                                        push({
                                                            title_bullet: '',
                                                            content_bullet: '',
                                                            icons: '',
                                                            content_type: 'info_component'
                                                        });
                                                    }
                                                }} className="mt-2">
                                                    <span className="text-green-500">+</span> Añadir
                                                </button>

                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        className="ml-2 float-right"
                                                        onClick={input.id ? () => removeObject(input.id, 'info_component', values.inputs.parent.id, 'content_base') : () => remove(index)}
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