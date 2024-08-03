//client\src\app\dashboard\page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Dashboard/Sidebar';
import ModelList from '../../components/Dashboard/ModelList';
import ModelDetails from '../../components/Dashboard/ModelDetails';
import Navbar from '../../components/Navbar';
import { Model } from '../../../../server/src/lib/db';

const DashboardPage = () => {
  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);
  const [models, setModels] = useState<Model[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user?.email) {
      fetchModels();
    }
  }, [user, refreshKey]);

  const fetchModels = async () => {
    if (user?.email) {
      try {
        const response = await fetch(`/api/get-user-models?email=${encodeURIComponent(user.email)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        setModels(data.models);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleNavigate = (direction: 'up' | 'down') => {
    if (direction === 'up' && selectedModelIndex > 0) {
      setSelectedModelIndex(selectedModelIndex - 1);
    } else if (direction === 'down' && selectedModelIndex < models.length - 1) {
      setSelectedModelIndex(selectedModelIndex + 1);
    }
  };

  const handleDeleteModel = async (modelName: string) => {
    if (user?.id) {
      try {
        const response = await fetch('/api/delete-model', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, modelName }),
        });
        if (!response.ok) {
          throw new Error('Failed to delete model');
        }
        handleRefresh();
      } catch (error) {
        console.error('Error deleting model:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <Navbar />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          {user && <p className="mb-6 text-lg">Welcome, {user.name}!</p>}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ModelList
                models={models}
                onSelectModel={(index: number) => setSelectedModelIndex(index)}
              />
            </div>
            <div className="lg:col-span-2">
              {models.length > 0 ? (
                <ModelDetails
                  modelId={models[selectedModelIndex].modelName}
                  onDelete={handleDeleteModel}
                  onRefresh={handleRefresh}
                  onNavigate={handleNavigate}
                />
              ) : (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
                  <p>Upload a new model to get started.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
