import React, { useState, useMemo, useContext } from 'react';
import CheatSheetCard from '../components/CheatSheetCard';
import { categories } from '../data/mockData';
import { Category } from '../types';
import { AppContext } from '../App';

const StatCard: React.FC<{ icon: string; value: string; label: string; }> = ({ icon, value, label }) => (
    <div className="bg-surface p-6 rounded-lg flex items-center">
        <div className="bg-primary/20 text-primary p-3 rounded-full mr-4">
            <i className={`fa-solid ${icon} fa-xl`}></i>
        </div>
        <div>
            <p className="text-3xl font-bold text-text-primary">{value}</p>
            <p className="text-text-secondary">{label}</p>
        </div>
    </div>
);


const Home: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('All Categories');
    const [searchTerm, setSearchTerm] = useState('');
    const { favorites, cheatSheets } = useContext(AppContext);
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
    }

    const handleFavoritesClick = () => {
      setActiveCategory('All Categories');
      setShowFavorites(!showFavorites);
    }
    
    // This is a dummy implementation for search from the header.
    // In a real app, this state would be lifted or managed with a global state manager.
    React.useEffect(() => {
        const searchInput = document.getElementById('search') as HTMLInputElement;
        if(searchInput) {
            const handleSearch = (e: Event) => {
                setSearchTerm((e.target as HTMLInputElement).value);
            };
            searchInput.addEventListener('input', handleSearch);
            return () => searchInput.removeEventListener('input', handleSearch);
        }
    }, []);

    return (
        <div className="space-y-12">
            <section className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Discover Amazing Cheat Sheets</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
                    Find quick reference guides for programming, development tools, and more. Save time with our curated collection of essential cheat sheets.
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="fa-file-alt" value={cheatSheets.length.toString()} label="Total Sheets" />
                <StatCard icon="fa-eye" value="596,390" label="Total Views" />
                <StatCard icon="fa-download" value="200,540" label="Downloads" />
                <StatCard icon="fa-users" value="59,639" label="Active Users" />
            </section>
            
            <section className="relative -mb-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-surface-light"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-background px-3 text-lg font-medium text-text-primary">
                        <div className="flex items-center gap-2">
                            <span>Monthly Growth</span>
                            <span className="text-green-400 text-sm font-bold">+12.5%</span>
                        </div>
                    </span>
                </div>
                <div className="w-full bg-surface-light rounded-full h-2.5 mt-4">
                  <div className="bg-primary h-2.5 rounded-full" style={{width: '75%'}}></div>
                </div>
            </section>


            <section>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeCategory === category && !showFavorites ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-light'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleFavoritesClick} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${showFavorites ? 'bg-pink-500/80 text-white' : 'bg-surface hover:bg-surface-light'}`}>
                            <i className="fa-solid fa-heart"></i>
                            Favorites ({favorites.length})
                        </button>
                        <button onClick={() => alert('Tag filtering not implemented')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-surface hover:bg-surface-light">
                            <i className="fa-solid fa-tags"></i>
                            Tags
                        </button>
                    </div>
                </div>
                <p className="text-sm text-text-secondary mb-6">Showing {filteredCheatSheets.length} of {cheatSheets.length} cheat sheets</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCheatSheets.map(sheet => (
                        <CheatSheetCard key={sheet.id} sheet={sheet} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;