import { useState } from "react";

// Función auxiliar para concatenar clases condicionalmente
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FileUpload = ({ onChange }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      if (onChange) onChange(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files && e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      if (onChange) onChange(droppedFile);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation(); // Evita que se active la carga del archivo
    setFile(null);
    if (onChange) onChange(null);
  };

  return (
    <div className="w-full space-y-2">
      <span className="text-sm font-medium">
        Comprobante de Pago (solo PDF)
      </span>
      <label
        htmlFor="pdfFile"
        className={cn(
          "relative block border-2 border-dashed rounded-lg cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-50" : "",
          file ? "border-solid border-blue-300" : "border-gray-300"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="pdfFile"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center w-full min-h-[120px] p-4">
          {!file ? (
            <p className="text-sm text-gray-600 text-center px-4">
              Haz clic o arrastra tu comprobante PDF aquí
            </p>
          ) : (
            <div className="relative w-full flex items-center justify-center">
              <span className="text-sm truncate">{file.name}</span>
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold"
              >
                X
              </button>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default FileUpload;
