import React from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios'; 

// Asumiendo que tienes estos componentes definidos
import { Input, FileInput } from './Form';
import Buttons from '../Button/Buttons';

const MyForm = () => {
  const handleSubmit = async (values) => {
    console.log('Form Values:', values);

    const formData = new FormData();
    formData.append('tag', values.tag);
    formData.append('title', values.title);
    formData.append('image', values.image);

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
      initialValues={{ 
        tag: '',  
        title: '',  
        image: '',  
    }}
      onSubmit={handleSubmit}
    >
      <Form className='mb-5'>
        <h3 className='text-lg text-center font-bold text-slate-800 font-oxanium'>Objetivo: Llenar formulario dinámico (Requerido)</h3>
        <Input name="tag" label="Etiqueta" />
        <Input name="title" label="Título" />
        <FileInput
          label="Subir Imagen"
          name="imagen" 
          helpText="Tamaño máximo del archivo: 1MB" 
          setFieldValue={(fieldName, selectedFile) => {
            // Actualiza el valor del campo 'imagen' en el estado de Formik
            setFieldValue(fieldName, selectedFile); 
          }}
        />
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
    </Formik>
  );
};

export default MyForm;