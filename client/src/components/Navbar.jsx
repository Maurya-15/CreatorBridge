import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, profileImageUrl } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              CreatorBridge
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!user ? (
              <Link
                to="/auth"
                className="px-5 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            ) : (
              <>
                {user.role === 'brand' && (
                  <Link
                    to="/search"
                    className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                  >
                    Search
                  </Link>
                )}
                <Link
                  to="/campaigns"
                  className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                >
                  Campaigns
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <div className="flex items-center gap-3">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-100"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            id="mobile-menu-button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-1">
              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
              ) : (
                <>
                  {user.role === 'brand' && (
                    <Link
                      to="/search"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                    >
                      Search Creators
                    </Link>
                  )}
                  <Link
                    to="/campaigns"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                  >
                    Campaigns
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
