'use client'
import { Plus, Save, Upload, Trash, User, ReceiptText } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Modal from "@/components/ui/Modal"
import BillingTable from "@/pages/components/tables/TableData"
import Button from "@/components/ui/button"
import Textarea from "@/components/ui/Textarea"
import Icon from "@/components/ui/Icon";

import { Formik, Form, useFormikContext } from 'formik';
import { Input } from '@/components/form/Form';
import axios from 'axios';


export default function Component() {
  const [typeTable, setTypeTable] = useState(''); // o cualquier valor por defecto que desees
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [client, setClient] = useState(null)
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const formRef = useRef(null);

  const handleServiceChange = (index, property, value) => {
    const newServices = [...services];
    newServices[0][index][property] = value;
    setServices(newServices);
  };

  const handleServiceDelete = (index) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };

  const [selectedClient, setSelectedClient] = useState(null)

  // handleSelectClient = (client) => {
  //   setSelectedClient(client);
  //   // llamar a la función loadClient en el componente InvoiceConfigure
  //   window.parenthandleSelectClient(client);
  // };

  const handleClientChange = (field, value) => {
    setClient(prevClient => ({
      ...prevClient,
      [field]: value
    }))
  }
  const loadClient = (client) => {
    setClient(client);
    setShowModal(true);
  };
  const loadTable = (type) => {
    setTypeTable(type); // Asigna el valor de typeTable a 'clients'
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const calculateSubtotal = () => {
      const subtotalServices = services[0]?.reduce((acci, service) => acci + (service.price * service.qty), 0) || 0;
      const subtotalProducts = products[0]?.reduce((acci, product) => acci + (product.price * product.qty), 0) || 0;
      const subtotal = subtotalServices + subtotalProducts;
      setSubtotal(subtotal);
    };

    const calculateDiscount = () => {
      const discountServices = services[0]?.reduce((acci, service) => acci + service.discount, 0) || 0;
      const discountProducts = products[0]?.reduce((acci, product) => acci + product.discount, 0) || 0;
      const discount = discountServices + discountProducts;
      setDiscount(discount);
    };

    const calculateTax = () => {
      const tax = subtotal * 0.10;
      setTax(tax);
    };

    const calculateTotal = () => {
      const subtotalWithDiscount = subtotal - discount;
      const total = subtotalWithDiscount + tax;
      setTotal(total);
    };

    calculateSubtotal();
    calculateDiscount();
    calculateTax();
    calculateTotal();
  }, [services, products, subtotal, handleServiceDelete]);

  const initialValues = {
    name: '',
    fiscal_id: '',
    email: '',
    phone: '',
    address: ''
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Campo requerido';
    }
    if (!values.fiscal_id) {
      errors.fiscal_id = 'Campo requerido';
    }
    if (!values.email) {
      errors.email = 'Campo requerido';
    }
    if (!values.phone) {
      errors.phone = 'Campo requerido';
    }
    if (!values.address) {
      errors.address = 'Campo requerido';
    }
    return errors;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const data = {
        client: values,
        services: services?.[0],
        products: products?.[0],
        subtotal: subtotal?.toFixed(2),
        discount: discount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      };

      const response = await axios.post('tu-url-endpoint', data);
      if (response.status === 200) {
        console.log('Factura creada exitosamente');
        setSubmitting(false);
      } else {
        console.log('Error al crear la factura');
      }
      console.log(data)
    } catch (error) {
      console.log('Error al crear la factura:', error);
    }
  };


  const handleSendForm = () => {
    formRef.current.submitForm();
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Nueva Factura</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Datos Cliente:</h3>
              <div className="flex gap-2">
                <Button onClick={() => loadTable('products')} className="bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs"><User className="w-5 mr-2" /><span className="mt-1 md:mt-0">Cargar Cliente</span></Button>
              </div>
            </div>
            <div>
              <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={onSubmit}
                innerRef={formRef}
              >
                {({ isSubmitting, errors, submitForm }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Input
                          type='text'
                          name='name'
                          placeholder="Ingrese Nombre"
                          error={errors['name']}
                        />
                        {errors['name'] && (
                          <div className="text-red-500 text-xs mt-1">
                            {errors['name']}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          type='text'
                          name='fiscal_id'
                          placeholder="RIF o ID"
                          error={errors['fiscal_id']}
                        />
                        {errors['fiscal_id'] && (
                          <div className="text-red-500 text-xs mt-1">
                            {errors['fiscal_id']}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          type='text'
                          name='email'
                          placeholder="Correo Electrónico"
                          error={errors['email']}
                        />
                        {errors['email'] && (
                          <div className="text-red-500 text-xs mt-1">
                            {errors['email']}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          type='text'
                          name='phone'
                          placeholder="Número Teléfonico"
                          error={errors['phone']}
                        />
                        {errors['phone'] && (
                          <div className="text-red-500 text-xs mt-1">
                            {errors['phone']}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Input
                        type='text'
                        name='address'
                        error={errors['address']}
                        placeholder="Dirección Fiscal"
                      />
                      {errors['address'] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors['address']}
                        </div>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-end">

              <div className="flex gap-2">
                <Button onClick={() => loadTable('products')} className="bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs">
                  <Plus className="w-4 mr-2" />
                  <span className="mt-1 md:mt-0">Agregar Producto</span>
                </Button>
                <Button onClick={() => loadTable('services')} className="bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs">
                  <Plus className="w-4 mr-2" />
                  <span className="mt-1 md:mt-0">Agregar Servicio</span>
                </Button>
              </div>
            </div>

            {services && services.length > 0 ? (
              services.map((service, index) => (
                <div key={index} className="flex flex-wrap items-end mb-4">
                  <div className="md:w-1/3 flex flex-col">
                    <label className="text-gray-600 dark:text-slate-100 text-sm mb-1" htmlFor={`titulo-${index}`}>
                      Título
                    </label>
                    <input
                      id={`titulo-${index}`}
                      type="text"
                      value={service[index].title}
                      disabled
                      className="p-2 border border-gray-300 rounded mx-1 bg-gray-100 dark:bg-black-700"
                    />
                  </div>
                  <div className="md:w-1/6 flex flex-col">
                    <label className="text-gray-600 dark:text-slate-100 text-sm mb-1" htmlFor={`cantidad-${index}`}>
                      Cantidad
                    </label>
                    <input
                      id={`cantidad-${index}`}
                      type="number"
                      value={service[index].qty}
                      onChange={(e) => handleServiceChange(index, "qty", parseInt(e.target.value))}
                      className="p-2 border border-gray-300 rounded mx-1 dark:bg-black-800"
                    />
                  </div>
                  <div className="md:w-1/6 flex flex-col">
                    <label className="text-gray-600 dark:text-slate-100 text-sm mb-1" htmlFor={`descuento-${index}`}>
                      Descuento
                    </label>
                    <input
                      id={`descuento-${index}`}
                      type="number"
                      step="0.01"
                      value={service[index].discount.toFixed(2)}
                      onChange={(e) => {
                        const valor = e.target.value;
                        let newValue = valor;
                        if (!valor.includes('.')) {
                          newValue += '.00';
                        } else {
                          const partes = valor.split('.');
                          if (partes[1].length < 2) {
                            newValue += '0';
                          }
                        }
                        handleServiceChange(index, "discount", parseInt(newValue));
                      }}
                      className="p-2 border border-gray-300 rounded mx-1 dark:bg-black-800"
                    />
                  </div>
                  <div className="md:w-1/6 flex flex-col">
                    <label className="text-gray-600 dark:text-slate-100 text-sm mb-1" htmlFor={`precio-${index}`}>
                      Precio
                    </label>
                    <input
                      id={`precio-${index}`}
                      type="number"
                      disabled
                      value={service[index].price}
                      onChange={(e) => handleServiceChange(index, "price", parseInt(e.target.value))}
                      className="p-2 border border-gray-300 rounded mx-1 bg-gray-100 dark:bg-black-700"
                    />
                  </div>
                  <button
                    className="flex justify-center items-center w-8 h-8 bg-red-500 text-slate-100 rounded-md ml-2 hover:bg-slate-50 hover:text-red-500 hover:shadow-md transition duration-100 ease-in-out"
                    onClick={() => handleServiceDelete(index)}
                  >
                    <Icon icon={"heroicons-outline:trash"} />
                  </button>
                </div>
              ))
            ) : (
              <p></p>
            )}



            {products && products.length > 0 ? (
              products.map((product, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 items-end">

                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>

          <div className="flex justify-end">
            <div className="w-60">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuesto (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Descuento:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            {(services.length || products.length) ? (
              <Button
                onClick={handleSendForm}
                className="bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs"
              >
                <ReceiptText className="w-4 mr-2" />
                <span className="mt-1 md:mt-0">Procesar</span>
              </Button>
            ) : ""
            }
          </div>
        </div>
      </div>
      <Modal
        activeModal={showModal}
        onClose={closeModal}
        centered={true} // Set this to true for centered modal
        className="max-w-4xl modal-scroll" // Increase width for a larger modal
        title="Agregar items"
        themeClass="bg-indigo-900"
        scrollContent={true}
      >
        {/* Content of your modal */}
        {/* Condicionar tablas de servicios, productos o clientes */}
        {typeTable === 'services' && <BillingTable tableType="billing_services" service_data={services} service_state={setServices} loadModal={setShowModal} />}
        {typeTable === 'products' && <BillingTable tableType="billing_products" product_data={products} product_state={setProducts} loadModal={setShowModal} />}
        {typeTable === 'clients' && <BillingTable tableType="clients" client_data={client} clients_state={setClient} loadModal={setShowModal} />}
      </Modal>

    </>
  )
}