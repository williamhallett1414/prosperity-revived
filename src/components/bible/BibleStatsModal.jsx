import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, TrendingUp, CheckCircle, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function BibleStatsModal({ isOpen, onClose, statType, progress, bookmarks }) {
  const totalDaysRead = progress.reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...progress.map(p => p.longest_streak || 0), 0);

  // Last 30 days reading data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const daysReadOnDate = progress.filter(p => 
      p.completion_dates?.some(d => d.startsWith(dateStr))
    ).length;
    
    return {
      date: format(date, 'MMM dd'),
      count: daysReadOnDate
    };
  });

  // Reading by plan
  const planData = progress.map(p => ({
    name: p.plan_name?.substring(0, 15) + (p.plan_name?.length > 15 ? '...' : ''),
    days: p.completed_days?.length || 0
  })).sort((a, b) => b.days - a.days).slice(0, 5);

  // Bookmarks over time
  const bookmarkData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const count = bookmarks.filter(b => 
      b.created_date?.startsWith(dateStr)
    ).length;
    
    return {
      date: format(date, 'MMM dd'),
      count
    };
  });

  const renderContent = () => {
    switch (statType) {
      case 'days_read':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D] rounded-2xl p-6 text-white">
              <BookOpen className="w-12 h-12 mb-3" />
              <p className="text-5xl font-bold mb-2">{totalDaysRead}</p>
              <p className="text-white/80">Total Days Read</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Last 30 Days Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last30Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#FD9C2D" 
                      strokeWidth={2} 
                      dot={{ fill: '#FD9C2D', r: 3 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Top Plans</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={planData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <Bar dataKey="days" fill="#FD9C2D" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'streak':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#3C4E53] to-[#FD9C2D] rounded-2xl p-6 text-white">
              <TrendingUp className="w-12 h-12 mb-3" />
              <p className="text-5xl font-bold mb-2">{longestStreak}</p>
              <p className="text-white/80">Longest Streak (Days)</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {progress.slice(0, 4).map((p, i) => (
                <div key={i} className="bg-gray-50 dark:bg-[#2d2d4a] rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{p.plan_name}</p>
                  <p className="text-2xl font-bold text-[#FD9C2D]">{p.longest_streak || 0}</p>
                  <p className="text-xs text-gray-500">days</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Consistency Tips</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/10 rounded-lg p-3">
                  <Calendar className="w-5 h-5 text-[#FD9C2D] mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">Set a Daily Time</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Pick the same time each day for reading</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/10 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-[#FD9C2D] mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">Start Small</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Even 5 minutes counts toward your streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bookmarks':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#FAD98D] to-[#FD9C2D] rounded-2xl p-6 text-white">
              <CheckCircle className="w-12 h-12 mb-3" />
              <p className="text-5xl font-bold mb-2">{bookmarks.length}</p>
              <p className="text-white/80">Saved Verses</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Bookmarks Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookmarkData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <Bar dataKey="count" fill="#FAD98D" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Bookmarks</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {bookmarks.slice(0, 5).map((bookmark, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-[#2d2d4a] rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {bookmark.book_name} {bookmark.chapter_number}:{bookmark.verse_number}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {bookmark.verse_text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const titles = {
    days_read: 'Days Read Progress',
    streak: 'Reading Streak Stats',
    bookmarks: 'Saved Verses'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{titles[statType]}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}