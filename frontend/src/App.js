import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import BootScreen from './components/BootScreen';
import DockDashboard from './components/DockDashboard';
import './App.css';

function App() {
  const [booted, setBooted] = useState(false);

  return (
    <Router>
      <div className="App" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
        {!booted && <BootScreen onComplete={() => setBooted(true)} />}
        <Routes>
          <Route path="/" element={<DockDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
