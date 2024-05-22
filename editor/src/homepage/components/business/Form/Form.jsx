import React, { memo } from 'react';
import { useField } from 'formik';

const Input = memo(({ label, labelClass, className, showErrorMsg, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className={`relative ${meta.touched && meta.error ? "error" : ""}`}>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 ${labelClass}`}>
        {label}
      </label>
      <input 
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

const TextArea = memo(({ label, labelClass, className, showErrorMsg, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className={`relative ${meta.touched && meta.error ? "error" : ""}`}>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 ${labelClass}`}>
        {label}
      </label>
      <textarea 
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm 
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

const Checkbox = memo(({ label, labelClass, className, children, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <label className={`inline-flex items-center ${labelClass ? ` ${labelClass}` : ""}`}>
        <input
          type="checkbox"
          className={`form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${className}${
            meta.touched && meta.error ? " border-red-500" : ""
          }`}
          {...field}
          {...props}
        />
        <span className="ml-2 text-sm text-gray-600">
          {children}
        </span>
      </label>
    );
});
  
const FileInput = memo(({ label, labelClass, className, showErrorMsg, helpText, ...props }) => {
  const [field, meta] = useField(props);
  const handleChange = (event) => {
    field.onChange(event);
    // You can add additional logic here to handle the selected file
  };
  return (
    <div className={`relative ${labelClass ? ` ${labelClass}` : ""}`}>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="file"
        className={`block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none 
        file:bg-gray-50 file:border-0
        file:me-4
        file:py-3 file:px-4
          ${className}${
          meta.touched && meta.error ? " border-red-500" : ""
        }`}
        {...field}
        {...props}
        onChange={handleChange}
      />
      {helpText && <span className="text-gray-500 text-sm mt-1">{helpText}</span>}
      {meta.touched && meta.error && showErrorMsg && (
        <span className="text-red-500 text-sm block mt-1">{meta.error}</span>
      )}
    </div>
  );
});

const Select = memo(({ label, labelClass, className, showErrorMsg, options, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className={`relative ${meta.touched && meta.error ? "error" : ""}`}>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 ${labelClass}`}>
        {label}
      </label>
      <select 
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                  ${meta.touched && meta.error ? "border-red-500" : ""} ${className}`} 
        {...field} 
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
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

const NumberInput = memo(({ label, labelClass, className, showErrorMsg, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className={`relative ${meta.touched && meta.error ? "error" : ""}`}>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 ${labelClass}`}>
        {label}
      </label>
      <input
        type="number" 
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

FileInput.defaultProps = {
  showErrorMsg: true,
};

export { Input, TextArea, Checkbox, FileInput, Select, NumberInput }; 