import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SubscriptionTerms() {
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
              <CreditCard className="w-6 h-6 text-[#FD9C2D]" />
              Subscription Terms
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 text-[#0A1A2F] pr-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Subscription Terms</h2>
                <h3 className="text-lg font-semibold mb-1">Prosperity Revived</h3>
                <p className="text-sm text-gray-500">Last Updated: 18 February 2026</p>
              </div>

              <p className="text-sm leading-relaxed">
                These Subscription Terms ("Terms") govern your purchase and use of any subscription based features within the Prosperity Revived mobile application ("the App"). By purchasing or accessing a subscription, you agree to these Terms. If you do not agree, do not purchase or use subscription features.
              </p>

              <div>
                <h3 className="text-lg font-bold mb-3">1. Overview of Subscription Services</h3>
                <p className="text-sm leading-relaxed mb-2">
                  Prosperity Revived may offer premium features through paid subscriptions, including but not limited to:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Advanced workout programs</li>
                  <li>Premium nutrition content</li>
                  <li>Personal growth tools</li>
                  <li>Exclusive spiritual content</li>
                  <li>Enhanced journaling features</li>
                  <li>Additional community features</li>
                  <li>Ad free experience (if applicable)</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  The specific features included in each subscription tier will be displayed within the App.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">2. Payment & Billing</h3>
                
                <h4 className="font-semibold text-base mb-2">A. Payment Processing</h4>
                <p className="text-sm leading-relaxed mb-2">All payments are processed securely through:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Apple App Store</li>
                  <li>Google Play Store</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Prosperity Revived does not collect or store your full payment information.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">B. Billing Cycle</h4>
                <p className="text-sm leading-relaxed mb-2">Subscriptions are billed:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Automatically</li>
                  <li>Recurring (monthly or yearly)</li>
                  <li>At the rate shown at the time of purchase</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Your billing cycle begins on the date of purchase.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">C. Automatic Renewal</h4>
                <p className="text-sm leading-relaxed mb-2">Your subscription will automatically renew unless:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>You cancel it through your app store</li>
                  <li>Your payment method fails</li>
                  <li>The subscription is discontinued</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  You authorize the app store to charge your payment method for each renewal.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">3. Free Trials</h3>
                <p className="text-sm leading-relaxed mb-2">If a free trial is offered:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>It begins immediately upon activation</li>
                  <li>It converts to a paid subscription unless canceled before the trial ends</li>
                  <li>You will be charged automatically at the end of the trial period</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  You may only receive one free trial per account unless otherwise stated.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">4. Price Changes</h3>
                <p className="text-sm leading-relaxed mb-2">
                  Prosperity Revived may update subscription pricing. If prices change:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>You will be notified by the app store</li>
                  <li>You may choose to continue or cancel</li>
                  <li>Continued use after the change constitutes acceptance</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  If you do not agree to the new price, cancel before the next billing cycle.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">5. Cancellation Policy</h3>
                <p className="text-sm leading-relaxed mb-2">You may cancel your subscription at any time through:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Apple App Store subscription settings</li>
                  <li>Google Play Store subscription settings</li>
                </ul>
                
                <p className="text-sm leading-relaxed mt-3 mb-2 font-semibold">Important notes:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Deleting the App does not cancel your subscription</li>
                  <li>Canceling prevents future charges but does not refund past payments</li>
                  <li>You will retain access until the end of the current billing period</li>
                </ul>
                
                <p className="text-sm leading-relaxed mt-2">
                  Prosperity Revived cannot cancel subscriptions on your behalf.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">6. Refund Policy</h3>
                <p className="text-sm leading-relaxed mb-2">Refunds are handled exclusively by:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Apple App Store</li>
                  <li>Google Play Store</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Prosperity Revived does not issue refunds directly.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  Refund eligibility is determined by the policies of your app store.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">7. Account Requirements</h3>
                <p className="text-sm leading-relaxed mb-2">
                  To maintain access to subscription features, you must:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Keep your account active</li>
                  <li>Maintain a valid payment method</li>
                  <li>Not violate any Terms or policies</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Failure to comply may result in suspension or loss of access.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">8. Access to Subscription Features</h3>
                <p className="text-sm leading-relaxed mb-2">Subscription features are:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Personal</li>
                  <li>Non transferable</li>
                  <li>For your individual use only</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  Sharing accounts or subscription access is prohibited.
                </p>
                <p className="text-sm leading-relaxed mt-2">
                  Prosperity Revived may modify, update, or remove subscription features as needed to improve the App.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">9. Service Availability</h3>
                <p className="text-sm leading-relaxed mb-2">
                  While we strive for uninterrupted service, we do not guarantee:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Continuous access</li>
                  <li>Error free performance</li>
                  <li>Uninterrupted availability</li>
                </ul>
                
                <p className="text-sm leading-relaxed mt-3 mb-2">Temporary outages may occur due to:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Maintenance</li>
                  <li>Updates</li>
                  <li>Technical issues</li>
                  <li>Third party service interruptions</li>
                </ul>
                
                <p className="text-sm leading-relaxed mt-2">
                  No refunds will be issued for temporary downtime.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">10. Termination by Prosperity Revived</h3>
                <p className="text-sm leading-relaxed mb-2">
                  We may suspend or terminate your subscription if you:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Violate the User Agreement</li>
                  <li>Misuse the App</li>
                  <li>Engage in harmful or illegal behavior</li>
                  <li>Attempt to hack or disrupt the App</li>
                </ul>
                <p className="text-sm leading-relaxed mt-2">
                  If terminated for violations, you are not entitled to a refund.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">11. No Medical, Mental Health, or Professional Services</h3>
                <p className="text-sm leading-relaxed mb-2">Subscription content may include:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Fitness programs</li>
                  <li>Nutrition suggestions</li>
                  <li>Emotional tools</li>
                  <li>Spiritual content</li>
                </ul>
                
                <p className="text-sm leading-relaxed mt-3 mb-2">These are not substitutes for:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Medical advice</li>
                  <li>Therapy</li>
                  <li>Counseling</li>
                  <li>Professional nutrition guidance</li>
                </ul>
                
                <p className="text-sm leading-relaxed mt-2 font-semibold">
                  You assume all risks associated with using subscription content.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">12. Governing Law</h3>
                <p className="text-sm leading-relaxed">
                  These Terms are governed by the laws of the jurisdiction in which Prosperity Revived operates, without regard to conflict of law principles.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">13. Contact Us</h3>
                <p className="text-sm leading-relaxed mb-2">
                  For questions or concerns about Subscription Terms:
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