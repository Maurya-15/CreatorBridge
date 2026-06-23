import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getProfile, createProfile, updateProfile } from '../api/profile';
import Spinner from '../components/Spinner';

export default function EditProfile() {
  const { user, refreshProfileImage } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    niche: '',
    platform: '',
    followerCount: '',
    engagementRate: '',
    location: '',
    profileImageUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
  });

  const niches = ['Fashion', 'Tech', 'Food', 'Travel', 'Fitness', 'Beauty', 'Gaming'];
  const platforms = ['Instagram', 'TikTok', 'YouTube'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile(user.id);
        setFormData({
          bio: data.bio || '',
          niche: data.niche || '',
          platform: data.platform || '',
          followerCount: data.followerCount || '',
          engagementRate: data.engagementRate || '',
          location: data.location || '',
          profileImageUrl: data.profileImageUrl || '',
          instagramUrl: data.instagramUrl || '',
          youtubeUrl: data.youtubeUrl || '',
        });
        setIsNew(false);
      } catch {
        setIsNew(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

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
        setFormData((prev) => ({ ...prev, profileImageUrl: reader.result }));
        showToast('Avatar uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        followerCount: Number(formData.followerCount) || 0,
        engagementRate: Number(formData.engagementRate) || 0,
      };

      if (isNew) {
        await createProfile(payload);
        setIsNew(false);
      } else {
        await updateProfile(payload);
      }
      if (refreshProfileImage) {
        await refreshProfileImage(user.id);
      }
      showToast('Profile saved successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNew ? 'Create Your Profile' : 'Edit Profile'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isNew ? 'Set up your influencer profile to get discovered' : 'Update your profile information'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Profile Image Uploader */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Profile Image
          </label>
          <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-400 transition-colors">
            {formData.profileImageUrl ? (
              <img
                src={formData.profileImageUrl}
                alt="Profile Preview"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-100"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-image-input"
              />
              <label
                htmlFor="profile-image-input"
                className="inline-block px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
              >
                Upload Photo
              </label>
              <p className="text-xs text-gray-400 mt-1.5">PNG, JPG, or GIF up to 2MB.</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1.5">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
            placeholder="Tell brands about yourself..."
          />
        </div>

        {/* Niche & Platform */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1.5">
              Niche
            </label>
            <select
              id="niche"
              name="niche"
              value={formData.niche}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-700 bg-white"
            >
              <option value="">Select niche</option>
              {niches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1.5">
              Primary Platform
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-700 bg-white"
            >
              <option value="">Select platform</option>
              {platforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Followers & Engagement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="followerCount" className="block text-sm font-medium text-gray-700 mb-1.5">
              Follower Count
            </label>
            <input
              id="followerCount"
              name="followerCount"
              type="number"
              value={formData.followerCount}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
              placeholder="e.g. 50000"
            />
          </div>

          <div>
            <label htmlFor="engagementRate" className="block text-sm font-medium text-gray-700 mb-1.5">
              Engagement Rate (%)
            </label>
            <input
              id="engagementRate"
              name="engagementRate"
              type="number"
              step="0.1"
              value={formData.engagementRate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
              placeholder="e.g. 4.5"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
            placeholder="e.g. New York, USA"
          />
        </div>

        {/* Social Media Details */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Social Media Links</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
                Instagram Profile URL
              </label>
              <input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                placeholder="https://instagram.com/username"
              />
            </div>

            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
                YouTube Channel URL
              </label>
              <input
                id="youtubeUrl"
                name="youtubeUrl"
                type="url"
                value={formData.youtubeUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                placeholder="https://youtube.com/@channel"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          id="save-profile-btn"
        >
          {saving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            isNew ? 'Create Profile' : 'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
}
