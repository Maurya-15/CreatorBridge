import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getProfile } from '../api/profile';
import { getMyCampaigns } from '../api/campaigns';
import { getMyApplications, getCampaignApplications } from '../api/applications';
import { getShortlist, removeFromShortlist } from '../api/shortlist';
import Spinner from '../components/Spinner';
import InfluencerCard from '../components/InfluencerCard';

const statusBadgeColors = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

const nicheBadgeColors = {
  Fashion: 'bg-pink-100 text-pink-700',
  Tech: 'bg-blue-100 text-blue-700',
  Food: 'bg-orange-100 text-orange-700',
  Travel: 'bg-teal-100 text-teal-700',
  Fitness: 'bg-red-100 text-red-700',
  Beauty: 'bg-purple-100 text-purple-700',
  Gaming: 'bg-green-100 text-green-700',
};

const platformIcons = {
  Instagram: '📸',
  TikTok: '🎵',
  YouTube: '▶️',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [appCounts, setAppCounts] = useState({});

  const loadBrandDashboard = async () => {
    try {
      const [campaignRes, shortlistRes] = await Promise.all([
        getMyCampaigns(),
        getShortlist(),
      ]);

      setCampaigns(campaignRes.data);
      setShortlist(shortlistRes.data);

      // Fetch applicant count for each campaign
      const counts = {};
      await Promise.all(
        campaignRes.data.map(async (c) => {
          try {
            const { data } = await getCampaignApplications(c._id);
            counts[c._id] = data.length;
          } catch {
            counts[c._id] = 0;
          }
        })
      );
      setAppCounts(counts);
    } catch (err) {
      showToast('Failed to load brand dashboard data', 'error');
    }
  };

  const loadInfluencerDashboard = async () => {
    try {
      const [appRes] = await Promise.all([getMyApplications()]);
      setApplications(appRes.data);

      // Profile details
      try {
        const profileRes = await getProfile(user.id);
        setProfile(profileRes.data);
      } catch {
        setProfile(null); // No profile yet
      }
    } catch (err) {
      showToast('Failed to load dashboard data', 'error');
    }
  };

  const loadData = async () => {
    setLoading(true);
    if (user.role === 'brand') {
      await loadBrandDashboard();
    } else {
      await loadInfluencerDashboard();
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleRemoveShortlist = async (influencerId) => {
    try {
      await removeFromShortlist(influencerId);
      setShortlist((prev) => prev.filter((item) => {
        const id = item.influencerId?._id || item.influencerId;
        return id !== influencerId;
      }));
      showToast('Removed from shortlist', 'success');
    } catch {
      showToast('Failed to remove from shortlist', 'error');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Row */}
      <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8">
        <h1 className="text-3xl font-extrabold">Welcome back, {user.name}!</h1>
        <p className="text-white/80 mt-1 font-medium">Role: {user.role === 'brand' ? '🏢 Brand' : '⭐ Influencer'}</p>
      </div>

      {user.role === 'brand' ? (
        /* BRAND DASHBOARD */
        <div className="space-y-8">
          {/* Campaigns Row */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">My Campaigns</h2>
              <button
                onClick={() => navigate('/campaigns/new')}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-purple-700 transition-all shadow-md"
                id="brand-new-campaign-dash"
              >
                + New Campaign
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">You haven't posted any campaigns yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => navigate(`/campaigns/${c._id}`)}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-primary-200 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500" />
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{c.title}</h3>
                    <div className="flex gap-2 mt-2">
                      {c.niche && (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nicheBadgeColors[c.niche] || 'bg-gray-100'}`}>
                          {c.niche}
                        </span>
                      )}
                      {c.platform && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {platformIcons[c.platform]} {c.platform}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-50">
                      <span className="text-xs text-gray-400">Applicants</span>
                      <span className="px-2 py-0.5 bg-primary-50 text-primary-600 font-bold rounded text-sm">
                        {appCounts[c._id] || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shortlisted Creators */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shortlisted Creators</h2>
            {shortlist.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">No shortlisted creators yet. Go to Search to add creators.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shortlist.map((item) => {
                  const infId = item.influencerId?._id || item.influencerId;
                  const profileData = item.profile || {};
                  return (
                    <div key={item._id} className="relative group">
                      <InfluencerCard
                        influencer={{
                          ...profileData,
                          userId: item.influencerId,
                        }}
                      />
                      <button
                        onClick={() => handleRemoveShortlist(infId)}
                        className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-red-50 text-red-500 rounded-full border border-gray-100 shadow-sm"
                        id={`dash-remove-shortlist-${infId}`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* INFLUENCER DASHBOARD */
        <div className="space-y-8">
          {/* Profile Overview Card */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Profile</h2>
            {profile ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  {profile.profileImageUrl ? (
                    <img
                      src={profile.profileImageUrl}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-100"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{profile.location || 'No location set'}</p>
                    <div className="flex gap-2 mt-1">
                      {profile.niche && (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${nicheBadgeColors[profile.niche] || 'bg-gray-100'}`}>
                          {profile.niche}
                        </span>
                      )}
                      {profile.platform && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {platformIcons[profile.platform]} {profile.platform}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="px-5 py-2.5 border-2 border-primary-100 text-primary-600 hover:border-primary-300 rounded-xl font-semibold transition-all self-start sm:self-auto"
                  id="dash-edit-profile-btn"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                <p className="text-gray-500 mb-4 font-medium">You haven't created your profile yet.</p>
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-md"
                  id="dash-create-profile-btn"
                >
                  Create Profile
                </button>
              </div>
            )}
          </div>

          {/* Applications list */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
              <button
                onClick={() => navigate('/campaigns')}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg font-semibold shadow-md"
                id="dash-browse-campaigns"
              >
                Browse Campaigns
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">You haven't applied to any campaigns yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/campaigns/${app.campaignId?._id || app.campaignId}`)}
                    >
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg hover:text-primary-600 transition-colors">
                          {app.campaignId?.title || 'Unknown Campaign'}
                        </h4>
                        <div className="flex gap-2 mt-1.5">
                          {app.campaignId?.niche && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {app.campaignId.niche}
                            </span>
                          )}
                          {app.campaignId?.platform && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {app.campaignId.platform}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${statusBadgeColors[app.status] || 'bg-gray-100'}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
