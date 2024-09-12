import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Step from '@/components/ui/Steps';
import Button from "@/components/ui/Button";
import Domains from "@/pages/subsections/portal/Domains"
import PortalForm from "@/pages/subsections/portal/PortalForm"
import { getPortal } from '@/constant/apiData';
import Loading from "@/components/Loading";



const PortalConfigurePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formErrors, setFormErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Inicializa isLoading como true
  const [draft, setDraft] = useState(false); // Inicializa draft como false


  const { portalid } = useParams()

  if (portalid) {
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await getPortal(portalid);
          if (data) {
            const response = data[0]; // Obtén el primer elemento del arreglo   
            setCurrentStep(response.current_step); 
            setDraft(true)  
          }
        } catch (error) {
          console.error('Error al obtener los requisitos del portal:', error);
          // Puedes agregar aquí el código para manejar el error y mostrar un mensaje al usuario
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, []);
  }

  const handleFormErrors = (errors) => {
    setFormErrors(errors);
  };

  const portalFormRef = useRef(null);

  const steps = [
    { id: 1, name: 'Paso 1' },
    { id: 2, name: 'Paso 2' },
    { id: 3, name: 'Paso 3' },
    { id: 4, name: 'Paso 4' },
    { id: 5, name: 'Paso 5' },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      const dynamicForm = portalFormRef.current;
      dynamicForm.submitForm();
      console.log(dynamicForm.values.formData.id)
      // Verificar si hay errores DESPUÉS de enviar el formulario
      if (dynamicForm.dirty || dynamicForm.values.formData.id) {
        if (dynamicForm.isValid) {
          setCurrentStep(currentStep + 1);
        }
      }
    } else {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Función para renderizar contenido condicional
  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Domains />
          </>
        );
      case 1:
        return (
          <>
            <p className='mt-7 mb-0 mx-4'>¡Genial! Ahora establece la identidad que le dará forma.</p>
            <div className="p-5">
              <PortalForm
                onFormErrors={handleFormErrors}
                ref={portalFormRef}
                draft={draft}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <p>¡Perfecto! Hemos recopilado las plantillas optimizadas según tu criterio, selecciona la de tu preferencia...</p>
          </>
        );
      case 3:
        return (
          <>
            <p>¡Ya casi terminas! Revisa con detalle el importe del costo del despliege</p>
          </>
        );
      case 4:
        return (
          <>
            <p>!Felicidades! Estamos listos para desplegar tu sitio web. Vive la nueva experiencia de negocios digitales, todo está en tus manos.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <Step steps={steps} currentStep={currentStep} />

          {renderContent()}

          <div className="flex justify-between mt-10">
            <Button
              text="Prev"
              className='text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md'
              disabled={currentStep === 0}
              onClick={handlePrev}
            />
            {/* Botón condicional */}
            {currentStep === steps.length - 1 ? (
              // Último paso: Mostrar botón "Desplegar"
              <Button
                text="Desplegar"
                className='text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md'
                onClick={() => console.log('¡Proceso finalizado!')}
              />
            ) : (
              // Otros pasos: Mostrar botón "Siguiente" normal
              <Button
                text="Siguiente"
                className='text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md'
                disabled={currentStep === steps.length - 1}
                onClick={handleNext}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

};

export default PortalConfigurePage;
