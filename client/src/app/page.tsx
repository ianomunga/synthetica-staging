// src/app/page.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const datasets = [
  { name: 'Arxiv', logo: '/images/arxiv-logo.png' },
  { name: 'HuggingFace', logo: '/images/hf-logo.png' },
  { name: 'Kaggle', logo: '/images/kaggle-logo.png' },
  { name: 'PapersWithCode', logo: '/images/pwc-logo.png' },
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-4">Keep your models great.</h1>
            <p className="text-2xl text-gray-600 mb-8">Evaluation & Retraining with Custom-Generated Synthetic Data</p>
            <Link href="/upload" className="bg-indigo-600 hover:bg-indigo-700 text-gray-100 font-semibold py-3 px-6 rounded text-lg inline-block">
              Evaluate your Model
            </Link>
          </div>
          <br></br>
          <div className="mt-16">
            <p className="text-xl text-gray-600 text-center mb-4">Powered by the largest collections of Open Source Data in the world.</p>
            <div className="flex justify-center items-center space-x-40">
              {datasets.map((dataset) => (
                <div key={dataset.name} className="w-24 h-20 relative">
                  <Image
                    src={dataset.logo}
                    alt={`${dataset.name} logo`}
                    layout="fill"
                    objectFit="contain"
                    className="opacity-50"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;