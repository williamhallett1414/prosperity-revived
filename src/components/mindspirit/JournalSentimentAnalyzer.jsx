import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function JournalSentimentAnalyzer({ userEmail }) {
  const [entries, setEntries] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(30); // days

  useEffect(() => {
    if (userEmail) {
      loadAndAnalyzeSentiments();
    }
  }, [userEmail, timeRange]);

  const loadAndAnalyzeSentiments = async () => {
    setIsLoading(true);
    try {
      const journalEntries = await base44.entities.JournalEntry.filter(
        { created_by: userEmail },
        '-created_date',
        100
      );

      // Filter by time range
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeRange);
      
      const filtered = journalEntries.filter(entry => {
        const entryDate = new Date(entry.created_date);
        return entryDate >= cutoffDate;
      });

      setEntries(filtered);
      
      // Prepare chart data (aggregate by date)
      const dateMap = {};
      filtered.forEach(entry => {
        const date = new Date(entry.created_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        if (!dateMap[date]) {
          dateMap[date] = { date, scores: [], count: 0 };
        }
        
        dateMap[date].scores.push(entry.sentiment_score || 0);
        dateMap[date].count += 1;
      });

      const data = Object.values(dateMap)
        .map(item => ({
          date: item.date,
          average: parseFloat((item.scores.reduce((a, b) => a + b, 0) / item.scores.length).toFixed(2)),
          count: item.count
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setChartData(data);
    } catch (error) {
      console.log('Loading sentiment analysis...');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTrend = () => {
    if (chartData.length < 2) return null;
    const recent = chartData.slice(-7);
    const older = chartData.slice(0, Math.max(1, chartData.length - 7));
    const recentAvg = recent.reduce((sum, d) => sum + d.average, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.average, 0) / older.length;
    return recentAvg - olderAvg;
  };

  const trend = calculateTrend();
  const avgSentiment = chartData.length > 0
    ? (chartData.reduce((sum, d) => sum + d.average, 0) / chartData.length).toFixed(2)
    : 0;

  const sentimentEmoji = {
    'very_negative': '😢',
    'negative': '😔',
    'neutral': '😐',
    'positive': '🙂',
    'very_positive': '😄'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#8a6e1a]" />
          Emotional Trends
        </h3>
        <div className="flex gap-2">
          {[7, 30, 90].map(days => (
            <Button
              key={days}
              variant={timeRange === days ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(days)}
            >
              {days}d
            </Button>
          ))}
        </div>
      </div>

      {chartData.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#FAD98D]/10 p-4 rounded-lg">
              <p className="text-xs text-gray-600">Average Sentiment</p>
              <p className="text-2xl font-bold text-[#8a6e1a]">{avgSentiment}</p>
              <p className="text-xs text-gray-500 mt-1">Scale: -1 to 1</p>
            </div>
            <div className="bg-[#F2F6FA] p-4 rounded-lg">
              <p className="text-xs text-gray-600">Entries</p>
              <p className="text-2xl font-bold text-[#3C4E53]">{entries.length}</p>
              <p className="text-xs text-gray-500 mt-1">Last {timeRange} days</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">Trend</p>
              <p className={`text-2xl font-bold ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{trend > 0 ? 'Improving' : trend < 0 ? 'Declining' : 'Stable'}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis domain={[-1, 1]} stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [value.toFixed(2), 'Sentiment']}
              />
              <Area type="monotone" dataKey="average" stroke="#a855f7" fillOpacity={1} fill="url(#colorAverage)" />
            </AreaChart>
          </ResponsiveContainer>

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Sentiment Guide:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Very Negative: -1 to -0.6</div>
              <div>Negative: -0.6 to -0.2</div>
              <div>Neutral: -0.2 to 0.2</div>
              <div>Positive: 0.2 to 0.6</div>
              <div>Very Positive: 0.6 to 1</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No journal entries in this time range. Start journaling to see your emotional trends!</p>
        </div>
      )}
    </motion.div>
  );
}