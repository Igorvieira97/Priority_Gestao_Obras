import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Obras from './pages/Obras';
import Materiais from './pages/Materiais';
import Pessoas from './pages/Pessoas';
import Financeiro from './pages/Financeiro';
import InstallApp from './pages/InstallApp';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';

const MainLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route: Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Wrapped in Layout) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/obras" element={<Obras />} />
          <Route path="/materiais" element={<Materiais />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/instalar-app" element={<InstallApp />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;