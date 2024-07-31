'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';


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

const EvaluationResultsLightbox = ({ isOpen, onClose, evalData }: { isOpen: boolean, onClose: () => void, evalData: any }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">{evalData.modelName}</h2>
        <table className="w-full mb-6">
          <tbody>
            <tr>
              <td className="font-semibold">Accuracy:</td>
              <td>{evalData.accuracy}</td>
            </tr>
            <tr>
              <td className="font-semibold">Precision:</td>
              <td>{evalData.precision}</td>
            </tr>
            <tr>
              <td className="font-semibold">Recall:</td>
              <td>{evalData.recall}</td>
            </tr>
            <tr>
              <td className="font-semibold">F1 Score:</td>
              <td>{evalData.f1Score}</td>
            </tr>
            <tr>
              <td className="font-semibold">AUC:</td>
              <td>{evalData.auc}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between">
          <button
            onClick={handleRepeatEvaluation}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Repeat Evaluation
          </button>
          <button
            onClick={handleProceedToRetraining}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Proceed to Retraining
          </button>
        </div>
      </div>
    </div>
  );
};

const ModelUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState('');
  const [modality, setModality] = useState('');
  const [dataIntegrityTags, setDataIntegrityTags] = useState<string[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setModelName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataIntegrityCheck = dataIntegrityTags.join(',');
    console.log('Submitting:', { file, modelName, modality, dataIntegrityCheck });
    // Here you would typically handle the file upload and metadata submission
    // After successful upload, open the lightbox with evaluation results
    setIsLightboxOpen(true);
  };

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
                  placeholder="Vision, Language, ext, Voice, Multimodal, etc."
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
                Proceed with Evaluation
              </button>
              <Link href="/" className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400">
                Back Home
              </Link>
            </div>
          </form>
        </div>
      </main>
      <EvaluationResultsLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        evalData={placeholderEvalData}
      />
    </div>
  );
};

export default ModelUploadPage;