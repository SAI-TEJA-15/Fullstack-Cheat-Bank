import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CheatSheetDetail from './pages/CheatSheetDetail';
import AddCheatSheet from './pages/AddCheatSheet';
import { cheatSheets as initialCheatSheets } from './data/mockData';
import { CheatSheet } from './types';
import Header from './components/Header';

export type NewCheatSheetPayload = Omit<CheatSheet, 'id' | 'stats' | 'createdAt'>;

export const AppContext = React.createContext<{
  favorites: number[];
  toggleFavorite: (id: number) => void;
  cheatSheets: CheatSheet[];
  addCheatSheet: (sheet: NewCheatSheetPayload) => void;
}>({
  favorites: [],
  toggleFavorite: () => {},
  cheatSheets: [],
  addCheatSheet: () => {},
});

const App: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [allCheatSheets, setAllCheatSheets] = useState<CheatSheet[]>(initialCheatSheets);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(id)) {
        return prevFavorites.filter(favId => favId !== id);
      } else {
        return [...prevFavorites, id];
      }
    });
  }, []);

  const addCheatSheet = useCallback((newSheetData: NewCheatSheetPayload) => {
    setAllCheatSheets(prevSheets => {
        const newSheet: CheatSheet = {
            ...newSheetData,
            id: Date.now(), // Use timestamp for a simple unique ID
            stats: { views: 0, downloads: 0 },
            createdAt: new Date().toISOString().split('T')[0],
        };
        return [newSheet, ...prevSheets];
    });
  }, []);

  return (
    <AppContext.Provider value={{ favorites, toggleFavorite, cheatSheets: allCheatSheets, addCheatSheet }}>
      <HashRouter>
        <div className="min-h-screen bg-background font-sans">
          <Header />
          <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sheet/:id" element={<CheatSheetDetail />} />
              <Route path="/add" element={<AddCheatSheet />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;