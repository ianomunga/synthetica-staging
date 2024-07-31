'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      router.push('/');
    } else {
      router.push('/auth');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/synthetica.png"
            alt="Synthetica Logo"
            width={28}
            height={28}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold">Synthetica</span>
        </Link>
        <div className="space-x-6">
          <a href="https://github.com/ianomunga/synthetica-staging/tree/main/datasets" className="text-gray-600 hover:text-gray-800" target="_blank" rel="noopener noreferrer">
            Datasets
          </a>
          {isAuthenticated && (
            <>
              <Link href="/upload" className="text-gray-600 hover:text-gray-800">
                Evaluate
              </Link>
              <Link href="/retrain" className="text-gray-600 hover:text-gray-800">
                Retrain
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
                Dashboard
              </Link>
            </>
          )}
          <button 
            onClick={handleAuthAction}
            className="bg-indigo-600 text-gray-100 px-4 py-2 rounded hover:bg-indigo-700"
          >
            {isAuthenticated ? 'Logout' : 'Log In'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;