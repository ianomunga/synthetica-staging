// client/src/components/Dashboard/ModelList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Model {
  SK: string;
  modelName: string;
  status: string;
  lastUpdated: string;
}

interface ModelListProps {
  onSelectModel: (id: string) => void;
}

const ModelList: React.FC<ModelListProps> = ({ onSelectModel }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const fetchModels = useCallback(async () => {
    console.log('Fetching models. IsAuthenticated:', isAuthenticated, 'User:', user);
    if (isAuthenticated && user?.email) {
      try {
        const response = await fetch(`/api/get-user-models?email=${encodeURIComponent(user.email)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        console.log('Fetched models:', data.models);
        setModels(data.models);
        setError(null);
      } catch (error) {
        console.error('Error fetching models:', error);
        setModels([]);
        setError('Failed to fetch models. Please try again later.');
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  console.log('Rendering ModelList. Models:', models, 'Error:', error);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Your Models</h2>
      {models.length === 0 ? (
        <p>No models found. Upload a model to get started!</p>
      ) : (
        <ul className="space-y-4">
          {models.map((model) => (
            <li key={model.SK} className="border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out">
              <button
                onClick={() => onSelectModel(model.modelName)}
                className="w-full text-left p-4"
              >
                <div className="flex flex-wrap justify-between items-center mb-3">
                  <span className="font-medium text-m  mr-2">{model.modelName}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    model.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {model.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Last updated: {new Date(model.lastUpdated).toLocaleString()}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModelList;