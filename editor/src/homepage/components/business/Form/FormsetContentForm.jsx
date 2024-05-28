import React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import axios from 'axios'; // Asegúrate de tener axios instalado

// Asumiendo que tienes estos componentes definidos
import { Input, FileInput } from './Form';
import Buttons from '../Button/Buttons';

const MyForm = () => {
    const [inputs, setInputs] = React.useState([{ value: '' }]);

    const handleSubmit = async (values) => {
        console.log('Valores del formulario:', values);

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('subtitle', values.subtitle);
        formData.append('image', values.image);

        values.inputs.forEach((input) => {
            formData.append('inputs[]', input.value);
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
        <Formik
            initialValues={{ title: '', subtitle: '', image: null, inputs: [{ value: '' }] }}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue }) => ( // Accede a values aquí
                <Form className=' mb-5'>
                    <h3 className='text-lg text-center font-bold text-slate-800 font-oxanium'>
                        Objetivo: Llenar Los Campos (Requerido)
                    </h3>
                    <Input name="title" label="Título" />
                    <Input name="subtitle" label="Subtítulo" />
                    <FileInput
                        label="Subir Imagen"
                        name="image"
                        helpText="Tamaño máximo del archivo: 1MB"
                        setFieldValue={setFieldValue} // Pasa setFieldValue directamente
                    />
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
                                        <button type="button" onClick={() => remove(index)}>
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => push({ value: '' })}>
                                    Añadir Input
                                </button>
                            </>
                        )}
                    </FieldArray>
                    <hr className='m-3' />
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
    );
};

export default MyForm;