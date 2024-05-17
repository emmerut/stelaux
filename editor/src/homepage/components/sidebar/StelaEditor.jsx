import styled from 'styled-components';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '350px' : '0px'};
  background-color: rgba(240, 240, 240, 0.8); // Transparencia suave 
  box-shadow: -5px 0px 10px rgba(0, 0, 0, 0.2);
  transition: width 0.3s ease-in-out;
  overflow: hidden;
  z-index: 9999;
  backdrop-filter: blur(5px); // Efecto blur

  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '80%' : '0px'};
  }
`;

const SidebarContent = styled.div`
  padding: 20px;
  opacity: ${props => props.isOpen ? 1 : 0}; /* Accede a isOpen desde las props */
  transition: opacity ${props => props.isOpen ? '0.3s ease-in' : '0 ease-out'};  
  transition-delay: ${props => props.isOpen ? '0.3s' : '0s'}; 
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background-color: transparent;
  font-size: 20px;
  cursor: pointer;
`;

const RightSidebar = ({ isOpen, toggleSidebar }) => {
  
  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <CloseButton onClick={toggleSidebar}>×</CloseButton>
        <SidebarContent isOpen={isOpen}>
          {/* Aquí va el contenido del sidebar */}
          <h2>Título del Sidebar</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a lacus et risus laoreet fermentum. Donec ullamcorper, sapien in tincidunt consectetur, tortor sapien elementum lectus, in semper libero sapien ac dui.</p>
        </SidebarContent>
      </SidebarContainer>
    </>
  );
};

export default RightSidebar;