import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Settings')}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
            </Link>
            <h1 className="text-2xl font-bold text-[#0A1A2F] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#FD9C2D]" />
              Terms &amp; Conditions
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 text-[#0A1A2F] pr-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Terms &amp; Conditions</h2>
                <p className="text-sm text-gray-500">Last Updated: 12 March 2026</p>
              </div>

              <p className="text-sm leading-relaxed">
                Welcome to <strong>Prosperity Revived</strong> ("the App"), operated by Anchor &amp; Way. By accessing or using the App, you agree to these Terms &amp; Conditions ("Terms"). If you do not agree, you may not use the App.
              </p>
              <p className="text-sm leading-relaxed">
                These Terms apply to all users, including visitors, registered users, and subscribers.
              </p>

              {/* 1 */}
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
                <p className="text-sm leading-relaxed mt-2">If you do not agree, discontinue use immediately.</p>
              </div>

              {/* 2 */}
              <div>
                <h3 className="text-lg font-bold mb-3">2. Eligibility &amp; Age Requirement</h3>
                <p className="text-sm leading-relaxed mb-2">To use the App, you must:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Be at least <strong>18 years old</strong>, OR at least 13 years old with verified parental or guardian consent</li>
                  <li>Have the legal capacity to enter into a binding agreement</li>
                  <li>Provide accurate and truthful information when creating an account</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  <strong>Children under 13 are strictly prohibited from using the App.</strong> The App is not directed at children under 13, and we do not knowingly collect personal information from children under 13 in compliance with the Children's Online Privacy Protection Act (COPPA). If we learn that a child under 13 has created an account, we will immediately delete it.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  Parents and guardians are responsible for supervising any minor (ages 13–17) who uses the App and for the minor's compliance with these Terms.
                </p>
              </div>

              {/* 3 */}
              <div>
                <h3 className="text-lg font-bold mb-3">3. Health &amp; Wellness Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">
                  The App provides fitness, nutrition, emotional, and wellness content for <strong>general informational and educational purposes only</strong>.
                </p>
                <p className="text-sm leading-relaxed mb-2">The App does <strong>NOT</strong>:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Provide medical advice, diagnosis, or treatment</li>
                  <li>Diagnose, treat, or cure any physical or mental health condition</li>
                  <li>Replace professional medical, psychological, nutritional, or financial guidance</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 mb-2">You agree that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>You will consult a licensed physician before beginning any workout or nutrition program</li>
                  <li>You assume all risks associated with physical activity</li>
                  <li>You are responsible for your own health decisions</li>
                  <li>You will verify all AI-generated allergen and nutritional information independently before acting on it</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  Prosperity Revived is not liable for injuries, health issues, allergic reactions, or outcomes resulting from your use of the App.
                </p>
              </div>

              {/* 4 */}
              <div>
                <h3 className="text-lg font-bold mb-3">4. Artificial Intelligence (AI) Disclosure</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
                  <p className="text-sm font-bold text-amber-800 mb-1">⚠ Important — Please Read</p>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    The App uses artificial intelligence (AI) to generate responses, coaching content, devotionals, scripture references, recipes, workout suggestions, and personalized guidance. AI-generated content is produced by automated systems and is <strong>not authored or reviewed in real time by a licensed professional</strong>.
                  </p>
                </div>
                <p className="text-sm leading-relaxed mb-2">You acknowledge and agree that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>All chatbot characters (Gideon, Hannah, Coach David, Chef Daniel, and Coach Paul) are <strong>AI-generated characters</strong>, not real people</li>
                  <li>These characters are <strong>not licensed therapists, physicians, registered dietitians, certified personal trainers, financial advisors, or counselors</strong></li>
                  <li>The title "Coach" used in the App refers to motivational and wellness-focused AI characters, <strong>not credentialed professional coaches</strong></li>
                  <li>AI-generated scripture text may contain inaccuracies. Always verify verses against a physical Bible or licensed translation</li>
                  <li>AI-generated content, including recipes, nutrition advice, workout plans, and financial reflections, may be incomplete or inaccurate. Always consult qualified professionals before acting on this content</li>
                  <li>Your conversations with AI chatbots are processed by third-party AI service providers in accordance with our Privacy Policy</li>
                  <li>The App's AI features are for personal enrichment and motivation only, and do not constitute professional advice of any kind</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  If you are in a mental health crisis, please contact the 988 Suicide &amp; Crisis Lifeline (call or text 988) or text HOME to 741741 (Crisis Text Line). For physical emergencies, call 911.
                </p>
              </div>

              {/* 5 */}
              <div>
                <h3 className="text-lg font-bold mb-3">5. Spiritual Content Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">
                  The App includes Bible content, devotionals, affirmations, and spiritual guidance.
                </p>
                <p className="text-sm leading-relaxed mb-2">You acknowledge that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Spiritual content is for personal enrichment only and reflects a Christian faith perspective</li>
                  <li>Biblical interpretations may vary by denomination and tradition</li>
                  <li>AI-generated scripture text is for reference only — always verify against a licensed Bible translation</li>
                  <li>The App's "Daily Reflection by Birth Month" feature is faith-based motivational content and does not constitute astrology or divination</li>
                  <li>You are responsible for how you apply spiritual content in your life</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Prosperity Revived is not responsible for decisions made based on spiritual or faith-based content.
                </p>
              </div>

              {/* 6 */}
              <div>
                <h3 className="text-lg font-bold mb-3">6. Financial Content Disclaimer</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
                  <p className="text-sm leading-relaxed text-blue-900">
                    Financial content in the App, including the "Financial Freedom Through Faith" coaching plan and any AI-generated financial guidance, is for <strong>educational and motivational purposes only</strong>. It does not constitute financial advice, investment advice, tax advice, or legal advice, and should not be relied upon as such. Always consult a licensed financial advisor, accountant, or attorney before making financial decisions.
                  </p>
                </div>
              </div>

              {/* 7 */}
              <div>
                <h3 className="text-lg font-bold mb-3">7. Emotional &amp; Mental Wellness Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">The App includes emotional check-ins, journaling tools, mindset content, and personal growth features. These features are <strong>not therapy</strong> and do not replace:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Licensed counseling or psychotherapy</li>
                  <li>Mental health treatment</li>
                  <li>Crisis intervention services</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  If you are experiencing emotional distress or a mental health crisis, please seek professional help immediately. Crisis resources: call or text 988, or text HOME to 741741.
                </p>
              </div>

              {/* 8 */}
              <div>
                <h3 className="text-lg font-bold mb-3">8. Scripture &amp; Bible Translation</h3>
                <p className="text-sm leading-relaxed mb-2">
                  All scripture quotations in Prosperity Revived are from the <strong>World English Bible (WEB)</strong>, which is in the public domain. The WEB is a modern-language update of the American Standard Version and is not subject to copyright restrictions. No license or permission is required to quote the WEB.
                </p>
                <p className="text-sm leading-relaxed mb-2">
                  When AI chatbot characters reference scripture, they may paraphrase for conversational context. For precise wording, users should refer to the WEB text directly or their preferred Bible translation. Prosperity Revived is not affiliated with any Bible publisher or translation organization.
                </p>
              </div>

              {/* 9 */}
              <div>
                <h3 className="text-lg font-bold mb-3">9. User Responsibilities</h3>
                <p className="text-sm leading-relaxed mb-2">You agree NOT to:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Misuse or abuse the App</li>
                  <li>Post harmful, offensive, or illegal content</li>
                  <li>Harass, threaten, or harm other users</li>
                  <li>Attempt to hack, reverse engineer, or disrupt the App</li>
                  <li>Use the App for commercial purposes without written permission</li>
                  <li>Upload content that infringes on third-party intellectual property</li>
                  <li>Impersonate any person or entity</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">You are responsible for maintaining the confidentiality of your account.</p>
              </div>

              {/* 10 */}
              <div>
                <h3 className="text-lg font-bold mb-3">10. Community Guidelines</h3>
                <p className="text-sm leading-relaxed mb-2">If you participate in Groups or community features, you agree to:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Be respectful and encouraging to all members</li>
                  <li>Avoid hate speech, harassment, or bullying</li>
                  <li>Not share explicit, violent, or harmful content</li>
                  <li>Not promote illegal activities</li>
                  <li>Not impersonate others</li>
                  <li>Not post content that infringes on copyrights or other intellectual property</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Prosperity Revived may remove content or suspend accounts that violate these rules at our sole discretion.
                </p>
              </div>

              {/* 11 */}
              <div>
                <h3 className="text-lg font-bold mb-3">11. DMCA &amp; Copyright Infringement</h3>
                <p className="text-sm leading-relaxed mb-2">
                  Prosperity Revived respects intellectual property rights and expects users to do the same. If you believe that content in the App or posted by a user infringes your copyright, you may submit a DMCA takedown notice to our designated agent:
                </p>
                <div className="bg-[#F2F6FA] rounded-lg p-4 mt-2">
                  <p className="text-sm font-semibold">DMCA Agent — Prosperity Revived</p>
                  <p className="text-sm mt-1">Email: <span className="text-[#FD9C2D]">Prosperityrevived2025@gmail.com</span></p>
                  <p className="text-sm">Subject line: <em>DMCA Takedown Notice</em></p>
                  <p className="text-sm mt-2">Your notice must include: (1) identification of the copyrighted work claimed to be infringed; (2) identification of the allegedly infringing material and its location in the App; (3) your contact information; (4) a statement of good faith belief that use is not authorized; (5) a statement under penalty of perjury that the information is accurate; and (6) your physical or electronic signature.</p>
                </div>
              </div>

              {/* 12 */}
              <div>
                <h3 className="text-lg font-bold mb-3">12. Subscription Terms</h3>
                <p className="text-sm leading-relaxed mb-2">If the App offers paid subscriptions:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Prices and billing cycles will be clearly displayed before purchase</li>
                  <li><strong>Subscriptions automatically renew at the end of each billing period</strong> unless you cancel before the renewal date</li>
                  <li>You may cancel at any time through your Apple App Store or Google Play Store account settings</li>
                  <li><strong>Deleting the App does not cancel your subscription</strong></li>
                  <li>Refunds follow the policies of the applicable app store</li>
                  <li>Free trial periods convert to paid subscriptions automatically unless canceled before the trial ends</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  See our full Subscription Terms for complete details.
                </p>
              </div>

              {/* 13 */}
              <div>
                <h3 className="text-lg font-bold mb-3">13. Intellectual Property</h3>
                <p className="text-sm leading-relaxed mb-2">
                  All original content in the App is owned by Anchor &amp; Way, including workouts, nutrition content, spiritual content, audio, images, branding, UI/UX designs, code, logos, and text. The AI characters Gideon, Hannah, Coach David, Chef Daniel, and Coach Paul are original characters created by Anchor &amp; Way.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  You may not copy, distribute, modify, or reproduce any content without written permission.
                </p>
              </div>

              {/* 14 */}
              <div>
                <h3 className="text-lg font-bold mb-3">14. User-Generated Content</h3>
                <p className="text-sm leading-relaxed mb-2">If you submit content (journal entries, posts, comments, etc.):</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>You retain ownership of your content</li>
                  <li>You grant Prosperity Revived a limited, non-exclusive license to display it within the App</li>
                  <li>You represent that your content does not infringe any third-party rights</li>
                  <li>You are solely responsible for the content you post</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">We may remove content that violates these Terms or community guidelines.</p>
              </div>

              {/* 15 */}
              <div>
                <h3 className="text-lg font-bold mb-3">15. Limitation of Liability</h3>
                <p className="text-sm leading-relaxed mb-2">To the fullest extent permitted by applicable law, Prosperity Revived and Anchor &amp; Way are not liable for:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Injuries or health issues arising from workouts or physical activity</li>
                  <li>Adverse reactions to nutrition suggestions or AI-generated recipes</li>
                  <li>Emotional or mental health outcomes</li>
                  <li>Financial decisions made based on AI-generated content</li>
                  <li>Spiritual interpretation or application of content</li>
                  <li>Inaccuracies in AI-generated scripture text</li>
                  <li>Loss of data or service interruptions</li>
                  <li>Unauthorized access to your account</li>
                  <li>User behavior in Groups or community features</li>
                  <li>Third-party services or integrations</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">Your use of the App is entirely at your own risk.</p>
              </div>

              {/* 16 */}
              <div>
                <h3 className="text-lg font-bold mb-3">16. Indemnification</h3>
                <p className="text-sm leading-relaxed">
                  You agree to indemnify, defend, and hold harmless Prosperity Revived, Anchor &amp; Way, and their respective officers, employees, and agents from any claim, demand, loss, liability, or expense (including attorney's fees) arising from your use of the App, your content, or your violation of these Terms.
                </p>
              </div>

              {/* 17 */}
              <div>
                <h3 className="text-lg font-bold mb-3">17. Account Termination</h3>
                <p className="text-sm leading-relaxed mb-2">We may suspend or terminate your account if you:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Violate these Terms</li>
                  <li>Misuse the App</li>
                  <li>Post harmful or illegal content</li>
                  <li>Engage in harassment or abuse</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">You may delete your account at any time in Settings.</p>
              </div>

              {/* 18 */}
              <div>
                <h3 className="text-lg font-bold mb-3">18. Dispute Resolution &amp; Governing Law</h3>
                <p className="text-sm leading-relaxed mb-2">
                  These Terms are governed by the laws of the State of [Your State], without regard to conflict-of-law principles. Any dispute arising under these Terms shall first be subject to good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration under the rules of the American Arbitration Association, on an individual basis. <strong>You waive any right to participate in a class action lawsuit or class-wide arbitration.</strong>
                </p>
                <p className="text-sm leading-relaxed mt-2 text-gray-500 italic text-xs">
                  Note: Consult a licensed attorney to confirm the governing law, arbitration clause, and class action waiver are appropriate for your jurisdiction before publishing.
                </p>
              </div>

              {/* 19 */}
              <div>
                <h3 className="text-lg font-bold mb-3">19. Privacy Policy</h3>
                <p className="text-sm leading-relaxed">
                  Your privacy is important to us. The App collects and processes data as described in our Privacy Policy, which is incorporated into these Terms by reference. You agree to the data practices described in the Privacy Policy.
                </p>
              </div>

              {/* 20 */}
              <div>
                <h3 className="text-lg font-bold mb-3">20. Changes to Terms</h3>
                <p className="text-sm leading-relaxed">
                  We may update these Terms at any time. If changes are significant, we will notify you through the App or via email. Continued use of the App after notice constitutes acceptance of the updated Terms.
                </p>
              </div>

              {/* 21 */}
              <div>
                <h3 className="text-lg font-bold mb-3">21. Contact Information</h3>
                <p className="text-sm leading-relaxed mb-2">For questions about these Terms, contact:</p>
                <div className="bg-[#F2F6FA] rounded-lg p-4 mt-3">
                  <p className="text-sm font-semibold">Prosperity Revived — Anchor &amp; Way</p>
                  <p className="text-sm text-[#FD9C2D]">Prosperityrevived2025@gmail.com</p>
                  <p className="text-sm text-[#FD9C2D]">www.prosperityrevived.com</p>
                </div>
              </div>

              <div className="text-center pt-6 pb-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">© 2026 Prosperity Revived / Anchor &amp; Way. All rights reserved.</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
