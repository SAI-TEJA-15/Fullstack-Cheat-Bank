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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl shadow-lg transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo with 3D glowing badge */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-black text-white group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                <i className="fa-solid fa-book-bookmark text-white text-base"></i>
              </div>
              <span className="tracking-tight">
                Cheat<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Bank</span>
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center">
                <i className="fa-solid fa-magnifying-glass text-text-secondary text-sm"></i>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full bg-surface/80 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all backdrop-blur-md shadow-inner"
                placeholder="Search commands, syntax, tags..."
                type="search"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/add"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span className="hidden xs:inline">Add Sheet</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface/80 hover:bg-surface-light border border-white/10 transition-all backdrop-blur-md"
                >
                  <div className="w-6 h-6 rounded-lg bg-accent/20 text-accent flex items-center justify-center text-xs">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-text-primary hidden sm:inline">
                    {user.username}
                  </span>
                  <i
                    className={`fa-solid fa-chevron-down text-[10px] text-text-secondary transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`}
                  ></i>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 glass-panel rounded-2xl shadow-2xl py-2 z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-text-primary">{user.username}</p>
                      <p className="text-[11px] text-text-secondary truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-md bg-accent/15 text-accent border border-accent/20">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-primary/20 hover:text-white transition"
                      >
                        <i className="fa-solid fa-shield-halved text-accent text-xs"></i>
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/15 transition text-left"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-text-secondary hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-accent/20 hover:bg-accent/30 border border-accent/30 transition shadow-sm"
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
