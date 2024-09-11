import React, { useState, useEffect, useRef, forwardRef } from 'react';
import BaseForm from '@/components/form/DynamicForm/DynamicForm';
import { apiCreateContent } from "@/constant/apiUrl"

const PortalForm = forwardRef(({ onFormErrors }, ref) => {
  const [formFields, setFormFields] = useState([
    { 
      type: 'hidden', 
      name: 'id', 
    },
    {
      type: 'select',
      name: 'options',
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
      name: 'content',
      label: 'Concepto del sitio',
      required: true,
    },
  ]);
  
  return (
    <div>
      <BaseForm 
        formFields={formFields} 
        objetive="composición el sitio"
        section="PortalData"
        noTitle={true}
        noButton={true}
        onFormErrors={onFormErrors}
        ref={ref}
        apiUrl={apiCreateContent}
      />
    </div>
  );
});

export default PortalForm;