
import React from 'react';
import { UploadForm } from '@/components/UploadForm';

const Upload = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Resource</h1>
        <p className="text-gray-600 mt-2">
          Share your notes, lectures, or placement resources with the community
        </p>
      </div>
      <UploadForm />
    </div>
  );
};

export default Upload;
