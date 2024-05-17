import React from 'react';
import styled from 'styled-components';
import { PiMagicWandFill } from "react-icons/pi";

const ButtonContainer = styled.div`
  position: relative;
`;

const StyledButton = styled.button`
  position: absolute;
  top: 20vh;
  right: 10vw;
  z-index: 2;
  border: none;
  background-color: #2f1875; 
  padding: 15px; 
  border-radius: 50%; 
  cursor: pointer;
  transition: all 0.3s ease; 
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); // Agrega una sombra de caja

  svg { 
    color: white; 
    font-size: 1.5em; 
  }
  &:hover {
    background-color: white; // Cambia el fondo a blanco al pasar el mouse
    svg {
      color: #2f1875; // Cambia el color del ícono a rojo al pasar el mouse
    }
`;

const FloatingButton = ({ onClick }) => {
  return (
    <ButtonContainer>
      <StyledButton onClick={onClick}>
        <PiMagicWandFill size={24} /> {/* Usa el ícono aquí */}
      </StyledButton>
    </ButtonContainer>
  );
};

export default FloatingButton;