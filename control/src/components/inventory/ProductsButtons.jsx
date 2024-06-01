import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Modal from "@/components/ui/Modal";


function ProductsButtons() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div className="flex space-x-2 sm:justify-end items-center rtl:space-x-reverse">
      <Button
        className="text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs"
        onClick={openModal}
      >
        + Catálogo
      </Button>
      <Button
        className="text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs"
        onClick={openModal}
        
      >
        + Variante
      </Button>
      <Button
        className="text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs"
        onClick={openModal}
      >
        + Producto
      </Button>
      <Modal
          activeModal={showModal}
          onClose={closeModal}
          centered={true} // Set this to true for centered modal
          className="max-w-2xl" // Increase width for a larger modal
          title="Large Modal Title"
          themeClass="bg-indigo-900"
          scrollContent={true}
        >
          {/* Content of your modal */}
        
        </Modal>
    </div>
  )
}

export default ProductsButtons
