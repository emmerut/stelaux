import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Modal from "@/components/ui/Modal";
import ProductForm from "@/components/form/Inventory/ProductForm";
import VariantForm from "@/components/form/Inventory/VariantForm";
import CatalogForm from "@/components/form/Inventory/CatalogForm";

function ProductsButtons() {
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState(null); 

  const openModal = (formID) => {
    setShowModal(true);
    setActiveForm(formID);
  }; 

  const closeModal = () => {
    setShowModal(false);
    setActiveForm(null);
  };

  const renderForm = () => {
    switch(activeForm) {
      case 'catalogForm':
        return <CatalogForm />;
      case 'variantForm':
        return <VariantForm />;
      case 'productForm':
        return <ProductForm />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!showModal) {
      setActiveForm(null);
    }
  }, [showModal]);
  
  return (
    <div className="flex space-x-2 sm:justify-end items-center rtl:space-x-reverse">
      {/* ... your buttons ... */}
      <Button
        className="text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs"
        onClick={() => openModal('catalogForm')}
      >
        + Catálogo
      </Button>
      <Button
        className="text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs"
        onClick={() => openModal('variantForm')}
      >
        + Variante
      </Button>
      <Button
        className="text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs"
        onClick={() => openModal('productForm')}
      >
        + Producto
      </Button>
      <Modal
        activeModal={showModal}
        onClose={closeModal}
        centered={true} 
        className="max-w-4xl modal-scroll" 
        title="Agregar/Editar Productos"
        themeClass="bg-indigo-900"
        scrollContent={true}
      >
        {/* Render the form directly with the current state value */}
      {activeForm && renderForm()}
      </Modal>
    </div>
  );
}

export default ProductsButtons; 