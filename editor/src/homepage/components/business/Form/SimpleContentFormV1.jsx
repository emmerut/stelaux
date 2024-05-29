import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { homepageData } from '../../../data/homepageData';

// Asumiendo que tienes estos componentes definidos
import { Input } from './Form';
import Buttons from '../Button/Buttons';

const MyForm = ({ section }) => {
  const [dataForm, setData] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [error, setError] = useState(null);

  const formikObj = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homepageDataResult = await homepageData();

        let parent = homepageDataResult.base.filter(item => item.component === `simpleContentV1_${section}`);
        if (parent.length === 1) {
          parent = parent[0];

          // Add parent and child to formikObj
          formikObj.push(parent);
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
    formData.append('parent_type', 'content_base')
    formData.append('component', `simpleContentV1_${section}`);
    formData.append(`parent_id`, values.inputs.parent.id);
    formData.append(`title`, values.inputs.parent.title);
    formData.append(`subtitle`, values.inputs.parent.subtitle);
    
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
      let parent = homepageDataResult.base.filter(item => item.component === `simpleContentV1_${section}`);
      if (parent.length === 1) {
        parent = parent[0];

        // Add parent and child to formikObj
        formikObj.push(parent);
        setData(formikObj)
      } else {
        console.warn("No 'infocards' component found!");
      }

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsLoadingForm(false);
    }
  };

  const initialValues = {
    inputs: dataForm?.length > 0
      ? { parent: dataForm[0] }
      : { parent: { id: '', title: '', subtitle: '' } },
  };


  const validate = (values) => {
    let errors = {};
    if (!values.inputs.parent.title) {
      errors['inputs.parent.title'] = 'El título es requerido';
    } else if (values.inputs.parent.title.length > 80) {
      errors['inputs.parent.title'] = 'El título no puede exceder los 80 caracteres';
    }
    if (!values.inputs.parent.subtitle) {
      errors['inputs.parent.subtitle'] = 'El subtítulo es requerido';
    } else if (values.inputs.parent.subtitle.length > 30) {
      errors['inputs.parent.title'] = 'El título no puede exceder los 30 caracteres';
    }

    return errors;
  };

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
                Objetivo: Form Básico Título y Subtítulo (Requerido)
              </h3>
              <Input
                name='inputs.parent.title'
                label={`Título Principal`}
              />
              {errors['inputs.parent.title'] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors['inputs.parent.title']}
                </div>
              )}
              <Input
                name='inputs.parent.subtitle'
                label={`Subtítulo`}
              />
              {errors['inputs.parent.subtitle'] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors['inputs.parent.subtitle']}
                </div>
              )}

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