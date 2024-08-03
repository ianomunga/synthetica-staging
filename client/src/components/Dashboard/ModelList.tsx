//client\src\components\Dashboard\ModelList.tsx
import React from 'react';
import { Model } from '../../../../server/src/lib/db';

interface ModelListProps {
  models: Model[];
  onSelectModel: (index: number) => void;
}

const ModelList: React.FC<ModelListProps> = ({ models, onSelectModel }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-l font-semibold mb-4">Your Synthetica Models</h2>
      {models.length === 0 ? (
        <p>No models found. Upload a model to get started!</p>
      ) : (
        <ul className="space-y-4">
          {models.map((model, index) => (
            <li key={model.modelName} className="border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out">
              <button
                onClick={() => onSelectModel(index)}
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