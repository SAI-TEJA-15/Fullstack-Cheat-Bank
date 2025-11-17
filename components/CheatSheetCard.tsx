import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CheatSheet } from '../types';
import { AppContext } from '../App';

interface CheatSheetCardProps {
  sheet: CheatSheet;
}

const categoryColors: { [key: string]: string } = {
  Development: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  Programming: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  Design: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
  'System Admin': 'bg-red-500/20 text-red-300 border-red-400/30',
  Database: 'bg-green-500/20 text-green-300 border-green-400/30',
  DevOps: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  Tools: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
};

const downloadAsMarkdown = (sheet: CheatSheet) => {
    let content = `# ${sheet.title}\n\n`;
    content += `> ${sheet.description}\n\n`;
    content += `**Category:** ${sheet.category}\n`;
    content += `**Author:** ${sheet.author.name}\n\n`;

    sheet.content.forEach(section => {
        content += `## ${section.title}\n\n`;
        section.commands.forEach(cmd => {
            content += `- \`${cmd.command}\` - ${cmd.description}\n`;
        });
        content += `\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sheet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};


const CheatSheetCard: React.FC<CheatSheetCardProps> = ({ sheet }) => {
  const { favorites, toggleFavorite } = useContext(AppContext);
  const isFavorite = favorites.includes(sheet.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(sheet.id);
  };
  
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadAsMarkdown(sheet);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Delete for "${sheet.title}" is not implemented.`);
  }

  return (
    <div className="bg-surface rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-text-primary group-hover:text-accent">
            {sheet.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${categoryColors[sheet.category] || 'bg-gray-500/20 text-gray-300 border-gray-400/30'}`}>
            {sheet.category}
          </span>
        </div>
        <p className="text-text-secondary text-sm mb-4 h-10">{sheet.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {sheet.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 text-xs bg-surface-light text-text-secondary rounded-md">{tag}</span>
          ))}
          {sheet.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-surface-light text-text-secondary rounded-md">+{sheet.tags.length - 3}</span>
          )}
        </div>
      </div>
      <div className="px-5 py-3 bg-surface-light/50 border-t border-surface-light">
         <div className="flex justify-between items-center text-sm text-text-secondary mb-4">
          <div className="flex items-center gap-1">
            <i className="fa-solid fa-user"></i>
            <span>{sheet.author.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span title="Views"><i className="fa-solid fa-eye mr-1"></i> {sheet.stats.views.toLocaleString()}</span>
            <span title="Downloads"><i className="fa-solid fa-download mr-1"></i> {sheet.stats.downloads.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
            <Link to={`/sheet/${sheet.id}`} className="w-full text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-hover transition-colors duration-200 font-semibold">
                View
            </Link>
            <button onClick={handleFavoriteClick} className={`p-2 rounded-md ${isFavorite ? 'text-pink-500 bg-pink-500/10' : 'text-text-secondary bg-surface-light'} hover:bg-surface-light/50 transition-colors`}>
                <i className="fa-solid fa-heart"></i>
            </button>
            <button onClick={handleDownloadClick} className="p-2 rounded-md text-text-secondary bg-surface-light hover:bg-surface-light/50 transition-colors">
                <i className="fa-solid fa-download"></i>
            </button>
            <button onClick={handleDeleteClick} className="p-2 rounded-md text-text-secondary bg-surface-light hover:bg-surface-light/50 transition-colors">
                <i className="fa-solid fa-trash"></i>
            </button>
        </div>
      </div>
    </div>
  );
};

export default CheatSheetCard;