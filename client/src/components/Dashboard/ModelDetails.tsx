// client/src/components/Dashboard/ModelDetails.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Model {
  id: string;
  name: string;
  status: string;
  lastUpdated: string;
  performance_metrics: {
    accuracy: string;
    precision: string;
    recall: string;
    f1_score: string;
  };
}

const ModelDetails = ({ modelId }: { modelId: string }) => {
  const [model, setModel] = useState<Model | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && modelId) {
      fetchModelDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, modelId]);

  const fetchModelDetails = async () => {
    // Mock data for now
    const mockModel: Model = {
      id: modelId,
      name: `Model ${modelId}`,
      status: 'Active',
      lastUpdated: '2023-05-15',
      performance_metrics: {
        accuracy: '0.95',
        precision: '0.92',
        recall: '0.97',
        f1_score: '0.94'
      }
    };
    setModel(mockModel);
  };

  if (!model) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{model.name}</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <p className={`mt-1 text-sm ${
            model.status === 'Active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {model.status}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Last Updated</p>
          <p className="mt-1 text-sm text-gray-900">{model.lastUpdated}</p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Metrics</h3>
        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Accuracy</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{model.performance_metrics.accuracy}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Precision</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{model.performance_metrics.precision}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Recall</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{model.performance_metrics.recall}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">F1 Score</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{model.performance_metrics.f1_score}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Retrain
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ModelDetails;