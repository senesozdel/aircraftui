import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AircraftList from './pages/AircraftList';
import PartList from './pages/PartList';
import ProducedAircraftList from './pages/ProducedAircraftList';
import CreatePart from './pages/CreatePart';
import CreateProducedAircraft from './pages/CreateProducedAircraft';
import TeamMates from './pages/TeamMate';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Herkese açık rotalar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Korumalı rotalar */}
          <Route path="/aircraft" element={
            <ProtectedRoute>
              <AircraftList />
            </ProtectedRoute>
          } />
          
          <Route path="/parts" element={
            <ProtectedRoute>
              <PartList />
            </ProtectedRoute>
          } />
          
          <Route path="/produced-aircraft" element={
            <ProtectedRoute>
              <ProducedAircraftList />
            </ProtectedRoute>
          } />
          
          <Route path="/create-part" element={
            <ProtectedRoute>
              <CreatePart />
            </ProtectedRoute>
          } />
          
          <Route path="/create-produced-aircraft" element={
            <ProtectedRoute>
              <CreateProducedAircraft />
            </ProtectedRoute>
          } />
          
          <Route path="/team" element={
            <ProtectedRoute>
              <TeamMates />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
