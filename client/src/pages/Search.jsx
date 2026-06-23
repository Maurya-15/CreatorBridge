import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import InfluencerCard from '../components/InfluencerCard';
import { useToast } from '../components/Toast';
import { addToShortlist, removeFromShortlist, getShortlist } from '../api/shortlist';

const API_URL = import.meta.env.VITE_API_URL;

export default function Search() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [filters, setFilters] = useState({
    niche: '',
    platform: '',
    minFollowers: '',
  });
  const { showToast } = useToast();

  const niches = ['Fashion', 'Tech', 'Food', 'Travel', 'Fitness', 'Beauty', 'Gaming'];
  const platforms = ['Instagram', 'TikTok', 'YouTube'];

  // Load shortlisted IDs on mount
  useEffect(() => {
    const loadShortlist = async () => {
      try {
        const { data } = await getShortlist();
        const ids = new Set(data.map((item) => item.influencerId?._id || item.influencerId));
        setShortlistedIds(ids);
      } catch {
        // silent fail
      }
    };
    loadShortlist();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('creatorbridge_token');
      const params = {};
      if (filters.niche) params.niche = filters.niche;
      if (filters.platform) params.platform = filters.platform;
      if (filters.minFollowers) params.minFollowers = filters.minFollowers;

      const { data } = await axios.get(`${API_URL}/api/influencers`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfluencers(data);
    } catch (err) {
      showToast('Failed to search influencers', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Search on mount
  useEffect(() => {
    handleSearch();
  }, []);

  const handleToggleShortlist = async (influencerId) => {
    try {
      if (shortlistedIds.has(influencerId)) {
        await removeFromShortlist(influencerId);
        setShortlistedIds((prev) => {
          const next = new Set(prev);
          next.delete(influencerId);
          return next;
        });
        showToast('Removed from shortlist', 'success');
      } else {
        await addToShortlist(influencerId);
        setShortlistedIds((prev) => new Set(prev).add(influencerId));
        showToast('Added to shortlist ❤️', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update shortlist', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Creators</h1>
        <p className="text-gray-500 mt-1">Discover the perfect influencers for your brand</p>
      </div>

      {/* Filter Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search-niche" className="block text-sm font-medium text-gray-700 mb-1.5">
              Niche
            </label>
            <select
              id="search-niche"
              value={filters.niche}
              onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-700 bg-white"
            >
              <option value="">All Niches</option>
              {niches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="search-platform" className="block text-sm font-medium text-gray-700 mb-1.5">
              Platform
            </label>
            <select
              id="search-platform"
              value={filters.platform}
              onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-700 bg-white"
            >
              <option value="">All Platforms</option>
              {platforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="search-followers" className="block text-sm font-medium text-gray-700 mb-1.5">
              Min Followers
            </label>
            <input
              id="search-followers"
              type="number"
              placeholder="e.g. 10000"
              value={filters.minFollowers}
              onChange={(e) => setFilters({ ...filters, minFollowers: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-700"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              id="search-btn"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <Spinner />
      ) : influencers.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No influencers found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {influencers.map((inf) => (
            <InfluencerCard
              key={inf._id}
              influencer={inf}
              isShortlisted={shortlistedIds.has(inf.userId?._id || inf.userId)}
              onToggleShortlist={handleToggleShortlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
