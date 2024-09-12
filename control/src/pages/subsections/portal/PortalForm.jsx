import React, { useState, useEffect, useRef, forwardRef } from 'react';
import BaseForm from '@/components/form/DynamicForm/DynamicForm';
import { apiCreateReqPortal } from "@/constant/apiUrl"
import { getPortalRequirement } from '@/constant/apiData';



const PortalForm = forwardRef(({ onFormErrors, draft }, ref) => {
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [existingFiles, setExistingFiles] = useState({});
  const [formFields, setFormFields] = useState([
    {
      type: 'hidden',
      name: 'id',
    },
    {
      type: 'select',
      name: 'project_type',
      label: 'Objetivo del Proyecto',
      options: [
        { value: '', label: 'Seleccione un Opción', disabled: true },
        { value: 'interno', label: 'Enlace Interno' },
        { value: 'externo', label: 'Enlace Externo' },
      ],
      required: true,
    },
    {
      type: 'file',
      name: 'image',
      label: 'Dale click o arrastra la imagen del logo del sitio.',
      helpText: '1920x1080 (jpeg, jpg, webp, png) y no debe exceder el 1MB.',
    },
    {
      type: 'textarea',
      name: 'project_voice',
      label: 'Concepto del sitio',
      required: true,
    },
    {
      type: 'colorpicker',
      name: 'primary_color',
      label: 'Color Primario',
      required: true,
    },
    {
      type: 'colorpicker',
      name: 'alternate_color',
      label: 'Color Segundario',
      required: true,
    },
  ]);

  if (draft) {
    useEffect(() => {
      const fetchData = async () => {
        setIsLoadingForm(true);
        try {
          const data = await getPortalRequirement();
          if (data) {
            const response = data[0]; // Obtén el primer elemento del arreglo
  
            const updatedFormFields = formFields.map((field) => {
              switch (field.name) {
                case 'project_type':
                  return {
                    ...field,
                    defaultValue: response[field.name],
                    options: [
                      { value: '', label: 'Seleccione un Opción', disabled: true },
                      { value: 'interno', label: 'Enlace Interno' },
                      { value: 'externo', label: 'Enlace Externo' },
                    ],
                  };
                case 'id':
                  return {
                    ...field,
                    defaultValue: response[field.name],
                  };
                case 'project_voice':
                  return {
                    ...field,
                    defaultValue: response[field.name],
                  };
                case 'primary_color':
                  return {
                    ...field,
                    defaultValue: response[field.name],
                  };
                case 'alternate_color':
                  return {
                    ...field,
                    defaultValue: response[field.name],
                  };
                default:
                  return field;
              }
            });
  
            const files = {};
            if (response.file_image) {
              files[`formData[file][image]`] = response.file_image;
            } else if (response.file_doc) {
              files[`formData[file][doc]`] = response.file_doc;
            }
            setExistingFiles(files);
            setFormFields(updatedFormFields);
          }
        } catch (error) {
          console.error('Error al obtener los requisitos del portal:', error);
          // Puedes agregar aquí el código para manejar el error y mostrar un mensaje al usuario
        } finally {
          setIsLoadingForm(false);
        }
      };
      fetchData();
    }, []);
  } 

  return (
    <div>
      <BaseForm
        formFields={formFields}
        existingFiles={existingFiles}
        objetive="composición el sitio"
        section="PortalData"
        noTitle={true}
        noButton={true}
        onFormErrors={onFormErrors}
        ref={ref}
        apiUrl={apiCreateReqPortal}
        isLoadingForm={isLoadingForm}
      />
    </div>
  );
});

export default PortalForm;