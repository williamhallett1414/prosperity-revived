import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Moon, Sun, Monitor, Bell, User, Palette, Trash2, Play, Database, ChevronRight, RotateCcw, Clock, AlertTriangle } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TIMEZONES } from '@/utils/localDate';
import { toast } from 'sonner';
const AppTour = lazy(() => import('@/components/onboarding/AppTour'));
const ReminderSettings = lazy(() => import('@/components/settings/ReminderSettings'));
const ManageMyData = lazy(() => import('@/components/settings/ManageMyData'));
const GideonNotificationSettings = lazy(() => import('@/components/settings/GideonNotificationSettings'));
const DailyReflectionSettings = lazy(() => import('@/components/settings/DailyReflectionSettings'));
const HannahNotificationSettings = lazy(() => import('@/components/settings/HannahNotificationSettings'));
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Label } from '@/components/ui/label';
const CoachDavidNotificationSettings = lazy(() => import('@/components/settings/CoachDavidNotificationSettings'));
const ChefDanielNotificationSettings = lazy(() => import('@/components/settings/ChefDanielNotificationSettings'));
const ChatbotPersonalitySettings = lazy(() => import('@/components/settings/ChatbotPersonalitySettings'));

class SettingsErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6 text-center">
          <p className="text-lg font-bold text-[#0A1A2F] dark:text-white mb-2">Something went wrong</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Settings encountered an error.</p>
          <button onClick={() => { this.setState({ error: null }); }} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function SettingsInner() {
  const [user, setUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const queryClient = useQueryClient();

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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">
      {/* Header */}
      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3C4E53] to-[#AFC7E3] flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white">Settings</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Customize your experience</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Chatbot Personalities */}
        <div className="bg-white dark:bg-white/5 dark:bg-[#0A1A2F] rounded-2xl p-4 shadow-sm dark:shadow-none mb-4">
          <Suspense fallback={<div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"/></div>}><ChatbotPersonalitySettings user={user} /></Suspense>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-white/5 dark:bg-[#0A1A2F] rounded-2xl p-4 shadow-sm dark:shadow-none mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-[#c9a227]" />
            <h2 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">Appearance</h2>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors min-h-[44px] ${
                user.theme === 'light' 
                  ? 'border-[#c9a227] bg-[#c9a227]/10' 
                  : 'border-gray-200 dark:border-white/10 dark:border-gray-700 hover:border-[#c9a227]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-[#c9a227]" />
                <span className="font-medium text-[#0A1A2F] dark:text-white dark:text-white">Light Mode</span>
              </div>
              {user.theme === 'light' && (
                <div className="w-5 h-5 rounded-full bg-[#c9a227] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white dark:bg-white/5 rounded-full" />
                </div>
              )}
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors min-h-[44px] ${
                user.theme === 'dark' 
                  ? 'border-[#c9a227] bg-[#c9a227]/10' 
                  : 'border-gray-200 dark:border-white/10 dark:border-gray-700 hover:border-[#c9a227]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#AFC7E3]" />
                <span className="font-medium text-[#0A1A2F] dark:text-white dark:text-white">Dark Mode</span>
              </div>
              {user.theme === 'dark' && (
                <div className="w-5 h-5 rounded-full bg-[#c9a227] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white dark:bg-white/5 rounded-full" />
                </div>
              )}
            </button>

            <button
              onClick={() => handleThemeChange('auto')}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors min-h-[44px] ${
                user.theme === 'auto' 
                  ? 'border-[#c9a227] bg-[#c9a227]/10' 
                  : 'border-gray-200 dark:border-white/10 dark:border-gray-700 hover:border-[#c9a227]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300" />
                <span className="font-medium text-[#0A1A2F] dark:text-white dark:text-white">Auto (System)</span>
              </div>
              {user.theme === 'auto' && (
                <div className="w-5 h-5 rounded-full bg-[#c9a227] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white dark:bg-white/5 rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Hannah Notifications */}
        <div className="mb-4">
          <Suspense fallback={<div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"/></div>}><HannahNotificationSettings user={user} /></Suspense>
        </div>

        {/* Gideon Daily Greetings */}
        <div className="mb-4">
          <Suspense fallback={<div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"/></div>}><GideonNotificationSettings /></Suspense>
        </div>

        {/* Gideon Proactive Engagement */}
        <div className="mb-4">
          <Suspense fallback={<div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"/></div>}><DailyReflectionSettings /></Suspense>
        </div>

        {/* Coach David Notifications */}
        <div className="mb-4">
          <Suspense fallback={<div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"/></div>}><CoachDavidNotificationSettings user={user} /></Suspense>
        </div>

        {/* Chef Daniel Notifications */}
        <div className="mb-4">
          <Suspense fallback={<div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"/></div>}><ChefDanielNotificationSettings user={user} /></Suspense>
        </div>

        {/* Reminders */}
        <div className="bg-white dark:bg-white/5 dark:bg-[#0A1A2F] rounded-2xl p-4 shadow-sm dark:shadow-none mb-4">
          <Suspense fallback={<div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"/></div>}><ReminderSettings /></Suspense>
        </div>

        {/* Timezone & Daily Reset */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-[#c9a227]" />
            <h2 className="font-semibold text-[#0A1A2F] dark:text-white">Timezone & Daily Reset</h2>
          </div>

          <div className="space-y-4">
            {/* Timezone */}
            <div>
              <label className="text-xs font-medium text-[#0A1A2F]/60 dark:text-white/60 mb-1.5 block">Your Timezone</label>
              <select
                value={localStorage.getItem('user_timezone') || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    localStorage.setItem('user_timezone', e.target.value);
                  } else {
                    localStorage.removeItem('user_timezone');
                  }
                  updateUser.mutate({ timezone: e.target.value || null });
                }}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-[#0A1A2F] dark:text-white min-h-[44px]"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/35 mt-1">Controls when your daily logs reset</p>
            </div>

            {/* Daily Reset Hour */}
            <div>
              <label className="text-xs font-medium text-[#0A1A2F]/60 dark:text-white/60 mb-1.5 block">Daily Reset Time</label>
              <select
                value={localStorage.getItem('daily_reset_hour') || '0'}
                onChange={(e) => {
                  localStorage.setItem('daily_reset_hour', e.target.value);
                  updateUser.mutate({ daily_reset_hour: parseInt(e.target.value) });
                }}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-[#0A1A2F] dark:text-white min-h-[44px]"
              >
                <option value="0">12:00 AM (Midnight)</option>
                <option value="1">1:00 AM</option>
                <option value="2">2:00 AM</option>
                <option value="3">3:00 AM</option>
                <option value="4">4:00 AM</option>
                <option value="5">5:00 AM</option>
                <option value="6">6:00 AM</option>
              </select>
              <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/35 mt-1">Workouts, meals, and journals reset at this time each day</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-white/5 dark:bg-[#0A1A2F] rounded-2xl p-4 shadow-sm dark:shadow-none mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-[#c9a227]" />
            <h2 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-[#0A1A2F] dark:text-white dark:text-white">Push Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">Get notified about updates</p>
              </div>
              <Switch
                checked={user.notifications_enabled ?? true}
                onCheckedChange={(checked) => updateUser.mutate({ notifications_enabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-[#0A1A2F] dark:text-white dark:text-white">Email Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">Receive updates via email</p>
              </div>
              <Switch
                checked={user.email_notifications ?? true}
                onCheckedChange={(checked) => updateUser.mutate({ email_notifications: checked })}
              />
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white dark:bg-white/5 dark:bg-[#0A1A2F] rounded-2xl p-4 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-[#c9a227]" />
            <h2 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">Account</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">Email</span>
              <span className="font-medium text-[#0A1A2F] dark:text-white dark:text-white">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">Member Since</span>
              <span className="font-medium text-[#0A1A2F] dark:text-white dark:text-white">
                {user.created_date ? new Date(user.created_date).toLocaleDateString() : '—'}
              </span>
            </div>
            
            <button
              onPointerDown={() => setShowTour(true)}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-gray-800 transition-colors min-h-[44px] w-full text-left"
            >
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">
                <Play className="w-4 h-4 text-[#FD9C2D]" />
                Replay App Tour
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            </button>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('launchGuidedTour', { detail: { steps: null } }))}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-gray-800 transition-colors min-h-[44px] w-full text-left"
            >
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">
                <Play className="w-4 h-4 text-[#38BDF8]" />
                Interactive Guided Tour
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            </button>

            <button
              onClick={async () => {
                localStorage.removeItem('age_verified');
                localStorage.removeItem('onboarding_done');
                await base44.auth.updateMe({ onboarding_completed: null, age_group: null }).catch(() => {});
                toast.success('Onboarding reset — reloading…');
                setTimeout(() => window.location.reload(), 1000);
              }}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-gray-800 transition-colors min-h-[44px] w-full text-left"
            >
              <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <RotateCcw className="w-4 h-4" />
                Reset Onboarding (Dev)
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            </button>

            <Link
              to={createPageUrl('TermsAndConditions')}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
            >
              <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">Terms & Conditions</span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            </Link>
            
            <Link
              to={createPageUrl('PrivacyPolicy')}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
            >
              <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">Privacy Policy</span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            </Link>
            
            <Link
              to={createPageUrl('HealthWellnessWaiver')}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
            >
              <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">Health & Wellness Waiver</span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            </Link>
            
            <Link
              to={createPageUrl('SubscriptionTerms')}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
            >
              <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">Subscription Terms</span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            </Link>

            <Link
              to={createPageUrl('PrivacyPolicy')}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
            >
              <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">Do Not Sell My Personal Information</span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            </Link>
          </div>

          {/* ── Manage My Data ──────────────────────────────────────────── */}
          <div className="mt-6 mb-1">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#C9A227]" />
              <h2 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">Manage My Data</h2>
            </div>
          </div>
          <Suspense fallback={<div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"/></div>}><ManageMyData user={user} /></Suspense>

          <Button
            onClick={() => {
              try {
                base44.auth.logout('/');
              } catch {
                window.location.href = '/';
              }
            }}
            variant="outline"
            className="w-full mt-4 border-red-200 text-red-600 hover:bg-red-50 dark:bg-red-900/20 dark:border-red-900 dark:hover:bg-red-950 min-h-[44px]"
          >
            Sign Out
          </Button>

          <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-3 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 min-h-[44px]"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-[#0A1A2F] border border-red-200 dark:border-red-900">
                <AlertDialogHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <AlertDialogTitle className="text-[#0A1A2F] dark:text-white">Delete Account Permanently?</AlertDialogTitle>
                  </div>
                  <AlertDialogDescription className="text-[#0A1A2F]/60 dark:text-white/60 text-sm leading-relaxed">
                    This will permanently erase <span className="font-semibold text-red-600 dark:text-red-400">all your data</span> — posts, reading plans, workout logs, journal entries, achievements, and points. <br /><br />
                    <strong className="text-[#0A1A2F] dark:text-white">This action cannot be undone.</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="min-h-[44px]">Keep My Account</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white min-h-[44px]"
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
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Deleting…' : 'Yes, Delete Everything'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
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

export default function Settings() {
  return <SettingsErrorBoundary><SettingsInner /></SettingsErrorBoundary>;
}