'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">LetsStartIt</h1>
          <div className="space-x-4">
            {user ? (
              <Link href="/profile" className="text-indigo-600 hover:text-indigo-800">
                Profile
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect Startups with Investors
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Share your startup journey, gain visibility, and connect with investors who
            value transparency and consistent execution.
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-3">For Founders</h3>
            <p className="text-gray-600">
              Share your journey, document progress, and build trust with investors over time.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-3">For Investors</h3>
            <p className="text-gray-600">
              Discover startups early and evaluate founders based on execution, not just pitches.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency First</h3>
            <p className="text-gray-600">
              No hype. No vanity metrics. Just real progress and consistent execution.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
