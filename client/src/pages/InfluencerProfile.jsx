import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getProfile } from '../api/profile';
import { addToShortlist, removeFromShortlist, getShortlist } from '../api/shortlist';
import { getMyCampaigns } from '../api/campaigns';
import Spinner from '../components/Spinner';

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

export default function InfluencerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getProfile(id);
        setProfile(data);

        if (user?.role === 'brand') {
          // Check shortlist status
          const shortlistRes = await getShortlist();
          const isInList = shortlistRes.data.some(
            (item) => (item.influencerId?._id || item.influencerId) === id
          );
          setIsShortlisted(isInList);

          // Load brand campaigns for invite
          const campaignRes = await getMyCampaigns();
          setCampaigns(campaignRes.data);
        }
      } catch {
        showToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleToggleShortlist = async () => {
    try {
      if (isShortlisted) {
        await removeFromShortlist(id);
        setIsShortlisted(false);
        showToast('Removed from shortlist', 'success');
      } else {
        await addToShortlist(id);
        setIsShortlisted(true);
        showToast('Added to shortlist ❤️', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update shortlist', 'error');
    }
  };

  const formatFollowers = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  if (loading) return <Spinner />;

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Profile not found</h2>
        <p className="text-gray-500 mt-2">This influencer hasn't set up their profile yet.</p>
      </div>
    );
  }

  const userData = profile.userId || {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header gradient */}
        <div className="h-32 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500" />

        <div className="px-6 sm:px-8 pb-8">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-start gap-6 -mt-12">
            <div className="flex-shrink-0">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={userData.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white shadow-lg">
                  {(userData.name || '?').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{userData.name || 'Unknown'}</h1>
                  {userData.email && (
                    <p className="text-gray-500 text-sm mt-0.5">{userData.email}</p>
                  )}
                </div>

                {user?.role === 'brand' && (
                  <button
                    onClick={handleToggleShortlist}
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                      isShortlisted
                        ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                        : 'bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:from-primary-600 hover:to-purple-700 shadow-md'
                    }`}
                    id="profile-shortlist-btn"
                  >
                    {isShortlisted ? '♥ Shortlisted' : '♡ Add to Shortlist'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {profile.niche && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Niche</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${nicheBadgeColors[profile.niche] || 'bg-gray-100 text-gray-700'}`}>
                  {profile.niche}
                </span>
              </div>
            )}
            {profile.platform && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Platform</p>
                <p className="font-semibold text-gray-900">
                  {platformIcons[profile.platform]} {profile.platform}
                </p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Followers</p>
              <p className="text-xl font-bold text-primary-600">{formatFollowers(profile.followerCount)}</p>
            </div>
            {profile.engagementRate > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Engagement</p>
                <p className="text-xl font-bold text-emerald-600">{profile.engagementRate}%</p>
              </div>
            )}
          </div>

          {/* Location & Socials */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-50">
            {profile.location && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{profile.location}</span>
              </div>
            )}

            {(profile.instagramUrl || profile.youtubeUrl) && (
              <div className="flex flex-wrap gap-2">
                {profile.instagramUrl && (
                  <a
                    href={profile.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all"
                  >
                    <span>📸 Instagram</span>
                  </a>
                )}
                {profile.youtubeUrl && (
                  <a
                    href={profile.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all"
                  >
                    <span>▶️ YouTube</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Invite to Campaign (brand only UI) */}
          {user?.role === 'brand' && campaigns.length > 0 && (
            <div className="mt-8 p-5 bg-primary-50 rounded-xl border border-primary-100">
              <h3 className="font-semibold text-gray-900 mb-3">Invite to Campaign</h3>
              <div className="flex gap-3">
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-gray-700"
                  id="invite-campaign-select"
                >
                  <option value="">Select a campaign...</option>
                  {campaigns.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (selectedCampaign) {
                      showToast('Invitation sent! (UI Demo)', 'success');
                    }
                  }}
                  disabled={!selectedCampaign}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  id="invite-btn"
                >
                  Invite
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
