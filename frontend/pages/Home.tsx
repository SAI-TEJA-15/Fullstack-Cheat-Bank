import React, { useState, useMemo, useContext } from 'react';
import CheatSheetCard from '../components/CheatSheetCard';
import Hero3DCard from '../components/Hero3DCard';
import { categories, Category } from '../types';
import { AppContext } from '../App';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  accentGradient: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, accentGradient, iconColor }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="glass-panel relative rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden border border-white/10"
      style={{
        boxShadow: hover
          ? '0 20px 30px -10px rgba(109, 40, 217, 0.3)'
          : '0 8px 20px -5px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div
        className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${accentGradient} opacity-10 blur-2xl pointer-events-none rounded-full`}
      />
      <div className="flex items-center gap-4 relative z-10">
        <div
          className={`w-14 h-14 rounded-2xl bg-surface-light/80 border border-white/10 flex items-center justify-center shadow-inner ${iconColor} transition-transform duration-300 ${
            hover ? 'scale-110 rotate-3' : ''
          }`}
        >
          <i className={`fa-solid ${icon} text-2xl`}></i>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
          <p className="text-text-secondary text-sm font-medium mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const { favorites, cheatSheets, currentUser } = useContext(AppContext);
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredCheatSheets = useMemo(() => {
    return cheatSheets
      .filter(sheet => {
        if (showFavorites) {
          return favorites.includes(sheet.id);
        }
        return true;
      })
      .filter(sheet => activeCategory === 'All Categories' || sheet.category === activeCategory)
      .filter(sheet =>
        sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [activeCategory, searchTerm, showFavorites, favorites, cheatSheets]);

  const handleCategoryClick = (category: Category) => {
    setShowFavorites(false);
    setActiveCategory(category);
  };

  const handleFavoritesClick = () => {
    setActiveCategory('All Categories');
    setShowFavorites(!showFavorites);
  };

  // Sync with global header search input
  React.useEffect(() => {
    const searchInput = document.getElementById('search') as HTMLInputElement;
    if (searchInput) {
      const handleSearch = (e: Event) => {
        setSearchTerm((e.target as HTMLInputElement).value);
      };
      searchInput.addEventListener('input', handleSearch);
      return () => searchInput.removeEventListener('input', handleSearch);
    }
  }, []);

  return (
    <div className="space-y-16 relative z-10 pb-16">
      {/* 3D Hero Section */}
      <section className="pt-4 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-purple-300 text-xs font-semibold backdrop-blur-md animate-pulse-glow">
              <i className="fa-solid fa-cube"></i>
              <span>Next-Gen 3D Cheat Vault</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Master Any Tech with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                CheatBank
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed mx-auto lg:mx-0">
              Your instant, interactive knowledge bank for syntax, terminal commands, architectures, and design patterns. Bookmark favorites, download PDF references, and share your wisdom with developers worldwide.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#cheat-sheets"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-pink-600 hover:from-primary-hover hover:to-pink-700 text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <span>Browse Cheat Sheets</span>
                <i className="fa-solid fa-arrow-down text-xs"></i>
              </a>

              <button
                onClick={() => {
                  const search = document.getElementById('search');
                  search?.focus();
                }}
                className="px-6 py-3 rounded-xl glass-panel hover:bg-surface-light/80 text-text-primary font-medium text-sm transition-all border border-white/10 hover:border-white/20 flex items-center gap-2"
              >
                <i className="fa-solid fa-magnifying-glass text-accent"></i>
                <span>Quick Search</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive 3D Card */}
          <div className="lg:col-span-5 flex justify-center">
            <Hero3DCard />
          </div>
        </div>
      </section>

      {/* 3D Glass Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="fa-layer-group"
          value={cheatSheets.length.toString()}
          label="Total Cheat Sheets"
          accentGradient="from-purple-500 to-indigo-500"
          iconColor="text-purple-400"
        />
        <StatCard
          icon="fa-eye"
          value={cheatSheets.reduce((sum, sheet) => sum + sheet.stats.views, 0).toLocaleString()}
          label="Community Views"
          accentGradient="from-blue-500 to-cyan-500"
          iconColor="text-blue-400"
        />
        <StatCard
          icon="fa-cloud-arrow-down"
          value={cheatSheets.reduce((sum, sheet) => sum + sheet.stats.downloads, 0).toLocaleString()}
          label="PDF Downloads"
          accentGradient="from-pink-500 to-rose-500"
          iconColor="text-pink-400"
        />
        <StatCard
          icon="fa-user-shield"
          value={currentUser?.role === 'admin' ? 'Admin Mode' : (currentUser ? 'Member' : 'Guest')}
          label="Access Level"
          accentGradient="from-emerald-500 to-teal-500"
          iconColor="text-emerald-400"
        />
      </section>

      {/* Main Catalog Section */}
      <section id="cheat-sheets" className="space-y-8 scroll-mt-24">
        {/* Category Filter & Actions Bar */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const isActive = activeCategory === category && !showFavorites;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 transform ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30 scale-105'
                      : 'bg-surface/80 hover:bg-surface-light text-text-secondary hover:text-white border border-white/5'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={handleFavoritesClick}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all border ${
                showFavorites
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-400/40 shadow-lg shadow-pink-500/30'
                  : 'bg-surface/80 hover:bg-surface-light text-text-secondary hover:text-white border-white/5'
              }`}
            >
              <i className="fa-solid fa-heart text-pink-400"></i>
              <span>Saved ({favorites.length})</span>
            </button>
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex justify-between items-center px-1">
          <p className="text-sm font-medium text-text-secondary">
            Displaying <span className="text-white font-bold">{filteredCheatSheets.length}</span> of {cheatSheets.length} guides
          </p>
          {searchTerm && (
            <span className="text-xs bg-primary/20 text-purple-300 px-3 py-1 rounded-full border border-primary/30">
              Filter: "{searchTerm}"
            </span>
          )}
        </div>

        {/* Cheat Sheets 3D Grid */}
        {filteredCheatSheets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCheatSheets.map(sheet => (
              <CheatSheetCard key={sheet.id} sheet={sheet} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-16 text-center border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto text-primary text-2xl">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3 className="text-xl font-bold text-white">No cheat sheets found</h3>
            <p className="text-text-secondary text-sm max-w-sm mx-auto">
              We couldn't find any guides matching your current filters. Try changing categories or search query.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All Categories');
                setShowFavorites(false);
                setSearchTerm('');
              }}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
