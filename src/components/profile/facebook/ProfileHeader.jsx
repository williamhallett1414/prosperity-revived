import React, { useState } from 'react';
import { Camera, Loader2, MessageCircle, UserPlus, Sparkles } from 'lucide-react';
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
      setUploadingCover(false);
    }
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
      setUploadingProfile(false);
    }
  };

  return (
    <div className="bg-white shadow-sm">
      {/* Cover Photo */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
        {user?.cover_image_url ?
        <img
          src={user.cover_image_url}
          alt="Cover"
          className="w-full h-full object-cover" /> :


        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        <label className="absolute bottom-4 right-4 bg-white rounded-lg px-4 py-2.5 shadow-lg cursor-pointer hover:bg-gray-50 transition-all flex items-center gap-2 hover:shadow-xl">
          <Camera className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-semibold text-gray-800">
            {uploadingCover ? 'Uploading...' : 'Edit Cover'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
            disabled={uploadingCover} />

        </label>
      </div>

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="pt-10 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20">
          {/* Profile Picture & Name */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:gap-5 mb-4 sm:mb-0">
            <div className="relative mb-4 sm:mb-0 mx-auto sm:mx-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                {user?.profile_image_url ?
                <img
                  src={user.profile_image_url}
                  alt={user?.full_name}
                  className="w-full h-full object-cover" /> :


                <div className="w-full h-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                }
              </div>
              
              <label className="absolute bottom-1 right-1 bg-white rounded-full p-2.5 shadow-lg cursor-pointer hover:bg-gray-50 transition-all hover:scale-105">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileUpload}
                  className="hidden"
                  disabled={uploadingProfile} />

              </label>
            </div>

            <div className="text-center sm:text-left pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {user?.full_name || 'User'}
              </h1>
              <p className="text-gray-600 font-medium text-sm sm:text-base">{friendsCount} {friendsCount === 1 ? 'friend' : 'friends'}</p>
              {user?.bio &&
              <p className="text-gray-600 text-sm mt-2 max-w-md leading-relaxed">{user.bio}</p>
              }
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center sm:justify-end flex-wrap">
            <Link to={createPageUrl('Messages')}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 shadow-sm hover:shadow-md transition-all">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </Link>
            <Button variant="outline" className="px-5 py-2.5 border-2 hover:bg-gray-50 font-medium shadow-sm hover:shadow-md transition-all">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
          </div>
        </div>

        {/* Status/Goal Section */}
        {(user?.status_message || user?.spiritual_goal) &&
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 pt-4 pb-3">

            <div className="max-w-3xl mx-auto sm:mx-0">
              {user?.status_message &&
            <p className="text-gray-700 text-center sm:text-left mb-3 italic text-sm sm:text-base">
                  "{user.status_message}"
                </p>
            }
              {user?.spiritual_goal &&
            <div className="flex items-start gap-2.5 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    <span className="font-bold text-gray-900">Spiritual Goal:</span> {user.spiritual_goal}
                  </p>
                </div>
            }
            </div>
          </motion.div>
        }
      </div>
    </div>);

}