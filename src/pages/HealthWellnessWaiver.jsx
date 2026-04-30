import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Heart, Shield} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HealthWellnessWaiver() {
  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3C4E53] to-[#AFC7E3] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Health Waiver</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Important information</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Settings')}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
            </Link>
            <h1 className="text-2xl font-bold text-[#0A1A2F] dark:text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#FD9C2D]" />
              Health &amp; Wellness Waiver
            </h1>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm dark:shadow-none">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 text-[#0A1A2F] dark:text-white pr-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Health &amp; Wellness Waiver</h2>
                <h3 className="text-lg font-semibold mb-1">Prosperity Revived</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Last Updated: 12 March 2026</p>
              </div>

              <p className="text-sm leading-relaxed">
                This Health &amp; Wellness Waiver ("Waiver") applies to all users of the Prosperity Revived mobile application ("the App"), operated by <strong>Prosperity Revived LLC</strong>, a Virginia limited liability company. By accessing or using the App, you acknowledge and agree to the terms of this Waiver. If you do not agree, discontinue use immediately.
              </p>

              {/* 1 */}
              <div>
                <h3 className="text-lg font-bold mb-3">1. General Acknowledgment</h3>
                <p className="text-sm leading-relaxed mb-2">You understand and agree that Prosperity Revived provides:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Fitness and workout content</li>
                  <li>Nutrition suggestions and AI-generated meal plans</li>
                  <li>Emotional and personal growth tools</li>
                  <li>Spiritual and Bible-based content</li>
                  <li>Journaling and reflection tools</li>
                  <li>AI-powered coaching conversations</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">These features are for <strong>general informational and educational purposes only</strong>.</p>
                <p className="text-sm leading-relaxed mt-3 mb-2 font-semibold">The App does not provide:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Medical advice, diagnosis, or treatment</li>
                  <li>Mental health therapy or psychiatric treatment</li>
                  <li>Registered dietitian services</li>
                  <li>Certified personal training or physical therapy</li>
                  <li>Licensed financial or legal advice</li>
                  <li>Emergency or crisis intervention services</li>
                </ul>
              </div>

              {/* 2 */}
              <div>
                <h3 className="text-lg font-bold mb-3">2. AI Chatbot Disclaimer</h3>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 mb-3">
                  <p className="text-sm font-bold text-amber-800 mb-2">⚠ Read Before Using AI Features</p>
                  <p className="text-sm text-amber-900 leading-relaxed mb-2">
                    The App's chatbot characters — <strong>Gideon</strong> (spiritual mentor), <strong>Hannah</strong> (mindset &amp; emotional growth), <strong>Coach David</strong> (fitness), <strong>Chef Daniel</strong> (nutrition), and <strong>Coach Paul</strong> (personal development) — are <strong>AI-generated characters powered by artificial intelligence</strong>. They are not real people.
                  </p>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-amber-900">
                    <li>None of the chatbot characters are licensed therapists, physicians, registered dietitians, certified personal trainers, financial advisors, or professional counselors</li>
                    <li>The title "Coach" is a motivational designation, not a professional credential</li>
                    <li>AI responses are generated automatically and may be inaccurate, incomplete, or not applicable to your specific situation</li>
                    <li>Do not make significant health, financial, or life decisions based solely on AI-generated content</li>
                    <li>Always consult a qualified professional for advice specific to your situation</li>
                  </ul>
                </div>
              </div>

              {/* 3 */}
              <div>
                <h3 className="text-lg font-bold mb-3">3. Crisis Resources &amp; Emergency Services</h3>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 rounded-xl p-4 mb-3">
                  <p className="text-sm font-bold text-red-800 mb-2">🆘 If You Are in Crisis</p>
                  <p className="text-sm text-red-900 leading-relaxed mb-2">
                    The App is <strong>not an emergency service and cannot contact help on your behalf</strong>. If you are experiencing a mental health crisis, thoughts of self-harm or suicide, or a medical emergency, please use the following resources immediately:
                  </p>
                  <ul className="list-none space-y-2 text-sm text-red-900">
                    <li><strong>🟢 988 Suicide &amp; Crisis Lifeline:</strong> Call or text <strong>988</strong> (U.S.)</li>
                    <li><strong>💬 Crisis Text Line:</strong> Text <strong>HOME</strong> to <strong>741741</strong></li>
                    <li><strong>🚨 Emergency:</strong> Call <strong>911</strong> (U.S.) or your local emergency number</li>
                    <li><strong>🌍 International:</strong> Visit findahelpline.com for resources by country</li>
                  </ul>
                </div>
                <p className="text-sm leading-relaxed">
                  While our AI characters are instructed to encourage users in distress to seek professional help, AI responses cannot replace real crisis support. Do not rely on the App in an emergency.
                </p>
              </div>

              {/* 4 */}
              <div>
                <h3 className="text-lg font-bold mb-3">4. Assumption of Risk — Fitness &amp; Physical Activity</h3>
                <p className="text-sm leading-relaxed mb-2">
                  <strong>Before beginning any exercise program, consult your physician.</strong> This is especially important if you have any of the following conditions: heart disease, high blood pressure, diabetes, joint or bone disorders, chronic pain, pregnancy, recent surgery, or any other condition that may be affected by physical activity.
                </p>
                <p className="text-sm leading-relaxed mb-2">By participating in workouts or physical activity through the App, you acknowledge that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Physical exercise involves inherent risks, including serious injury or death</li>
                  <li>You have completed (or waive the right to complete) a physical activity readiness assessment (PAR-Q) with your healthcare provider</li>
                  <li>You are voluntarily participating and assume full personal responsibility</li>
                  <li>You will stop immediately if you experience pain, dizziness, shortness of breath, or any warning symptom</li>
                  <li>You will modify or skip any exercise that is beyond your current ability</li>
                  <li>AI-generated workout plans are general suggestions, not personalized medical exercise prescriptions</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  Prosperity Revived is not responsible for any injuries or health issues resulting from your participation in any workout or physical activity.
                </p>
              </div>

              {/* 5 */}
              <div>
                <h3 className="text-lg font-bold mb-3">5. Nutrition &amp; Allergen Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">Nutrition content in the App, including AI-generated meal plans, recipes, and macro targets, is not:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Medical nutrition therapy</li>
                  <li>Personalized dietary prescriptions from a licensed dietitian</li>
                  <li>A substitute for professional guidance from a physician or registered dietitian</li>
                </ul>
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 rounded-xl p-3 mt-3 mb-3">
                  <p className="text-sm font-bold text-orange-800 mb-1">⚠ Allergen Warning</p>
                  <p className="text-sm text-orange-900 leading-relaxed">
                    AI-generated recipes and ingredient lists <strong>may be incomplete or inaccurate</strong> regarding allergens and nutritional content. <strong>Always verify allergen information independently</strong> by checking food packaging and consulting your healthcare provider before consuming any food if you have allergies, food sensitivities, or medical dietary restrictions. Do not rely on AI-generated allergen information for severe or life-threatening allergies.
                  </p>
                </div>
                <p className="text-sm leading-relaxed">
                  Prosperity Revived is not liable for any adverse reactions, allergic reactions, or health outcomes related to nutrition content or AI-generated recipes.
                </p>
              </div>

              {/* 6 */}
              <div>
                <h3 className="text-lg font-bold mb-3">6. Emotional &amp; Mental Wellness Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">The App includes emotional check-ins, mindset tools, reflections, affirmations, journaling, and Hannah's AI coaching conversations. These features:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Are for personal growth and motivation only</li>
                  <li>Are <strong>not therapy, counseling, or clinical mental health treatment</strong></li>
                  <li>Are not crisis intervention services</li>
                  <li>Do not establish a therapist-client or doctor-patient relationship</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3">
                  Hannah's AI is informed by general coaching frameworks and psychological concepts (including attachment theory and cognitive reframing). These are presented for motivational and educational purposes only. If you are dealing with diagnosed mental health conditions, trauma, or serious emotional distress, please work with a licensed mental health professional.
                </p>
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  In a crisis: call or text 988, or text HOME to 741741.
                </p>
              </div>

              {/* 7 */}
              <div>
                <h3 className="text-lg font-bold mb-3">7. Financial Content Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">
                  The "Financial Freedom Through Faith" coaching plan and any other financial content in the App is for <strong>educational and faith-based motivational purposes only</strong>. It does not constitute financial advice, investment advice, tax advice, or legal advice. You should consult a licensed financial advisor, CPA, or attorney before making any financial decisions.
                </p>
                <p className="text-sm leading-relaxed">
                  Prosperity Revived is not responsible for any financial decisions made based on App content.
                </p>
              </div>

              {/* 8 */}
              <div>
                <h3 className="text-lg font-bold mb-3">8. Spiritual Content Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">The App includes Bible verses, devotionals, faith-based reflections, and spiritual guidance. You acknowledge that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Spiritual content is interpretive and reflects a Christian faith perspective</li>
                  <li>AI-generated scripture text is for reference only — always verify against a physical Bible</li>
                  <li>You are responsible for how you apply spiritual content in your life</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  Prosperity Revived is not liable for decisions made based on spiritual or faith-based content.
                </p>
              </div>

              {/* 9 */}
              <div>
                <h3 className="text-lg font-bold mb-3">9. User Responsibility</h3>
                <p className="text-sm leading-relaxed mb-2">You agree to:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Use the App safely and responsibly</li>
                  <li>Exercise within your physical limits</li>
                  <li>Verify AI-generated information before acting on it, especially regarding allergens and health conditions</li>
                  <li>Seek professional help when needed — medical, mental health, nutritional, or financial</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">You are solely responsible for your own actions and decisions.</p>
              </div>

              {/* 10 */}
              <div>
                <h3 className="text-lg font-bold mb-3">10. No Emergency Services</h3>
                <p className="text-sm leading-relaxed mb-2">The App does not provide emergency medical or crisis support. It cannot:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Call emergency services on your behalf</li>
                  <li>Monitor your physical condition in real time</li>
                  <li>Detect or respond to medical emergencies</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  If you are experiencing a medical or mental health emergency, call 911 or your local emergency number immediately. For mental health crises, call or text 988.
                </p>
              </div>

              {/* 11 */}
              <div>
                <h3 className="text-lg font-bold mb-3">11. Limitation of Liability</h3>
                <p className="text-sm leading-relaxed mb-2">
                  To the fullest extent permitted by law, Prosperity Revived LLC, and its owners, employees, and affiliates are not liable for:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Physical injuries from workouts</li>
                  <li>Adverse reactions to nutrition or recipe content</li>
                  <li>Allergen-related incidents from AI-generated recipes</li>
                  <li>Emotional or psychological outcomes</li>
                  <li>Financial decisions made based on App content</li>
                  <li>Misinterpretation or misapplication of any App content</li>
                  <li>Any harm resulting from reliance on AI-generated content</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3 font-semibold">Your use of the App is at your own risk.</p>
              </div>

              {/* 12 */}
              <div>
                <h3 className="text-lg font-bold mb-3">12. Indemnification</h3>
                <p className="text-sm leading-relaxed">
                  You agree to indemnify and hold harmless Prosperity Revived LLC from any claims, damages, losses, or expenses arising from your use of the App, your participation in any activities suggested by the App, or your violation of any Terms or this Waiver.
                </p>
              </div>

              {/* 13 */}
              <div>
                <h3 className="text-lg font-bold mb-3">13. Acceptance of Waiver</h3>
                <p className="text-sm leading-relaxed mb-2">By using the App, you acknowledge that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>You have read and understood this Waiver in full</li>
                  <li>You voluntarily accept all risks described herein</li>
                  <li>You agree to release Prosperity Revived from liability to the fullest extent permitted by law</li>
                  <li>You agree to comply with all Terms &amp; Conditions</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3 font-semibold">If you do not agree to this Waiver, stop using the App immediately.</p>
              </div>

              {/* 14 */}
              <div>
                <h3 className="text-lg font-bold mb-3">14. Contact Us</h3>
                <div className="bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-lg p-4 mt-3">
                  <p className="text-sm font-semibold">Prosperity Revived LLC</p>
                  <p className="text-sm text-[#FD9C2D]">Prosperityrevived2025@gmail.com</p>
                  <p className="text-sm text-[#FD9C2D]">www.prosperityrevived.com</p>
                </div>
              </div>

              <div className="text-center pt-6 pb-4 border-t border-gray-200 dark:border-white/10 dark:border-white/10">
                <p className="text-xs text-gray-500 dark:text-gray-300">© 2026 Prosperity Revived LLC. All rights reserved.</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

