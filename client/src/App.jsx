import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Search from './pages/Search';
import InfluencerProfile from './pages/InfluencerProfile';
import EditProfile from './pages/EditProfile';
import Campaigns from './pages/Campaigns';
import NewCampaign from './pages/NewCampaign';
import CampaignDetail from './pages/CampaignDetail';
import Dashboard from './pages/Dashboard';

function App() {
  const { user } = useAuth();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/auth"
              element={user ? <Navigate to="/dashboard" /> : <Auth />}
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute role="brand">
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/influencer/:id"
              element={
                <ProtectedRoute>
                  <InfluencerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute role="influencer">
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/new"
              element={
                <ProtectedRoute role="brand">
                  <NewCampaign />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/:id"
              element={
                <ProtectedRoute>
                  <CampaignDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;
