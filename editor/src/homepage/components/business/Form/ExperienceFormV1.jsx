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
    formData.append('title', values.title);
    formData.append('subtitle', values.subtitle);
    formData.append('number', values.number);
    formData.append('thumnail', values.thumnail);
    formData.append('imagen', valores.image);

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
        title: '',  
        subtitle: '',  
        number:'', 
        image: '', 
        thumnail: '',
    }}
      onSubmit={handleSubmit}
    >
      <Form className='mb-5'>
        <h3 className='text-lg text-center font-bold text-slate-800 font-oxanium'>Objetivo: Completar Experticia  (Requerido)</h3>
        <NumberInput name="numberLeft" label="Número Izquierdo" />
        <Input name="titleLeft" label="Título Izquierdo" />
        <Input name="subtitleLeft" label="Subtítulo Izquierdo" />
        <hr className='m-3' />
        <FileInput
          label="Background"
          name="image_background" 
          helpText="Tamaño máximo del archivo: 1MB" 
          setFieldValue={(fieldName, selectedFile) => {
            setFieldValue(fieldName, selectedFile); 
          }}
        />
        <NumberInput name="numberRight" label="Número Derecho" />
        <Input name="titleRicht" label="Título Derecho" />
        <Input name="subtitleRight" label="Subtítulo Derecho" />
        <hr className='m-3' />
        {/* Repite esta sección si necesitas más campos */}
        <FileInput
          label="Thumbnail"
          name="image_thumbnail" 
          helpText="Tamaño máximo del archivo: 1MB" 
          setFieldValue={(fieldName, selectedFile) => {
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