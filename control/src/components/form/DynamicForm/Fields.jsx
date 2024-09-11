import React, { memo, useState, useEffect } from 'react';
import { useFormikContext, Field, ErrorMessage } from 'formik';
import { useField } from 'formik';
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Icon from '@/components/ui/Icon';
import CheckImage from "@/assets/images/icon/ck-white.svg";
import { fetchCountries } from "@/constant/data"
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import { Spanish } from 'flatpickr/dist/l10n/es'

const currentYear = new Date().getFullYear();
const startYear = 1950;
const adultYear = currentYear - 18;

const InputLogin = memo(({ type, label, placeholder = "Add placeholder", classLabel = "form-label", className = "", classGroup = "", readOnly, error, icon, disabled, id, horizontal, validate, isMask, msgTooltip, description, hasIcon, options, onFocus, defaultValue, ...props }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  const [field, meta] = useField(props);

  return (
    <div className={`formGroup ${meta.touched && meta.error ? "has-error" : ""} ${horizontal ? "flex" : ""} ${meta.touched && validate ? "is-valid" : ""} ${classGroup}`}>
      {label && (
        <label htmlFor={id} className={`block capitalize ${classLabel} ${horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""}`}>
          {label}
        </label>
      )}
      <div className={`relative ${horizontal ? "flex-1" : ""}`}>
        {!isMask ? (
          <input
            type={type === "password" && open ? "text" : type}
            className={`form-control py-2 ${className} ${meta.touched && meta.error ? "has-error" : ""}`}
            {...field}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            defaultValue={defaultValue}
            id={id}
          />
        ) : (
          <Cleave
            className={`form-control py-2 ${className} ${meta.touched && meta.error ? "has-error" : ""}`}
            {...field}
            placeholder={placeholder}
            options={options}
            readOnly={readOnly}
            disabled={disabled}
            defaultValue={defaultValue}
            id={id}
            onFocus={onFocus}
          />
        )}
        <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
          {hasIcon && (
            <span className="cursor-pointer text-secondary-500" onClick={handleOpen}>
              {open && type === "password" ? (
                <Icon icon="heroicons-outline:eye" />
              ) : (
                <Icon icon="heroicons-outline:eye-off" />
              )}
            </span>
          )}
          {meta.touched && meta.error && (
            <span className="text-danger-500">
              <Icon icon="heroicons-outline:information-circle" />
            </span>
          )}
          {meta.touched && validate && (
            <span className="text-success-500">
              <Icon icon="bi:check-lg" />
            </span>
          )}
        </div>
      </div>
      {meta.touched && meta.error && (
        <div className={`mt-2 ${msgTooltip ? "inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded" : "text-danger-500 block text-sm"}`}>
          {meta.error}
        </div>
      )}
      {meta.touched && validate && (
        <div className={`mt-2 ${msgTooltip ? "inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded" : "text-success-500 block text-sm"}`}>
          {validate}
        </div>
      )}
      {description && <span className="input-description">{description}</span>}
    </div>
  );
});

const BirthDateField = memo(() => {
  const { setFieldValue, values } = useFormikContext();

  const handleDateChange = (field, value) => {
    setFieldValue(field, value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="day" className="block text-slate-500 dark:text-slate-400 text-sm font-bold mb-2">
        Fecha de nacimiento
      </label>
      <div className="flex space-x-2">
        <Field
          as="select"
          id="day"
          name="day"
          className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => handleDateChange('day', e.target.value)}
          value={values.day}
        >
          <option value="" disabled label="Día" />
          {[...Array(31).keys()].map((day) => (
            <option key={day + 1} value={day + 1}>
              {day + 1}
            </option>
          ))}
        </Field>
        <Field
          as="select"
          id="month"
          name="month"
          className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => handleDateChange('month', e.target.value)}
          value={values.month}
        >
          <option value="" disabled label="Mes" />
          {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </Field>
        <Field
          as="select"
          id="year"
          name="year"
          className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => handleDateChange('year', e.target.value)}
          value={values.year}
        >
          <option value="" disabled label="Año" />
          {[...Array(adultYear - startYear + 1).keys()].map((year) => (
            <option key={year + startYear} value={year + startYear}>
              {year + startYear}
            </option>
          ))}
        </Field>
      </div>
      <ErrorMessage name="day" component="div" className="text-red-500 text-sm mt-1" />
      <ErrorMessage name="month" component="div" className="text-red-500 text-sm mt-1" />
      <ErrorMessage name="year" component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );
});

const Input = memo(({ label, labelClass, className, helpText, showErrorMsg, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className={`relative ${meta.touched && meta.error ? "error" : ""}`}>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 dark:text-slate-300 ${labelClass}`}>
        {label}
      </label>
      <input
        className={`bg-gray-50 border-width text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                   ${meta.touched && props.error ? "border-red-500" : ""} ${className}`}
        {...field}
        {...props}
      />
      {helpText && <span className="text-gray-500 text-sm mt-1">{helpText}</span>}
      {meta.touched && meta.error && showErrorMsg && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {showErrorMsg}
        </p>
      )}
    </div>
  );
});

const TextArea = memo(({ label, labelClass, className, onEditorChange, showErrorMsg, ...props }) => {
  const editorRef = useRef(null);
  const { setFieldValue, values } = useFormikContext();

  const handleEditorChange = (content) => {
    // Update the Formik field value
    setFieldValue(props.name, content);
    if (onEditorChange) {
      // Call the original onEditorChange if it exists
      onEditorChange(content);

    }
  };

  return (
    <div className='my-6'>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 dark:text-slate-300 ${labelClass}`}>
        {label}
      </label>
      <Editor
        apiKey='jilhl78tlomd3250tf5ncjjywse6ibcq3uu862mlml03ve6w'
        htmlFor={props.id || props.name}
        onInit={(_evt, editor) => editorRef.current = editor}
        initialValue={props.initialValue} // Ensure initialValue is a string
        init={{
          height: 300,
          menubar: false,
          directionality: 'ltr', // for left-to-right text direction
          plugins: [
            'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
            'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
            'media', 'table', 'emoticons', 'help'
          ],
          toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent |' +
            'bullist numlist | table',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
});

const Checkbox = memo(({ label, labelClass, className, ...props }) => {
  const [field, meta] = useField(props);

  const handleChange = (e) => {
    field.onChange(e);
    console.log(`${props.name}: ${e.target.checked}`);
  };

  return (
    <label className={`inline-flex items-center ${labelClass ? ` ${labelClass}` : ""}`}>
      <input
        type="checkbox"
        className={`form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${className}${meta.touched && meta.error ? " border-red-500" : ""}`}
        {...field}
        {...props}
        onChange={handleChange}
      />
      <span className="ml-2 mb-4 text-sm leading-tight text-gray-600">
        {label}
      </span>
    </label>
  );
});

const CheckboxInput = memo(({ label, classLabel = "form-label", className = "", activeClass = "ring-black-500 bg-slate-900 dark:bg-slate-700 dark:ring-slate-700", ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });

  const handleChange = (e) => {
    field.onChange(e);
    console.log(`${props.name}: ${e.target.checked}`);
  };

  return (
    <label
      className={`flex items-center ${meta.error && meta.touched ? " has-error" : ""} ${props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
      htmlFor={props.id || props.name}
    >
      <input
        type="checkbox"
        className="hidden"
        {...field}
        {...props}
        onChange={handleChange}
      />
      <span
        className={`h-4 w-4 border flex-none border-slate-100 dark:border-slate-800 rounded inline-flex ltr:mr-3 rtl:ml-3 relative transition-all duration-150 ${field.checked ? activeClass + " ring-2 ring-offset-2 dark:ring-offset-slate-800" : "bg-slate-100 dark:bg-slate-600 dark:border-slate-600"}`}
      >
        {field.checked && (
          <img
            src={CheckImage}
            alt=""
            className="h-[10px] w-[10px] block m-auto"
          />
        )}
      </span>
      <span className="text-slate-500 dark:text-slate-400 text-sm leading-6 capitalize">
        {label}
      </span>
    </label>
  );
});

const FileInput = ({ name, className, helpText, onFileChange, existingFile, ...props }) => {
  const [file, setFile] = useState(null);
  const [meta] = useField(props);
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    onFileChange(selectedFile, name);
  };

  return (
    <div>
      <input
        type="file"
        className={`mt-3 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none 
        file:bg-gray-50 file:border-0
        file:me-4
        file:py-3 file:px-4
          ${className}${meta.touched && meta.error ? " border-red-500" : ""
          }`}
        {...props}
        onChange={handleFileChange}
      />
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      {existingFile && !file && (
        <p className="text-sm text-gray-500">Archivo actual: {existingFile}</p>
      )}
      {file && (
        <p className="text-sm text-gray-500">Archivo seleccionado: {file.name}</p>
      )}
    </div>
  );
};

const SelectInput = memo(({ label, labelClass, className, showErrorMsg, options, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className={`relative ${meta.touched && meta.error ? "error" : ""}`}>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 dark:text-slate-300 ${labelClass}`}>
        {label}
      </label>
      <select
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
        ${meta.touched && meta.error ? "border-red-500" : ""} ${className}`}
        {...field}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} disabled={option.disabled} style={{ color: option.disabled ? 'graytext' : 'inherit' }}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error && showErrorMsg && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {showErrorMsg}
        </p>
      )}
    </div>
  );
});

const NestedSelectInput = memo(({ label, labelClass, className, showErrorMsg, handler, value, options, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className={`relative ${meta.touched && meta.error ? "error" : ""}`}>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 dark:text-slate-300 ${labelClass}`}>
        {label}
      </label>
      <select
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
        ${meta.touched && meta.error ? "border-red-500" : ""} ${className}`}
        {...field}
        {...props}
        value={value}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} disabled={option.disabled} style={{ color: option.disabled ? 'graytext' : 'inherit' }}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error && showErrorMsg && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {meta.error}
        </p>
      )}
    </div>
  );
});

const CountrySelect = ({ fetchRegions }) => {
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetchCountries({});
        setCountriesData(res);
      } catch (error) {
        console.error('Error al obtener los países:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const { setFieldValue } = useFormikContext();

  return loading ? (
    <div>Cargando países...</div>
  ) : (
    <NestedSelectInput
      name="country"
      label="País"
      options={[...countriesData.map(geo => ({ value: geo.name, label: geo.name }))]}
      onChange={e => {
        const selectedCountryCode = e.target.value;
        setFieldValue('country', selectedCountryCode);
        fetchRegions(selectedCountryCode);
      }}
    />
  );
};

const NumberInput = memo(({ label, labelClass, className, helpText, showErrorMsg, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className={`relative ${meta.touched && meta.error ? "error" : ""}`}>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 dark:text-slate-300 ${labelClass}`}>
        {label}
      </label>
      <input
        type="number"
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
          ${meta.touched && meta.error ? "border-red-500" : ""} ${className}`}
        {...field}
        {...props}
      />
      {helpText && <span className="text-gray-500 text-sm mt-1">{helpText}</span>}
      {meta.touched && meta.error && showErrorMsg && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {meta.error}
        </p>
      )}
    </div>
  );
});

const DecimalInput = memo(({ label, labelClass, className, showErrorMsg, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className={`relative ${meta.touched && meta.error ? "error" : ""}`}>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 dark:text-slate-300 ${labelClass}`}>
        {label}
      </label>
      <input
        type="number"
        step="0.01" // Set the step to 0.01 for decimal input
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                   ${meta.touched && meta.error ? "border-red-500" : ""} ${className}`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error && showErrorMsg && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {meta.error}
        </p>
      )}
    </div>
  );
});

const DatePicker = memo(({ label, labelClass, name, placeholder = "Seleccionar fecha", className = "", options = {}, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const fpRef = useRef(null);

  useEffect(() => {
    return () => {
      if (fpRef.current && fpRef.current.flatpickr) {
        fpRef.current.flatpickr.destroy();
      }
    };
  }, []);

  const defaultOptions = {
    locale: Spanish,
    dateFormat: 'd/m/Y',
    allowInput: true,
    ...options,
  };

  const handleChange = (selectedDates, dateStr, instance) => {
    setFieldValue(name, selectedDates[0]);
    setFieldTouched(name, true);
  };

  return (
    <div className={`formGroup ${meta.touched && meta.error ? "has-error" : ""}`}>
      <div className="relative">
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 dark:text-slate-300 ${labelClass}`}>
        {label}
      </label>
        <Flatpickr
          ref={fpRef}
          className={`form-control py-2 ${className} ${meta.touched && meta.error ? "border-red-500" : ""}`}
          placeholder={placeholder}
          options={defaultOptions}
          onChange={handleChange}
          onClose={() => setFieldTouched(name, true)}
          value={field.value}
          {...props}
        />
        {meta.touched && meta.error && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Icon icon="heroicons-outline:exclamation-circle" className="text-red-500" />
          </div>
        )}
      </div>
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">
          {meta.error}
        </div>
      )}
    </div>
  );
});

DecimalInput.defaultProps = {
  showErrorMsg: true,
};

FileInput.defaultProps = {
  showErrorMsg: true,
};

export {
  Input, TextArea, Checkbox, FileInput, SelectInput,
  NumberInput, DecimalInput, NestedSelectInput, InputLogin,
  CheckboxInput, BirthDateField, CountrySelect, DatePicker
}; 