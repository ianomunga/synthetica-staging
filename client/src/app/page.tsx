// src/app/page.tsx

'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';

// Toggle between test and production mode
const USE_TEST_USER = true;
const TEST_USER_ID = "ad7655af-9938-4d24-952e-eab663f19d3c";

const API_URL = 'https://l2l445877i.execute-api.us-east-1.amazonaws.com/staging/launch';
const POLL_MS = 5000;
const MAX_POLLS = 30;

const datasets = [
  { name: 'Arxiv', logo: '/images/arxiv-logo.png' },
  { name: 'HuggingFace', logo: '/images/hf-logo.png' },
  { name: 'Kaggle', logo: '/images/kaggle-logo.png' },
  { name: 'PapersWithCode', logo: '/images/pwc-logo.png' },
];

async function callLambda(payload: any) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

export default function Home() {
  const launchSession = useCallback(async () => {
    let user_id: string;

    if (USE_TEST_USER) {
      user_id = TEST_USER_ID;
      console.log("🚀 Using TEST user_id:", user_id);
    } else {
      alert("Supabase getUser() flow not enabled in test mode.");
      return;
    }

    const { ok, status, data } = await callLambda({ user_id });

    if (ok && status === 200 && data.public_url) {
      window.open(data.public_url, '_blank');
      return;
    }

    if (status === 202) {
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        const r = await callLambda({ user_id });
        if (r.ok && r.status === 200 && r.data?.public_url) {
          clearInterval(poll);
          window.open(r.data.public_url, '_blank');
        } else if (attempts >= MAX_POLLS) {
          clearInterval(poll);
          alert('Still starting up. Please try again in a bit.');
        }
      }, POLL_MS);
      return;
    }

    console.error('Launch error:', status, data);
    alert('Error starting session.');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-4">
              Keep your models great.
            </h1>
            <p className="text-2xl text-gray-600 mb-8">
              Evaluation & Retraining with Custom-Generated Synthetic Data
            </p>

            {/* Updated button: calls launchSession instead of navigating */}
            <button
              onClick={launchSession}
              className="bg-indigo-600 hover:bg-indigo-700 text-gray-100 font-semibold py-3 px-6 rounded text-lg inline-block"
            >
              Evaluate your Model
            </button>
          </div>

          <br />

          <div className="mt-16">
            <p className="text-xl text-gray-600 text-center mb-4">
              Powered by the largest collections of Open Source Data in the world.
            </p>
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
}
