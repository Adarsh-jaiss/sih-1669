import React from 'react';
import { AlertCircle } from 'lucide-react';

const AttractiveNote = () => {
  return (
    <div className="bg-gray-800 border-l-4 border-blue-500 p-4 my-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <AlertCircle className="text-blue-400 mr-2" size={18} />
        <h3 className="text-lg font-semibold text-blue-400">Note</h3>
      </div>
      <div className="mt-2">
        <p className="text-md font-normal text-gray-300">
          This is an MVP of the final application. For now it only converts a PDF file into a text file.
        </p>
      </div>
    </div>
  );
};

export default AttractiveNote;