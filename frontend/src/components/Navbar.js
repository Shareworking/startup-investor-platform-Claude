'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            LetsStartIt
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link href="/startups" className="text-gray-700 hover:text-indigo-600">
                  Discover
                </Link>
                <Link href="/my-startups" className="text-gray-700 hover:text-indigo-600">
                  My Startups
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-indigo-600">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Logout
                </button>
              </>
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
      </div>
    </nav>
  );
}
