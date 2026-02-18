import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HealthWellnessWaiver() {
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
              <Heart className="w-6 h-6 text-[#FD9C2D]" />
              Health & Wellness Waiver
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 text-[#0A1A2F] pr-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Health & Wellness Waiver</h2>
                <h3 className="text-lg font-semibold mb-1">Prosperity Revived</h3>
                <p className="text-sm text-gray-500">Last Updated: 18 February 2026</p>
              </div>

              <p className="text-sm leading-relaxed">
                This Health & Wellness Waiver ("Waiver") applies to all users of the Prosperity Revived mobile application ("the App"). By accessing or using the App, you acknowledge and agree to the terms of this Waiver. If you do not agree, discontinue use immediately.
              </p>

              <div>
                <h3 className="text-lg font-bold mb-3">1. General Acknowledgment</h3>
                <p className="text-sm leading-relaxed mb-2">
                  You understand and agree that Prosperity Revived provides:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Fitness and workout content</li>
                  <li>Nutrition suggestions</li>
                  <li>Emotional and personal growth tools</li>
                  <li>Spiritual and Bible based content</li>
                  <li>Journaling and reflection tools</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  These features are for general informational and educational purposes only.
                </p>
                
                <p className="text-sm leading-relaxed mt-3 mb-2 font-semibold">
                  The App does not provide:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Medical advice</li>
                  <li>Mental health treatment</li>
                  <li>Therapy</li>
                  <li>Dietary prescriptions</li>
                  <li>Professional counseling</li>
                  <li>Emergency support</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">2. Assumption of Risk (Fitness & Physical Activity)</h3>
                <p className="text-sm leading-relaxed mb-2">
                  By participating in any workout, exercise, or physical activity provided by the App, you acknowledge and agree that:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Physical exercise involves inherent risks</li>
                  <li>Injuries can occur, including serious or permanent harm</li>
                  <li>You are voluntarily choosing to participate</li>
                  <li>You assume full responsibility for your health and safety</li>
                </ul>

                <p className="text-sm leading-relaxed mt-3 mb-2">You agree to:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Consult a physician before beginning any exercise program</li>
                  <li>Stop immediately if you feel pain, dizziness, or discomfort</li>
                  <li>Modify or skip exercises as needed based on your ability</li>
                </ul>

                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  Prosperity Revived is not responsible for injuries or health issues resulting from your participation in workouts or physical activities.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">3. Nutrition Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">
                  Nutrition content in the App is not:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Medical nutrition therapy</li>
                  <li>Personalized dietary advice</li>
                  <li>A substitute for professional guidance</li>
                </ul>

                <p className="text-sm leading-relaxed mt-3 mb-2">You acknowledge that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Nutrition needs vary by individual</li>
                  <li>You are responsible for your own dietary decisions</li>
                  <li>You should consult a licensed nutritionist or physician for personalized advice</li>
                </ul>

                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  Prosperity Revived is not liable for any adverse reactions, allergies, or health outcomes related to nutrition suggestions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">4. Emotional & Mental Wellness Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">The App includes:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Emotional check ins</li>
                  <li>Mindset tools</li>
                  <li>Reflections</li>
                  <li>Affirmations</li>
                  <li>Journaling</li>
                  <li>Identity in Christ content</li>
                </ul>

                <p className="text-sm leading-relaxed mt-3 mb-2 font-semibold">These features are not:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Therapy</li>
                  <li>Counseling</li>
                  <li>Crisis intervention</li>
                  <li>Mental health treatment</li>
                </ul>

                <p className="text-sm leading-relaxed mt-3 mb-2">
                  If you are experiencing emotional distress, you agree to seek help from:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>A licensed mental health professional</li>
                  <li>A counselor</li>
                  <li>A crisis hotline</li>
                  <li>Emergency services</li>
                </ul>

                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  Prosperity Revived is not responsible for emotional or psychological outcomes resulting from use of the App.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">5. Spiritual Content Disclaimer</h3>
                <p className="text-sm leading-relaxed mb-2">The App includes:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Bible verses</li>
                  <li>Devotionals</li>
                  <li>Faith based reflections</li>
                  <li>Identity in Christ teachings</li>
                </ul>

                <p className="text-sm leading-relaxed mt-3 mb-2">You acknowledge that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Spiritual content is interpretive</li>
                  <li>You are responsible for how you apply it</li>
                  <li>Prosperity Revived does not guarantee specific spiritual outcomes</li>
                </ul>

                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  Prosperity Revived is not liable for decisions made based on spiritual or faith based content.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">6. User Responsibility</h3>
                <p className="text-sm leading-relaxed mb-2">You agree to:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Use the App safely and responsibly</li>
                  <li>Follow instructions within your physical limits</li>
                  <li>Avoid activities that may cause harm</li>
                  <li>Seek professional help when needed</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  You are solely responsible for your actions and decisions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">7. No Emergency Services</h3>
                <p className="text-sm leading-relaxed mb-2">The App does not provide:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Emergency medical support</li>
                  <li>Crisis response</li>
                  <li>Real time monitoring</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  If you are experiencing a medical or mental health emergency, call 911 or your local emergency number immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">8. Limitation of Liability</h3>
                <p className="text-sm leading-relaxed mb-2">
                  To the fullest extent permitted by law, Prosperity Revived, its owners, employees, partners, and affiliates are not liable for:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Injuries</li>
                  <li>Illness</li>
                  <li>Emotional distress</li>
                  <li>Mental health outcomes</li>
                  <li>Allergic reactions</li>
                  <li>Physical harm</li>
                  <li>Misinterpretation of content</li>
                  <li>Decisions made based on App content</li>
                  <li>Any damages arising from use or misuse of the App</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  Your use of the App is at your own risk.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">9. Indemnification</h3>
                <p className="text-sm leading-relaxed mb-2">
                  You agree to indemnify and hold harmless Prosperity Revived from any claims, damages, losses, or expenses arising from:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Your use of the App</li>
                  <li>Your participation in workouts</li>
                  <li>Your application of nutrition or spiritual content</li>
                  <li>Your interactions within Groups</li>
                  <li>Your violation of any Terms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">10. Acceptance of Waiver</h3>
                <p className="text-sm leading-relaxed mb-2">By using the App, you acknowledge that:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>You have read and understood this Waiver</li>
                  <li>You voluntarily accept all risks</li>
                  <li>You agree to release Prosperity Revived from liability</li>
                  <li>You agree to comply with all Terms & Conditions</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3 font-semibold">
                  If you do not agree, you must stop using the App immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">11. Contact Us</h3>
                <p className="text-sm leading-relaxed mb-2">
                  For questions or concerns about this Health & Wellness Waiver:
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