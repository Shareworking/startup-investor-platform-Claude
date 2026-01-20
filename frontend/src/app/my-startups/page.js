'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { startupAPI } from '@/lib/api';

export default function MyStartupsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [startups, setStartups] = useState([]);
  const [loadingStartups, setLoadingStartups] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchMyStartups();
    }
  }, [user, loading, router]);

  const fetchMyStartups = async () => {
    try {
      const response = await startupAPI.getMyStartups();
      setStartups(response.data.startups);
    } catch (error) {
      console.error('Error fetching startups:', error);
    } finally {
      setLoadingStartups(false);
    }
  };

  if (loading || loadingStartups) {
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Startups</h1>
          <Link
            href="/startups/create"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            + Create Startup
          </Link>
        </div>

        {startups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No startups yet</h2>
            <p className="text-gray-600 mb-6">Create your first startup to get started!</p>
            <Link
              href="/startups/create"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Create Your First Startup
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <Link
                key={startup.id}
                href={`/startups/${startup.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {startup.logo && (
                  <img
                    src={startup.logo}
                    alt={startup.name}
                    className="w-16 h-16 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{startup.name}</h3>
                {startup.tagline && (
                  <p className="text-gray-600 text-sm mb-3">{startup.tagline}</p>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                    {startup.stage}
                  </span>
                  {startup.category && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                      {startup.category}
                    </span>
                  )}
                </div>
                {startup.is_owner && (
                  <span className="inline-block mt-3 text-xs text-indigo-600 font-medium">
                    👑 Owner
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
