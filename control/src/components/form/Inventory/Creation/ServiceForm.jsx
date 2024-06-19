import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';

// Asumiendo que tienes estos componentes definidos
import { Input, FileInput, NumberInput, DecimalInput, TextArea, SelectInput } from '@/components/form/Form';
import Buttons from '@/components/ui/Button';

const MyForm = ({refreshData}) => {
  const [dataForm, setData] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [sendingForm, setSendingForm] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);

  const formikObj = [];

  useEffect(() => {
    const fetchData = async () => {

    };
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setSendingForm(true);
    const formData = new FormData();
    formData.append('parent_id', values.inputs.parent.id);
    formData.append(`category`, values.inputs.parent.category);
    formData.append(`title`, values.inputs.parent.title);
    formData.append(`status`, values.inputs.parent.status);
    formData.append(`description`, values.inputs.parent.description);
    formData.append('image', selectedFile);
    formData.append('parent_type', 'service')
    values.inputs.child.forEach((input, index) => {
      formData.append(`inputs[${index}][id]`, input.id);
      formData.append(`inputs[${index}][title]`, input.title);
      formData.append(`inputs[${index}][description]`, input.description);
      formData.append(`inputs[${index}][image]`, selectedFile2);
      formData.append(`inputs[${index}][price]`, input.price);
      formData.append(`inputs[${index}][duration]`, input.duration);
      formData.append(`inputs[${index}][content_type]`, input.content_type);
    });
    const formDataObject = {};
    for (const [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }

    // Mostrar el objeto plano en la consola
    console.log('Valores del formulario:', formDataObject);

    try {
      const res = await fetch('http://127.0.0.1:8000/v1/inventory/create_service/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.status}`);
      }

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setSendingForm(false);
      refreshData();
      closeModal();
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
      : { parent: { id: '', category: '', title: '', status: '', description: '', main_image: '' }, child: [{ parent_id: '', title: '', description: '', image: '', price: '', content_type: 'service_variant' }] },
  };

  const category = [
    { value: '', label: 'Seleccione Categoría', disabled: true },
    { value: 'Consultoría', label: 'Consultoría' },
    { value: 'Diseño Web', label: 'Diseño Web' },
    { value: 'Marketing Digital', label: 'Marketing Digital' },
    { value: 'Desarrollo de Software', label: 'Desarrollo de Software' },
    { value: 'Gestión de Proyectos', label: 'Gestión de Proyectos' },
    { value: 'Traducción', label: 'Traducción' },
    { value: 'Contabilidad', label: 'Contabilidad' },
    { value: 'Asesoría Legal', label: 'Asesoría Legal' },
    { value: 'Recursos Humanos', label: 'Recursos Humanos' },

  ];

  const status = [
    { value: '', label: 'Seleccionar Estado', disabled: true },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
  ];

  const validate = (values) => {
    let errors = {};
    if (!values.inputs.parent.category) {
      errors[`inputs.parent.category`] = 'La categoría es requerida';
    }
    if (!values.inputs.parent.title) {
      errors['inputs.parent.title'] = 'El título es requerido';
    } else if (values.inputs.parent.title.length > 80) {
      errors['inputs.parent.title'] = 'El título no puede exceder los 80 caracteres';
    }
    if (!values.inputs.parent.description) {
      errors['inputs.parent.description'] = 'La descripción es requerida';
    }
    if (!values.inputs.parent.status) {
      errors['inputs.parent.status'] = 'El estatus es requerido';
    }
    if (!values.inputs.parent.image) {
      errors['inputs.parent.image'] = 'El campo image es requerido';
    }

    if (selectedFile) {
      if (selectedFile.size > 1048576) {
        errors['main_image'] = 'El archivo no debe exceder 1MB';
      } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile.name.split('.').pop().toLowerCase())) {
        errors['main_image'] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
      }
    }

    values.inputs.child.forEach((input, index) => {
      if (!input.title) {
        errors[`inputs.child.${index}.title`] = 'El título es requerido';
      } else if (!input.title.length > 80) {
        errors[`inputs.child.${index}.title`] = 'El título no puede exceder los 80 caracteres';
      }
      if (!input.description) {
        errors[`inputs.child.${index}.description`] = 'La descripción es requerida';
      }
      if (!input.image) {
        errors[`inputs.child.${index}.image`] = 'El campo image es requerido';
      }
      if (selectedFile2) {
        if (selectedFile2.size > 1048576) {
          errors[`inputs.child.${index}.image`] = 'El archivo no debe exceder 1MB';
        } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile.name.split('.').pop().toLowerCase())) {
          errors[`inputs.child.${index}.image`] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
        }
      }
      if (!input.price) {
        errors[`inputs.child.${index}.price`] = 'El campo del precio es requerido';
      }
    });

    console.log(errors);

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

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsLoadingForm(false);
    }
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={validate}
      >
        {({ values, errors, setFieldValue }) => (
          <Form className="mb-5 pb-5">
            <h3 className="text-lg text-center font-bold text-slate-800 font-oxanium mb-5">
              Objetivo: Llenar los campos del Servicio Padre y sus Variantes.
            </h3>
            {errors.inputs && (
              <div className="text-red-500 text-xs mt-1 text-center">
                {errors.inputs}
              </div>
            )}
            <SelectInput
              label={`Categoría Principal`}
              name={`inputs.parent.category`}
              options={category}
            />
            {errors[`inputs.parent.category`] && (
              <div className="text-red-500 text-xs mt-1">
                {errors[`inputs.parent.category`]}
              </div>
            )}
            <Input
              name='inputs.parent.title'
              label={`Título Principal`}
            />
            {errors['inputs.parent.title'] && (
              <div className="text-red-500 text-xs mt-1">
                {errors['inputs.parent.title']}
              </div>
            )}
            <SelectInput
              label={`Estado`}
              name={`inputs.parent.status`}
              options={status}
            />
            {errors[`inputs.parent.status`] && (
              <div className="text-red-500 text-xs mt-1">
                {errors[`inputs.parent.status`]}
              </div>
            )}
            <TextArea
              initialValue={values.inputs.parent.description}
              name='inputs.parent.description'
              label={`Descripción`}
              onEditorChange={(content) => setFieldValue('inputs.parent.description', content)}
            />
            {errors['inputs.parent.description'] && (
              <div className="text-red-500 text-xs mt-1">
                {errors['inputs.parent.description']}
              </div>
            )}
            {values.inputs.parent.image && (
              <p>
                Actual: <a href={values.inputs.parent.image}>{values.inputs.parent.image}</a>
              </p>
            )}
            <FileInput
              name='inputs.parent.image'
              helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
              onFileChange={handleFileChange}
            />
            {errors['inputs.parent.image'] && (
              <div className="text-red-500 text-xs mt-1">
                {errors['inputs.parent.image']}
              </div>
            )}
            <hr className='my-5' />
            <span className='mb-4'>Variantes del Servicio</span>
            <FieldArray name="inputs.child">
              {({ insert, remove, push }) => (
                <>
                  {values.inputs.child.map((input, index) => (

                    <div key={index}>
                      <Input
                        name={`inputs.child.${index}.title`}
                        label={`Título ${index + 1}`}
                      />
                      {errors[`inputs.child.${index}.title`] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[`inputs.child.${index}.title`]}
                        </div>
                      )}
                      <TextArea
                        initialValue={`inputs.child.${index}.description`}
                        name={`inputs.child.${index}.description`}
                        label={`Descripción ${index + 1}`}
                        onEditorChange={(content) => {
                          setFieldValue(`inputs.child.${index}.description`, content);
                        }}
                      />
                      {errors[`inputs.child.${index}.description`] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[`inputs.child.${index}.description`]}
                        </div>
                      )}
                      <FileInput
                        name={`inputs.child.${index}.image`}
                        helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                        onFileChange={handleFileChange2}
                      />
                      {errors[`inputs.child.${index}.image`] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[`inputs.child.${index}.image`]}
                        </div>
                      )}
                      <DecimalInput
                        name={`inputs.child.${index}.price`}
                        label={`Precio ${index + 1}`}
                      />
                      {errors[`inputs.child.${index}.price`] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[`inputs.child.${index}.price`]}
                        </div>
                      )}
                      <button type="button" onClick={() => {
                        push({
                          title: '',
                          description: '',
                          image: '',
                          price: '',
                          content_type: 'service_variant'
                        });
                      }} className="mt-2">
                        <span className="text-green-500">+</span> Añadir
                      </button>

                      {index > 0 && (
                        <button
                          type="button"
                          className="ml-2 float-right"
                          onClick={input.id ? () => removeObject(input.id, 'service_variant', values.inputs.parent.id, 'service') : () => remove(index)}
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
              isLoading={sendingForm}
              type={sendingForm || Object.keys(errors).length > 0 ? 'button' : 'submit'}
              className={`text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md px-6 font-medium font-oxanium rounded-none uppercase text-[11px] float-end ${Object.keys(errors).length > 0 ? "disabled" : ""
                }`}
              disabled={sendingForm || Object.keys(errors).length > 0}
              text="Guardar"
              color="#fff"
              size="md"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MyForm;