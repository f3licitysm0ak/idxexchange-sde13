import React from 'react';
import { ListingsPage } from './components/ListingsPage';
import './App.css'; // Optional: for global layout styling

export function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Property Directory</h1>
      </header>
      <main className="app-content">
        <ListingsPage />
      </main>
    </div>
  );
}

export default App;