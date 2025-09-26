// src/components/profile/UserProfile.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

const UserProfile = () => {
  // Mock data - in a real app, this would come from your user session
  const [name, setName] = useState('Ananya Sharma');
  const [email, setEmail] =useState('ananya.sharma@example.com');
  const [bio, setBio] = useState('Passionate about sustainable living and upcycling. Based in Mysuru.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = { name, email, bio };
    console.log('Profile updated:', updatedProfile);
    alert('Profile saved successfully!');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative w-24 h-24">
          <Image
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Short Bio</label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Tell us a little about yourself"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;