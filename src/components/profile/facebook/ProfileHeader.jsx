import React, { useState } from 'react';
import { Camera, Loader2, MessageCircle, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProfileHeader({ user, friendsCount, userProgress }) {
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ cover_image_url: file_url });
      window.location.reload();
    } catch (error) {
      console.error('Upload failed', error);
    }
    setUploadingCover(false);
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_image_url: file_url });
      window.location.reload();
    } catch (error) {
      console.error('Upload failed', error);
    }
    setUploadingProfile(false);
  };

  return (
    <>
      {/* Cover Photo */}
      <div className="relative h-80 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden group">
        {user?.cover_image_url ? (
          <img src={user.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
          id="cover-upload"
        />
        
        <button
          onClick={() => document.getElementById('cover-upload').click()}
          disabled={uploadingCover}
          className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-900 rounded-full p-3 shadow-lg transition-all flex items-center gap-2 px-4"
        >
          {uploadingCover ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Camera className="w-5 h-5" />
              <span className="text-sm font-medium">Edit Cover</span>
            </>
          )}
        </button>

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Profile Info Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-24 pb-6 relative z-10">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-white shadow-lg border-4 border-white">
              {user?.profile_image_url ? (
                <img src={user.profile_image_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-5xl font-bold text-white">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleProfileUpload}
              className="hidden"
              id="profile-upload"
            />

            <button
              onClick={() => document.getElementById('profile-upload').click()}
              disabled={uploadingProfile}
              className="absolute bottom-0 right-0 bg-white hover:bg-gray-100 text-gray-900 rounded-full p-2 shadow-lg transition-all"
            >
              {uploadingProfile ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Name and Basic Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">{user?.full_name || 'User'}</h1>
            <p className="text-gray-600 mt-1">{friendsCount} Friends</p>
            
            {/* Bio */}
            {user?.bio && (
              <p className="text-gray-700 mt-3 max-w-2xl">{user.bio}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link to={createPageUrl('Messages')}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Friend
            </Button>
          </div>
        </div>

        {/* Status/Spiritual Goal */}
        {user?.status_message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500"
          >
            <p className="text-sm text-gray-700"><strong>Status:</strong> {user.status_message}</p>
          </motion.div>
        )}

        {user?.spiritual_goal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 rounded-lg p-4 mb-6 border-l-4 border-purple-500"
          >
            <p className="text-sm text-gray-700"><strong>🎯 Spiritual Goal:</strong> {user.spiritual_goal}</p>
          </motion.div>
        )}
      </div>
    </>
  );
}