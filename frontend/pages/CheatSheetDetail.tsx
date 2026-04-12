import React, { useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { incrementDownload, incrementView } from '../services/apiService';
import { downloadCheatSheetAsPdf } from '../utils/pdfDownload';

const CheatSheetDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { cheatSheets, favorites, toggleFavorite } = useContext(AppContext);

    const sheet = cheatSheets.find(s => s.id === parseInt(id || ''));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (sheet) {
            incrementView(sheet.id).catch(error => {
                console.error('Failed to record view:', error);
            });
        }
    }, [id, sheet]);

    if (!sheet) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Cheat Sheet not found</h2>
                <Link to="/" className="mt-4 inline-block text-primary hover:underline">
                    &larr; Back to all cheat sheets
                </Link>
            </div>
        );
    }
    
    const isFavorite = favorites.includes(sheet.id);

    const relatedSheets = cheatSheets
        .filter(s => s.category === sheet.category && s.id !== sheet.id)
        .slice(0, 3);
        
    const handleActionClick = (action: string) => {
        alert(`${action} is not implemented.`);
    };

    return (
        <div>
            <button onClick={() => navigate(-1)} className="text-sm text-text-secondary hover:text-text-primary mb-8 flex items-center gap-2">
                <i className="fa-solid fa-arrow-left"></i>
                Back to Cheat Sheets
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h1 className="text-4xl font-extrabold text-text-primary">{sheet.title} Cheat Sheet</h1>
                        <div className="flex gap-2">
                            <button onClick={() => {
                                incrementDownload(sheet.id).catch(error => {
                                    console.error('Failed to record download:', error);
                                });
                                downloadCheatSheetAsPdf(sheet);
                            }} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                                <i className="fa-solid fa-file-pdf"></i> Download PDF
                            </button>
                            <button onClick={() => handleActionClick('Copy Content')} className="bg-surface hover:bg-surface-light text-text-primary font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                                <i className="fa-solid fa-copy"></i> Copy Content
                            </button>
                             <button onClick={() => handleActionClick('Share')} className="bg-surface hover:bg-surface-light text-text-primary font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                                <i className="fa-solid fa-share-alt"></i> Share
                            </button>
                        </div>
                    </div>

                    <p className="text-lg text-text-secondary mb-6">{sheet.description}</p>
                    
                    <div className="flex items-center justify-between border-y border-surface-light py-4 mb-8">
                        <div className="flex flex-wrap gap-2">
                            {sheet.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 text-sm bg-surface text-text-secondary rounded-full">{tag}</span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                           <button onClick={() => toggleFavorite(sheet.id)} className={`flex items-center gap-2 text-sm font-medium ${isFavorite ? 'text-pink-400' : 'text-text-secondary hover:text-white'}`}>
                                <i className={`fa-solid fa-heart ${isFavorite ? 'text-pink-500' : ''}`}></i> {isFavorite ? 'Favorited' : 'Favorite'}
                            </button>
                            <button onClick={() => handleActionClick('Delete')} className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-red-500">
                                <i className="fa-solid fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary mb-12">
                        <div className="flex items-center gap-2"><i className="fa-solid fa-user"></i>{sheet.author.name}</div>
                        <div className="flex items-center gap-2"><i className="fa-solid fa-eye"></i>{sheet.stats.views.toLocaleString()} views</div>
                        <div className="flex items-center gap-2"><i className="fa-solid fa-download"></i>{sheet.stats.downloads.toLocaleString()} downloads</div>
                        <div className="flex items-center gap-2"><i className="fa-solid fa-calendar-alt"></i>{new Date(sheet.createdAt).toLocaleDateString()}</div>
                    </div>


                    <div className="space-y-10">
                        {sheet.content.map(section => (
                            <div key={section.title}>
                                <h2 className="text-2xl font-bold text-accent mb-4 pb-2 border-b-2 border-surface">{section.title}</h2>
                                <div className="space-y-3">
                                    {section.commands.map(cmd => (
                                        <div key={cmd.command} className="bg-surface p-4 rounded-lg flex items-center justify-between hover:bg-surface-light transition-colors">
                                            <code className="text-sm md:text-base text-purple-300 bg-black/20 px-3 py-1 rounded">{cmd.command}</code>
                                            <p className="text-text-secondary text-right text-sm md:text-base">{cmd.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <aside>
                    <div className="sticky top-24">
                        <h3 className="text-xl font-bold mb-4 pb-2 border-b border-surface">Related Cheat Sheets</h3>
                        <div className="space-y-4">
                            {relatedSheets.length > 0 ? relatedSheets.map(related => (
                                <Link key={related.id} to={`/sheet/${related.id}`} className="block p-4 bg-surface rounded-lg hover:bg-surface-light transition-colors">
                                    <h4 className="font-semibold text-text-primary">{related.title}</h4>
                                    <p className="text-sm text-text-secondary">Quick reference guide</p>
                                </Link>
                            )) : <p className="text-sm text-text-secondary">No related sheets found.</p>}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CheatSheetDetail;
