// client/src/components/Dashboard/ModelDetails.tsx

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Model } from '../../../../server/src/lib/db';
import type { IconType } from "react-icons";
import { FiRefreshCw, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const RefreshIcon: IconType = FiRefreshCw;
const UpIcon: IconType = FiChevronUp;
const DownIcon: IconType = FiChevronDown;

interface ModelDetailsProps {
  modelId: string;
  onDelete: (modelName: string) => void;
  onRefresh: () => void;
  onNavigate: (direction: 'up' | 'down') => void;
}

const ModelDetails: React.FC<ModelDetailsProps> = ({ modelId, onDelete, onRefresh, onNavigate }) => {
  const [model, setModel] = useState<Model | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const fetchModelDetails = useCallback(async () => {
    if (user?.email && modelId) {
      try {
        const response = await fetch(`/api/get-model-details?email=${encodeURIComponent(user.email)}&modelName=${encodeURIComponent(modelId)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch model details');
        }
        const modelDetails = await response.json();
        setModel(modelDetails);
        setError(null);
      } catch (error) {
        console.error('Error fetching model details:', error);
        setError('Failed to fetch model details. Please try again later.');
      }
    }
  }, [user, modelId]);

  useEffect(() => {
    fetchModelDetails();
  }, [fetchModelDetails]);

  const handleStatusChange = async (newStatus: string) => {
    if (user?.email && model) {
      try {
        const response = await fetch('/api/update-model-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            modelName: model.modelName,
            status: newStatus,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to update model status');
        }
        fetchModelDetails();
      } catch (error) {
        console.error('Error updating model status:', error);
        setError('Failed to update model status. Please try again later.');
      }
    }
  };

  const handleRetrain = () => {
    router.push(`/retrain/${modelId}`);
  };

  const handleDelete = async () => {
    if (model && user) {
      try {
        const response = await fetch('/api/delete-model', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, modelName: model.modelName }),
        });
        if (!response.ok) {
          throw new Error('Failed to delete model');
        }
        onDelete(model.modelName);
        onRefresh();
      } catch (error) {
        console.error('Error deleting model:', error);
        setError('Failed to delete model. Please try again later.');
      }
    }
  };

  const handleRefresh = () => {
    fetchModelDetails();
    onRefresh();
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!model) return <div>Loading...</div>;

  return (
    <div className="absolute top-5 right-2 flex space-x-2">
      <button onClick={handleRefresh} className="p-1 hover:bg-gray-100 rounded">
        <RefreshIcon className="w-5 h-5 text-gray-600" />
      </button>
      <button onClick={() => onNavigate('up')} className="p-1 hover:bg-gray-100 rounded">
        <UpIcon className="w-5 h-5 text-gray-600" />
      </button>
      <button onClick={() => onNavigate('down')} className="p-1 hover:bg-gray-100 rounded">
        <DownIcon className="w-5 h-5 text-gray-600" />
      </button>
    </div>
      
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
          } text-white py-2 px-4 rounded`}
        >
          {model.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>
        <button 
          onClick={handleRetrain}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Retrain
        </button>
        <button 
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ModelDetails;
