import React, { useState, useEffect } from 'react';

const UploadStatusIndicator = ({ sendingForm, progress }) => {
  const [statusMessage, setStatusMessage] = useState("Cargando, Por favor espere...");
  const [barColor, setBarColor] = useState("blue-500"); // Inicialmente azul
 
  useEffect(() => {
    if (progress === 100) {
      setStatusMessage("Cargado Exitosamente");
      setBarColor("green-500"); // Cambia a verde para éxito
    }
  }, [progress]);

  return (
    <>
      {sendingForm ? (
        <div className="fixed top-1 right-1 px-6 z-50 bg-white rounded-md shadow-md p-2 w-[300px]">
          <p className="text-sm font-bold">{statusMessage}</p>
          <div className="w-full h-2 bg-gray-200 rounded-md overflow-hidden">
            <div
              className={`h-2 bg-${barColor} rounded-md`} // Usa la clase de color dinámica
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default UploadStatusIndicator;