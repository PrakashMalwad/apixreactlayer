import React from 'react';
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import HowToUsePage from './components/Dash/HowToUsePage';
import ProtectedRoute from './routes/protectedRoutes';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-to-use" element={<HowToUsePage />} />
          <Route path="/dashboard" element={

            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;