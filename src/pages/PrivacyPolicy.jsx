import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3C4E53] to-[#AFC7E3] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F]">Privacy Policy</h1>
            <p className="text-xs text-[#0A1A2F]/45">How we protect your data</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Settings')}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
            </Link>
            <h1 className="text-2xl font-bold text-[#0A1A2F] flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#FD9C2D]" />
              Privacy Policy
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 text-[#0A1A2F] pr-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Privacy Policy</h2>
                <h3 className="text-base font-semibold text-gray-600 mb-1">Prosperity Revived</h3>
                <p className="text-sm text-gray-500">Last Updated: 12 March 2026</p>
              </div>

              <p className="text-sm leading-relaxed">
                This Privacy Policy explains how <strong>Prosperity Revived</strong> ("we," "us," "our," or "the App"), operated by <strong>Prosperity Revived LLC</strong>, a Virginia limited liability company, collects, uses, stores, and protects your information when you use our mobile application, website, and related services.
              </p>
              <p className="text-sm leading-relaxed">
                By using the App, you agree to the practices described in this Privacy Policy.
              </p>

              {/* 1 */}
              <div>
                <h3 className="text-lg font-bold mb-3">1. Information We Collect</h3>

                <h4 className="font-semibold text-base mb-2">A. Account Information</h4>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Name and email address</li>
                  <li>Password (stored encrypted — we cannot read your password)</li>
                  <li>Profile photo (optional)</li>
                  <li>Date of birth or age confirmation (for age verification)</li>
                </ul>

                <h4 className="font-semibold text-base mt-4 mb-2">B. Sensitive Health &amp; Wellness Data</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-2">
                  <p className="text-xs font-bold text-amber-800 mb-1">⚠ Sensitive Category</p>
                  <p className="text-xs text-amber-900">The following data is classified as sensitive personal information. We collect it only to personalize your App experience and do not sell, share, or use it for advertising.</p>
                </div>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Height, weight, and body composition goals</li>
                  <li>Fitness level and workout history</li>
                  <li>Injuries and physical limitations</li>
                  <li>Dietary preferences, restrictions, and allergies</li>
                  <li>Mental health and emotional wellness goals (e.g., stress management, anxiety)</li>
                  <li>Mood and emotional check-in data</li>
                  <li>Journal entries and personal reflections</li>
                  <li>Prayer logs and spiritual growth data</li>
                  <li>Progress photos (if you upload them)</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  Journal entries, emotional check-ins, prayer logs, video recordings, and progress photos are treated as especially sensitive. They are never shared with other users or third parties, and are never used to train AI models.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">C. Video, Camera &amp; Audio Data</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-2">
                  <p className="text-xs font-bold text-amber-800 mb-1">⚠ Camera &amp; Microphone Access</p>
                  <p className="text-xs text-amber-900">The App requests access to your device's camera and microphone only when you choose to use video features. You will be prompted for permission before any recording begins. You may deny or revoke this permission at any time in your device settings.</p>
                </div>
                <p className="text-sm leading-relaxed mb-2">If you use the App's video features, we may collect:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li><strong>Video journal recordings:</strong> Video and audio recorded through the journal's video mode, stored securely and accessible only to you</li>
                  <li><strong>Video chat messages:</strong> Video and audio recorded when sending video messages to AI chatbot characters</li>
                  <li><strong>Speech-to-text transcripts:</strong> Your spoken words are transcribed using your device's built-in speech recognition (processed locally on your device, not sent to external servers for transcription)</li>
                  <li><strong>Video metadata:</strong> Recording duration and timestamp</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  Video and audio recordings are treated with the highest sensitivity:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Video recordings are stored securely and are <strong>never shared</strong> with other users, third parties, or advertisers</li>
                  <li>Video content is <strong>never used to train AI models</strong></li>
                  <li>When you send a video message to an AI chatbot, only the <strong>text transcript</strong> of your speech is sent to the AI — the video and audio files themselves are not processed by the AI</li>
                  <li>All video recordings are <strong>permanently deleted</strong> when you delete the associated journal entry, conversation, or your account</li>
                  <li>You may delete any individual video recording at any time</li>
                </ul>

                <h4 className="font-semibold text-base mt-4 mb-2">D. Community Content</h4>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Posts, comments, and group activity</li>
                  <li>Content you choose to share publicly within the App community</li>
                </ul>

                <h4 className="font-semibold text-base mt-4 mb-2">D. AI Conversation Data</h4>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Messages you send to AI chatbot characters (Gideon, Hannah, Coach David, Chef Daniel, Coach Paul)</li>
                  <li>Conversation history stored for continuity within the App</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 italic">
                  AI conversations are processed by our AI service provider (Anthropic). Conversations are not used to train AI models and are handled in accordance with our service provider's data policies.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">E. Subscription &amp; Payment Information</h4>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Subscription status and purchase history</li>
                  <li>Transaction identifiers from Apple App Store or Google Play Store</li>
                </ul>
                <p className="text-sm leading-relaxed mt-1 italic">We do not store your payment card details. All payment processing is handled securely by your app store.</p>

                <h4 className="font-semibold text-base mt-4 mb-2">F. Device &amp; Usage Data (Automatic)</h4>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Device type, operating system, and app version</li>
                  <li>IP address (anonymized for analytics)</li>
                  <li>Crash logs and performance data</li>
                  <li>App navigation and feature usage patterns</li>
                </ul>
              </div>

              {/* 2 */}
              <div>
                <h3 className="text-lg font-bold mb-3">2. How We Use Your Information</h3>
                <p className="text-sm leading-relaxed mb-3">We use your information only to:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Provide and personalize the App's features (workouts, nutrition, spiritual content, coaching)</li>
                  <li>Generate personalized AI chatbot responses tailored to your goals</li>
                  <li>Track your progress and display it to you</li>
                  <li>Send you notifications and reminders (only those you have enabled)</li>
                  <li>Moderate community content and enforce our Terms</li>
                  <li>Maintain, debug, and improve the App</li>
                  <li>Comply with legal obligations</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3 font-semibold">We never sell your personal information. We never use your data for advertising.</p>
              </div>

              {/* 3 */}
              <div>
                <h3 className="text-lg font-bold mb-3">3. How We Store &amp; Protect Your Data</h3>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Data is stored on secured servers via our backend provider (Base44)</li>
                  <li>Passwords are hashed and encrypted</li>
                  <li>Sensitive fields are access-controlled and not exposed in logs</li>
                  <li>We apply industry-standard security measures including encryption in transit (HTTPS/TLS)</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  No security system is 100% guaranteed. In the event of a data breach, we will notify affected users within the timeframes required by applicable law (generally within 72 hours under GDPR; as required by applicable U.S. state laws).
                </p>
              </div>

              {/* 4 */}
              <div>
                <h3 className="text-lg font-bold mb-3">4. How We Share Your Information</h3>
                <p className="text-sm leading-relaxed mb-3">We share your information only in these limited circumstances:</p>

                <h4 className="font-semibold text-base mb-2">A. Service Providers</h4>
                <p className="text-sm leading-relaxed mb-2">Trusted service providers who help us operate the App, including:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li><strong>Base44</strong> — backend database and authentication</li>
                  <li><strong>Anthropic</strong> — AI language model provider for chatbot responses</li>
                  <li><strong>Google Cloud</strong> — text-to-speech services</li>
                  <li>Analytics and crash-reporting tools</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">Each provider receives only the minimum data necessary and is bound by data processing agreements.</p>

                <h4 className="font-semibold text-base mt-4 mb-2">B. Legal Requirements</h4>
                <p className="text-sm leading-relaxed">We may disclose information if required by law, court order, or government request, or to protect the safety of our users or the public.</p>

                <h4 className="font-semibold text-base mt-4 mb-2">C. Community Features</h4>
                <p className="text-sm leading-relaxed">Content you post in Groups (your display name, profile photo, posts, and comments) is visible to other users. Private journal entries, emotional check-ins, prayer logs, and progress photos are <strong>never</strong> shared publicly or with other users.</p>
              </div>

              {/* 5 */}
              <div>
                <h3 className="text-lg font-bold mb-3">5. Your Rights &amp; How to Exercise Them</h3>
                <p className="text-sm leading-relaxed mb-2">
                  Depending on your location, you have the following rights regarding your personal data:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion (Right to Erasure):</strong> Request deletion of your account and associated data</li>
                  <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt Out:</strong> Opt out of non-essential communications at any time</li>
                  <li><strong>Restrict Processing:</strong> Request that we limit how we use your data in certain circumstances</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3">
                  <strong>To exercise any of these rights:</strong> Go to <strong>Settings → Manage My Data</strong> in the App, or email us at <span className="text-[#FD9C2D]">Prosperityrevived2025@gmail.com</span> with subject line "Data Rights Request." We will respond within 30 days.
                </p>
                <p className="text-sm leading-relaxed mt-2 italic">
                  California residents: You have additional rights under the CCPA, including the right to know what personal information is sold or shared (we do not sell your information) and the right to non-discrimination for exercising your privacy rights.
                </p>
                <p className="text-sm leading-relaxed mt-2 italic">
                  EU/UK residents: You have rights under GDPR including those listed above. You may also lodge a complaint with your national data protection authority.
                </p>
              </div>

              {/* 6 */}
              <div>
                <h3 className="text-lg font-bold mb-3">6. Data Retention</h3>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>We retain your data for as long as your account is active or as needed to provide the App</li>
                  <li>When you delete your account: personal profile data, journal entries, video recordings, health data, workout logs, nutrition logs, mood data, prayer logs, progress photos, and AI conversation history are permanently deleted within 30 days</li>
                  <li>Anonymized usage data (with no identifying information) may be retained for analytics</li>
                  <li>Community posts you made may be retained in anonymized form or removed — you may request deletion of specific posts by contacting us</li>
                </ul>
              </div>

              {/* 7 */}
              <div>
                <h3 className="text-lg font-bold mb-3">7. Progress Photos</h3>
                <p className="text-sm leading-relaxed mb-2">If you upload progress photos:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Photos are stored securely and are private to your account by default</li>
                  <li>Photos are <strong>never</strong> shared with other users, displayed publicly, or used for AI training</li>
                  <li>You may delete your photos at any time in the App</li>
                  <li>Upon account deletion, all photos are permanently deleted within 30 days</li>
                </ul>
              </div>

              {/* 8 */}
              <div>
                <h3 className="text-lg font-bold mb-3">8. Children's Privacy (COPPA)</h3>
                <p className="text-sm leading-relaxed">
                  The App is <strong>not directed at children under 13</strong>. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has created an account, contact us immediately at <span className="text-[#FD9C2D]">Prosperityrevived2025@gmail.com</span> and we will delete the account promptly.
                </p>
              </div>

              {/* 9 */}
              <div>
                <h3 className="text-lg font-bold mb-3">9. Third-Party Links &amp; Integrations</h3>
                <p className="text-sm leading-relaxed mb-2">The App may link to or integrate with third-party services (such as fitness trackers). We are not responsible for their privacy practices, content, or security. Review their policies before interacting with them.</p>
                <p className="text-sm leading-relaxed">Third-party data you import into the App (e.g., from fitness trackers) is subject to those providers' terms and ours. We use it only to personalize your App experience and do not share it further.</p>
              </div>

              {/* 10 */}
              <div>
                <h3 className="text-lg font-bold mb-3">10. Image Attribution</h3>
                <p className="text-sm leading-relaxed">
                  Some images in the App are sourced from Unsplash under their applicable license terms. We comply with Unsplash's attribution requirements. Images are not downloaded in bulk or used for commercial resale.
                </p>
              </div>

              {/* 11 */}
              <div>
                <h3 className="text-lg font-bold mb-3">11. International Users</h3>
                <p className="text-sm leading-relaxed mb-2">If you access the App from outside the United States, you consent to your data being transferred to and processed in the United States under U.S. law. We make reasonable efforts to apply privacy protections consistent with your region's laws.</p>
              </div>

              {/* 12 */}
              <div>
                <h3 className="text-lg font-bold mb-3">12. Changes to This Privacy Policy</h3>
                <p className="text-sm leading-relaxed">
                  We may update this Privacy Policy at any time. If changes are significant, we will notify you through the App or via email. Continued use of the App after notice constitutes acceptance of the updated policy.
                </p>
              </div>

              {/* 13 */}
              <div>
                <h3 className="text-lg font-bold mb-3">13. Contact Us</h3>
                <div className="bg-[#F2F6FA] rounded-lg p-4 mt-3">
                  <p className="text-sm font-semibold">Prosperity Revived LLC</p>
                  <p className="text-sm text-[#FD9C2D]">Prosperityrevived2025@gmail.com</p>
                  <p className="text-sm text-[#FD9C2D]">www.prosperityrevived.com</p>
                </div>
              </div>

              <div className="text-center pt-6 pb-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">© 2026 Prosperity Revived LLC. All rights reserved.</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

