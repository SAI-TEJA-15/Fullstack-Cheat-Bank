import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUserFromStorage, logout, isAuthenticated } from '../services/apiService';
import { User } from '../types';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUserFromStorage());
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-2xl font-bold text-accent">
              <i className="fa-solid fa-book-bookmark mr-2"></i> CheatBank
            </Link>
          </div>
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-center">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search cheat sheets</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <i className="fa-solid fa-search text-text-secondary"></i>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full bg-surface border border-surface-light rounded-md py-2 pl-10 pr-3 text-sm placeholder-text-secondary focus:outline-none focus:text-text-primary focus:placeholder-gray-500 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search cheat sheets..."
                  type="search"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
            >
              <i className="fa-solid fa-plus -ml-1 mr-2 h-5 w-5"></i>
              Add Cheat Sheet
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface hover:bg-surface-light transition"
                >
                  <i className="fa-solid fa-user text-accent"></i>
                  <span className="text-sm font-medium text-text-primary">{user.username}</span>
                  <i className={`fa-solid fa-chevron-down text-xs transition ${showUserMenu ? 'rotate-180' : ''}`}></i>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg py-1 z-10 border border-surface-light">
                    <div className="px-4 py-2 border-b border-surface-light">
                      <p className="text-sm font-medium text-text-primary">{user.username}</p>
                      <p className="text-xs text-text-secondary">{user.email}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-accent">{user.role}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-text-primary hover:bg-background transition"
                      >
                        <i className="fa-solid fa-shield-halved mr-2"></i>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background transition"
                    >
                      <i className="fa-solid fa-sign-out-alt mr-2"></i>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-hover transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-accent hover:bg-accent/90 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
