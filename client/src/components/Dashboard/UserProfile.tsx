// client/src/components/Dashboard/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';

interface Profile {
  name: string;
  email: string;
  role: string;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<Profile>({ name: '', email: '', role: '' });
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    // Mock data for now
    const mockProfile: Profile = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Developer'
    };
    setProfile(mockProfile);

    // In the future, replace with actual API call
    // const response = await fetch('/api/user');
    // if (response.ok) {
    //   const data = await response.json();
    //   setProfile(data);
    // }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement update logic here
    console.log('Updating profile:', profile);
    // In the future, make an API call to update the profile
  };

  const handleLogout = () => {
    logout();
    // Add any additional logout logic here
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;