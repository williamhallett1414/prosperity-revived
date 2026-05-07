import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import InterestsGoalsEditor from '@/components/profile/InterestsGoalsEditor';
import { toast } from 'sonner';
import { getNameInputValue } from '@/lib/userName';

export default function AboutTab({ user, onUserUpdate }) {
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [name, setName] = useState(getNameInputValue(user));
  const [bio, setBio] = useState(typeof user?.bio === 'string' ? user.bio : '');
  const [loading, setLoading] = useState(false);

  // Keep local state in sync when user loads asynchronously after first render
  useEffect(() => {
    if (!editingName) setName(getNameInputValue(user));
  }, [user?.full_name, editingName]);
  useEffect(() => {
    if (!editingBio) setBio(typeof user?.bio === 'string' ? user.bio : '');
  }, [user?.bio, editingBio]);

  const handleNameSave = async () => {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      toast.error('Please enter a name');
      return;
    }
    setLoading(true);
    try {
      // Save the name AND mark it as user-set. The name_set_by_user flag
      // tells the userName.js helpers to trust this name verbatim, even
      // if it contains digits/dots/underscores that would normally be
      // flagged as an auto-derived email prefix. Without this flag, names
      // like "Will1414" or "william.hallett" appear to save successfully
      // but get filtered out by the display heuristic.
      await base44.auth.updateMe({ full_name: trimmed, name_set_by_user: true });
      setEditingName(false);
      toast.success('Name updated');
      // Refresh the user object via the parent so the Profile header updates
      // without a full page reload.
      try {
        const updated = await base44.auth.me();
        onUserUpdate?.(updated);
      } catch {}
    } catch (error) {
      console.error('Error saving name:', error);
      toast.error('Could not save name — please try again');
    }
    setLoading(false);
  };

  const handleBioSave = async () => {
    setLoading(true);
    try {
      await base44.auth.updateMe({ bio });
      setEditingBio(false);
      toast.success('Bio updated');
      try {
        const updated = await base44.auth.me();
        onUserUpdate?.(updated);
      } catch {}
    } catch (error) {
      console.error('Error saving bio:', error);
      toast.error('Could not save bio — please try again');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Name Section */}
      <div className="bg-white dark:bg-white/5 rounded-lg shadow-sm dark:shadow-none p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Name</h2>
          {!editingName && (
            <Button variant="ghost" size="sm" onClick={() => setEditingName(true)}>
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {editingName ? (
          <div className="space-y-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              autoFocus
              maxLength={60}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleNameSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save
              </Button>
              <Button variant="outline" onClick={() => { setEditingName(false); setName(getNameInputValue(user)); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-900 dark:text-white font-medium">
            {getNameInputValue(user) || <span className="text-gray-400 dark:text-gray-500 italic font-normal">No name set — tap the pencil to add one</span>}
          </p>
        )}
      </div>

      {/* Bio Section */}
      <div className="bg-white dark:bg-white/5 rounded-lg shadow-sm dark:shadow-none p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bio</h2>
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
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
            {bio || 'No bio yet'}
          </p>
        )}
      </div>

      {/* Interests & Goals */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 px-2">Interests & Goals</h2>
        <InterestsGoalsEditor user={user} />
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-white/5 rounded-lg shadow-sm dark:shadow-none p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
            <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white dark:bg-white/5 rounded-lg shadow-sm dark:shadow-none p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Member Since</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {user?.created_date ? new Date(user.created_date).toLocaleDateString() : 'Recently'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Account Role</p>
            <p className="text-gray-900 dark:text-white font-medium capitalize">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}