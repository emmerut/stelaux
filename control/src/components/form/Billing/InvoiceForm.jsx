import React, { useState, useEffect, useRef, forwardRef } from 'react';
import BaseForm from '@/components/form/DynamicForm/DynamicForm';
import { apiCreateReqPortal } from "@/constant/apiUrl"
import { productData, serviceData } from '@/constant/apiData';

const InvoiceForm = forwardRef(({ onFormErrors, draft }, ref) => {
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [formFields, setFormFields] = useState([
        {
            type: 'hidden',
            name: 'id',
        },
        {
            type: 'text',
            name: 'fiscal_id',
            label: 'Fiscal ID',
        },
        {
            type: 'text',
            name: 'customer_name',
            label: 'Nombre del Cliente',
        },
        {
            type: 'text',
            name: 'address_line',
            label: 'Dirección',
        },
        // {
        //     type: 'email',
        //     name: 'customer_name',
        //     label: 'Nombre del Cliente',
        // },
        // {
        //     type: 'phone',
        //     name: 'project_voice',
        //     label: 'Concepto del sitio',
        //     required: true,
        // },
        {
            type: 'fieldarray',
            name: 'items_serv',
            label: "Items de la factura", // Etiqueta para el FieldArray
            fields: [
                {
                    type: 'hidden',
                    name: 'id',
                },
                {
                    type: 'select',
                    name: 'services',
                    label: 'Servicios',
                    options: [
                        { value: '', label: '-----', disabled: true },
                    ],
                    required: true,
                },
            ],
        },
        {
            type: 'fieldarray',
            name: 'items_prod',
            label: "Items de la factura", // Etiqueta para el FieldArray
            fields: [
                {
                    type: 'hidden',
                    name: 'id',
                },
                {
                    type: 'select',
                    name: 'products',
                    label: 'Productos',
                    options: [
                        { value: '', label: '-----', disabled: true },
                    ],
                    required: true,
                },
            ],
        },
        {
            type: 'textarea',
            name: 'report',
            label: 'Observaciones',
        },
    ]);

    useEffect(() => {
        const fetchData = async () => {
          setIsLoadingForm(true);
          try {
            const servicesData = await serviceData();
            const productsData = await productData();
      
            if (servicesData && servicesData.variants) {
              const res = servicesData.variants;
              setFormFields((prevFormFields) =>
                prevFormFields.map((field) =>
                  field.type === 'fieldarray'
                    ? { ...field, fields: field.fields.map((subField) =>
                        subField.name === 'services'
                          ? { ...subField, options: res.map((option) => ({ value: option.id, label: option.label })) }
                          : subField
                      ) }
                    : field
                )
              );
            } else {
              console.log('No se obtuvieron datos de servicios');
            }
      
            if (productsData && productsData.variants) {
              const res = productsData.variants;
              setFormFields((prevFormFields) =>
                prevFormFields.map((field) =>
                  field.type === 'fieldarray'
                    ? { ...field, fields: field.fields.map((subField) =>
                        subField.name === 'products'
                          ? { ...subField, options: res.map((option) => ({ value: option.id, label: option.label })) }
                          : subField
                      ) }
                    : field
                )
              );
            } else {
              console.log('No se obtuvieron datos de productos');
            }
          } catch (error) {
            console.error('error al obtener datos:', error);
          } finally {
            setIsLoadingForm(false);
          }
        };
        fetchData();
      }, []);

    return (
        <>
            <BaseForm
                formFields={formFields}
                objetive="Carga los datos de facturación."
                section="InvoiceData"
                onFormErrors={onFormErrors}
                ref={ref}
                apiUrl={apiCreateReqPortal}
                isLoadingForm={isLoadingForm}
            />
        </>
    );
});

export default InvoiceForm;