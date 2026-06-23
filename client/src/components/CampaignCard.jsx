import { useNavigate } from 'react-router-dom';

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

export default function CampaignCard({ campaign, hasApplied, onApply }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const brandName = campaign.brandId?.name || 'Unknown Brand';
  const displayImage = campaign.imageUrl || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3`;

  // Dynamic compensation text
  const getCompensationText = () => {
    const parts = [];
    if (campaign.budget) parts.push(`$${campaign.budget.toLocaleString()}`);
    if (campaign.giftValue) parts.push(`$${campaign.giftValue} Gift`);
    if (campaign.commissionRate) parts.push(`${campaign.commissionRate}% Comm.`);
    return parts.length > 0 ? parts.join(' + ') : 'Collaboration';
  };

  return (
    <div
      onClick={() => navigate(`/campaigns/${campaign._id}`)}
      className="bg-white rounded-2xl border border-gray-100 hover:shadow-2xl hover:border-primary-200 transition-all duration-300 cursor-pointer group flex flex-col overflow-hidden"
      id={`campaign-card-${campaign._id}`}
    >
      {/* Campaign Image Cover */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <img
          src={displayImage}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Platform overlay tag */}
        {campaign.platform && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 text-gray-800">
            {platformIcons[campaign.platform]} {campaign.platform}
          </div>
        )}
        {/* Niche tag */}
        {campaign.niche && (
          <div className="absolute bottom-3 left-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${nicheBadgeColors[campaign.niche] || 'bg-white text-gray-800'}`}>
              {campaign.niche}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Campaign Title */}
          <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
            {campaign.title}
          </h3>

          {/* Brand Info & Apply button */}
          <div className="flex items-center justify-between gap-2 mt-3 mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {brandName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-600 truncate">{brandName}</span>
            </div>
            {onApply !== undefined && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply();
                }}
                disabled={hasApplied}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex-shrink-0 ${
                  hasApplied
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200'
                }`}
              >
                {hasApplied ? 'Applied ✓' : 'Apply'}
              </button>
            )}
          </div>
        </div>

        {/* Footer info (Compensation + date) */}
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">COMPENSATION</span>
            <span className="text-sm font-bold text-primary-600 mt-0.5">{getCompensationText()}</span>
          </div>
          <div className="text-right">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${paymentBadgeColors[campaign.paymentType] || 'bg-gray-100'}`}>
              {campaign.paymentType}
            </span>
            <p className="text-[10px] text-gray-400 mt-1">{formatDate(campaign.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
