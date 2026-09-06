import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ListingsPage } from './components/ListingsPage';
import { FavoritesProvider, useFavorites } from './hooks/useFavorites';
import { FavoritesPage } from './pages/FavoritesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import './App.css';

function AppShell() {
  const { favoriteIds } = useFavorites();

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="app-title">Property Directory</Link>
        <nav className="app-nav" aria-label="Main navigation">
          <Link to="/favorites" className="favorites-link">
            Favorites {favoriteIds.length > 0 ? `(${favoriteIds.length})` : ''}
          </Link>
        </nav>
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <FavoritesProvider>
      <ErrorBoundary>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppShell />
        </BrowserRouter>
      </ErrorBoundary>
    </FavoritesProvider>
  );
}

export default App;