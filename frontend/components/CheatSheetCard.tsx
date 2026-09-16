import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheatSheet } from '../types';
import { AppContext } from '../App';
import { incrementDownload } from '../services/apiService';
import { downloadCheatSheetAsPdf } from '../utils/pdfDownload';

interface CheatSheetCardProps {
  sheet: CheatSheet;
}

const categoryColors: { [key: string]: { badge: string; glow: string } } = {
  Development: {
    badge: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    glow: 'hover:shadow-blue-500/20 hover:border-blue-500/40',
  },
  Programming: {
    badge: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    glow: 'hover:shadow-purple-500/20 hover:border-purple-500/40',
  },
  Design: {
    badge: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
    glow: 'hover:shadow-pink-500/20 hover:border-pink-400/40',
  },
  'System Admin': {
    badge: 'bg-red-500/20 text-red-300 border-red-400/40',
    glow: 'hover:shadow-red-500/20 hover:border-red-400/40',
  },
  Database: {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    glow: 'hover:shadow-emerald-500/20 hover:border-emerald-400/40',
  },
  DevOps: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    glow: 'hover:shadow-amber-500/20 hover:border-amber-400/40',
  },
  Tools: {
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    glow: 'hover:shadow-indigo-500/20 hover:border-indigo-400/40',
  },
};

const CheatSheetCard: React.FC<CheatSheetCardProps> = ({ sheet }) => {
  const { favorites, toggleFavorite } = useContext(AppContext);
  const isFavorite = favorites.includes(sheet.id);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotX(rX);
    setRotY(rY);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotX(0);
    setRotY(0);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(sheet.id);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    incrementDownload(sheet.id).catch(error => {
      console.error('Failed to record download:', error);
    });
    downloadCheatSheetAsPdf(sheet);
  };

  const currentTheme = categoryColors[sheet.category] || {
    badge: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
    glow: 'hover:shadow-primary/20 hover:border-primary/40',
  };

  return (
    <div
      className="perspective-1000 h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={`glass-panel preserve-3d relative rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 ease-out border border-white/10 shadow-xl ${currentTheme.glow}`}
        style={{
          transform: isHovered
            ? `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03) translateZ(10px)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        }}
      >
        {/* Specular glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
          style={{
            background: `radial-gradient(circle 200px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.15), transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Card Body */}
        <div className="p-6 flex-grow flex flex-col justify-between preserve-3d">
          <div>
            <div
              className="flex justify-between items-start gap-2 mb-3 transition-transform duration-200"
              style={{ transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)' }}
            >
              <h3 className="text-lg font-bold text-text-primary group-hover:text-accent line-clamp-1">
                {sheet.title}
              </h3>
              <span
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border backdrop-blur-md flex-shrink-0 ${currentTheme.badge}`}
              >
                {sheet.category}
              </span>
            </div>

            <p
              className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed transition-transform duration-200"
              style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)' }}
            >
              {sheet.description}
            </p>
          </div>

          <div
            className="flex flex-wrap gap-1.5 transition-transform duration-200"
            style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)' }}
          >
            {sheet.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] font-medium bg-surface-light/80 text-text-secondary rounded-md border border-white/5"
              >
                #{tag}
              </span>
            ))}
            {sheet.tags.length > 3 && (
              <span className="px-2 py-0.5 text-[11px] font-medium bg-surface-light/80 text-text-secondary rounded-md border border-white/5">
                +{sheet.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div
          className="px-6 py-4 bg-surface-light/30 border-t border-white/5 preserve-3d transition-transform duration-200"
          style={{ transform: isHovered ? 'translateZ(35px)' : 'translateZ(0px)' }}
        >
          <div className="flex justify-between items-center text-xs text-text-secondary mb-3">
            <div className="flex items-center gap-1.5 font-medium">
              <i className="fa-solid fa-circle-user text-accent/80"></i>
              <span>{sheet.author.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span title="Views" className="flex items-center gap-1">
                <i className="fa-solid fa-eye text-primary"></i> {sheet.stats.views.toLocaleString()}
              </span>
              <span title="Downloads" className="flex items-center gap-1">
                <i className="fa-solid fa-download text-pink-400"></i> {sheet.stats.downloads.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/sheet/${sheet.id}`}
              className="flex-1 text-center py-2 px-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white font-semibold text-xs transition-all shadow-md shadow-primary/20 hover:shadow-primary/40 active:scale-95"
            >
              Explore Sheet
            </Link>
            <button
              onClick={handleFavoriteClick}
              aria-label="Favorite"
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? 'text-pink-500 bg-pink-500/15 border-pink-500/30 shadow-sm shadow-pink-500/20'
                  : 'text-text-secondary bg-surface-light/60 border-white/5 hover:text-white hover:bg-surface-light'
              }`}
            >
              <i className="fa-solid fa-heart text-xs"></i>
            </button>
            <button
              onClick={handleDownloadClick}
              aria-label="Download PDF"
              className="p-2 rounded-xl text-text-secondary bg-surface-light/60 border border-white/5 hover:text-white hover:bg-surface-light transition-all"
            >
              <i className="fa-solid fa-download text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheatSheetCard;
