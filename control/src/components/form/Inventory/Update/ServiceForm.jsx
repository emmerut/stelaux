import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';

// Asumiendo que tienes estos componentes definidos
import { Input, FileInput, TextArea, SelectInput } from '@/components/form/Form';
import { serviceData } from "@/constant/inventoryData";
import Buttons from '@/components/ui/Button';

const MyForm = ({ objID, refreshData }) => {
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sendingForm, setSendingForm] = useState(false);
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingForm(true);
        const serviceDataResponse = await serviceData();
        const filteredServices = serviceDataResponse.services.filter(service => service.id === objID);
        setFormData(filteredServices[0]);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoadingForm(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setSendingForm(true);
    const formData = new FormData();

    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    formData.append('parent_id', values.formData.id);
    formData.append(`category`, values.formData.subcategory_name);
    formData.append(`title`, values.formData.title);
    formData.append(`status`, values.formData.status);
    formData.append(`description`, values.formData.description);
    formData.append('parent_type', 'service')

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

  const initialValues = { formData };

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
    if (!values.formData.subcategory_name) {
      errors[`formData.subcategory_name`] = 'La categoría es requerida';
    }
    if (!values.formData.title) {
      errors['formData.title'] = 'El título es requerido';
    } else if (values.formData.title.length > 80) {
      errors['formData.title'] = 'El título no puede exceder los 80 caracteres';
    }
    if (!values.formData.description) {
      errors['formData.description'] = 'La descripción es requerida';
    }
    if (!values.formData.status) {
      errors['formData.status'] = 'El estatus es requerido';
    }
    if (!values.formData.image) {
      errors['formData.image'] = 'El campo image es requerido';
    }

    if (selectedFile) {
      if (selectedFile.size > 1048576) {
        errors['formData.image'] = 'El archivo no debe exceder 1MB';
      } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile.name.split('.').pop().toLowerCase())) {
        errors['formData.image'] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
      }
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
          {({ values, errors, setFieldValue }) => (

            <Form className="mb-5 pb-5">
              <h3 className="text-lg text-center font-bold text-slate-800 font-oxanium mb-5">
                Objetivo: Llenar los campos del Servicio.
              </h3>
              <SelectInput
                label={`Categoría Principal`}
                name={`formData.subcategory_name`}
                options={category}
              />
              {errors[`formData.subcategory_name`] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors[`formData.subcategory_name`]}
                </div>
              )}
              <Input
                name='formData.title'
                label={`Título Principal`}
              />
              {errors['formData.title'] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors['service.title']}
                </div>
              )}
              <SelectInput
                label={`Estado`}
                name={`formData.status`}
                options={status}
              />
              {errors[`formData.status`] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors[`formData.status`]}
                </div>
              )}
              <TextArea
                name='formData.description'
                label={`Descripción`}
                onEditorChange={(content) => setFieldValue('formData.description', content)}
              />
              {errors['formData.description'] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors['formData.description']}
                </div>
              )}
              {values.formData.image && (
                <p>
                  Actual: <a href={values.formData.image} target='_blank'>{values.formData.image}</a>
                </p>
              )}
              <FileInput
                name='formData.image'
                helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                onFileChange={handleFileChange}
              />
              {errors['formData.image'] && (
                <div className="text-red-500 text-xs mt-1">
                  {errors['formData.image']}
                </div>
              )}
              <hr className='my-5' />

              <Buttons
                ariaLabel="botón del formulario"
                type={sendingForm || Object.keys(errors).length > 0 ? 'button' : 'submit'}
                isLoading={sendingForm} 
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
      )}

    </div>
  );
};

export default MyForm;