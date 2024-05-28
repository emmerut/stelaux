import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios'; // Asegúrate de tener axios instalado

// Asumiendo que tienes estos componentes definidos
import { Input, FileInput } from './Form';
import Buttons from '../Button/Buttons';

const MyForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (valores) => {
    console.log('Valores del formulario:', valores);
    setIsLoading(true);
    const formData = new FormData();
    formData.append('titulo', valores.titulo);
    formData.append('subtitulo', valores.subtitulo);
    formData.append('imagen', valores.imagen);

    try {
      const respuesta = await axios.post('/api/enviar_datos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(respuesta.data);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsLoading(false); // Desactivar el loader al finalizar
    }
  };

  return (
    <Formik
      initialValues={{ titulo: '', subtitulo: '', imagen: null }}
      onSubmit={handleSubmit}
    >
      <Form className=' mb-5'>
        <h3 className='text-lg text-center font-bold text-slate-800 font-oxanium'>Objetivo: Llenar 3 Sliders (Requerido)</h3>
        <Input name="titulo" label="Título" />
        <Input name="subtitulo" label="Subtítulo" />
        <FileInput
          label="Subir Imagen"
          name="imagen"
          helpText="Tamaño máximo del archivo: 1MB"
          setFieldValue={(fieldName, selectedFile) => {
            // Actualiza el valor del campo 'imagen' en el estado de Formik
            setFieldValue(fieldName, selectedFile);
          }}
        />
        <hr />
        {/* Repite esta sección si necesitas más campos */}
        <Input name="titulo" label="Título" />
        <Input name="subtitulo" label="Subtítulo" />
        <FileInput
          label="Subir Imagen"
          name="imagen"
          helpText="Tamaño máximo del archivo: 1MB"
          setFieldValue={(fieldName, selectedFile) => {
            setFieldValue(fieldName, selectedFile);
          }}
        />
        <hr />
        {/* Repite esta sección si necesitas más campos */}
        <Input name="titulo" label="Título" />
        <Input name="subtitulo" label="Subtítulo" />
        <FileInput
          label="Subir Imagen"
          name="imagen"
          helpText="Tamaño máximo del archivo: 1MB"
          setFieldValue={(fieldName, selectedFile) => {
            setFieldValue(fieldName, selectedFile);
          }}
        />
        <hr />
        <Buttons
          ariaLabel="botón del formulario"
          type="submit"
          className={`font-medium font-oxanium rounded-none uppercase text-[11px] float-end`}
          themeColor={['#2f1875', '#2f1875']}
          size="md"
          color="#fff"
          title={isLoading ? 'Guardando...' : 'Guardar'}
          disabled={isLoading} 
        />
      </Form>
    </Formik>
  );
};

export default MyForm;