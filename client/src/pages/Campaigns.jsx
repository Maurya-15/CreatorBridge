import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getAllCampaigns } from '../api/campaigns';
import { apply, getMyApplications } from '../api/applications';
import CampaignCard from '../components/CampaignCard';
import Spinner from '../components/Spinner';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [appliedCampaignIds, setAppliedCampaignIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaignsAndApplications = async () => {
      try {
        const { data: campaignData } = await getAllCampaigns();
        setCampaigns(campaignData);

        if (user?.role === 'influencer') {
          const { data: appData } = await getMyApplications();
          const appliedIds = new Set(
            appData.map((app) => app.campaignId?._id || app.campaignId)
          );
          setAppliedCampaignIds(appliedIds);
        }
      } catch (err) {
        showToast('Failed to load campaigns', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignsAndApplications();
  }, [user]);

  const handleApply = async (campaignId) => {
    try {
      await apply(campaignId);
      setAppliedCampaignIds((prev) => {
        const next = new Set(prev);
        next.add(campaignId);
        return next;
      });
      showToast('Applied successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to apply', 'error');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-1">Explore current collaboration opportunities</p>
        </div>
        {user?.role === 'brand' && (
          <button
            onClick={() => navigate('/campaigns/new')}
            className="px-5 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg self-start sm:self-auto"
            id="new-campaign-btn"
          >
            + Create Campaign
          </button>
        )}
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No campaigns available</h3>
          <p className="text-gray-500 mt-1">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const hasApplied = appliedCampaignIds.has(campaign._id);
            return (
              <CampaignCard
                key={campaign._id}
                campaign={campaign}
                hasApplied={user?.role === 'influencer' ? hasApplied : undefined}
                onApply={user?.role === 'influencer' ? () => handleApply(campaign._id) : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
