import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableBox = () => {
  // Utilizar el hook useDrag para hacer el componente arrastrable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box', // Definir un tipo para identificar qué se está arrastrando. Esto se usa en los objetivos de soltado.
    collect: monitor => ({
      isDragging: !!monitor.isDragging(), // Recolectar el estado de arrastre para aplicar estilos u otras funciones.
    }),
  }));

  // Estilos cuando está siendo arrastrado
  const opacity = isDragging ? 0.4 : 1;

  return (
    <div
      ref={drag} // Ref conectar el elemento DOM con el manejador de arrastre de react-dnd
      style={{
        width: '200px',
        height: '200px',
        backgroundColor: 'skyblue',
        opacity,
        cursor: 'move', // Cambiar el cursor para indicar que este elemento se puede mover
      }}>
      Drag me
    </div>
  );
};

export default DraggableBox;