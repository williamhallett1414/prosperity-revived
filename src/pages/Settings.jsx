import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Moon, Sun, Monitor, Bell, User, Palette, Trash2, Play, Database, ChevronRight, Bot } from 'lucide-react';
import { toast } from 'sonner';
const AppTour = lazy(() => import('@/components/onboarding/AppTour'));
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Label } from '@/components/ui/label';
import ReminderSettings from '@/components/settings/ReminderSettings';
import ManageMyData from '@/components/settings/ManageMyData';
import GideonNotificationSettings from '@/components/settings/GideonNotificationSettings';
import DailyReflectionSettings from '@/components/settings/DailyReflectionSettings';
import HannahNotificationSettings from '@/components/settings/HannahNotificationSettings';
import CoachDavidNotificationSettings from '@/components/settings/CoachDavidNotificationSettings';
import ChefDanielNotificationSettings from '@/components/settings/ChefDanielNotificationSettings';
import ChatbotPersonalitySettings from '@/components/settings/ChatbotPersonalitySettings';
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
  const [showTour, setShowTour] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const updateUser = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      base44.auth.me().then(setUser).catch(() => {});
    },
    onError: () => toast.error('Failed to save — please try again'),
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

  const tabs = [
    { id: 'appearance', label: '🎨 Appearance', icon: Palette },
    { id: 'ai', label: '🤖 AI Coaches', icon: Bot },
    { id: 'notifications', label: '🔔 Notifications', icon: Bell },
    { id: 'account', label: '👤 Account', icon: User },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-[#131C2E] border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3C4E53] to-[#AFC7E3] flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white">Settings</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-gray-400">Customize your experience</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-[60px] z-30 bg-white dark:bg-[#131C2E] border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="max-w-lg mx-auto flex px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max py-3 px-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#c9a227] text-[#c9a227]'
                  : 'border-transparent text-[#0A1A2F]/50 dark:text-gray-400 hover:text-[#0A1A2F] dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto">
        {/* APPEARANCE TAB */}
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            {/* Theme Settings */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-5 h-5 text-[#c9a227]" />
                <h2 className="font-semibold text-[#0A1A2F] dark:text-white">Theme</h2>
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
                    <span className="font-medium text-[#0A1A2F] dark:text-white">Light Mode</span>
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
                    <Moon className="w-5 h-5 text-[#AFC7E3]" />
                    <span className="font-medium text-[#0A1A2F] dark:text-white">Dark Mode</span>
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
                    <span className="font-medium text-[#0A1A2F] dark:text-white">Auto (System)</span>
                  </div>
                  {user.theme === 'auto' && (
                    <div className="w-5 h-5 rounded-full bg-[#c9a227] flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI COACHES TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <ChatbotPersonalitySettings user={user} />
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {/* Hannah Notifications */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <HannahNotificationSettings user={user} />
            </div>

            {/* Gideon Daily Greetings */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <GideonNotificationSettings />
            </div>

            {/* Daily Reflection */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <DailyReflectionSettings />
            </div>

            {/* Coach David Notifications */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <CoachDavidNotificationSettings user={user} />
            </div>

            {/* Chef Daniel Notifications */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <ChefDanielNotificationSettings user={user} />
            </div>

            {/* Reminders */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <ReminderSettings />
            </div>

            {/* General Notifications */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-[#c9a227]" />
                <h2 className="font-semibold text-[#0A1A2F] dark:text-white">General Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-[#0A1A2F] dark:text-white">Push Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about updates</p>
                  </div>
                  <Switch
                    checked={user.notifications_enabled ?? true}
                    onCheckedChange={(checked) => updateUser.mutate({ notifications_enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-[#0A1A2F] dark:text-white">Email Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={user.email_notifications ?? true}
                    onCheckedChange={(checked) => updateUser.mutate({ email_notifications: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNT TAB */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-[#c9a227]" />
                <h2 className="font-semibold text-[#0A1A2F] dark:text-white">Account Info</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Email</span>
                  <span className="font-medium text-[#0A1A2F] dark:text-white">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="font-medium text-[#0A1A2F] dark:text-white">
                    {user.created_date ? new Date(user.created_date).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tours */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold text-[#0A1A2F] dark:text-white mb-3">Help & Tours</h2>
              
              <div className="space-y-2">
                <button
                  onPointerDown={() => setShowTour(true)}
                  className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px] text-left"
                >
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Play className="w-4 h-4 text-[#FD9C2D]" />
                    Replay App Tour
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('launchGuidedTour', { detail: { steps: null } }))}
                  className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px] text-left"
                >
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Play className="w-4 h-4 text-[#38BDF8]" />
                    Guided Tour
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Legal */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold text-[#0A1A2F] dark:text-white mb-3">Legal</h2>
              
              <div className="space-y-2">
                <Link
                  to={createPageUrl('TermsAndConditions')}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
                >
                  <span className="text-gray-600 dark:text-gray-400">Terms & Conditions</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <Link
                  to={createPageUrl('PrivacyPolicy')}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
                >
                  <span className="text-gray-600 dark:text-gray-400">Privacy Policy</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <Link
                  to={createPageUrl('HealthWellnessWaiver')}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
                >
                  <span className="text-gray-600 dark:text-gray-400">Health & Wellness Waiver</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <Link
                  to={createPageUrl('SubscriptionTerms')}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
                >
                  <span className="text-gray-600 dark:text-gray-400">Subscription Terms</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  to={createPageUrl('PrivacyPolicy')}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
                >
                  <span className="text-gray-600 dark:text-gray-400">Do Not Sell My Data</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Manage My Data */}
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-[#C9A227]" />
                <h2 className="font-semibold text-[#0A1A2F] dark:text-white">Manage My Data</h2>
              </div>
              <ManageMyData user={user} />
            </div>

            {/* Sign Out & Delete */}
            <div className="space-y-2">
              <Button
                onClick={() => { base44.auth.logout().catch(() => { toast.error('Failed to sign out'); }); }}
                variant="outline"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-900 dark:hover:bg-orange-950 min-h-[44px]"
              >
                Sign Out
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950 min-h-[44px]"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-[#0A1A2F]">
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
                    <AlertDialogCancel className="min-h-[44px] dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700 min-h-[44px]"
                      onClick={async () => {
                        setIsDeleting(true);
                        try {
                          await base44.auth.deleteAccount();
                          window.location.href = '/';
                        } catch {
                          toast.error('Failed to delete account — please try again');
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
        )}
      </div>

      {showTour && (
        <Suspense fallback={null}>
          <AppTour
            userName={user?.full_name?.split(' ')[0]}
            onComplete={() => setShowTour(false)}
          />
        </Suspense>
      )}
    </div>
  );
}