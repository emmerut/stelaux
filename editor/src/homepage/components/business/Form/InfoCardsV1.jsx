import React from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios'; // Asegúrate de tener axios instalado

// Asumiendo que tienes estos componentes definidos
import { Input, Select } from './Form';
import Buttons from '../Button/Buttons';

const options = [
    { value: 'option1', label: 'Click' },
    { value: 'option2', label: 'Locker' },
    { value: 'option3', label: 'User' },
  ];

const MyForm = () => {
  const handleSubmit = async (values) => {
    console.log('Form Values:', values);

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('subtitle', values.subtitle);
    formData.append('icon', values.icon);

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
      initialValues={{ title: '', subtitle: '', icon: '' }}
      onSubmit={handleSubmit}
    >
      <Form className='mb-5'>
        <h3 className='text-lg text-center font-bold text-slate-800 font-oxanium'>Objetivo: Llenar las 3 Tarjetas (Requerido)</h3>
        <Select label="Icono" name="mySelect" options={options} />
        <Input name="titulo" label="Título" />
        <Input name="subtitulo" label="Subtítulo" />
        <hr className='m-3' />
        {/* Repite esta sección si necesitas más campos */}
        <Select label="Icono" name="mySelect" options={options} />
        <Input name="titulo" label="Título" />
        <Input name="subtitulo" label="Subtítulo" />
        <hr className='m-3' />
        {/* Repite esta sección si necesitas más campos */}
        <Select label="Icono" name="mySelect" options={options} />
        <Input name="titulo" label="Título" />
        <Input name="subtitulo" label="Subtítulo" />
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