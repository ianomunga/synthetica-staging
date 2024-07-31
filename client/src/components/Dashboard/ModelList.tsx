// client/src/components/Dashboard/ModelList.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';

interface Model {
  id: string;
  name: string;
  status: string;
  lastUpdated: string;
}

interface ModelListProps {
  onSelectModel: (id: string) => void;
}

const ModelList: React.FC<ModelListProps> = ({ onSelectModel }) => {
  const [models, setModels] = useState<Model[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchModels();
    }
  }, [isAuthenticated]);

  const fetchModels = async () => {
    // Mock data for now
    const mockModels: Model[] = [
      { id: '1', name: 'Model A', status: 'Active', lastUpdated: '2023-05-15' },
      { id: '2', name: 'Model B', status: 'Inactive', lastUpdated: '2023-05-10' },
      { id: '3', name: 'Model C', status: 'Active', lastUpdated: '2023-05-05' },
    ];
    setModels(mockModels);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Models</h2>
      <ul className="divide-y divide-gray-200">
        {models.map((model) => (
          <li key={model.id} className="py-4">
            <button
              onClick={() => onSelectModel(model.id)}
              className="w-full text-left hover:bg-gray-50 p-2 rounded transition duration-150 ease-in-out"
            >
              <div className="flex justify-between">
                <span className="font-medium">{model.name}</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  model.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Last updated: {model.lastUpdated}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModelList;