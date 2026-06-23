import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getProfile } from '../api/profile';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshProfileImage = async (userId) => {
    if (!userId) {
      setProfileImageUrl('');
      return;
    }
    try {
      const { data } = await getProfile(userId);
      setProfileImageUrl(data.profileImageUrl || '');
    } catch {
      setProfileImageUrl('');
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('creatorbridge_token');
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setToken(savedToken);
        } else {
          localStorage.removeItem('creatorbridge_token');
        }
      } catch {
        localStorage.removeItem('creatorbridge_token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.role === 'influencer') {
      refreshProfileImage(user.id);
    } else {
      setProfileImageUrl('');
    }
  }, [user]);

  const login = (newToken) => {
    localStorage.setItem('creatorbridge_token', newToken);
    const decoded = jwtDecode(newToken);
    setUser(decoded);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('creatorbridge_token');
    setUser(null);
    setToken(null);
    setProfileImageUrl('');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, profileImageUrl, refreshProfileImage, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
