import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getCampaign, updateCampaignBrandInstagram } from '../api/campaigns';
import { apply, getCampaignApplications, updateStatus, getMyApplications } from '../api/applications';
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

const paymentBadgeColors = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Gift: 'bg-amber-100 text-amber-700',
  Commission: 'bg-sky-100 text-sky-700',
};

const platformIcons = {
  Instagram: '📸',
  TikTok: '🎵',
  YouTube: '▶️',
};

export default function CampaignDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [instagramInput, setInstagramInput] = useState('');
  const [savingInstagram, setSavingInstagram] = useState(false);

  const fetchCampaignData = async () => {
    try {
      const { data } = await getCampaign(id);
      setCampaign(data);
      setInstagramInput(data.brandInstagramUrl || '');

      if (user.role === 'brand') {
        const { data: appData } = await getCampaignApplications(id);
        setApplications(appData);
      } else if (user.role === 'influencer') {
        const { data: myApps } = await getMyApplications();
        const hasApplied = myApps.some((app) => (app.campaignId?._id || app.campaignId) === id);
        setApplied(hasApplied);
      }
    } catch {
      showToast('Failed to load campaign details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, [id, user]);

  const handleApply = async () => {
    try {
      await apply(id);
      setApplied(true);
      showToast('Applied successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to apply', 'error');
    }
  };

  const handleSaveInstagram = async (e) => {
    e.preventDefault();
    setSavingInstagram(true);
    try {
      const { data } = await updateCampaignBrandInstagram(id, instagramInput);
      setCampaign(data);
      setInstagramInput(data.brandInstagramUrl || '');
      showToast('Brand Instagram URL saved!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save Instagram URL', 'error');
    } finally {
      setSavingInstagram(false);
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await updateStatus(appId, status);
      showToast(`Application ${status}!`, 'success');
      fetchCampaignData(); // Reload applications list
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  if (loading) return <Spinner />;
  if (!campaign) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Campaign not found</h2>
        <button
          onClick={() => navigate('/campaigns')}
          className="mt-4 px-5 py-2.5 bg-primary-600 text-white rounded-xl"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  const brand = campaign.brandId || {};
  const brandName = brand.name || 'Unknown Brand';
  const brandInstagramUrl = campaign.brandInstagramUrl?.trim() || '';
  const isBrandOwner = user.role === 'brand' && String(brand._id) === String(user.id);
  const displayImage = campaign.imageUrl || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80`;

  const formatFollowers = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/campaigns')}
        className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600 font-semibold mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Campaigns
      </button>

      {/* Main Campaign Details Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image Cover */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={displayImage}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              {campaign.platform && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-1.5 text-gray-800">
                  {platformIcons[campaign.platform]} {campaign.platform}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Campaign details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{campaign.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {brandName.charAt(0).toUpperCase()}
                </div>
                {brandInstagramUrl ? (
                  <a
                    href={brandInstagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors"
                  >
                    {brandName}
                  </a>
                ) : (
                  <p className="text-sm text-gray-600 font-semibold">{brandName}</p>
                )}
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-400">Offer available: {campaign.locationRequirement}</span>
              </div>
            </div>

            {/* CTA action */}
            {user.role === 'influencer' && (
              <div>
                {applied ? (
                  <button disabled className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-xl shadow-md cursor-default flex items-center justify-center gap-2">
                    <span>Applied Successfully ✓</span>
                  </button>
                ) : (
                  <button
                    onClick={handleApply}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-bold hover:from-primary-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                    id="campaign-detail-apply"
                  >
                    Make collaboration proposal
                  </button>
                )}
              </div>
            )}

            {/* Offer details & Compensation list */}
            <div>
              <h3 className="font-bold text-gray-900 text-sm tracking-wider uppercase mb-3">What's present in this offer</h3>
              <div className="space-y-2.5">
                {campaign.budget > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-lg">💰</span>
                    <span>Paid offer: <strong className="text-gray-900">${campaign.budget.toLocaleString()} Budget</strong></span>
                  </div>
                )}
                {campaign.giftValue > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-lg">🎁</span>
                    <span>Gift value: <strong className="text-gray-900">${campaign.giftValue} value</strong></span>
                  </div>
                )}
                {campaign.commissionRate > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-lg">📈</span>
                    <span>Commission rate: <strong className="text-gray-900">{campaign.commissionRate}% Commission</strong></span>
                  </div>
                )}
                {campaign.paymentType && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-lg">💳</span>
                    <span>Payout type: <strong className="text-gray-900">{campaign.paymentType}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Creator requirements list */}
            <div className="pt-5 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm tracking-wider uppercase mb-3">Creator Requirements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span>🌍</span>
                  <span>Location: <strong className="text-gray-900">{campaign.locationRequirement}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>Min Followers: <strong className="text-gray-900">{formatFollowers(campaign.minFollowers)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔥</span>
                  <span>Min Engagement: <strong className="text-gray-900">{campaign.minEngagement}%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏷️</span>
                  <span>Niche target: <strong className="text-gray-900">{campaign.niche}</strong></span>
                </div>
              </div>
            </div>

            {/* Brand details */}
            <div className="pt-5 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm tracking-wider uppercase mb-3">About the Brand</h3>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {brandName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    {brandInstagramUrl ? (
                      <a
                        href={brandInstagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {brandName}
                      </a>
                    ) : (
                      <p className="font-bold text-gray-900">{brandName}</p>
                    )}
                    {brand.email && (
                      <p className="text-xs text-gray-500 mt-0.5">{brand.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  {brandInstagramUrl && (
                    <div className="flex items-center gap-2">
                      <span>📸</span>
                      <span>
                        Instagram:{' '}
                        <a
                          href={brandInstagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-primary-600 hover:text-primary-700 hover:underline break-all"
                        >
                          {brandInstagramUrl.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </span>
                    </div>
                  )}
                  {campaign.platform && (
                    <div className="flex items-center gap-2">
                      <span>{platformIcons[campaign.platform]}</span>
                      <span>
                        Campaign platform: <strong className="text-gray-900">{campaign.platform}</strong>
                      </span>
                    </div>
                  )}
                  {campaign.niche && (
                    <div className="flex items-center gap-2">
                      <span>🏷️</span>
                      <span>
                        Brand niche: <strong className="text-gray-900">{campaign.niche}</strong>
                      </span>
                    </div>
                  )}
                  {campaign.locationRequirement && (
                    <div className="flex items-center gap-2">
                      <span>🌍</span>
                      <span>
                        Available in: <strong className="text-gray-900">{campaign.locationRequirement}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {brandInstagramUrl && (
                  <a
                    href={brandInstagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all"
                  >
                    <span>📸 Visit {brandName} on Instagram</span>
                  </a>
                )}

                {isBrandOwner && (
                  <form onSubmit={handleSaveInstagram} className="pt-2 border-t border-gray-200">
                    <label htmlFor="brandInstagramUrl" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      {brandInstagramUrl ? 'Update Instagram URL' : 'Add Instagram URL'}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id="brandInstagramUrl"
                        type="url"
                        value={instagramInput}
                        onChange={(e) => setInstagramInput(e.target.value)}
                        placeholder="https://instagram.com/yourbrand"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={savingInstagram}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
                      >
                        {savingInstagram ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Offer Description */}
            <div className="pt-5 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm tracking-wider uppercase mb-2">Offer Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{campaign.description}</p>
            </div>

          </div>
        </div>
      </div>

      {/* Brand Applicants Section */}
      {user.role === 'brand' && (
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Applicants ({applications.length})</h2>

          {applications.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No one has applied to this campaign yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const influencer = app.influencerId || {};
                return (
                  <div
                    key={app._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                    id={`applicant-row-${app._id}`}
                  >
                    <div>
                      <Link
                        to={`/influencer/${influencer._id}`}
                        className="font-bold text-gray-900 text-lg hover:text-primary-600 transition-colors cursor-pointer block"
                      >
                        {influencer.name}
                      </Link>
                      <p className="text-sm text-gray-500">{influencer.email}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
                            id={`reject-btn-${app._id}`}
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'accepted')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-semibold transition-all shadow-sm"
                            id={`accept-btn-${app._id}`}
                          >
                            Accept
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          app.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {app.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
