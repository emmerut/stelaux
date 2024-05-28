import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import { homepageData } from '../../../data/homepageData';

// Asumiendo que tienes estos componentes definidos
import { Input, FileInput, NumberInput } from './Form';
import Buttons from '../Button/Buttons';

const MyForm = () => {
  const [dataForm, setData] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);

  const formikObj = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homepageDataResult = await homepageData();
        let parent = homepageDataResult.base.filter(item => item.component === 'experienceV1');
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
    formData.append('main_image', selectedFile);
    formData.append('thumbnail', selectedFile2);
    formData.append('component', 'experienceV1');
    values.inputs.child.forEach((input, index) => {
      formData.append(`inputs[${index}][id]`, input.id);
      formData.append(`inputs[${index}][title_bullet]`, input.title_bullet);
      formData.append(`inputs[${index}][content_bullet]`, input.content_bullet);
      formData.append(`inputs[${index}][numbers]`, input.numbers);
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
      let parent = homepageDataResult.base.filter(item => item.component === 'experienceV1');
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
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };
  const handleFileChange2 = (file) => {
    setSelectedFile2(file);
  };
  
  const initialValues = {
    inputs: dataForm?.length > 0
      ? { parent: dataForm[0], child: dataForm[1] }
      : { parent: [{ id: '', main_image: '', thumbnail: '' }], child: [{ title_bullet: '', content_bullet: '', numbers: '', content_type: 'experience' }] },
  };


  const validate = (values) => {
    let errors = {};

    if (!values.inputs.parent.main_image) {
      errors['inputs.parent.main_image'] = 'El campo main_image es requerido';
    }
    if (!values.inputs.parent.thumbnail) {
      errors['inputs.parent.thumbnail'] = 'El campo thumbnail es requerido';
    }

    if (selectedFile) {
      if (selectedFile.size > 1048576) {
        errors['main_image'] = 'El archivo no debe exceder 1MB';
      } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile.name.split('.').pop().toLowerCase())) {
        errors['main_image'] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
      }
    }
    if (selectedFile2) {
      if (selectedFile2.size > 1048576) {
        errors['thumbnail'] = 'El archivo no debe exceder 1MB';
      } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile2.name.split('.').pop().toLowerCase())) {
        errors['thumbnail'] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
      }
    }
    values.inputs.child.forEach((input, index) => {
      if (!input.title_bullet) {
        errors[`inputs.child.${index}.title_bullet`] = 'El campo título es requerido';
      } else if (input.title_bullet.length > 30) {
        errors[`inputs.child.${index}.title_bullet`] = 'El título no puede exceder los 30 caracteres';
      }

      if (!input.content_bullet) {
        errors[`inputs.child.${index}.content_bullet`] = 'El campo subtítulo es requerido';
      } else if (input.content_bullet.length > 50) {
        errors[`inputs.child.${index}.content_bullet`] = 'El subtítulo no puede exceder los 50 caracteres';
      }
      if (!input.numbers) {
        errors[`inputs.child.${index}.numbers`] = 'El campo número es requerido';
      }
    });

    if (values.inputs.child.length < 2) {
      errors.inputs = 'Se necesitan al menos 2 formsets';
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
      let parent = homepageDataResult.base.filter(item => item.component === 'experienceV1');
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
            <Form className="mb-5">
              <h3 className="text-lg text-center font-bold text-slate-800 font-oxanium">
                Objetivo: Llenar Imagenes y Experiencia (Requerido)
              </h3>
              {errors.inputs && (
                <div className="text-red-500 text-xs mt-1 text-center">
                  {errors.inputs}
                </div>
              )}
              {values.inputs.parent.main_image && (
                <p>
                  Actual: <a href={values.inputs.parent.main_image}>{values.inputs.parent.main_image}</a>
                </p>
              )}
              <FileInput
                name='inputs.parent.main_image'
                helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                onFileChange={handleFileChange}
              />
              {errors['inputs.parent.main_image'] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors['inputs.parent.main_image']}
                </div>
              )}
              {values.inputs.parent.thumbnail && (
                <p>
                  Actual: <a href={values.inputs.parent.thumbnail}>{values.inputs.parent.thumbnail}</a>
                </p>
              )}
              <FileInput
                name='inputs.parent.thumbnail'
                helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 340x340px"
                onFileChange={handleFileChange2}
              />
              {errors['inputs.parent.thumbnail'] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors['inputs.parent.thumbnail']}
                </div>
              )}
              <FieldArray name="inputs.child">
                {({ insert, remove, push }) => (
                  <>
                    {values.inputs.child.map((input, index) => (

                      <div key={index}>

                        <NumberInput
                          name={`inputs.child.${index}.numbers`}
                          label={`Count Number ${index + 1}`}
                        />
                        {errors[`inputs.child.${index}.numbers`] && (
                          <div className="text-red-500 text-xs mt-1">
                            {errors[`inputs.child.${index}.numbers`]}
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
                          if (values.inputs.child.length < 2) {
                            push({
                              title_bullet: '',
                              content_bullet: '',
                              numbers: '',
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