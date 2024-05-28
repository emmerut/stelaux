import styled from 'styled-components';
import SliderForm from '../business/Form/SliderFormV1';
import InfoCardV1 from '../business/Form/FormsetICFormV1';
import InfoCardV2 from '../business/Form/FormsetICFormV2';
import ExperienceForm from '../business/Form/ExperienceFormV1';
import PortFolioForm from '../business/Form/PortfolioFormV1';
import SimpleContentForm from '../business/Form/SimpleContentFormV1';
import formsetMCFormV1 from '../business/Form/FormsetMCFormV1';
import formsetStepsV1 from '../business/Form/FormsetContentFormV1';


const forms = {
  'sliderForm': SliderForm,
  'infoCardV1': InfoCardV1,
  'infoCardV2': InfoCardV2,
  'experienceForm': ExperienceForm,
  'portfolioForm': PortFolioForm,
  'simpleContentForm': SimpleContentForm,
  'formsetMCFormV1': formsetMCFormV1,
  'formsetStepsV1': formsetStepsV1
};

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '450px' : '0px'};
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
  height: 100%;
`;

const ScrollableContent = styled.div`
  overflow-y: auto;
  height: calc(100% - 60px); // Ajusta la altura restando el padding de SidebarContent

  /* Estilos para la barra de desplazamiento */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; 
  }

  &::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }
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

const RightSidebar = ({ isOpen, toggleSidebar, formID, activeFormKey, section }) => {
  const ActiveForm = forms[formID];
  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <CloseButton onClick={toggleSidebar}>×</CloseButton>
        <SidebarContent isOpen={isOpen}>
          {/* Aquí va el contenido del sidebar */}
          <h5 className='font-oxanium text-center font-bold text-shadow text-slate-100'>Stela Editor</h5> 
          <ScrollableContent>
            {/* Contenido del sidebar */}
            {ActiveForm && <ActiveForm key={activeFormKey} section={section} />}
          </ScrollableContent>
        </SidebarContent>
      </SidebarContainer>
    </>
  );
};

export default RightSidebar;