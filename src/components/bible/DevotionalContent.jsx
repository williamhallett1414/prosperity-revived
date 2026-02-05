import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function DevotionalContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Who God Says I Am</h1>
        </div>
        <p className="text-white/90 text-sm">A devotional on identity in Christ</p>
      </motion.div>

      {/* Introduction */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#c9a227]" />
          Introduction
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>Every day, the world tries to hand you a name tag. Some labels come from your past, some from people who misunderstood you, and some from moments you wish you could erase. Others come from achievements, titles, or roles you've carried—parent, leader, provider, survivor. But beneath all of that, there is a deeper truth about you that cannot be shaken, edited, or voted on. It was spoken long before you were born and will remain long after every season of your life changes.</p>
          
          <p>We live in a culture that constantly asks, "Who are you?"—but rarely gives you the space to answer from a place of truth. Instead, it pressures you to define yourself by performance, perfection, or comparison. And if you're not careful, you'll start believing the loudest voice instead of the truest one.</p>
          
          <p>But God's voice is different. His words don't wound—they restore. His identity for you doesn't shrink you—it strengthens you. When God speaks over your life, He doesn't describe who you've been; He declares who you were created to be. He calls you chosen when you feel overlooked. He calls you loved when you feel unworthy. He calls you His masterpiece even when you feel like a mess in progress.</p>
          
          <p>This devotional is an invitation to step out of the shadows of false identity and into the light of God's truth. It's a reminder that your identity is not fragile, not up for negotiation, and not dependent on anyone's approval. It is rooted in the unchanging character of a God who crafted you with intention, purpose, and love.</p>
          
          <p>Today, let's slow down, breathe, and rediscover who God says you are—because when you know that, everything else in your life begins to align.</p>
        </div>
      </Card>

      {/* Key Bible Verses */}
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-[#c9a227]">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Key Bible Verses</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">1. You Are Known and Appointed</h3>
            <p className="italic text-gray-700 dark:text-gray-300 mb-2">"Before I formed you in the womb I knew you, before you were born I set you apart…" — Jeremiah 1:5</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">This wasn't just spoken to Jeremiah—it reveals God's pattern. Identity begins in the mind of God long before it's lived out on earth.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">2. You Are Adopted Into God's Family</h3>
            <p className="italic text-gray-700 dark:text-gray-300 mb-2">"The Spirit you received brought about your adoption to sonship. And by Him we cry, 'Abba, Father.'" — Romans 8:15</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">In ancient Rome, adoption was permanent and legally stronger than biological ties. Paul uses this cultural truth to show how secure your identity is in Christ.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">3. You Are Sealed With Purpose</h3>
            <p className="italic text-gray-700 dark:text-gray-300 mb-2">"Having believed, you were marked in Him with a seal, the promised Holy Spirit…" — Ephesians 1:13</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">A seal in biblical times represented ownership, authority, and protection. God's seal on your life is unbreakable.</p>
          </div>
        </div>
      </Card>

      {/* Reflection */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Reflection</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>Identity has always been a battleground. From Genesis to Revelation, you see a pattern: God declares who His people are, and the enemy immediately tries to distort, distract, or destroy that identity. This isn't new—it's ancient spiritual warfare. The first attack in Scripture wasn't on Eve's body or her circumstances; it was on her identity and her relationship with God. The serpent whispered, "Did God really say…?"—a question designed to plant doubt about God's character and her own.</p>
          
          <p>Throughout biblical history, God repeatedly affirmed His people's identity because He knew how easily they forgot it. When Israel was enslaved in Egypt, they weren't just physically oppressed—they were mentally conditioned to believe they were nothing more than laborers and property. But when God delivered them, He didn't just bring them out of Egypt; He reminded them who they were: "My treasured possession… a kingdom of priests and a holy nation." Their identity was restored before their destiny unfolded.</p>
          
          <p>Fast forward to the New Testament. Jesus begins His ministry with a public declaration of identity: "This is my beloved Son, in whom I am well pleased." Immediately after, He is led into the wilderness—where the enemy attacks the very thing God just affirmed: "If You are the Son of God…" The enemy always targets identity because identity determines authority.</p>
          
          <p>And today, the same pattern continues. The enemy doesn't need to destroy your life if he can distort your identity. If he can convince you that you're unworthy, unloved, forgotten, or insignificant, he can keep you from walking in the fullness of your calling. But God's Word cuts through every lie with truth that has stood firm for thousands of years.</p>
        </div>
      </Card>

      {/* Reflection Questions */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Reflection Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Identity & Internal Dialogue</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <li>What internal narratives or quiet thoughts about myself have I been believing that contradict God's Word, and where did those narratives originate in my life story?</li>
              <li>When I think about who God says I am, which part feels hardest to accept—and what does that resistance reveal about my wounds, fears, or past experiences?</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Spiritual Warfare & Identity</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <li>In what areas of my life do I feel the enemy tries hardest to distort my identity, and how can I use Scripture to confront those lies in real time?</li>
              <li>When I look at the patterns of my life, where can I see moments where God affirmed my identity, even when I didn't recognize it at the time?</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Purpose & Calling</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <li>If I fully embraced my identity as God's masterpiece, what bold decisions, conversations, or steps of faith would I take that I've been avoiding?</li>
              <li>How would my relationships, work ethic, or daily habits shift if I lived from a place of God-given identity instead of insecurity or comparison?</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Emotional Healing & Restoration</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <li>What past labels—spoken by family, friends, culture, or even myself—still cling to me, and what would it look like to surrender them to God today?</li>
              <li>Where in my life do I still feel "enslaved" to old identities, and how does God's deliverance of Israel from Egypt speak to my own journey of freedom?</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Call to Christ */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-purple-600" />
          Call to Christ
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="font-semibold">Stepping Into the Identity God Spoke Over You</p>
          <p>When you discover who God says you are, something awakens inside you. But identity isn't fully realized until it's rooted in Christ. You can know the verses, repeat the affirmations, and even desire change—but true identity transformation happens when you walk closely with Jesus.</p>
          
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white">How to Grow in Christ Through Identity</h3>
            <ol className="list-decimal pl-5 space-y-3 text-sm">
              <li><strong>Let God's Voice Become the Loudest Voice</strong> - Spend intentional time asking God to reveal how He sees you.</li>
              <li><strong>Immerse Yourself in Scripture</strong> - Read identity-focused passages repeatedly and out loud.</li>
              <li><strong>Confront Every Lie With Truth</strong> - Identify false labels and replace them with God's declarations.</li>
              <li><strong>Surround Yourself With Truth-Speakers</strong> - Connect with believers who see you as God sees you.</li>
              <li><strong>Practice Obedience as Expression</strong> - Make decisions that reflect your identity as God's masterpiece.</li>
              <li><strong>Invite God Into Broken Places</strong> - Ask God to heal where you were mislabeled.</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Prayer */}
      <Card className="p-6 bg-gradient-to-br from-[#c9a227]/10 to-[#8fa68a]/10 border-l-4 border-[#c9a227]">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Prayer</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
          Heavenly Father, thank You for calling me chosen, loved, and wonderfully made. Help me silence every voice that contradicts Your truth. Renew my mind and reshape my identity according to Your Word. Strengthen me to walk boldly in the purpose You designed for me. Let my life reflect Your glory and remind me daily that I am Your masterpiece. In Jesus' name, Amen.
        </p>
      </Card>

      {/* Conclusion */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Conclusion</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>As you close this devotional, pause for a moment and let the truth settle into your spirit: you are who God says you are. Not who life said you were. Not who pain shaped you to be. Not who people assumed you were. Your identity is anchored in the eternal voice of God—the One who formed you, called you, and set you apart long before you ever took your first breath.</p>
          
          <p>This journey of rediscovering your identity isn't meant to end here. In fact, this is only the beginning. Every day, God invites you deeper—deeper into His presence, deeper into His truth, deeper into the version of yourself that He designed with intention and love.</p>
          
          <p className="font-semibold text-[#1a1a2e] dark:text-white">You are chosen. You are loved. You are crafted with purpose. You are God's masterpiece.</p>
          
          <p>And the best part? God is not done writing your story. There is more to discover, more to grow into, more to become. Lean in. Stay expectant. Keep seeking. Because the more you learn about who God is, the more you'll understand who you truly are.</p>
        </div>
      </Card>
    </div>
  );
}