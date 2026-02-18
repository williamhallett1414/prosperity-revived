import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PrivacyPolicy() {
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
              <Shield className="w-6 h-6 text-[#FD9C2D]" />
              Privacy Policy
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 text-[#0A1A2F] pr-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Prosperity Revived</h2>
                <p className="text-sm text-gray-500">Last Updated: 18 February 2026</p>
              </div>

              <p className="text-sm leading-relaxed">
                This Privacy Policy explains how <strong>Prosperity Revived</strong> ("we," "us," "our," or "the App") collects, uses, stores, and protects your information when you use our mobile application, website, and related services.
              </p>

              <p className="text-sm leading-relaxed">
                By using the App, you agree to the practices described in this Privacy Policy.
              </p>

              <div>
                <h3 className="text-lg font-bold mb-3">1. Information We Collect</h3>
                <p className="text-sm leading-relaxed mb-3">
                  We collect the following types of information to provide and improve the App.
                </p>

                <h4 className="font-semibold text-base mb-2">A. Information You Provide Directly</h4>
                
                <p className="text-sm font-semibold mt-3 mb-1">Account Information</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Password (encrypted)</li>
                  <li>Profile details</li>
                </ul>

                <p className="text-sm font-semibold mt-3 mb-1">Wellness & Personal Growth Data</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Workout activity</li>
                  <li>Nutrition preferences</li>
                  <li>Emotional check ins</li>
                  <li>Journal entries</li>
                  <li>Reflections</li>
                  <li>Affirmations</li>
                  <li>Personal growth progress</li>
                </ul>

                <p className="text-sm font-semibold mt-3 mb-1">Community Content</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Group posts</li>
                  <li>Comments</li>
                  <li>Messages (if enabled)</li>
                </ul>

                <p className="text-sm font-semibold mt-3 mb-1">Subscription Information</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Purchase history</li>
                  <li>Subscription status</li>
                  <li>Transaction identifiers (from Apple/Google)</li>
                </ul>

                <p className="text-sm leading-relaxed mt-2 italic">
                  We do not store your full payment information. All payments are processed securely by the App Store or Google Play.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">B. Information Collected Automatically</h4>
                
                <p className="text-sm font-semibold mt-3 mb-1">Device & Usage Data</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Device type</li>
                  <li>Operating system</li>
                  <li>App version</li>
                  <li>IP address</li>
                  <li>Crash logs</li>
                  <li>Performance data</li>
                </ul>

                <p className="text-sm font-semibold mt-3 mb-1">Interaction Data</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Pages visited</li>
                  <li>Buttons tapped</li>
                  <li>Time spent in sections</li>
                  <li>Navigation patterns</li>
                </ul>

                <p className="text-sm leading-relaxed mt-2">
                  This helps us improve the user experience.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">C. Optional Data</h4>
                <p className="text-sm leading-relaxed mb-2">If you choose to enable them:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Push notification preferences</li>
                  <li>Profile photo</li>
                  <li>Fitness goals</li>
                  <li>Personal notes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">2. How We Use Your Information</h3>
                <p className="text-sm leading-relaxed mb-3">We use your information to:</p>

                <p className="text-sm font-semibold mt-3 mb-1">Provide Core Features</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Workouts</li>
                  <li>Nutrition content</li>
                  <li>Personal growth tools</li>
                  <li>Bible content</li>
                  <li>Groups and community features</li>
                </ul>

                <p className="text-sm font-semibold mt-3 mb-1">Improve Your Experience</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Personalized recommendations</li>
                  <li>Suggested workouts</li>
                  <li>Suggested affirmations</li>
                  <li>Suggested reflections</li>
                </ul>

                <p className="text-sm font-semibold mt-3 mb-1">Maintain App Functionality</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Debugging</li>
                  <li>Analytics</li>
                  <li>Performance optimization</li>
                </ul>

                <p className="text-sm font-semibold mt-3 mb-1">Communicate With You</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>App updates</li>
                  <li>Notifications</li>
                  <li>Support responses</li>
                </ul>

                <p className="text-sm font-semibold mt-3 mb-1">Ensure Safety</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Moderation of Groups</li>
                  <li>Prevention of harmful behavior</li>
                  <li>Enforcement of Terms & Conditions</li>
                </ul>

                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  We never sell your personal information.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">3. How We Store & Protect Your Data</h3>
                <p className="text-sm leading-relaxed mb-2">
                  We use industry standard security measures, including:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Encrypted passwords</li>
                  <li>Secure database storage</li>
                  <li>Access controls</li>
                  <li>Regular security audits</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  However, no system is 100% secure. You use the App at your own risk.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">4. How We Share Your Information</h3>
                <p className="text-sm leading-relaxed mb-3">
                  We only share your information in the following cases:
                </p>

                <h4 className="font-semibold text-base mb-2">A. Service Providers</h4>
                <p className="text-sm leading-relaxed mb-2">
                  Trusted partners who help us operate the App, such as:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Cloud hosting</li>
                  <li>Analytics tools</li>
                  <li>Notification services</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  They only access the minimum data required.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">B. Legal Requirements</h4>
                <p className="text-sm leading-relaxed mb-2">
                  We may disclose information if required by:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Law</li>
                  <li>Court order</li>
                  <li>Government request</li>
                  <li>To protect safety or prevent harm</li>
                </ul>

                <h4 className="font-semibold text-base mt-4 mb-2">C. Community Features</h4>
                <p className="text-sm leading-relaxed mb-2">
                  If you post in Groups:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Your name</li>
                  <li>Profile photo</li>
                  <li>Posts and comments</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  …are visible to other users.
                </p>
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  Private journal entries and emotional check ins are never shared.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">5. Your Rights</h3>
                <p className="text-sm leading-relaxed mb-2">
                  Depending on your region, you may have the right to:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Access your data</li>
                  <li>Update your data</li>
                  <li>Delete your data</li>
                  <li>Export your data</li>
                  <li>Opt out of marketing</li>
                  <li>Close your account</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  To request any of these, contact: <span className="text-[#FD9C2D]">Prosperityrevived2025@gmail.com</span>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">6. Data Retention</h3>
                <p className="text-sm leading-relaxed mb-2">
                  We retain your data only as long as necessary to:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Provide the App</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3 mb-2">
                  When you delete your account:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Personal data is removed</li>
                  <li>Journal entries are deleted</li>
                  <li>Workout and nutrition data is deleted</li>
                  <li>Group posts may remain anonymized</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">7. Children's Privacy</h3>
                <p className="text-sm leading-relaxed">
                  The App is not intended for children under 13. We do not knowingly collect data from children under 13.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  If you believe a child has created an account, contact us immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">8. Third Party Links & Integrations</h3>
                <p className="text-sm leading-relaxed mb-2">
                  The App may contain links to third party content. We are not responsible for:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Their privacy practices</li>
                  <li>Their content</li>
                  <li>Their security</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Review their policies before interacting with them.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">9. International Users</h3>
                <p className="text-sm leading-relaxed mb-2">
                  If you access the App from outside the United States, you consent to:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Data being transferred to the U.S.</li>
                  <li>Data being processed under U.S. laws</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">10. Changes to This Privacy Policy</h3>
                <p className="text-sm leading-relaxed">
                  We may update this Privacy Policy at any time. If changes are significant, we will notify you through the App.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  Continued use of the App means you accept the updated policy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">11. Contact Us</h3>
                <p className="text-sm leading-relaxed mb-2">
                  For questions or concerns about this Privacy Policy:
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