// client/src/components/Dashboard/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Dashboard
        </Link>
        <Link href="/upload" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Upload Model
        </Link>
        <Link href="/retrain" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Retrain Model
        </Link>
        <Link href="/test-inference" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Test Inference
        </Link>
        <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
        Back Home
        </Link>
      </nav>
      <div className="px-4 py-2">
        <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;