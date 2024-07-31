'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

// Placeholder evaluation data
const placeholderEvalData = {
  modelName: "MODEL 11-23A.H5",
  accuracy: "95.2%",
  precision: "94.8%",
  recall: "93.7%",
  f1Score: "94.2%",
  auc: "0.978"
};

const EvaluationResultsLightbox = ({ isOpen, onClose, evalData }: { isOpen: boolean, onClose: () => void, evalData: any }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleRepeatEvaluation = () => {
    console.log("Repeating evaluation...");
    // Here you would typically call the API to re-run the evaluation
    // For now, we'll just close the lightbox
    onClose();
  };

  const handleProceedToRetraining = () => {
    onClose();
    router.push('/retrain');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">{evalData.modelName}</h2>
        <table className="w-full mb-6">
          <tbody>
            <tr>
              <td className="font-semibold">Accuracy:</td>
              <td>{evalData.accuracy}</td>
            </tr>
            <tr>
              <td className="font-semibold">Precision:</td>
              <td>{evalData.precision}</td>
            </tr>
            <tr>
              <td className="font-semibold">Recall:</td>
              <td>{evalData.recall}</td>
            </tr>
            <tr>
              <td className="font-semibold">F1 Score:</td>
              <td>{evalData.f1Score}</td>
            </tr>
            <tr>
              <td className="font-semibold">AUC:</td>
              <td>{evalData.auc}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between">
          <button
            onClick={handleRepeatEvaluation}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Repeat Evaluation
          </button>
          <button
            onClick={handleProceedToRetraining}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Proceed to Retraining
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated ModelUploadPage component to include the lightbox
const ModelUploadPage = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleProceedWithEvaluation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically call the API to run the evaluation
    // For now, we'll just open the lightbox with placeholder data
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="px-8 md:px-16 lg:px-24 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Upload your Model</h1>
          <form onSubmit={handleProceedWithEvaluation} className="space-y-6">
            {/* Form fields go here (similar to previous implementation) */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Proceed with Evaluation
            </button>
          </form>
        </div>
      </main>
      <EvaluationResultsLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        evalData={placeholderEvalData}
      />
    </div>
  );
};

export default ModelUploadPage;