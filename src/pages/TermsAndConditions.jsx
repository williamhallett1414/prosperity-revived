import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Settings')}
              className="w-10 h-10 rounded-full bg-[#FAD98D] hover:bg-[#FAD98D]/90 shadow-sm flex items-center justify-center text-[#3C4E53] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#0A1A2F] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#FD9C2D]" />
              Terms & Conditions
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 text-[#0A1A2F] pr-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Terms & Conditions</h2>
                <p className="text-sm text-gray-500">Last Updated: 18 February 2026</p>
              </div>

              <p className="text-sm leading-relaxed">
                Welcome to <strong>Prosperity Revived</strong> ("the App"). By accessing or using the App, you agree to these Terms & Conditions ("Terms"). If you do not agree, you may not use the App.
              </p>

              <p className="text-sm leading-relaxed">
                These Terms apply to all users, including visitors, registered users, and subscribers.
              </p>

              <div>
                <h3 className="text-lg font-bold mb-3">1. Acceptance of Terms</h3>
                <p className="text-sm leading-relaxed mb-2">
                  By creating an account, accessing content, or using any feature of the App, you acknowledge that you:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Have read and understood these Terms</li>
                  <li>Agree to be bound by them</li>
                  <li>Are legally able to enter into this agreement</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  If you do not agree, discontinue use immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">2. Eligibility</h3>
                <p className="text-sm leading-relaxed mb-2">To use the App, you must:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Be at least 13 years old (or the minimum age required in your region)</li>
                  <li>Have the legal capacity to enter into a binding agreement</li>
                  <li>Provide accurate and truthful information when creating an account</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Parents/guardians are responsible for minors who use the App.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">3. Health & Wellness Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">
                  The App provides fitness, nutrition, emotional, and wellness content for general informational and educational purposes only.
                </p>
                <p className="text-sm leading-relaxed mb-2">The App does NOT:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Provide medical advice</li>
                  <li>Diagnose, treat, or cure any condition</li>
                  <li>Replace professional medical, psychological, or nutritional guidance</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 mb-2">You agree that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>You will consult a physician before beginning any workout or nutrition program</li>
                  <li>You assume all risks associated with physical activity</li>
                  <li>You are responsible for your own health decisions</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  <strong>Prosperity Revived is not liable</strong> for injuries, health issues, or outcomes resulting from your use of the App.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">4. Spiritual Content Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">
                  The App includes Bible content, devotionals, affirmations, and spiritual guidance.
                </p>
                <p className="text-sm leading-relaxed mb-2">You acknowledge that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Spiritual content is for personal enrichment only</li>
                  <li>Interpretations may vary</li>
                  <li>You are responsible for how you apply spiritual content in your life</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Prosperity Revived is not responsible for decisions made based on spiritual or faith based content.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">5. Emotional & Personal Growth Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">The App includes:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Emotional check ins</li>
                  <li>Journaling tools</li>
                  <li>Mindset and personal growth content</li>
                  <li>Identity in Christ content</li>
                  <li>Weekly reflections</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 mb-2">
                  These features are not therapy and do not replace:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Counseling</li>
                  <li>Mental health treatment</li>
                  <li>Crisis support</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  If you are experiencing emotional distress, seek professional help immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">6. User Responsibilities</h3>
                <p className="text-sm leading-relaxed mb-2">You agree NOT to:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Misuse or abuse the App</li>
                  <li>Post harmful, offensive, or illegal content</li>
                  <li>Harass, threaten, or harm other users</li>
                  <li>Attempt to hack, reverse engineer, or disrupt the App</li>
                  <li>Use the App for commercial purposes without permission</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  You are responsible for maintaining the confidentiality of your account.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">7. Community Guidelines (Groups)</h3>
                <p className="text-sm leading-relaxed mb-2">
                  If you participate in Groups or community features, you agree to:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Be respectful</li>
                  <li>Avoid hate speech, harassment, or bullying</li>
                  <li>Not share explicit, violent, or harmful content</li>
                  <li>Not promote illegal activities</li>
                  <li>Not impersonate others</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Prosperity Revived may remove content or suspend accounts that violate these rules.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">8. Subscription Terms</h3>
                <p className="text-sm leading-relaxed mb-2">If the App offers paid subscriptions:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Prices and billing cycles will be clearly displayed</li>
                  <li>Subscriptions automatically renew unless canceled</li>
                  <li>You may cancel at any time through your app store</li>
                  <li>Refunds follow the policies of the app store (Apple/Google)</li>
                  <li>Prosperity Revived does not process refunds directly</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Failure to pay may result in loss of access to premium features.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">9. Intellectual Property</h3>
                <p className="text-sm leading-relaxed mb-2">
                  All content in the App is owned by Anchor & Way, including:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Workouts</li>
                  <li>Nutrition content</li>
                  <li>Spiritual content</li>
                  <li>Audio</li>
                  <li>Images</li>
                  <li>Branding</li>
                  <li>UI/UX designs</li>
                  <li>Code</li>
                  <li>Logos</li>
                  <li>Text</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  You may not copy, distribute, modify, or reproduce any content without written permission.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">10. User Generated Content</h3>
                <p className="text-sm leading-relaxed mb-2">
                  If you submit content (journal entries, posts, comments, etc.):
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>You retain ownership of your content</li>
                  <li>You grant Prosperity Revived a license to display it within the App</li>
                  <li>You are responsible for ensuring your content does not violate laws or rights</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  We may remove content that violates these Terms.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">11. Limitation of Liability</h3>
                <p className="text-sm leading-relaxed mb-2">
                  To the fullest extent permitted by law:
                </p>
                <p className="text-sm leading-relaxed mb-2 font-semibold">
                  Prosperity Revived is not liable for:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Injuries or health issues from workouts</li>
                  <li>Reactions to nutrition suggestions</li>
                  <li>Emotional or mental outcomes</li>
                  <li>Spiritual interpretation or application</li>
                  <li>Loss of data</li>
                  <li>Service interruptions</li>
                  <li>Unauthorized access to your account</li>
                  <li>User behavior in Groups</li>
                  <li>Third party services or integrations</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  Your use of the App is at your own risk.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">12. Account Termination</h3>
                <p className="text-sm leading-relaxed mb-2">
                  We may suspend or terminate your account if you:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Violate these Terms</li>
                  <li>Misuse the App</li>
                  <li>Post harmful or illegal content</li>
                  <li>Engage in harassment or abuse</li>
                  <li>Attempt to hack or disrupt the App</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  You may delete your account at any time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">13. Privacy Policy</h3>
                <p className="text-sm leading-relaxed">
                  Your privacy is important to us. The App collects and processes data as described in our Privacy Policy, which is incorporated into these Terms.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  You agree to the data practices described in the Privacy Policy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">14. Changes to Terms</h3>
                <p className="text-sm leading-relaxed">
                  We may update these Terms at any time. If changes are significant, we will notify you through the App.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  Continued use of the App means you accept the updated Terms.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">15. Contact Information</h3>
                <p className="text-sm leading-relaxed mb-2">
                  For questions about these Terms, contact:
                </p>
                <div className="bg-[#F2F6FA] rounded-lg p-4 mt-3">
                  <p className="text-sm font-semibold">Prosperity Revived Support</p>
                  <p className="text-sm text-[#FD9C2D]">Prosperityrevived2025@gmail.com</p>
                  <p className="text-sm text-[#FD9C2D]">www.prosperityrevived.com</p>
                </div>
              </div>

              <div className="text-center pt-6 pb-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  © 2026 Prosperity Revived. All rights reserved.
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}