import React from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios'; 

// Asumiendo que tienes estos componentes definidos
import { Input, NumberInput, FileInput } from './Form';
import Buttons from '../Button/Buttons';

const MyForm = () => {
  const handleSubmit = async (values) => {
    console.log('Form Values:', values);

    const formData = new FormData();
    formData.append('main_title', values.main_title);
    formData.append('title', values.title);
    formData.append('subtitle', values.subtitle);

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
        main_title: '',  
        title: '',  
        subtitle: '',  
    }}
      onSubmit={handleSubmit}
    >
      <Form className='mb-5'>
        <h3 className='text-lg text-center font-bold text-slate-800 font-oxanium'>Objetivo: Llenar información en 3 secciones (Requerido)</h3>
        <Input name="main_title" label="Título Principal" />
        <hr className='m-3' />
        <Input name="title" label="Título" />
        <Input name="subtitle" label="Subtítulo" />
        <hr className='m-3' />
        <Input name="titleRicht" label="Título" />
        <Input name="subtitleRight" label="Subtítulo" />
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