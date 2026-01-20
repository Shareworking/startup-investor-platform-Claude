'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { startupAPI } from '@/lib/api';

export default function StartupsPage() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const response = await startupAPI.getAll();
      setStartups(response.data.startups);
    } catch (error) {
      console.error('Error fetching startups:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Discover Startups</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading startups...</div>
          </div>
        ) : startups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No startups yet</h2>
            <p className="text-gray-600">Be the first to create a startup!</p>
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
                <div className="flex items-center space-x-2 text-sm mb-4">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                    {startup.stage}
                  </span>
                  {startup.category && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                      {startup.category}
                    </span>
                  )}
                </div>
                {startup.founders && startup.founders.length > 0 && (
                  <div className="flex -space-x-2">
                    {startup.founders.slice(0, 3).map((founder, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                        title={founder.name}
                      >
                        {founder.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {startup.founders.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold border-2 border-white">
                        +{startup.founders.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
