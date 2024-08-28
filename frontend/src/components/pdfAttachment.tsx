import React, { useState } from 'react';

interface PDFUploaderProps {
  onFileUpload: (file: File | null) => void;
}

const MAX_FILE_SIZE_MB = 5; 
const ALLOWED_FILE_TYPES = ['application/pdf'];

const PDFUploader: React.FC<PDFUploaderProps> = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError('Invalid file type. Please upload a PDF.');
        setFileName(null);
        onFileUpload(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`File size exceeds ${MAX_FILE_SIZE_MB} MB.`);
        setFileName(null);
        onFileUpload(null);
        return;
      }

      setFileName(file.name);
      setError(null);
      onFileUpload(file);
    }
  };

  return (
    <div className=''>
      <label className="block text-gray-700 mb-2">Attach PDF (optional)</label>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {fileName && <p className="mt-2 text-gray-600">Selected file: {fileName}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default PDFUploader;
