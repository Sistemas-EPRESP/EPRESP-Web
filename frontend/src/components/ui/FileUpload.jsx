import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ onChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onChange(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"], "image/*": [] },
      multiple: false,
    });

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [selectedFile]);

  const baseClasses =
    "border-2 border-dashed p-6 text-center cursor-pointer rounded-md transition-colors";
  const borderClasses = isDragActive
    ? "border-green-500"
    : isDragReject
    ? "border-red-500"
    : "border-gray-300";

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Subir Archivo Comprobante de Pago (PDF)
      </h2>
      <div {...getRootProps({ className: `${baseClasses} ${borderClasses}` })}>
        <input {...getInputProps()} />
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="flex justify-between items-center w-full">
              <span className="truncate">{selectedFile.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  onChange(null);
                }}
                className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Quitar
              </button>
            </div>
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="mt-2 max-h-64 object-contain"
              />
            )}
          </div>
        ) : (
          <p className="text-gray-600">
            Arrastra y suelta un archivo PDF o haz clic para seleccionarlo.
          </p>
        )}
      </div>
    </>
  );
};

export default FileUpload;
