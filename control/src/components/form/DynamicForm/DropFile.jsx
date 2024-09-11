// DropFile.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

export default function DropFile({ name, label, helpText, onFileChange, error, existingFile }) {
  const [files, setFiles] = useState(existingFile ? [existingFile] : []);

  const onDrop = useCallback((acceptedFiles) => {
    // Reemplaza cualquier archivo existente con el nuevo
    setFiles(acceptedFiles);
    onFileChange(acceptedFiles[0], name);
  }, [onFileChange, name]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = () => {
    setFiles([]);
    onFileChange(null, name);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md my-4">
      <div
        {...getRootProps()}
        className={`p-6 mt-4 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
          }`}
      >
        <input {...getInputProps()} name={name} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          {label}
        </p>
        <small className='text-xs text-gray-500'>
          {helpText}
        </small>
      </div>
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <div className="flex items-center">
                <File className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm truncate">
                  {file.name ?
                    file.name
                    :
                    <img
                      src={file}
                      alt="Archivo"
                      className="h-50 w-50 mx-auto" // Ajusta el tamaño de la imagen según sea necesario
                    />}
                </span>
              </div>
              <button
                onClick={() => removeFile(file)}
                className="text-red-500 hover:text-red-700"
                aria-label={`Eliminar archivo ${file.name ? file.name : file}`}
              >
                <X className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Mostrar el mensaje de error si existe */}
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}
