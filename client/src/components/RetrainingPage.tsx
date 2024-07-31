'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

const RetrainingPage: React.FC = () => {
  const [selectedBackend, setSelectedBackend] = useState<string | null>(null);
  const [hyperparameters, setHyperparameters] = useState('');
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainingComplete, setRetrainingComplete] = useState(false);
  const router = useRouter();

  const handleBackendSelection = (backend: string) => {
    setSelectedBackend(backend);
    if (backend === 'aws' || backend === 'dgx') {
      // Redirect to external login page
      window.location.href = `https://${backend}-login-url.com`;
    }
  };

  const handleRetrainClick = async () => {
    if (selectedBackend !== 'synthetica') {
      console.log('Please select Synthetica AutoTrain to proceed with retraining.');
      return;
    }

    setIsRetraining(true);
    // Simulating the retraining process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsRetraining(false);
    setRetrainingComplete(true);
  };

  const handleEvaluateRetrainedModel = () => {
    router.push('/test-inference');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="px-8 md:px-16 lg:px-24 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Retrain your Model</h1>
          <p className="mb-6">Select a backend for retraining:</p>
          
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => handleBackendSelection('aws')}
              className={`px-4 py-2 rounded ${selectedBackend === 'aws' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              AWS
            </button>
            <button
              onClick={() => handleBackendSelection('dgx')}
              className={`px-4 py-2 rounded ${selectedBackend === 'dgx' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              DGX Cloud
            </button>
            <button
              onClick={() => handleBackendSelection('synthetica')}
              className={`px-4 py-2 rounded ${selectedBackend === 'synthetica' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Synthetica AutoTrain
            </button>
          </div>

          {selectedBackend === 'synthetica' && (
            <div className="mb-8">
              <label htmlFor="hyperparameters" className="block mb-2">Enter hyperparameters:</label>
              <textarea
                id="hyperparameters"
                value={hyperparameters}
                onChange={(e) => setHyperparameters(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
                placeholder="Enter hyperparameters here..."
              />
            </div>
          )}

          <button
            onClick={handleRetrainClick}
            disabled={selectedBackend !== 'synthetica' || isRetraining}
            className={`px-6 py-2 rounded ${
              selectedBackend === 'synthetica' && !isRetraining
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isRetraining ? 'Retraining...' : 'Retrain your Model'}
          </button>

          {retrainingComplete && (
            <div className="mt-8">
              <p className="text-green-600 mb-4">Retraining complete!</p>
              <button
                onClick={handleEvaluateRetrainedModel}
                className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Evaluate Retrained Model
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RetrainingPage;