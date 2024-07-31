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
  const { isAuthenticated,loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSelectModel = (id: string) => {
    setSelectedModelId(id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <main className="p-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ModelList onSelectModel={handleSelectModel} />
            </div>
            <div className="md:col-span-2">
              {selectedModelId ? (
                <ModelDetails modelId={selectedModelId} />
              ) : (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
                  <p>Select a model from the list to view its details.</p>
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