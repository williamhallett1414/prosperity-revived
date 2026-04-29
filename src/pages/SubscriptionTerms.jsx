import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, CreditCard, FileText} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SubscriptionTerms() {
  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3C4E53] to-[#AFC7E3] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Subscription Terms</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Plan details</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Settings')}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
            </Link>
            <h1 className="text-2xl font-bold text-[#0A1A2F] dark:text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#FD9C2D]" />
              Subscription Terms
            </h1>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 text-[#0A1A2F] dark:text-white pr-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Subscription Terms</h2>
                <h3 className="text-lg font-semibold mb-1">Prosperity Revived</h3>
                <p className="text-sm text-gray-500">Last Updated: 12 March 2026</p>
              </div>

              {/* FTC-required auto-renewal disclosure — must appear before purchase */}
              <div className="bg-[#0A1A2F] rounded-2xl p-5 mb-2">
                <p className="text-sm font-bold text-[#FD9C2D] mb-3">📋 Important Subscription Disclosure (Required by Law)</p>
                <ul className="space-y-2 text-sm text-white">
                  <li>✔ <strong>Subscriptions automatically renew</strong> at the end of each billing period at the then-current rate until you cancel.</li>
                  <li>✔ Your payment method will be <strong>charged automatically</strong> at the start of each new billing period.</li>
                  <li>✔ To avoid being charged for the next period, <strong>you must cancel before the renewal date</strong>.</li>
                  <li>✔ <strong>Deleting the App does not cancel your subscription.</strong></li>
                  <li>✔ Cancel anytime through your <strong>Apple App Store</strong> or <strong>Google Play Store</strong> account settings.</li>
                  <li>✔ Free trials <strong>automatically convert to paid subscriptions</strong> unless canceled before the trial ends.</li>
                </ul>
              </div>

              <p className="text-sm leading-relaxed">
                These Subscription Terms govern your purchase and use of any subscription-based features within the Prosperity Revived App, operated by <strong>Prosperity Revived LLC</strong>, a Virginia limited liability company. By purchasing or accessing a subscription, you agree to these Terms.
              </p>

              {/* 1 */}
              <div>
                <h3 className="text-lg font-bold mb-3">1. What Your Subscription Includes</h3>
                <p className="text-sm leading-relaxed mb-2">A Prosperity Revived subscription may include access to:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Advanced workout programs and personalized coaching plans</li>
                  <li>Premium nutrition content and AI-generated meal plans</li>
                  <li>Full access to AI chatbot coaching sessions (Gideon, Hannah, Coach David, Chef Daniel, Coach Paul)</li>
                  <li>Personal growth pathways and coaching programs</li>
                  <li>Exclusive spiritual content and devotionals</li>
                  <li>Enhanced journaling and reflection features</li>
                  <li>Community features and group access</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">Specific features per plan tier are displayed at the time of purchase within the App. Features may be updated, added, or removed over time — we will notify you of material changes.</p>
              </div>

              {/* 2 */}
              <div>
                <h3 className="text-lg font-bold mb-3">2. Billing &amp; Automatic Renewal</h3>

                <h4 className="font-semibold text-base mb-2">A. Payment Processing</h4>
                <p className="text-sm leading-relaxed mb-2">All payments are processed securely through your app store:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Apple App Store (iOS users)</li>
                  <li>Google Play Store (Android users)</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">Prosperity Revived does not collect or store your payment card details.</p>

                <h4 className="font-semibold text-base mt-4 mb-2">B. Billing Cycle</h4>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Subscriptions are billed on a recurring basis (monthly or annually, as selected)</li>
                  <li>Your billing cycle begins on the date of your initial purchase or the end of your free trial</li>
                  <li>You will be charged the rate shown at the time of your purchase confirmation</li>
                </ul>

                <h4 className="font-semibold text-base mt-4 mb-2">C. Automatic Renewal</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-2">
                  <p className="text-sm text-yellow-900">
                    <strong>Your subscription will automatically renew</strong> at the end of each billing period. Your payment method on file with your app store will be charged automatically unless you cancel at least 24 hours before the end of the current period. You authorize your app store to charge your payment method for each renewal.
                  </p>
                </div>
              </div>

              {/* 3 */}
              <div>
                <h3 className="text-lg font-bold mb-3">3. Free Trials</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
                  <p className="text-sm text-blue-900">
                    <strong>Important:</strong> If a free trial is offered, it converts automatically to a paid subscription at the end of the trial period unless you cancel before the trial ends. You will be charged the applicable subscription rate on the day your trial expires. Cancel through your app store at any time before the trial ends to avoid charges.
                  </p>
                </div>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Free trials begin immediately upon activation</li>
                  <li>Only one free trial per account per offer, unless otherwise stated</li>
                  <li>Trial eligibility is determined by your app store</li>
                </ul>
              </div>

              {/* 4 */}
              <div>
                <h3 className="text-lg font-bold mb-3">4. Cancellation</h3>
                <p className="text-sm leading-relaxed mb-2">You may cancel your subscription at any time through your app store account settings:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li><strong>iOS:</strong> Settings → [Your Name] → Subscriptions → Prosperity Revived → Cancel</li>
                  <li><strong>Android:</strong> Google Play Store → Profile → Payments &amp; subscriptions → Subscriptions → Prosperity Revived → Cancel</li>
                </ul>
                <div className="bg-gray-100 rounded-xl p-3 mt-3">
                  <p className="text-sm font-semibold mb-1">Important cancellation notes:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li><strong>Deleting the App does NOT cancel your subscription</strong></li>
                    <li>Canceling stops future charges but does not refund the current billing period</li>
                    <li>You retain access to premium features until the end of the current paid period</li>
                    <li>Prosperity Revived cannot cancel subscriptions on your behalf</li>
                  </ul>
                </div>
              </div>

              {/* 5 */}
              <div>
                <h3 className="text-lg font-bold mb-3">5. Price Changes</h3>
                <p className="text-sm leading-relaxed mb-2">If subscription pricing changes:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>You will be notified in advance by your app store and/or within the App</li>
                  <li>Continued use after the change constitutes acceptance of the new price</li>
                  <li>If you do not accept the new price, cancel before your next billing date</li>
                </ul>
              </div>

              {/* 6 */}
              <div>
                <h3 className="text-lg font-bold mb-3">6. Refunds</h3>
                <p className="text-sm leading-relaxed mb-2">Refunds are handled exclusively by your app store:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li><strong>Apple:</strong> reportaproblem.apple.com</li>
                  <li><strong>Google:</strong> play.google.com/store/account/subscriptions</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">Prosperity Revived does not issue refunds directly. Refund eligibility is determined by your app store's policies.</p>
              </div>

              {/* 7 */}
              <div>
                <h3 className="text-lg font-bold mb-3">7. Account Requirements</h3>
                <p className="text-sm leading-relaxed mb-2">To maintain access to subscription features, you must:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Keep your account active and in good standing</li>
                  <li>Maintain a valid payment method with your app store</li>
                  <li>Comply with all Terms &amp; Conditions</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">Subscriptions are personal and non-transferable. Sharing accounts or subscription access is prohibited.</p>
              </div>

              {/* 8 */}
              <div>
                <h3 className="text-lg font-bold mb-3">8. Service Availability</h3>
                <p className="text-sm leading-relaxed mb-2">While we strive for uninterrupted service, we do not guarantee continuous access due to maintenance, updates, or technical issues. No refunds are issued for temporary downtime.</p>
                <p className="text-sm leading-relaxed">Prosperity Revived may modify, update, or remove features at any time. Material changes to features included in your subscription will be communicated in advance.</p>
              </div>

              {/* 9 */}
              <div>
                <h3 className="text-lg font-bold mb-3">9. Termination for Cause</h3>
                <p className="text-sm leading-relaxed mb-2">We may suspend or terminate your subscription if you violate the Terms &amp; Conditions, misuse the App, or engage in harmful or illegal behavior. If terminated for violations, no refund is provided.</p>
              </div>

              {/* 10 */}
              <div>
                <h3 className="text-lg font-bold mb-3">10. No Professional Services</h3>
                <p className="text-sm leading-relaxed mb-2">Subscription content is for educational and motivational purposes only and does not constitute:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Medical advice</li>
                  <li>Mental health therapy</li>
                  <li>Registered dietitian services</li>
                  <li>Certified personal training</li>
                  <li>Financial or legal advice</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2 font-semibold">You assume all risks associated with using subscription content. See our full Health &amp; Wellness Waiver for details.</p>
              </div>

              {/* 11 */}
              <div>
                <h3 className="text-lg font-bold mb-3">11. Governing Law</h3>
                <p className="text-sm leading-relaxed">
                  These Terms are governed by the laws of the State of [Your State], without regard to conflict-of-law principles. See Section 18 of the Terms &amp; Conditions for dispute resolution details.
                </p>
              </div>

              {/* 12 */}
              <div>
                <h3 className="text-lg font-bold mb-3">12. Contact Us</h3>
                <div className="bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-lg p-4 mt-3">
                  <p className="text-sm font-semibold">Prosperity Revived LLC</p>
                  <p className="text-sm text-[#FD9C2D]">Prosperityrevived2025@gmail.com</p>
                  <p className="text-sm text-[#FD9C2D]">www.prosperityrevived.com</p>
                </div>
              </div>

              <div className="text-center pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                <p className="text-xs text-gray-500">© 2026 Prosperity Revived LLC. All rights reserved.</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

