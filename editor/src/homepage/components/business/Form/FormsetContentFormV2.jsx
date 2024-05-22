import React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import axios from 'axios'; // Asegúrate de tener axios instalado

// Asumiendo que tienes estos componentes definidos
import { Input, FileInput } from './Form';
import Buttons from '../Button/Buttons';

const MyForm = () => {
    const [inputs, setInputs] = React.useState([{ value: '' }]);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (values) => {
        console.log('Valores del formulario:', values);
        const formData = new FormData();

        // Asegúrate de que values.inputs tenga la estructura correcta
        values.inputs.forEach((input, index) => {
            formData.append(`inputs[${index}][value]`, input.value);
            // Asegúrate de que el FileInput esté configurado para adjuntar la imagen correctamente
            formData.append(`inputs[${index}][image]`, input.image);
        });

        try {
            const respuesta = await axios.post('/api/enviar_datos/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(respuesta.data);
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    };

    return (
        <div>
            {isLoading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}

            <Formik
                initialValues={{
                    inputs: [{ value: '' }],
                }}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="mb-5">
                        <h3 className="text-lg text-center font-bold text-slate-800 font-oxanium">
                            Objetivo: Llenar Los Campos dinámicamente hasta 10 objetos (Requerido)
                        </h3>

                        <FieldArray name="inputs">
                            {({ insert, remove, push }) => (
                                <>
                                    {values.inputs.map((input, index) => (
                                        <div key={index}>
                                            <Input
                                                name={`inputs.${index}.value`}
                                                label={`Paso Titulo ${index + 1}`}
                                            />
                                            <Input
                                                name={`inputs.${index}.value`}
                                                label={`Paso Subtitulo ${index + 1}`}
                                            />
                                            <FileInput
                                                label={`Subir Imagen ${index + 1}`}
                                                name={`inputs.${index}.image`}
                                                helpText="Tamaño máximo del archivo: 1MB"
                                                setFieldValue={setFieldValue}
                                            />
                                            <button type="button" onClick={() => push({ value: '' })} className="mt-2">
                                                <span className="text-green-500">+</span> Añadir
                                            </button>
                                            {index > 0 && ( // Condición para mostrar el botón solo si index > 0
                                                <button type="button" onClick={() => remove(index)} className="ml-2 float-right">
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
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default MyForm;