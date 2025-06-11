import React from 'react';
import { parseExcelFile } from '../utils/parseExcel';

const FileUploader = ({ onDataParsed }) => {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const parsedData = await parseExcelFile(file);
      onDataParsed(parsedData);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="excel-upload" className="form-label">
        Upload Excel File
      </label>
      <input
        type="file"
        accept=".xlsx, .xls"
        className="form-control"
        id="excel-upload"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default FileUploader;
