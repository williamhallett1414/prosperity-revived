import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronDown } from 'lucide-react';

// ─── Content sections per document ────────────────────────────────────────────

const DOCS = {
  terms: {
    title: 'Terms & Conditions',
    icon: '📄',
    updated: '12 March 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By creating an account or using any feature of Prosperity Revived, you have read and understood these Terms, agree to be bound by them, and are legally able to enter into this agreement. If you do not agree, discontinue use immediately.',
      },
      {
        heading: '2. Eligibility & Age Requirement',
        body: 'You must be at least 18 years old, OR at least 13 years old with verified parental or guardian consent. Children under 13 are strictly prohibited. We do not knowingly collect personal information from children under 13 (COPPA).',
      },
      {
        heading: '3. Health & Wellness — Not Medical Advice',
        body: 'All fitness, nutrition, emotional, and wellness content is for general informational and educational purposes only. The App does NOT provide medical advice, diagnosis, or treatment, and does not replace professional medical, psychological, or nutritional guidance. You agree to consult a physician before beginning any workout or nutrition program and to verify all AI-generated allergen and nutritional information independently.',
        highlight: true,
      },
      {
        heading: '4. Artificial Intelligence (AI) Disclosure',
        body: 'All chatbot characters — Gideon, Hannah, Coach David, Chef Daniel, and Coach Paul — are AI-generated characters, not real people. None are licensed therapists, physicians, registered dietitians, certified personal trainers, financial advisors, or counselors. The title "Coach" is motivational, not a professional credential. AI-generated scripture text may contain inaccuracies — always verify against a physical Bible. AI content may be incomplete or inaccurate; always consult qualified professionals before acting on it.',
        highlight: true,
        warning: true,
      },
      {
        heading: '5. Mental Health Crisis Resources',
        body: 'The App is NOT a crisis service. If you are in a mental health crisis, call or text 988 (Suicide & Crisis Lifeline), text HOME to 741741 (Crisis Text Line), or call 911 for emergencies.',
        highlight: true,
        emergency: true,
      },
      {
        heading: '6. Financial Content Disclaimer',
        body: 'Financial content, including the "Financial Freedom Through Faith" coaching plan, is for educational and motivational purposes only. It does not constitute financial, investment, tax, or legal advice. Consult a licensed financial advisor before making financial decisions.',
      },
      {
        heading: '7. Scripture & Bible Translation Copyright',
        body: 'The King James Version (KJV) and World English Bible (WEB) are in the public domain. AI-generated scripture text is a paraphrase for reference only — it is not a licensed reproduction of any copyrighted translation. Always refer to a licensed copy of your preferred Bible translation.',
      },
      {
        heading: '8. DMCA & Copyright',
        body: 'Prosperity Revived respects intellectual property. If you believe content infringes your copyright, submit a DMCA notice to Prosperityrevived2025@gmail.com with subject "DMCA Takedown Notice."',
      },
      {
        heading: '9. Subscription Auto-Renewal',
        body: 'Subscriptions automatically renew at the end of each billing period. You must cancel before the renewal date to avoid charges. Deleting the App does NOT cancel your subscription. Cancel through Apple App Store or Google Play settings.',
        highlight: true,
      },
      {
        heading: '10. Dispute Resolution & Governing Law',
        body: 'These Terms are governed by applicable state law. Disputes shall be resolved by binding individual arbitration. You waive any right to participate in a class action lawsuit.',
      },
      {
        heading: '11. Limitation of Liability',
        body: 'To the fullest extent permitted by law, Prosperity Revived LLC is not liable for injuries, health issues, allergic reactions, emotional or mental health outcomes, financial decisions based on AI content, scripture inaccuracies, data loss, or service interruptions. Your use of the App is entirely at your own risk.',
      },
    ],
  },

  privacy: {
    title: 'Privacy Policy',
    icon: '🔒',
    updated: '12 March 2026',
    sections: [
      {
        heading: 'What We Collect',
        body: 'We collect: account information (name, email, encrypted password); sensitive health & wellness data (height, weight, injuries, allergies, mental health goals, mood data, journal entries, prayer logs, progress photos); AI conversation history; community content; and device/usage data.',
      },
      {
        heading: 'Sensitive Health Data',
        body: 'Journal entries, mood check-ins, prayer logs, progress photos, and health data are classified as sensitive personal information. They are never shared with other users, never used for advertising, and never used to train AI models.',
        highlight: true,
      },
      {
        heading: 'AI Conversation Data',
        body: 'Messages you send to AI chatbots are processed by our AI service provider (Anthropic). Conversations are not used to train AI models and are handled under data processing agreements.',
      },
      {
        heading: 'How We Use Your Data',
        body: 'We use your data only to: provide and personalize App features, generate personalized AI coaching responses, track your progress, send enabled notifications, moderate community content, and maintain/improve the App. We never sell your personal information and never use your data for advertising.',
        highlight: true,
      },
      {
        heading: 'Service Providers',
        body: 'We share minimum necessary data with trusted service providers: Base44 (backend/authentication), Anthropic (AI language model), Google Cloud (text-to-speech), and analytics/crash-reporting tools. All providers are bound by data processing agreements.',
      },
      {
        heading: 'Your Rights (GDPR / CCPA)',
        body: 'You have the right to access, correct, delete, or export your data. California residents have additional rights under the CCPA. EU/UK residents have rights under GDPR. To exercise rights, go to Settings → Manage My Data or email Prosperityrevived2025@gmail.com.',
      },
      {
        heading: 'Data Deletion',
        body: 'When you delete your account, personal data, journal entries, health data, workout logs, mood data, prayer logs, and AI conversation history are permanently deleted within 30 days.',
      },
      {
        heading: "Children's Privacy (COPPA)",
        body: 'The App is not directed at children under 13. We do not knowingly collect data from children under 13. If you believe a child under 13 has created an account, contact us immediately.',
      },
      {
        heading: 'Data Security & Breach Notification',
        body: 'We use industry-standard security (HTTPS/TLS, encrypted passwords, access controls). In the event of a data breach, we will notify affected users within the timeframes required by applicable law (72 hours under GDPR).',
      },
    ],
  },

  waiver: {
    title: 'Health & Wellness Waiver',
    icon: '❤️',
    updated: '12 March 2026',
    sections: [
      {
        heading: 'What This App Provides',
        body: 'Prosperity Revived provides fitness and workout content, AI-generated nutrition suggestions and meal plans, emotional and personal growth tools, spiritual and Bible-based content, journaling tools, and AI-powered coaching conversations — all for general informational and educational purposes only.',
      },
      {
        heading: '⚠️ AI Chatbot Characters Are Not Professionals',
        body: 'Gideon, Hannah, Coach David, Chef Daniel, and Coach Paul are AI-generated characters. None are licensed therapists, physicians, registered dietitians, certified personal trainers, or counselors. The title "Coach" is motivational only. AI responses may be inaccurate. Do not make significant health, financial, or life decisions based solely on AI content.',
        highlight: true,
        warning: true,
      },
      {
        heading: '🆘 Crisis Resources',
        body: 'The App is NOT an emergency service and cannot contact help on your behalf. In a crisis: Call or text 988 (Suicide & Crisis Lifeline) · Text HOME to 741741 (Crisis Text Line) · Call 911 for emergencies · Visit findahelpline.com for international resources.',
        highlight: true,
        emergency: true,
      },
      {
        heading: 'Fitness & Physical Activity — Assumption of Risk',
        body: 'Before beginning any exercise program, consult your physician — especially if you have heart disease, high blood pressure, diabetes, joint/bone disorders, chronic pain, pregnancy, or recent surgery. By using workout features you acknowledge physical exercise involves inherent risks (including serious injury), you voluntarily participate, and you assume full personal responsibility. Stop immediately if you experience pain, dizziness, or shortness of breath.',
        highlight: true,
      },
      {
        heading: '⚠️ Allergen Warning',
        body: 'AI-generated recipes and ingredient lists may be incomplete or inaccurate regarding allergens. Always verify allergen information independently by checking food packaging and consulting your healthcare provider. Do not rely on AI allergen data for severe or life-threatening allergies.',
        highlight: true,
        warning: true,
      },
      {
        heading: 'Mental Wellness — Not Therapy',
        body: "Emotional check-ins, mindset tools, reflections, affirmations, journaling, and Hannah's AI coaching are for personal growth and motivation only — not therapy, counseling, or clinical mental health treatment. They do not establish a therapist-client or doctor-patient relationship. If you have diagnosed mental health conditions or serious emotional distress, work with a licensed mental health professional.",
      },
      {
        heading: 'Financial Content',
        body: 'The "Financial Freedom Through Faith" coaching plan and financial content is for educational and faith-based motivational purposes only. Not financial, investment, tax, or legal advice. Consult a licensed professional before making financial decisions.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'To the fullest extent permitted by law, Prosperity Revived LLC is not liable for: physical injuries from workouts · adverse or allergic reactions to nutrition/recipe content · emotional or psychological outcomes · financial decisions based on App content · any harm from reliance on AI-generated content. Your use of the App is at your own risk.',
        highlight: true,
      },
    ],
  },

  subscription: {
    title: 'Subscription Terms',
    icon: '💳',
    updated: '12 March 2026',
    sections: [
      {
        heading: '📋 Auto-Renewal Disclosure (Required by Law)',
        body: 'Subscriptions automatically renew at the end of each billing period at the then-current rate until you cancel. Your payment method will be charged automatically at the start of each new period. To avoid being charged for the next period, you must cancel before the renewal date. Deleting the App does NOT cancel your subscription. Cancel anytime through Apple App Store or Google Play Store account settings. Free trials automatically convert to paid subscriptions unless canceled before the trial ends.',
        highlight: true,
        warning: true,
      },
      {
        heading: 'What a Subscription Includes',
        body: 'A subscription may include: advanced workout programs, personalized coaching plans, premium nutrition content and AI meal plans, full access to AI chatbot coaching sessions, personal growth pathways, exclusive spiritual content, enhanced journaling features, and community features. Specific features per tier are displayed at the time of purchase.',
      },
      {
        heading: 'Billing & Payment',
        body: 'All payments are processed securely through Apple App Store (iOS) or Google Play Store (Android). Prosperity Revived does not collect or store your payment card details. Subscriptions are billed on a recurring basis (monthly or annually, as selected) starting on your purchase date.',
      },
      {
        heading: 'Free Trials',
        body: 'Free trials convert automatically to paid subscriptions at the end of the trial period unless you cancel before the trial ends. You will be charged the applicable rate on the day your trial expires. Cancel through your app store before the trial ends to avoid charges.',
        highlight: true,
      },
      {
        heading: 'How to Cancel',
        body: 'iOS: Settings → [Your Name] → Subscriptions → Prosperity Revived → Cancel. Android: Google Play Store → Profile → Payments & subscriptions → Subscriptions → Prosperity Revived → Cancel. Canceling stops future charges but does not refund the current billing period. You retain access until the end of the paid period.',
      },
      {
        heading: 'Refunds',
        body: 'Refunds are handled exclusively by your app store. Apple: reportaproblem.apple.com. Google: play.google.com/store/account/subscriptions. Prosperity Revived does not issue refunds directly.',
      },
      {
        heading: 'No Professional Services',
        body: 'Subscription content is for educational and motivational purposes only — not medical advice, therapy, registered dietitian services, certified personal training, or financial/legal advice. You assume all risks associated with using subscription content.',
      },
    ],
  },
};

// ─── Main Modal ────────────────────────────────────────────────────────────────

export default function LegalDocModal({ doc, onAccept, onClose }) {
  const data = DOCS[doc];
  const scrollRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const canAccept = scrollPct >= 85 || accepted;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    setScrollPct(Math.min(100, Math.round(pct)));
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(onAccept, 180);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          className="w-full max-w-lg bg-white dark:bg-white/5 rounded-t-3xl overflow-hidden shadow-2xl"
          style={{ maxHeight: '92vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10 bg-[#0A1A2F]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{data.icon}</span>
              <div>
                <p className="text-white font-bold text-base leading-tight">{data.title}</p>
                <p className="text-white/50 text-xs">Last updated {data.updated}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>

          {/* Scroll progress bar */}
          <div className="h-1 bg-gray-100">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C9A227] to-[#FD9C2D]"
              animate={{ width: `${scrollPct}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Scrollable content */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-y-auto px-5 py-5 space-y-4"
            style={{ maxHeight: 'calc(92vh - 160px)' }}
          >
            {data.sections.map((s, i) => (
              <div
                key={i}
                className={`rounded-2xl p-4 ${
                  s.emergency
                    ? 'bg-red-50 border border-red-200'
                    : s.warning
                    ? 'bg-amber-50 border border-amber-200'
                    : s.highlight
                    ? 'bg-[#F2F6FA] dark:bg-[#0A1A2F] border border-gray-200 dark:border-white/10'
                    : 'bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10'
                }`}
              >
                <p className={`text-xs font-bold mb-1.5 ${
                  s.emergency ? 'text-red-700' : s.warning ? 'text-amber-700' : 'text-[#0A1A2F] dark:text-white dark:text-white'
                }`}>
                  {s.heading}
                </p>
                <p className={`text-xs leading-relaxed ${
                  s.emergency ? 'text-red-800' : s.warning ? 'text-amber-800' : 'text-gray-600'
                }`}>
                  {s.body}
                </p>
              </div>
            ))}

            {/* Bottom spacer */}
            <div className="h-2" />
          </div>

          {/* Scroll hint or accept button */}
          <div className="px-5 pb-6 pt-3 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-white/5">
            {!canAccept ? (
              <div className="flex items-center justify-center gap-2 py-3 text-gray-400">
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
                <span className="text-xs font-medium">Scroll to read — {scrollPct}% complete</span>
              </div>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleAccept}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #C9A227, #FD9C2D)' }}
              >
                <Check className="w-4 h-4" />
                I have read and understand this document
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
