import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import { Formik, Form, FieldArray } from 'formik';
import getInitialValues from '@/components/form/DynamicForm/InitialValues';
import Modal from "@/components/ui/NotifyModal"
import TextArea from "@/components/ui/RichTextEditor"
// Asumiendo que tienes estos componentes definidos
import FixedBar from '@/components/ui/ProgressBar/FixedBarAlert';
import { getCookie } from '@/constant/sessions'


// Asumiendo que tienes estos componentes definidos
import {
  Input,
  SelectInput,
  DecimalInput,
  Checkbox,
  CheckboxInput,
  BirthDateField,
  CountrySelect,
  NumberInput,
  DatePicker,
  ColorPickerInput
} from './Fields';

import DropFile from '@/components/form/DynamicForm/DropFile';

import Buttons from '@/components/ui/Button';

const BaseFormset = forwardRef(({
  fetchDataFunction,
  validateFunction,
  formFields,
  onSubmitFunction,
  objID,
  refreshData,
  closeModal,
  apiUrl,
  formDataAppendFields,
  isLoadingForm,
  objetive,
  section,
  existingFiles,
  noButton,
  noTitle,
  onFormErrors,
}, ref) => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [sendingForm, setSendingForm] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [delObj, setdelObj] = useState(null);
  const [itemName, setItemName] = useState(null);

  const handleSubmit = async (values) => {
    setSendingForm(true);
    const formData = new FormData();

    // Agregar campos adicionales a formData
    if (formDataAppendFields) {
      Object.entries(formDataAppendFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    if (selectedFiles) {
      Object.entries(selectedFiles).forEach(([fieldName, file]) => {
        if (file) {
          formData.append(fieldName, file);
        }
      });
    }

    // Agregar campos dinámicos del formulario
    Object.entries(values).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          // Verificar si subValue es un array antes de usar forEach
          if (Array.isArray(subValue)) {
            subValue.forEach((item, index) => {
              Object.entries(item).forEach(([itemKey, itemValue]) => {
                formData.append(`${key}[${index}][${itemKey}]`, itemValue);
              });
            });
          } else {
            // Si subValue no es un array, simplemente agregarlo al formData
            formData.append(`${key}[${subKey}]`, subValue);
          }
        });
      } else {
        formData.append(key, value);
      }
    });

    // ... resto de la función handleSubmit


    if (section) {
      formData.append('formData[section]', section);
    }

    const formDataObject = {};
    for (const [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }

    console.log('Valores del formulario:', formDataObject);

    const token = getCookie('user_token')

    try {
      const response = await axios.post(apiUrl, formData, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        },
        headers: {
          'Authorization': `${token}`
        }
      });

      if (!response.status >= 200 && response.status < 300) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setSendingForm(false);
      if (typeof refreshData === 'function') {
        refreshData();
      }
      if (typeof closeModal === 'function') {
        closeModal();
      }
    }
  };

  const validateField = (field, value, selectedFiles, existingFiles, index) => {
    const { name, type, required, maxLength, minLength, min, max, label } = field;
    let error = null;
    if (required && !value) {
      error = `El campo ${label} es requerido`;
    } else if (value !== undefined) {
      switch (type) {
        case 'textarea':
          if (maxLength && value.length > maxLength) {
            error = `El campo ${name} no puede exceder los ${maxLength} caracteres`;
          } else if (minLength && value.length < minLength) {
            error = `El campo ${name} debe tener al menos ${minLength} caracteres`;
          }
          break;

        case 'file':
          const file_name = `formData[file][${name}]`
          const file_index = `formData[file][${index}][${name}]`
          if (existingFiles[file_name] || existingFiles[file_index]) {
            if (value) {
              // Validar el nuevo archivo seleccionado
              const fileSizeMB = value.size / 1024 / 1024; // Tamaño del archivo en MB
              const allowedExtensions = ['jpeg', 'jpg', 'webp', 'png'];
              const fileExtension = value.name.split('.').pop().toLowerCase();
              if (fileSizeMB > 1) {
                error = 'El archivo no debe exceder 1MB';
              } else if (!allowedExtensions.includes(fileExtension)) {
                error = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
              }
            }
          } else {
            if (!value) {
              error = `El campo ${label} es requerido`;
            } else {
              // Validar el nuevo archivo seleccionado
              const fileSizeMB = value.size / 1024 / 1024; // Tamaño del archivo en MB
              const allowedExtensions = ['jpeg', 'jpg', 'webp', 'png'];
              const fileExtension = value.name.split('.').pop().toLowerCase();
              if (fileSizeMB > 1) {
                error = 'El archivo no debe exceder 1MB';
              } else if (!allowedExtensions.includes(fileExtension)) {
                error = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
              }
            }
          }

          break;

        case 'number':
        case 'decimal':
          if (min !== undefined && value < min) {
            error = `El campo ${name} debe ser mayor o igual a ${min}`;
          } else if (max !== undefined && value > max) {
            error = `El campo ${name} debe ser menor o igual a ${max}`;
          }
          break;
      }
    }

    return error;
  };

  const validate = (values) => {
    let errors = {};

    const validateFieldArray = (fieldArrayValues, fields, fieldArrayName, index) => {
      if (fieldArrayValues) {
        fieldArrayValues.forEach((input, subIndex) => {
          fields.forEach((subField) => {
            const subFieldName = `${fieldArrayName}[${subIndex}].${subField.name}`;
            const subFieldValue = input[subField.name];
            const error = validateField(subField, subFieldValue, selectedFiles, existingFiles, index);
            if (error) {
              errors[subFieldName] = error;
            }
          });
        });
      }
    };

    formFields.forEach((field, index) => {

      if (field.type === 'fieldarray') {
        validateFieldArray(values.formData[field.name], field.fields, `formData.${field.name}`, index);
      } else {
        const fieldName = `formData.${field.name}`;
        const fieldValue = values.formData[field.name];
        const error = validateField(field, fieldValue, selectedFiles, existingFiles, index);
        if (error) {
          errors[fieldName] = error;
        }
      }
    });

    console.log('Errores:', errors);
    onFormErrors(errors);
    return errors;
  };

  const handleFilesChange = (file, fileName, setFieldValue, fieldName) => {
    setFieldValue(fieldName, file);
    setSelectedFiles(prevFiles => ({
      ...prevFiles,
      [fileName]: file,
    }));
  };

  const initialValues = {
    ...getInitialValues(formFields),
  };

  /* const deleteObj = (id, itemName) => {
    setIsOpen(true)
    setdelObj(id)
    setItemName(itemName)
  } */

  const textData = getInitialValues(formFields)

  console.log('Initial Values:', initialValues);

  return (
    <div>
      {isLoadingForm && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      {!isLoadingForm && (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmitFunction || handleSubmit}
          validate={validateFunction || validate}
          innerRef={ref}
        >
          {({ values, errors, setFieldValue }) => (
            <Form className="pb-2">
              <div className="form-content">
                {!noTitle && (
                  <h3 className="text-lg text-center font-bold font-oxanium my-5">
                    {objetive}
                  </h3>
                )}

                {/* Renderizar campos dinámicamente */}
                {formFields && formFields.map((field, index) => {
                  const { type, subtype, minDate, maxDate, placeholder, name, label, options, helpText, ...rest } = field;
                  const fieldName = `formData.${name}`;
                  const fileName = `formData[file][${name}]`;

                  switch (type) {
                    case 'select':
                      return (
                        <div key={index}> {/* Add a wrapping div here */}
                          <SelectInput
                            label={label}
                            name={fieldName}
                            options={options}
                            {...rest}
                          />
                          {errors[fieldName] && (
                            <div className="text-red-500 text-xs mt-0">
                              {errors[fieldName]}
                            </div>
                          )}
                        </div> // Close the wrapping div
                      );
                    case 'textarea':
                      return (
                        <>
                          <TextArea
                            key={index}
                            initialValue={textData.formData[name]}
                            name={fieldName}
                            label={label}
                            onEditorChange={(content) => setFieldValue(fieldName, content)}
                            {...rest}
                          />
                          {errors[fieldName] && (
                            <div className="text-red-500 text-xs mt-0">
                              {errors[fieldName]}
                            </div>
                          )}
                        </>
                      );
                    case 'decimal':
                      return (
                        <DecimalInput
                          key={index}
                          name={fieldName}
                          label={label}
                          {...rest}
                        />
                      );
                    case 'file':
                      return (
                        <DropFile
                          key={index}
                          name={fieldName}
                          label={label}
                          helpText={helpText}
                          onFileChange={(file) => handleFilesChange(file, fileName, setFieldValue, fieldName)}
                          existingFile={existingFiles && existingFiles[fileName]}
                          error={errors[fieldName]} // Pasa el error al componente DropFile
                        />
                      );
                    case 'checkbox':
                      return (
                        <Checkbox
                          key={index}
                          name={fieldName}
                          label={label}
                          {...rest}
                        />
                      );
                    case 'checkboxinput':
                      return (
                        <CheckboxInput
                          key={index}
                          name={fieldName}
                          label={label}
                          {...rest}
                        />
                      );
                    case 'birthdate':
                      return (
                        <BirthDateField
                          key={index}
                          {...rest}
                        />
                      );
                    case 'countryselect':
                      return (
                        <CountrySelect
                          key={index}
                          fetchRegions={rest.fetchRegions} // Pasar la función fetchRegions si es necesario 
                          {...rest}
                        />
                      );
                    case 'number':
                      return (
                        <NumberInput
                          key={index}
                          name={fieldName}
                          label={label}
                          {...rest}
                        />
                      );
                    case 'colorpicker':
                      return (
                        <>
                          <ColorPickerInput
                            key={index}
                            label={label}
                            name={fieldName}
                            value="#000"
                            {...rest}
                          />
                          {errors[fieldName] && (
                            <div className="text-red-500 text-xs mt-0">
                              {errors[fieldName]}
                            </div>
                          )}
                        </>
                      );
                    case 'date':
                      switch (subtype) {
                        case 'range':
                          return (
                            <DateRangePicker
                              key={index}
                              name={fieldName}
                              label={label}
                              placeholder={placeholder}
                              options={{
                                minDate: minDate || "2024-01-01",
                                maxDate: maxDate || new Date(),
                              }}
                            />
                          );
                        case 'datetime':
                          return (
                            <DateTimePicker
                              key={index}
                              name={fieldName}
                              label={label}
                              placeholder={placeholder}
                              options={{
                                minDate: minDate || "2024-01-01",
                                maxDate: maxDate || new Date(),
                              }}
                            />
                          );
                        default:
                          return (
                            <DatePicker
                              key={index}
                              name={fieldName}
                              label={label}
                              placeholder={placeholder}
                              options={{
                                minDate: minDate || "2024-01-01",
                                maxDate: maxDate || new Date(),
                              }}
                            />
                          );
                      }
                    case 'fieldarray':
                      return (
                        <FieldArray name={`formData.${name}`}>
                          {({ insert, remove, push }) => (
                            <div className='my-6'>
                              <span>Formsets</span>
                              {values.formData[name].map((input, subIndex) => (
                                <div key={subIndex}>
                                  {field.fields.map((subField, subFieldIndex) => {
                                    // Nombre de campo correcto para subcampos
                                    const subFieldName = `formData.${name}[${subIndex}].${subField.name}`;
                                    const subFileName = `formData[file][${subIndex}][${subField.name}]`;
                                    switch (subField.type) {
                                      case 'select':
                                        return (
                                          <div key={subFieldIndex}>
                                            <SelectInput
                                              label={subField.label}
                                              name={subFieldName}
                                              options={subField.options}
                                              {...subField.rest}
                                            />
                                            {errors[subFieldName] && (
                                              <div className="text-red-500 text-xs mt-1">
                                                {errors[subFieldName]}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      case 'colorpicker':
                                        return (
                                          <>
                                            <ColorPickerInput
                                              key={subFieldIndex}
                                              label={subField.label}
                                              name={subFieldName}
                                              {...rest}
                                            />
                                            {errors[subFieldName] && (
                                              <div className="text-red-500 text-xs mt-1">
                                                {errors[subFieldName]}
                                              </div>
                                            )}
                                          </>
                                        );
                                      case 'date':
                                        switch (subtype) {
                                          case 'range':
                                            return (
                                              <DatePicker
                                                key={subFieldIndex}
                                                name={subFieldName}
                                                label={subField.label}
                                                placeholder={placeholder}
                                                options={{
                                                  minDate: minDate || "2024-01-01",
                                                  maxDate: maxDate || new Date(),
                                                }}
                                              />
                                            );
                                          case 'datetime':
                                            return (
                                              <DatePicker
                                                key={subFieldIndex}
                                                name={subFieldName}
                                                label={subField.label}
                                                placeholder={placeholder}
                                                options={{
                                                  minDate: minDate || "2024-01-01",
                                                  maxDate: maxDate || new Date(),
                                                }}
                                              />
                                            );
                                          default:
                                            return (
                                              <DatePicker
                                                key={subFieldIndex}
                                                name={subFieldName}
                                                label={subField.label}
                                                placeholder={placeholder}
                                                options={{
                                                  minDate: minDate || "2024-01-01",
                                                  maxDate: maxDate || new Date(),
                                                }}
                                              />
                                            );
                                        }
                                      case 'decimal':
                                        return (
                                          <div key={subFieldIndex}>
                                            <DecimalInput
                                              label={subField.label}
                                              name={subFieldName}
                                              {...subField.rest}
                                            />
                                            {errors[subFieldName] && (
                                              <div className="text-red-500 text-xs mt-1">
                                                {errors[subFieldName]}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      case 'textarea':
                                        return (
                                          <div key={subFieldIndex}>
                                            <TextArea
                                              initialValue={textData?.formData.items[subIndex]?.[subField.name] ?? ''}
                                              label={subField.label}
                                              name={subFieldName}
                                              onEditorChange={(content) => setFieldValue(subFieldName, content)}
                                              {...subField.rest}
                                            />
                                            {errors[subFieldName] && (
                                              <div className="text-red-500 text-xs mt-1">
                                                {errors[subFieldName]}
                                              </div>
                                            )}
                                          </div>

                                        );
                                      case 'file':
                                        return (
                                          <DropFile
                                            key={subFieldIndex} // Asegúrate de que DropFile tenga una key única
                                            label={subField.label}
                                            name={subFieldName}
                                            helpText={subField.helpText}
                                            onFileChange={(file) => handleFilesChange(file, subFileName, setFieldValue, subFieldName)}
                                            existingFile={existingFiles && existingFiles[subFileName]}
                                            error={errors[subFieldName]} // Pasa el error al componente DropFile
                                          />
                                        );
                                      case 'checkbox':
                                        return (
                                          <div key={subFieldIndex}>
                                            <Checkbox
                                              label={subField.label}
                                              name={subFieldName}
                                              {...subField.rest}
                                            />
                                            {errors[subFieldName] && (
                                              <div className="text-red-500 text-xs mt-1">
                                                {errors[subFieldName]}
                                              </div>
                                            )}
                                          </div>

                                        );
                                      case 'checkboxinput':
                                        return (
                                          <div key={subFieldIndex}>
                                            <CheckboxInput
                                              label={subField.label}
                                              name={subFieldName}
                                              {...subField.rest}
                                            />
                                            {errors[subFieldName] && (
                                              <div className="text-red-500 text-xs mt-1">
                                                {errors[subFieldName]}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      case 'birthdate':
                                        return (
                                          <div key={subFieldIndex}>
                                            <BirthDateField
                                              {...subField.rest}
                                            />
                                            {errors[subFieldName] && (
                                              <div className="text-red-500 text-xs mt-1">
                                                {errors[subFieldName]}
                                              </div>
                                            )}
                                          </div>

                                        );
                                      case 'countryselect':
                                        return (
                                          <div key={subFieldIndex}>
                                            <CountrySelect
                                              fetchRegions={subField.rest.fetchRegions}
                                              {...subField.rest}
                                            />
                                            {errors[subFieldName] && (
                                              <div className="text-red-500 text-xs mt-1">
                                                {errors[subFieldName]}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      case 'number':
                                        return (
                                          <div key={subFieldIndex}>
                                            <NumberInput
                                              label={subField.label}
                                              name={subFieldName}
                                              {...subField.rest}
                                            />
                                            {errors[subFieldName] && (
                                              <div className="text-red-500 text-xs mt-1">
                                                {errors[subFieldName]}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      case 'text':
                                        return (
                                          <div key={subFieldIndex}>
                                            <Input
                                              type={subField.type}
                                              name={subFieldName}
                                              label={subField.label}
                                              {...subField.rest}
                                              error={errors[subFieldName]}
                                            />
                                            {errors[subFieldName] && (
                                              <div className="text-red-500 text-xs mt-1">
                                                {errors[subFieldName]}
                                              </div>
                                            )}
                                          </div>
                                        );
                                    }
                                  })}
                                  <div className="flex justify-between">
                                    {/* Botones para agregar y eliminar elementos del fieldarray */}
                                    <button type="button" onClick={() => {
                                      // Crear un nuevo objeto vacío con la estructura de field.fields
                                      const cloneItem = {};
                                      field.fields.forEach(subField => {
                                        cloneItem[subField.name] = ''; // O el valor por defecto que necesites
                                      });

                                      if (field.limit) {
                                        if (values.formData[name].length >= field.limit) {
                                          return;
                                        } else {
                                          push(cloneItem);
                                        }
                                      } else {
                                        push(cloneItem);
                                      }
                                    }}>
                                      + Añadir más campos
                                    </button>

                                    {subIndex > 0 && (
                                      <button type="button" onClick={() => (input.id ? deleteObj(input.id, input.title) : remove(subIndex))}>
                                        - Eliminar
                                      </button>
                                    )}
                                  </div>

                                </div>
                              ))}

                            </div>
                          )}
                        </FieldArray>
                      );
                    default: // input text por defecto
                      return (
                        <>
                          <Input
                            type={type}
                            key={index}
                            name={fieldName}
                            label={label}
                            error={errors[fieldName]}
                            {...rest}
                          />
                          {errors[fieldName] && (
                            <div className="text-red-500 text-xs mt-1">
                              {errors[fieldName]}
                            </div>
                          )}
                        </>

                      );
                  }
                })}
                {
                  !noButton && (
                    <>
                      <hr className='my-5' />
                      <FixedBar sendingForm={sendingForm} progress={progress} />
                      <Buttons
                        ariaLabel="botón del formulario"
                        isLoading={sendingForm}
                        type={sendingForm ? 'button' : 'submit'}
                        className={`text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md px-6 font-medium font-oxanium rounded-none uppercase text-[11px] float-end ${Object.keys(errors).length > 0 ? "disabled" : ""
                          }`}
                        disabled={sendingForm}
                        text="Guardar"
                        color="#fff"
                        size="md"
                      />
                    </>
                  )
                }

              </div>
            </Form>
          )}
        </Formik>
      )}
      {/* <Modal
        isOpen={isOpen}
        itemName={itemName}
        object_id={objID}
        setIsOpen={setIsOpen}
      /> */}
    </div>
  );
});

export default BaseFormset;