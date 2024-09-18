"use client";
import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const MachineReadableFormats = {
  XML: 'application/xml',
  JSON: 'application/json',
  YAML: 'application/x-yaml',
  CSV: 'text/csv',
  RDF: 'application/rdf+xml',
  Epub: 'application/epub+zip',
  PlainText: 'text/plain',
  TOML: 'application/toml',
  INI: 'text/plain',
  HTML: 'text/html',
  Markdown: 'text/markdown',
  TSV: 'text/tab-separated-values',
  Parquet: 'application/vnd.apache.parquet',
  Avro: 'application/avro',
  Protobuf: 'application/x-protobuf',
  MessagePack: 'application/x-msgpack',
  BSON: 'application/bson'

};

const NonMachineReadableFileFormats = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLS: 'application/vnd.ms-excel',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  PPT: 'application/vnd.ms-powerpoint',
  ODT: 'application/vnd.oasis.opendocument.text',
  ODS: 'application/vnd.oasis.opendocument.spreadsheet',
  ODP: 'application/vnd.oasis.opendocument.presentation',
  ODG: 'application/vnd.oasis.opendocument.graphics',
  ODF: 'application/vnd.oasis.opendocument.formula',
  ODC: 'application/vnd.oasis.opendocument.chart',
  ODI: 'application/vnd.oasis.opendocument.image',
  ODM: 'application/vnd.oasis.opendocument.text-master',
  IMG: 'image/*',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
  BMP: 'image/bmp',
  TIFF: 'image/tiff',
  SVG: 'image/svg+xml',
  WEBP: 'image/webp'
};

const getFileCategory = (mimeType) => {
  if (Object.values(MachineReadableFormats).includes(mimeType)) return 'Machine Readable';
  if (Object.values(NonMachineReadableFileFormats).includes(mimeType)) return 'Non-Machine Readable';
  return 'Unknown';
};

export default function EnhancedFileUpload() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
  };

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
    <div className="flex flex-col items-center justify-center  min-h-screen  p-4">
      <div className="w-full max-w-md p-6 bg-gray-900   rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">File Analyzer</h1>
        
        {!file && (
          <label className="flex flex-col items-center px-4 py-6 bg-blue-50 text-gray-900 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-100 transition duration-300">
            <Upload className="w-8 h-8" />
            <span className="mt-2 text-base text-gray-900 leading-normal">Select a file</span>
            <input type='file' className="hidden" onChange={handleFileUpload} />
          </label>
        )}

        {file && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <FileText className="w-8 h-8  text-white" />
              <span className="font-semibold text-lg text-white flex-grow ml-2">{file.name}</span>
              <button onClick={resetUpload} className="p-1 rounded-full  hover:bg-gray-400 transition duration-300">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <Progress value={uploadProgress} className="w-full bg-gray-600 " />
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Size:</span> {(file.size / 1024).toFixed(2)} KB
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Type:</span> {file.type || 'Unknown'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Category:</span> {getFileCategory(file.type)}
              </p>
            </div>

            <Alert className={getFileCategory(file.type) === 'Machine Readable' ? "bg-green-100" : "bg-yellow-100"}>
              {getFileCategory(file.type) === 'Machine Readable' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <AlertTitle>{getFileCategory(file.type)}</AlertTitle>
              <AlertDescription>
                {getFileCategory(file.type) === 'Machine Readable' 
                  ? "This file is machine-readable and can be easily processed."
                  : "This file may require additional processing to extract structured data."}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}