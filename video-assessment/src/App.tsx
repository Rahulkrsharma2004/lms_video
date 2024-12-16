// App.tsx
import React from 'react';
import LMS from './components/LMSPage';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">LMS-Video-System</h1>
      </header>
      <main className="p-4">
        <LMS />
      </main>
    </div>
  );
};

export default App;
