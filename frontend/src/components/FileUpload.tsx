import React from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploadProps {
  onUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Button
      variant="contained"
      component="label"
      startIcon={<CloudUploadIcon />}
    >
      Upload File
      <input
        type="file"
        hidden
        onChange={handleFileChange}
        accept="image/*,.pdf"
      />
    </Button>
  );
};

export default FileUpload;
