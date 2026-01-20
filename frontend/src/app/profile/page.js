'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {user.role === 'founder' ? '🚀 Founder' : '💼 Investor'}
              </span>
            </div>
          </div>

          {user.bio && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">User ID:</span> {user.id}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Role:</span> {user.role}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Member Since:</span>{' '}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {user.role === 'founder' && (
            <div className="mt-8">
              <Link
                href="/my-startups"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                View My Startups
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
