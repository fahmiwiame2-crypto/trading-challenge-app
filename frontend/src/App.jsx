import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Checkout from './pages/Checkout';
import MarketWatch from './pages/MarketWatch';
import PropAcademy from './pages/PropAcademy';
import MyChallenges from './pages/MyChallenges';
import CourseDetail from './pages/CourseDetail';
import Overview from './pages/Overview';
import Settings from './pages/Settings';
import Community from './pages/Community';
import NewsHub from './pages/NewsHub';
import Loader from './components/Loader';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = window.location;

    if (loading) return <Loader />;

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

import AdminPanel from './pages/AdminPanel';
import { Toaster } from './components/ui/sonner';
import CertificateView from './pages/CertificateView';

import { AuroraBackground } from './components/ui/AuroraBackground';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Toaster />
                <AuroraBackground>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/market" element={<MarketWatch />} />
                        <Route path="/academy" element={<PropAcademy />} />
                        <Route path="/academy/:courseId" element={<CourseDetail />} />
                        <Route path="/certificate/:id" element={<CertificateView />} />
                        <Route path="/challenges" element={<MyChallenges />} />
                        <Route path="/overview" element={<Overview />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/news-hub" element={<NewsHub />} />

                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <Checkout />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminPanel />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </AuroraBackground>
            </AuthProvider>
        </Router>
    );
};

export default App;
