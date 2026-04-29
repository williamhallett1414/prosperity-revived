import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Shield, Trash2, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ModerationPanel({ user }) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('pending');
  const isAdmin = user?.role === 'admin' || user?.is_admin;

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports', filter],
    queryFn: async () => {
      try {
        if (!base44.entities.Report) return [];
        const all = await base44.entities.Report.filter(
          filter === 'all' ? {} : { status: filter }
        );
        return all || [];
      } catch { return []; }
    },
    enabled: !!isAdmin,
    retry: false,
  });

  const { data: flaggedPosts = [] } = useQuery({
    queryKey: ['flaggedPosts'],
    queryFn: async () => {
      try {
        if (!base44.entities.CommunityPost) return [];
        return await base44.entities.CommunityPost.filter({ is_flagged: true }) || [];
      } catch { return []; }
    },
    enabled: !!isAdmin,
    retry: false,
  });

  const resolveReport = useMutation({
    mutationFn: async ({ reportId, action }) => {
      if (!base44.entities.Report) return;
      await base44.entities.Report.update(reportId, {
        status: action, // 'resolved', 'dismissed'
        reviewed_by: user.email,
        reviewed_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
      toast.success('Report updated');
    },
    onError: () => toast.error('Failed to update report'),
  });

  const deletePost = useMutation({
    mutationFn: async (postId) => {
      if (!base44.entities.CommunityPost) return;
      await base44.entities.CommunityPost.delete(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['flaggedPosts']);
      queryClient.invalidateQueries(['communityPosts']);
      toast.success('Post removed');
    },
    onError: () => toast.error('Failed to delete post'),
  });

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-gray-300 dark:text-gray-400 dark:text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-300 font-semibold">Admin access required</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-[#c9a227]" />
        <h2 className="font-bold text-[#0A1A2F] dark:text-white text-lg">Moderation Dashboard</h2>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['pending', 'resolved', 'dismissed', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
              filter === f ? 'bg-[#0A1A2F] text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-300'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-lg font-black text-amber-600">{reports.filter(r => r.status === 'pending').length}</p>
          <p className="text-[10px] text-amber-600/60 font-bold">Pending</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-lg font-black text-red-500">{flaggedPosts.length}</p>
          <p className="text-[10px] text-red-500/60 font-bold">Flagged Posts</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-lg font-black text-green-600">{reports.filter(r => r.status === 'resolved').length}</p>
          <p className="text-[10px] text-green-600/60 font-bold">Resolved</p>
        </div>
      </div>

      {/* Reports list */}
      {isLoading ? (
        <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-300">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-300">No {filter} reports</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <motion.div key={report.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm dark:shadow-none">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0A1A2F] dark:text-white dark:text-white">
                    Report #{report.id?.slice(-6)} · <span className="capitalize text-amber-600">{report.status || 'pending'}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">
                    Reason: {report.reason || 'User flagged'} · By: {report.reporter_email || 'Anonymous'}
                  </p>
                  {report.post_id && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-300 mt-0.5">Post: {report.post_id}</p>
                  )}
                </div>
              </div>
              {report.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => resolveReport.mutate({ reportId: report.id, action: 'resolved' })}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-green-50 text-green-600 text-xs font-bold">
                    <CheckCircle className="w-3 h-3" /> Resolve
                  </button>
                  <button
                    onClick={() => resolveReport.mutate({ reportId: report.id, action: 'dismissed' })}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-300 text-xs font-bold">
                    <Eye className="w-3 h-3" /> Dismiss
                  </button>
                  {report.post_id && (
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this post permanently?')) {
                          deletePost.mutate(report.post_id);
                          resolveReport.mutate({ reportId: report.id, action: 'resolved' });
                        }
                      }}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-red-50 text-red-500 text-xs font-bold">
                      <Trash2 className="w-3 h-3" /> Delete Post
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}