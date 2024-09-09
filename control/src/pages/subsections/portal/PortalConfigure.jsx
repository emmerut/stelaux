import React, { useState } from 'react';
import Step from '@/components/ui/Steps';
import Button from "@/components/ui/Button";
import Domains from "@/pages/subsections/portal/Domains"

const PortalConfigurePage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, name: 'Paso 1' },
    { id: 2, name: 'Paso 2' },
    { id: 3, name: 'Paso 3' },
    { id: 4, name: 'Paso 4' },
    { id: 5, name: 'Paso 5' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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
            <p>¡Genial! Ahora establece la identidad que le dará forma.</p>
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
          <Button
            text="Desplegar" // Texto "Finalizar"
            className='text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md'
            // Puedes agregar una acción al hacer clic en "Finalizar"
            onClick={() => console.log('¡Proceso finalizado!')} 
          />
        ) : (
          <Button
            text="Siguiente"
            className='text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md'
            disabled={currentStep === steps.length - 1}
            onClick={handleNext}
          />
        )}
      </div>
    </div>
  );
};

export default PortalConfigurePage;
