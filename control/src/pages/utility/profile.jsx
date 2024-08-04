import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import BasicArea from "../chart/appex-chart/BasicArea";
import EditProfile from "@/pages/utility/settings";
import BusinessForm from "@/components/form/Profile/BusinessForm";
import ProfileForm from "@/components/form/Profile/ProfileForm";
import UseAuth from "@/components/auth/UseAuth"
import { SkeletionTitle, SkeletionAvatar, SkeletionGrid } from "@/components/skeleton/Skeleton";

// import images
import ProfileImage from "@/assets/images/avatar/default_user.jpg";

const profile = () => {
  const { userData } = UseAuth();

  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState(null);
  const [formPK, setFormPK] = useState(null);

  const handleEdit = (name) => {
    setFormName(name); 
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
      <div className="space-y-5 profile-page mb-6">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  {userData ? <img
                    src={userData.avatar ? userData.avatar : ProfileImage}
                    alt=""
                    className="block w-full h-full object-cover rounded-full"
                  /> : <SkeletionAvatar width="md:h-[186px] md:w-[186px] h-[140px] w-[140px]" />}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {userData ? userData.full_name : <SkeletionTitle className="w-28" />}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  Administrador
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={() => handleEdit('profileForm')}
              className="btn btn-outline-warning">
              {/* Add your button's text or icon here */}
              Completar Perfíl
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      EMAIL
                    </div>
                    <a
                      href="mailto:someone@example.com"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {userData ? userData.email : <SkeletionTitle className="w-28" />}
                    </a>
                  </div>
                  {userData && (
                    userData.email_verified ? (
                      true //  No need to render anything if the email exists
                    ) : (
                      <button className="px-4 py-2 btn btn-outline-warning">Verificar</button>
                    )
                  )}
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      TELÉFONO
                    </div>
                    <a
                      href="tel:0189749676767"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {userData ? userData.phone : <SkeletionTitle className="w-28" />}
                    </a>
                  </div>
                  {userData && userData.phone !== "Ingrese Información" && (
                    userData.phone_verified ? (
                      true //  No need to render anything if the email exists            
                    ) : (
                      <button className="px-4 py-2 btn btn-outline-warning">Verificar</button>
                    )
                  )}
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:map" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      DIRECCIÓN
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {userData ? userData.address : <SkeletionTitle className="w-28" />}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <Card title="Solicitudes API">
              <BasicArea height={190} />
            </Card>
          </div>
        </div>
      </div>
      {userData ? <EditProfile userID={userData.id} /> : <SkeletionGrid />}
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

export default profile;
