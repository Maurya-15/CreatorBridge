import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

export default function InfluencerCard({ influencer, isShortlisted, onToggleShortlist }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const profile = influencer;
  const userData = influencer.userId || {};
  const userId = userData._id || influencer.userId;

  const formatFollowers = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <div
      onClick={() => navigate(`/influencer/${typeof userId === 'object' ? userId : userId}`)}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-primary-200 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profile.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt={userData.name || 'Influencer'}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-100"
            />
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold ring-2 ring-primary-100">
              {(userData.name || '?').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg truncate group-hover:text-primary-600 transition-colors">
            {userData.name || 'Unknown'}
          </h3>

          <div className="flex flex-wrap gap-2 mt-2">
            {profile.niche && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nicheBadgeColors[profile.niche] || 'bg-gray-100 text-gray-700'}`}>
                {profile.niche}
              </span>
            )}
            {profile.platform && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {platformIcons[profile.platform]} {profile.platform}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-gray-700">{formatFollowers(profile.followerCount)}</span>
            </div>
            {profile.engagementRate > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="font-medium text-gray-700">{profile.engagementRate}%</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{profile.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Shortlist Heart */}
        {user?.role === 'brand' && onToggleShortlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist(typeof userId === 'object' ? userId : userId);
            }}
            className={`flex-shrink-0 p-2 rounded-full transition-all duration-200 ${
              isShortlisted
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-gray-300 hover:text-red-400 hover:bg-red-50'
            }`}
            id={`shortlist-btn-${userId}`}
          >
            <svg
              className="w-5 h-5"
              fill={isShortlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
