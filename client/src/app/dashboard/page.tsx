// client/src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Dashboard/Sidebar';
import ModelList from '../../components/Dashboard/ModelList';
import ModelDetails from '../../components/Dashboard/ModelDetails';
import Navbar from '../../components/Navbar';

const DashboardPage = () => {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
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
            <button
              onClick={handleRefresh}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Refresh
            </button>
          </div>
          {user && <p className="mb-6 text-lg">Welcome, {user.name}!</p>}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ModelList key={refreshKey} onSelectModel={setSelectedModelId} />
            </div>
            <div className="lg:col-span-2">
              {selectedModelId ? (
                <ModelDetails modelId={selectedModelId} onDelete={() => {}} />
              ) : (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
                  <p>Select a model from the list to view its details, or upload a new model.</p>
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