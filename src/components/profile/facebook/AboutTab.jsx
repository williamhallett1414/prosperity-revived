import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

export default function AboutTab({ user }) {
  const [editingBio, setEditingBio] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [goal, setGoal] = useState(user?.spiritual_goal || '');
  const [loading, setLoading] = useState(false);

  const handleBioSave = async () => {
    setLoading(true);
    try {
      await base44.auth.updateMe({ bio });
      setEditingBio(false);
      window.location.reload();
    } catch (error) {
      console.error('Error saving bio:', error);
    }
    setLoading(false);
  };

  const handleGoalSave = async () => {
    setLoading(true);
    try {
      await base44.auth.updateMe({ spiritual_goal: goal });
      setEditingGoal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Bio Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Bio</h2>
          {!editingBio && (
            <Button variant="ghost" size="sm" onClick={() => setEditingBio(true)}>
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {editingBio ? (
          <div className="space-y-3">
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="min-h-24"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleBioSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingBio(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 whitespace-pre-wrap">
            {bio || 'No bio yet'}
          </p>
        )}
      </div>

      {/* Spiritual Goal Section */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h2 className="text-xl font-bold text-gray-900">Spiritual Goal</h2>
          </div>
          {!editingGoal && (
            <Button variant="ghost" size="sm" onClick={() => setEditingGoal(true)}>
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {editingGoal ? (
          <div className="space-y-3">
            <Textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Share your spiritual goal for accountability..."
              className="min-h-24"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleGoalSave}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingGoal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 whitespace-pre-wrap">
            {goal || 'No spiritual goal set yet'}
          </p>
        )}
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-gray-900 font-medium">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-gray-900 font-medium">
              {user?.created_date ? new Date(user.created_date).toLocaleDateString() : 'Recently'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Account Role</p>
            <p className="text-gray-900 font-medium capitalize">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}