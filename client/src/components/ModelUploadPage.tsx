// client/src/components/ModelUploadPage.tsx
'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from './Navbar';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

// Placeholder evaluation data
const placeholderEvalData = {
  modelName: "MODEL 11-23A.H5",
  accuracy: "95.2%",
  precision: "94.8%",
  recall: "93.7%",
  f1Score: "94.2%",
  auc: "0.978"
};

// Custom MultiSelect component
const MultiSelect: React.FC<{
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && input.trim()) {
      e.preventDefault();
      setTags([...tags, input.trim()]);
      setInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const getRandomColor = () => {
    const colors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200', 'bg-purple-200', 'bg-pink-200'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="border border-gray-300 rounded p-2 flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span key={index} className={`${getRandomColor()} text-gray-700 px-2 py-1 rounded-full text-sm flex items-center`}>
          {tag}
          <button onClick={() => removeTag(index)} className="ml-1 text-gray-600 hover:text-gray-800">
            &times;
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow outline-none"
        placeholder={tags.length === 0 ? "What open source data may have been in the training set?" : ""}
      />
    </div>
  );
};
/*
const EvaluationResultsLightbox: React.FC<{ isOpen: boolean, onClose: () => void, evalData: any }> = ({ isOpen, onClose, evalData }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleRepeatEvaluation = () => {
    console.log("Repeating evaluation...");
    // Here you would typically call the API to re-run the evaluation
    // For now, we'll just close the lightbox
    onClose();
  };

  const handleProceedToRetraining = () => {
    onClose();
    router.push('/retrain');
  };
}
*/  
const ModelUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [codeFile, setCodeFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState('');
  const [modality, setModality] = useState('');
  const [dataIntegrityTags, setDataIntegrityTags] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setModelName(e.target.files[0].name);
    }
  };

  const handleCodeFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCodeFile(e.target.files[0]);
    }
  };

  //we'd normally get server progress data, but it's expensive, so we'll simulate it for now
  const simulateProgress = (setProgress: (progress: number) => void) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        clearInterval(interval);
        setProgress(100);
      } else {
        setProgress(progress);
      }
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (codeFile) {
      formData.append('codeFile', codeFile);
    }
    formData.append('modelName', modelName);
    formData.append('modality', modality);
    formData.append('dataIntegrityTags', JSON.stringify(dataIntegrityTags));
    formData.append('userId', user.id);
    formData.append('username', user.email);
    formData.append('lastUpdated', new Date().toISOString());

    setUploadProgress(0);
    simulateProgress(setUploadProgress);

    try {
      const response = await fetch('/api/upload-model', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadProgress(100);
        setUploadComplete(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        console.error('Failed to upload model');
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('Error uploading model:', error);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="px-8 md:px-16 lg:px-24 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-5">Upload your Model</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={file ? file.name : 'MODEL 11-23A.H5'}
                readOnly
                className="flex-grow p-2 border border-gray-300 rounded"
              />
              <label className="bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">
                Choose Weights File
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={codeFile ? codeFile.name : 'Model Class Implementation'}
                readOnly
                className="flex-grow p-2 border border-gray-300 rounded"
              />
              <label className="bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">
                Choose Code File
                <input type="file" onChange={handleCodeFileChange} className="hidden" />
              </label>
            </div>

            <h2 className="text-xl font-semibold">Please fill in the model&apos;s metadata below</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">Model Name</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="MODEL 11-23A.H5"
                />
              </div>
              <div>
                <label className="block mb-1">Modality</label>
                <input
                  type="text"
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Vision, Language, Voice, Multimodal, etc."
                />
              </div>
              <div>
                <label className="block mb-1">Data Integrity Check</label>
                <MultiSelect tags={dataIntegrityTags} setTags={setDataIntegrityTags} />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
              >
                Upload Model
              </button>
              <Link href="/dashboard" className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400">
                Back to Dashboard
              </Link>
            </div>
          </form>
          
          {uploadProgress > 0 && !uploadComplete && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${uploadProgress}%`}}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Upload progress: {uploadProgress}%</p>
            </div>
          )}
          
          {uploadComplete && (
            <div className="mt-4 text-green-600 font-semibold">
              Upload Complete! Redirecting to dashboard...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ModelUploadPage;