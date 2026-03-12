import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Download, Pencil, Trash2, ChevronDown, ChevronUp,
  Check, Mail, ExternalLink, Shield
} from 'lucide-react';
import { toast } from 'sonner';

const SUPPORT_EMAIL = 'Prosperityrevived2025@gmail.com';

const DATA_CATEGORIES = [
  { icon: '👤', label: 'Profile & Account', items: ['Name, email, date of birth, biological sex', 'Fitness goals, fitness level, equipment', 'Age group confirmed at sign-up'] },
  { icon: '📓', label: 'Journals & Mood', items: ['Gratitude journal entries', 'Weekly reflections', 'Emotional check-in logs', 'Mindset reset sessions', 'Prayer journal entries'] },
  { icon: '💪', label: 'Health & Fitness', items: ['Workout logs and sessions', 'Body measurements (height, weight, goals)', 'Nutrition and food logs', 'Water intake logs', 'Progress photos'] },
  { icon: '🙏', label: 'Faith & Bible', items: ['Bible reading plan progress', 'Verse bookmarks and highlights', 'Bible study notes', 'Devotional completion records'] },
  { icon: '🤖', label: 'AI Conversations', items: ['Chat history with Gideon, Hannah, Coach David, Chef Daniel, Coach Paul', 'Conversation context used for personalization'] },
  { icon: '🌐', label: 'Community', items: ['Posts and comments', 'Group memberships', 'AI-generated blog posts'] },
];

const RIGHTS = [
  {
    icon: Download,
    color: '#38BDF8',
    title: 'Access & Export',
    desc: 'Request a copy of all personal data we hold about you.',
    subject: 'Data Access Request — Prosperity Revived',
    body: `Hi,\n\nI am requesting a copy of all personal data you hold about my account.\n\nAccount email: [your email here]\n\nPlease send the data export to this email address.\n\nThank you.`,
  },
  {
    icon: Pencil,
    color: '#C9A227',
    title: 'Correct My Data',
    desc: 'Request a correction to any inaccurate personal information.',
    subject: 'Data Correction Request — Prosperity Revived',
    body: `Hi,\n\nI am requesting a correction to my personal data.\n\nAccount email: [your email here]\n\nData to correct:\n- Field: [e.g., date of birth]\n- Current value: [incorrect value]\n- Correct value: [correct value]\n\nThank you.`,
  },
  {
    icon: Trash2,
    color: '#EF4444',
    title: 'Delete My Data',
    desc: 'Request deletion of your personal data (separate from account deletion).',
    subject: 'Data Deletion Request — Prosperity Revived',
    body: `Hi,\n\nI am requesting deletion of my personal data.\n\nAccount email: [your email here]\n\nData to delete (check all that apply):\n[ ] All personal data\n[ ] Journal entries only\n[ ] AI conversation history only\n[ ] Progress photos only\n[ ] Other: [specify]\n\nThank you.`,
  },
  {
    icon: Shield,
    color: '#A78BFA',
    title: 'Object / Restrict',
    desc: 'Object to processing or request restriction of certain data uses (GDPR right).',
    subject: 'Data Processing Objection — Prosperity Revived',
    body: `Hi,\n\nI am exercising my right to object to / restrict processing of my personal data.\n\nAccount email: [your email here]\n\nDetails of my request:\n[Describe what processing you object to and why]\n\nThank you.`,
  },
];

function RequestCard({ right, onSend }) {
  const [open, setOpen] = useState(false);
  const Icon = right.icon;

  const handleEmailOpen = () => {
    const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(right.subject)}&body=${encodeURIComponent(right.body)}`;
    window.open(mailtoLink, '_blank');
    toast.success('Email client opened — fill in your details and send.');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${right.color}18` }}
        >
          <Icon className="w-4 h-4" style={{ color: right.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0A1A2F]">{right.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{right.desc}</p>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-50 space-y-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                We'll respond within <strong>30 days</strong> (or 72 hours for breaches). Under GDPR and CCPA you have the right to make this request at no charge.
              </p>
              <button
                onClick={handleEmailOpen}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-white transition-opacity hover:opacity-90"
                style={{ background: right.color }}
              >
                <Mail className="w-4 h-4" />
                Send Request via Email
                <ExternalLink className="w-3 h-3 opacity-70" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ManageMyData({ user }) {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="space-y-5">

      {/* What we hold */}
      <div>
        <button
          className="w-full flex items-center justify-between py-2 text-left"
          onClick={() => setShowCategories(v => !v)}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">What We Store</p>
          {showCategories
            ? <ChevronUp className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />
          }
        </button>

        <AnimatePresence>
          {showCategories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-2">
                {DATA_CATEGORIES.map(cat => (
                  <div key={cat.label} className="bg-[#F2F6FA] rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{cat.icon}</span>
                      <p className="text-xs font-bold text-[#0A1A2F]">{cat.label}</p>
                    </div>
                    <ul className="space-y-0.5">
                      {cat.items.map(item => (
                        <li key={item} className="text-xs text-gray-500 flex gap-1.5">
                          <span className="text-gray-300 mt-px">·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Your rights */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Data Rights</p>
        <div className="space-y-2">
          {RIGHTS.map(r => (
            <RequestCard key={r.title} right={r} />
          ))}
        </div>
      </div>

      {/* Quick note */}
      <div className="bg-[#F2F6FA] rounded-2xl p-4 flex gap-3">
        <Check className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-[#0A1A2F] mb-0.5">Your data is never sold</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            We never sell your personal information or use your health data, journals, or prayer logs for advertising.
            You can delete your entire account and all data from the button below at any time.
          </p>
        </div>
      </div>

      {/* Terms accepted date */}
      {user?.terms_accepted_at && (
        <p className="text-[10px] text-center text-gray-400">
          Terms accepted {new Date(user.terms_accepted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {user.terms_version ? ` (v${user.terms_version})` : ''}
        </p>
      )}
    </div>
  );
}
