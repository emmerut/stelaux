import React, { memo } from 'react';
import { useFormikContext } from 'formik';
import { useField } from 'formik';
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const Input = memo(({ label, labelClass, className, helpText, showErrorMsg, ...props }) => {
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
      {helpText && <span className="text-gray-500 text-sm mt-1">{helpText}</span>}
      {meta.touched && meta.error && showErrorMsg && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {meta.error}
        </p>
      )}
    </div>
  );
});

const TextArea = memo(({ label, labelClass, className, onEditorChange, showErrorMsg, ...props }) => {
  const editorRef = useRef(null);
  const { setFieldValue } = useFormikContext(); 

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
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 ${labelClass}`}>
        {label}
      </label>
      <Editor
        apiKey='jilhl78tlomd3250tf5ncjjywse6ibcq3uu862mlml03ve6w'
        onInit={(_evt, editor) => editorRef.current = editor}
        init={{
          height: 300,
          menubar: false,
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

const Checkbox = memo(({ label, labelClass, className, children, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <label className={`inline-flex items-center ${labelClass ? ` ${labelClass}` : ""}`}>
      <input
        type="checkbox"
        className={`form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${className}${meta.touched && meta.error ? " border-red-500" : ""
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

const FileInput = memo(({ label, labelClass, className, showErrorMsg, helpText, onFileChange, ...props }) => {
  const [field, meta] = useField(props);
  const handleChange = (event) => {
    field.onChange(event);
    const file = event.target.files[0];
    onFileChange(file);
  };
  return (
    <div className={`relative ${labelClass ? ` ${labelClass}` : ""}`}>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="file"
        className={`my-3 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none 
        file:bg-gray-50 file:border-0
        file:me-4
        file:py-3 file:px-4
          ${className}${meta.touched && meta.error ? " border-red-500" : ""
          }`}
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

const SelectInput = memo(({ label, labelClass, className, showErrorMsg, options, ...props }) => {
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

const NestedSelectInput = memo(({ label, labelClass, className, showErrorMsg, handler, value, options, ...props }) => {
  const [field, meta] = useField(props); // Obtener el campo y el metadato de Formik
  return (
    <div className={`relative ${meta.touched && meta.error ? "error" : ""}`}>
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 ${labelClass}`}>
        {label}
      </label>
      <select
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
        ${meta.touched && meta.error ? "border-red-500" : ""} ${className}`}
        {...field} // Spread field properties
        {...props} // Spread props
        value={value} // Set the selected value
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

const NumberInput = memo(({ label, labelClass, className, helpText, showErrorMsg, ...props }) => {
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
      <label htmlFor={props.id || props.name} className={`block text-sm font-medium text-gray-700 ${labelClass}`}>
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

DecimalInput.defaultProps = {
  showErrorMsg: true,
};

FileInput.defaultProps = {
  showErrorMsg: true,
};

export { Input, TextArea, Checkbox, FileInput, SelectInput, NumberInput, DecimalInput, NestedSelectInput }; 