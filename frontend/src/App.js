import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ListingsPage } from './components/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import './App.css'; // Optional: for global layout styling

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-container">
        <header className="app-header">
          <Link to="/" className="app-title">Property Directory</Link>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<ListingsPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;