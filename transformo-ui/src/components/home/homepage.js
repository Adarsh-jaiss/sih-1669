import React, { useState, useRef } from "react";
import AttractiveNote from "./note";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Copy,
  Download,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";

const FileCategories = {
  MACHINE_READABLE: "Machine Readable",
  NON_MACHINE_READABLE: "Non-Machine Readable",
  UNKNOWN: "Unknown",
};

const MachineReadableFormats = {
  XML: "application/xml",
  JSON: "application/json",
  YAML: "application/x-yaml",
  CSV: "text/csv",
  RDF: "application/rdf+xml",
  Epub: "application/epub+zip",
  PlainText: "text/plain",
  TOML: "application/toml",
  INI: "text/plain",
  HTML: "text/html",
  Markdown: "text/markdown",
  TSV: "text/tab-separated-values",
  Parquet: "application/vnd.apache.parquet",
  Avro: "application/avro",
  Protobuf: "application/x-protobuf",
  MessagePack: "application/x-msgpack",
  BSON: "application/bson",
};

const NonMachineReadableFileFormats = {
  PDF: "application/pdf",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  DOC: "application/msword",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  XLS: "application/vnd.ms-excel",
  PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  PPT: "application/vnd.ms-powerpoint",
  ODT: "application/vnd.oasis.opendocument.text",
  ODS: "application/vnd.oasis.opendocument.spreadsheet",
  ODP: "application/vnd.oasis.opendocument.presentation",
  ODG: "application/vnd.oasis.opendocument.graphics",
  ODF: "application/vnd.oasis.opendocument.formula",
  ODC: "application/vnd.oasis.opendocument.chart",
  ODI: "application/vnd.oasis.opendocument.image",
  ODM: "application/vnd.oasis.opendocument.text-master",
  IMG: "image/*",
  JPEG: "image/jpeg",
  PNG: "image/png",
  GIF: "image/gif",
  BMP: "image/bmp",
  TIFF: "image/tiff",
  SVG: "image/svg+xml",
  WEBP: "image/webp",
};

const getFileCategory = (mimeType) => {
  if (Object.values(MachineReadableFormats).includes(mimeType)) {
    return FileCategories.MACHINE_READABLE;
  } else if (Object.values(NonMachineReadableFileFormats).includes(mimeType)) {
    return FileCategories.NON_MACHINE_READABLE;
  }
  return FileCategories.UNKNOWN;
};

export default function FileAnalyzer() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedText, setParsedText] = useState("");
  const [isParsingComplete, setIsParsingComplete] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);
      uploadFile(uploadedFile);
    }
  };

  const firebaseConfig = {
    apiKey: "AIzaSyAK6g5soLJxYVBb8av_OPrxGe_MENul0zI",
    authDomain: "test-e09cc.firebaseapp.com",
    projectId: "test-e09cc",
    storageBucket: "test-e09cc.appspot.com",
    messagingSenderId: "878440702363",
    appId: "1:878440702363:web:6815da3fa5ba0bdcf4c13e",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const uploadFile = async (fileToUpload) => {
    const storageRef = ref(storage, `uploads/${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress indicator
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error);
        setError(`Upload failed: ${error.message}`);
      },
      () => {
        // Get the download URL when the upload completes
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          sendUrlToAPI(downloadURL);
        });
      }
    );
  };

  const sendUrlToAPI = async (fileUrl) => {
    try {
      console.log("Sending URL to API:", fileUrl);
      const response = await fetch("https://sih-backend-wv2s.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: fileUrl }),
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        console.log("Response body:", await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
      setParsedText(result.res || "No text returned from API");
      setIsParsingComplete(true);
    } catch (error) {
      console.error("Error sending URL to API:", error);
      setError(`Error sending URL to API: ${error.message}`);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setParsedText("");
    setIsParsingComplete(false);
    setIsCopied(false);
    setError(null);
  };

  const downloadParsedText = () => {
    const element = document.createElement("a");
    const file = new Blob([parsedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "parsed_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand("copy");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
     
      <div className="w-full max-w-xl p-6 bg-gray-900   rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-9 mt-3 text-white text-center">File Analyzer and converter
        </h1>
        <AttractiveNote></AttractiveNote>

        {!file && (
          <label className="flex flex-col items-center px-4 py-6 bg-blue-50 text-gray-900 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-100 transition duration-300">
            <Upload className="w-8 h-8" />
            <span className="mt-2 text-base text-gray-900 leading-normal">Select a file</span>
            <input type='file' className="hidden" onChange={handleFileUpload} />
          </label>
        )}

        {file && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg">
              <FileText className="w-8 h-8 text-blue-500" />
              <span className="font-semibold text-lg text-white flex-grow ml-2">
                {file.name}
              </span>
              <button
                onClick={resetUpload}
                className="p-1 rounded-full hover:bg-gray-500 transition duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <Progress value={uploadProgress} className="w-full bg-gray-600" />

            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Size:</span>{" "}
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Type:</span>{" "}
                {file.type || "Unknown"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Category:</span>{" "}
                {getFileCategory(file.type)}
              </p>
            </div>

            <Alert
              className={
                getFileCategory(file.type) === FileCategories.MACHINE_READABLE
                  ? "bg-green-100"
                  : "bg-yellow-100"
              }
            >
              {getFileCategory(file.type) ===
                FileCategories.MACHINE_READABLE ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <AlertTitle>{getFileCategory(file.type)}</AlertTitle>
              <AlertDescription>
                {getFileCategory(file.type) === FileCategories.MACHINE_READABLE
                  ? "This file is machine-readable and can be easily processed."
                  : "This file may require additional processing to extract structured data."}
              </AlertDescription>
            </Alert>

            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                File Processing
              </h2>
              {isParsingComplete ? (
                <>
                  {error ? (
                    <p className="text-red-500 mb-2">{error}</p>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-2">
                        File processing complete. {parsedText.length} characters
                        extracted.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <textarea
                          ref={textareaRef}
                          className="w-full h-64 p-2 text-gray-700 bg-white rounded resize-none border border-gray-300"
                          value={parsedText}
                          readOnly
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {isCopied ? "Copied!" : "Copy Text"}
                        </button>
                        <button
                          onClick={downloadParsedText}
                          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Text
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="text-gray-600">
                  Processing file... This may take a moment.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}