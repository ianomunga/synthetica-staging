// client/src/components/Dashboard/ModelDetails.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getModelDetails, updateModelStatus, Model } from '../../../../server/src/lib/db';
import { useRouter } from 'next/navigation';

interface ModelDetailsProps {
  modelId: string;
  onDelete: (modelName: string) => void;
}

const ModelDetails: React.FC<ModelDetailsProps> = ({ modelId, onDelete }) => {
  const [model, setModel] = useState<Model | null>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const fetchModelDetails = useCallback(async () => {
    if (isAuthenticated && user?.email && modelId) {
      try {
        const modelDetails = await getModelDetails(user.email, modelId);
        setModel(modelDetails || null);
      } catch (error) {
        console.error('Error fetching model details:', error);
      }
    }
  }, [isAuthenticated, user, modelId]);

  useEffect(() => {
    fetchModelDetails();
  }, [fetchModelDetails]);

  const handleStatusChange = async (newStatus: string) => {
    if (user?.email && model) {
      try {
        await updateModelStatus(user.email, model.modelName, newStatus);
        fetchModelDetails();
      } catch (error) {
        console.error('Error updating model status:', error);
      }
    }
  };

  const handleRetrain = () => {
    router.push(`/retrain/${modelId}`);
  };

  const handleDelete = () => {
    if (model) {
      onDelete(model.modelName);
    }
  };

  if (!model) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{model.modelName}</h2>
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
        <div>
          <p className="text-sm font-medium text-gray-500">Modality</p>
          <p className="mt-1 text-sm text-gray-900">{model.modality}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Data Integrity Tags</p>
          <p className="mt-1 text-sm text-gray-900">{model.dataIntegrityTags}</p>
        </div>
      </div>
      {model.performance_metrics && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Metrics</h3>
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
            {Object.entries(model.performance_metrics).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm font-medium text-gray-500">{key}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          onClick={() => handleStatusChange(model.status === 'Active' ? 'Inactive' : 'Active')}
          className={`${
            model.status === 'Active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } text-white font-bold py-2 px-4 rounded`}
        >
          {model.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>
        <button 
          onClick={handleRetrain}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retrain
        </button>
        <button 
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ModelDetails;