import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Moon, Sun, Monitor, Bell, Mail, User, Palette, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Label } from '@/components/ui/label';
import ReminderSettings from '@/components/settings/ReminderSettings';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const updateUser = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      base44.auth.me().then(setUser);
    }
  });

  const handleThemeChange = (theme) => {
    updateUser.mutate({ theme });
    applyTheme(theme);
  };

  const applyTheme = (theme) => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'auto' && systemDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (user?.theme) {
      applyTheme(user.theme);
    }
  }, [user?.theme]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] text-white px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to={createPageUrl('Profile')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-[#c9a227]" />
            <h2 className="font-semibold text-[#1a1a2e] dark:text-white">Appearance</h2>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors min-h-[44px] ${
                user.theme === 'light' 
                  ? 'border-[#c9a227] bg-[#c9a227]/10' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-[#c9a227]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-[#c9a227]" />
                <span className="font-medium text-[#1a1a2e] dark:text-white">Light Mode</span>
              </div>
              {user.theme === 'light' && (
                <div className="w-5 h-5 rounded-full bg-[#c9a227] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors min-h-[44px] ${
                user.theme === 'dark' 
                  ? 'border-[#c9a227] bg-[#c9a227]/10' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-[#c9a227]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#8fa68a]" />
                <span className="font-medium text-[#1a1a2e] dark:text-white">Dark Mode</span>
              </div>
              {user.theme === 'dark' && (
                <div className="w-5 h-5 rounded-full bg-[#c9a227] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>

            <button
              onClick={() => handleThemeChange('auto')}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors min-h-[44px] ${
                user.theme === 'auto' 
                  ? 'border-[#c9a227] bg-[#c9a227]/10' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-[#c9a227]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-[#1a1a2e] dark:text-white">Auto (System)</span>
              </div>
              {user.theme === 'auto' && (
                <div className="w-5 h-5 rounded-full bg-[#c9a227] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm mb-4">
          <ReminderSettings />
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-[#c9a227]" />
            <h2 className="font-semibold text-[#1a1a2e] dark:text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-[#1a1a2e] dark:text-white">Push Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about updates</p>
              </div>
              <Switch
                checked={user.notifications_enabled ?? true}
                onCheckedChange={(checked) => updateUser.mutate({ notifications_enabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-[#1a1a2e] dark:text-white">Email Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
              </div>
              <Switch
                checked={user.email_notifications ?? true}
                onCheckedChange={(checked) => updateUser.mutate({ email_notifications: checked })}
              />
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-[#c9a227]" />
            <h2 className="font-semibold text-[#1a1a2e] dark:text-white">Account</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Email</span>
              <span className="font-medium text-[#1a1a2e] dark:text-white">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Member Since</span>
              <span className="font-medium text-[#1a1a2e] dark:text-white">
                {new Date(user.created_date).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Button
            onClick={() => base44.auth.logout()}
            variant="outline"
            className="w-full mt-4 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950 min-h-[44px]"
          >
            Sign Out
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-3 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950 min-h-[44px]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-[#2d2d4a]">
              <AlertDialogHeader>
                <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="dark:text-gray-400">
                  This action cannot be undone. This will permanently delete your account
                  and remove all of your data from our servers, including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All your posts and comments</li>
                    <li>Reading plans and progress</li>
                    <li>Workout and meditation logs</li>
                    <li>Journal entries and bookmarks</li>
                    <li>Achievements and points</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="min-h-[44px]">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 min-h-[44px]"
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      await base44.auth.deleteAccount();
                      window.location.href = '/';
                    } catch (error) {
                      console.error('Failed to delete account:', error);
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}