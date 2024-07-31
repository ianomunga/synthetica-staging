'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';


const TestInferencePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [generatedImageName, setGeneratedImageName] = useState<string | null>(null);
  const [inferenceResult, setInferenceResult] = useState<string | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setGeneratedImageName(null);
    }
  };

  const handleGenerateTestImage = async () => {
    setIsComputing(true);
    // Simulating API call to generate test image
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedImageName('generated_test_image.jpg');
    setFile(null);
    setIsComputing(false);
  };

  const handleCompute = async () => {
    if (!file && !generatedImageName) {
      alert('Please upload a file or generate a test image first.');
      return;
    }
    setIsComputing(true);
    // Simulating API call for inference
    await new Promise(resolve => setTimeout(resolve, 3000));
    setInferenceResult(JSON.stringify({
      class: 'dog',
      confidence: 0.95,
      bounding_box: [100, 100, 200, 200]
    }, null, 2));
    setIsComputing(false);
  };

  const handleRetrain = () => {
    router.push('/retrain');
  };

  const handleDownload = () => {
    // Simulating model download
    console.log('Downloading retrained model...');
    // After download starts, redirect to home page
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="px-8 md:px-16 lg:px-24 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Test Inference</h1>
          <p className="mb-6">Upload a test image or generate one for inference:</p>
          
          <div className="flex space-x-4 mb-8">
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
              Upload Test Image
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
            <button
              onClick={handleGenerateTestImage}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Generate Test Image
            </button>
          </div>

          {(file || generatedImageName) && (
            <div className="mb-8">
              <p className="font-semibold">Selected Image:</p>
              <p>{file ? file.name : generatedImageName}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleCompute}
                  disabled={isComputing}
                  className={`px-6 py-2 rounded ${
                    isComputing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isComputing ? 'Computing...' : 'Compute'}
                </button>
              </div>
            </div>
          )}

          {inferenceResult && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Inference Result:</h2>
              <pre className="bg-gray-200 p-4 rounded overflow-x-auto">
                {inferenceResult}
              </pre>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleRetrain}
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
            >
              Retrain Model
            </button>
            <button
              onClick={handleDownload}
              className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
            >
              Download Model
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestInferencePage;