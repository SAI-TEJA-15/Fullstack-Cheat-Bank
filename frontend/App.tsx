import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CheatSheetDetail from './pages/CheatSheetDetail';
import AddCheatSheet from './pages/AddCheatSheet';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { CheatSheet, User } from './types';
import Header from './components/Header';
import { fetchApprovedCheatSheets, fetchCurrentUser, getCurrentUserFromStorage, isAuthenticated, logout } from './services/apiService';

export const AppContext = React.createContext<{
  favorites: number[];
  toggleFavorite: (id: number) => void;
  cheatSheets: CheatSheet[];
  setCheatSheets: React.Dispatch<React.SetStateAction<CheatSheet[]>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshCheatSheets: () => Promise<void>;
  authChecked: boolean;
}>({
  favorites: [],
  toggleFavorite: () => {},
  cheatSheets: [],
  setCheatSheets: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  refreshCheatSheets: async () => {},
  authChecked: false,
});

const App: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [allCheatSheets, setAllCheatSheets] = useState<CheatSheet[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUserFromStorage());
  const [authChecked, setAuthChecked] = useState(false);

  const toggleFavorite = (id: number) => {
    setFavorites(prevFavorites => (
      prevFavorites.includes(id)
        ? prevFavorites.filter(favId => favId !== id)
        : [...prevFavorites, id]
    ));
  };

  const refreshCheatSheets = async () => {
    try {
      const sheets = await fetchApprovedCheatSheets();
      setAllCheatSheets(sheets);
    } catch (error) {
      console.error('Failed to fetch cheat sheets:', error);
    }
  };

  useEffect(() => {
    refreshCheatSheets();
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      if (!isAuthenticated()) {
        setCurrentUser(null);
        setAuthChecked(true);
        return;
      }

      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to restore session:', error);
        logout();
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    };

    restoreSession();
  }, []);

  const contextValue = useMemo(() => ({
    favorites,
    toggleFavorite,
    cheatSheets: allCheatSheets,
    setCheatSheets: setAllCheatSheets,
    currentUser,
    setCurrentUser,
    refreshCheatSheets,
    authChecked,
  }), [favorites, allCheatSheets, currentUser, authChecked]);

  return (
    <AppContext.Provider value={contextValue}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppContext.Provider>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const shouldShowHeader = !isAuthPage;

  return (
    <div className="min-h-screen bg-background font-sans">
      {shouldShowHeader && <Header />}
      <main className={!isAuthPage ? "px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/sheet/:id" element={<ProtectedRoute><CheatSheetDetail /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddCheatSheet /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
          
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;

