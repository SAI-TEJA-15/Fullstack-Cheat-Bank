import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
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
          <div className="flex items-center">
            <Link
              to="/add"
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
            >
              <i className="fa-solid fa-plus -ml-1 mr-2 h-5 w-5"></i>
              Add Cheat Sheet
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;