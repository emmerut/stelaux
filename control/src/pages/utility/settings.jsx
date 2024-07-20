import React, {useState} from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import BusinessForm from "@/components/form/Profile/BusinessForm";
import ProfileForm from "@/components/form/Profile/ProfileForm";
import Modal from "@/components/ui/Modal";

const settings = ({userID}) => {
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState(null);
  const [formPK, setFormPK] = useState(userID);

  const handleEdit = (name) => {
    setFormName(name); // Set the ID when editing
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const forms = {
    'profileForm': ProfileForm,
    'businessForm': BusinessForm,
  };

  const ActiveForm = forms[formName];


  return (
    <div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 items-center rtl:space-x-reverse">
              <div className="flex-none h-8 w-8 rounded-full bg-slate-800 dark:bg-slate-700 text-slate-300 flex flex-col items-center justify-center text-lg">
                <Icon icon="heroicons:building-office-2" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                Configuración de Negocio
              </div>
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-sm">
              Configura tu perfil de empresa, agrega tu logotipo y más.
            </div>
             <div
              onClick={() => handleEdit('businessForm')} // Assuming you have IDs for each card
              className="inline-flex cursor-pointer items-center space-x-3 rtl:space-x-reverse text-sm capitalize font-medium text-slate-600 dark:text-slate-300"
            >
              <span>Modificar</span> <Icon icon="heroicons:arrow-right" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 items-center rtl:space-x-reverse">
              <div className="flex-none h-8 w-8 rounded-full bg-primary-500 text-slate-300 flex flex-col items-center justify-center text-lg">
                <Icon icon="heroicons:credit-card" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                Configuración de Pagos
              </div>
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-sm">
              Vincula tu metodo de pago.
            </div>
            <Link
              to="/payments"
              className="inline-flex items-center space-x-3 rtl:space-x-reverse text-sm capitalize font-medium text-slate-600 dark:text-slate-300"
            >
              <span>Modificar</span> <Icon icon="heroicons:arrow-right" />
            </Link>
          </div>
        </Card>
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 rtl:space-x-reverse items-center">
              <div className="flex-none h-8 w-8 rounded-full bg-success-500 text-white flex flex-col items-center justify-center text-lg">
                <Icon icon="heroicons:users" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                Configuración de Perfíl
              </div>
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-sm">
              Configura tu perfil, añade tu foto de perfil y más.
            </div>
            <div
              onClick={() => handleEdit('profileForm')} // Assuming you have IDs for each card
              className="inline-flex cursor-pointer items-center space-x-3 rtl:space-x-reverse text-sm capitalize font-medium text-slate-600 dark:text-slate-300"
            >
              <span>Modificar</span> <Icon icon="heroicons:arrow-right" />
            </div>
          </div>
        </Card>
      </div>
      <Modal
        activeModal={showModal}
        onClose={closeModal}
        centered={true}
        className="max-w-4xl modal-scroll"
        title="Control de datos"
        themeClass="bg-indigo-900"
        scrollContent={true}
      >
        {ActiveForm && <ActiveForm objID={formPK} closeModal={closeModal} />}
      </Modal>
    </div>
    
  );
};

export default settings;
