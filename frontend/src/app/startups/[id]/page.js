'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { startupAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function StartupProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchStartup();
    }
  }, [params.id, user]);

  const fetchStartup = async () => {
    try {
      const response = await startupAPI.getById(params.id);
      const startupData = response.data.startup;
      setStartup(startupData);
      
      if (user && startupData.founders) {
        const ownerFounder = startupData.founders.find(
          f => f.id === user.id && f.is_owner
        );
        setIsOwner(!!ownerFounder);
      }
    } catch (error) {
      console.error('Error fetching startup:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this startup? This action cannot be undone.')) return;
    
    try {
      await startupAPI.delete(params.id);
      router.push('/my-startups');
    } catch (error) {
      alert('Error deleting startup');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl font-semibold text-indigo-600">Loading Profile...</div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Startup not found</h1>
          <button 
            onClick={() => router.back()}
            className="mt-4 text-indigo-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                {startup.logo ? (
                  <img
                    src={startup.logo}
                    alt={startup.name}
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-3xl font-bold">
                    {startup.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{startup.name}</h1>
                  {startup.tagline && (
                    <p className="text-xl text-gray-500 mt-1 italic">{startup.tagline}</p>
                  )}
                </div>
              </div>
              
              {isOwner && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                  >
                    Delete Profile
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                {startup.stage}
              </span>
              {startup.category && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-200">
                  {startup.category}
                </span>
              )}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* About Section */}
            {startup.description && (
              <section>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">About the Venture</h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{startup.description}</p>
              </section>
            )}

            {/* Links Section */}
            {startup.website && (
              <section>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Digital Presence</h2>
                <a
                  href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="Language" />
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  {startup.website}
                </a>
              </section>
            )}

            {/* Team Section */}
            {startup.founders && startup.founders.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Core Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {startup.founders.map((founder) => (
                    <div key={founder.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm">
                        {founder.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{founder.name}</p>
                        <p className="text-sm text-indigo-600 font-medium">
                          {founder.is_owner ? '👑 Founder' : (founder.role || 'Team Member')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Status Footer */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 text-center">
                <p className="text-indigo-900 font-medium">
                  ✨ <strong className="text-indigo-700">Phase 2 Successfully Deployed</strong>
                </p>
                <p className="text-indigo-600 text-sm mt-1">
                  Startup profiles are now fully functional. Next: <strong>Journey Posts & Discovery Feed</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
