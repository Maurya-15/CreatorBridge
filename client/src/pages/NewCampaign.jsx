import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { createCampaign } from '../api/campaigns';

export default function NewCampaign() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    niche: '',
    platform: '',
    paymentType: '',
    budget: '',
    locationRequirement: 'Worldwide',
    minFollowers: '',
    minEngagement: '',
    giftValue: '',
    commissionRate: '',
    imageUrl: '',
    brandInstagramUrl: '',
  });

  const niches = ['Fashion', 'Tech', 'Food', 'Travel', 'Fitness', 'Beauty', 'Gaming'];
  const platforms = ['Instagram', 'TikTok', 'YouTube'];
  const paymentTypes = ['Paid', 'Gift', 'Commission'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
        showToast('Image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : undefined,
        minFollowers: formData.minFollowers ? Number(formData.minFollowers) : 0,
        minEngagement: formData.minEngagement ? Number(formData.minEngagement) : 0,
        giftValue: formData.giftValue ? Number(formData.giftValue) : 0,
        commissionRate: formData.commissionRate ? Number(formData.commissionRate) : 0,
      };

      await createCampaign(payload);
      showToast('Campaign created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create campaign', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post New Campaign</h1>
        <p className="text-gray-500 mt-1">Start collaborating with creators by describing your project</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
            Campaign Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
            placeholder="e.g. Summer Fashion Collection Launch"
          />
        </div>

        {/* Campaign Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Campaign Image
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-400 transition-colors">
            {formData.imageUrl ? (
              <img
                src={formData.imageUrl}
                alt="Campaign Preview"
                className="w-24 h-24 rounded-lg object-cover ring-2 ring-primary-100"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                📸
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="campaign-image-input"
              />
              <label
                htmlFor="campaign-image-input"
                className="inline-block px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
              >
                Upload File
              </label>
              <p className="text-xs text-gray-400 mt-1.5">PNG, JPG, or GIF up to 2MB.</p>
            </div>
          </div>
        </div>

        {/* Brand Instagram */}
        <div>
          <label htmlFor="brandInstagramUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
            Brand Instagram URL
          </label>
          <input
            id="brandInstagramUrl"
            name="brandInstagramUrl"
            type="url"
            value={formData.brandInstagramUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
            placeholder="https://instagram.com/yourbrand"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
            placeholder="Describe your requirements, deliverables, and targets..."
          />
        </div>

        {/* Niche & Platform */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1.5">
              Niche Target
            </label>
            <select
              id="niche"
              name="niche"
              required
              value={formData.niche}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-700 bg-white"
            >
              <option value="">Select Niche</option>
              {niches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1.5">
              Target Platform
            </label>
            <select
              id="platform"
              name="platform"
              required
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-700 bg-white"
            >
              <option value="">Select Platform</option>
              {platforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Type & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-1.5">
              Payment Model
            </label>
            <select
              id="paymentType"
              name="paymentType"
              required
              value={formData.paymentType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-700 bg-white"
            >
              <option value="">Select Model</option>
              {paymentTypes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1.5">
              Budget ($ USD)
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
              placeholder="e.g. 500 (Optional)"
            />
          </div>
        </div>

        {/* Extra compensation values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="giftValue" className="block text-sm font-medium text-gray-700 mb-1.5">
              Gift Value ($ USD)
            </label>
            <input
              id="giftValue"
              name="giftValue"
              type="number"
              value={formData.giftValue}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
              placeholder="e.g. 100"
            />
          </div>

          <div>
            <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-1.5">
              Commission Rate (%)
            </label>
            <input
              id="commissionRate"
              name="commissionRate"
              type="number"
              value={formData.commissionRate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
              placeholder="e.g. 15"
            />
          </div>
        </div>

        {/* Creator Requirements Header */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Creator Requirements</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="locationRequirement" className="block text-sm font-medium text-gray-700 mb-1.5">
                Location Requirement
              </label>
              <input
                id="locationRequirement"
                name="locationRequirement"
                type="text"
                value={formData.locationRequirement}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                placeholder="e.g. Worldwide, US, UK"
              />
            </div>

            <div>
              <label htmlFor="minFollowers" className="block text-sm font-medium text-gray-700 mb-1.5">
                Min Followers
              </label>
              <input
                id="minFollowers"
                name="minFollowers"
                type="number"
                value={formData.minFollowers}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                placeholder="e.g. 1000"
              />
            </div>

            <div>
              <label htmlFor="minEngagement" className="block text-sm font-medium text-gray-700 mb-1.5">
                Min Engagement (%)
              </label>
              <input
                id="minEngagement"
                name="minEngagement"
                type="number"
                step="0.1"
                value={formData.minEngagement}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                placeholder="e.g. 2.5"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            id="create-campaign-submit"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              'Publish Campaign'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
