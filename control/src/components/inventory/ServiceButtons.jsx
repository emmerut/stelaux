import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Modal from "@/components/ui/Modal";
import ServiceForm from '@/components/form/Inventory/Creation/ServiceForm'

function ServiceButtons({refreshData}) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
        <Button className="text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md px-6 smc:px-4 smc:py-2 smc:text-xs" onClick={openModal}>+ Servicio</Button>
        <Modal
          activeModal={showModal}
          onClose={closeModal}
          centered={true} // Set this to true for centered modal
          className="max-w-4xl modal-scroll" // Increase width for a larger modal
          title="Agregar/Editar Servicios"
          themeClass="bg-indigo-900"
          scrollContent={true}
        >
          {/* Content of your modal */}
          <ServiceForm />
        </Modal>
      </div>
    </div>
  )
}

export default ServiceButtons
