import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Heart, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const devotionalContentMap = {
  'identity-christ': {
    introduction: [
      "Every day, the world tries to hand you a name tag. Some labels come from your past, some from people who misunderstood you, and some from moments you wish you could erase. Others come from achievements, titles, or roles you've carried—parent, leader, provider, survivor. But beneath all of that, there is a deeper truth about you that cannot be shaken, edited, or voted on. It was spoken long before you were born and will remain long after every season of your life changes.",
      "We live in a culture that constantly asks, \"Who are you?\"—but rarely gives you the space to answer from a place of truth. Instead, it pressures you to define yourself by performance, perfection, or comparison. And if you're not careful, you'll start believing the loudest voice instead of the truest one.",
      "But God's voice is different. His words don't wound—they restore. His identity for you doesn't shrink you—it strengthens you. When God speaks over your life, He doesn't describe who you've been; He declares who you were created to be. He calls you chosen when you feel overlooked. He calls you loved when you feel unworthy. He calls you His masterpiece even when you feel like a mess in progress.",
      "This devotional is an invitation to step out of the shadows of false identity and into the light of God's truth. It's a reminder that your identity is not fragile, not up for negotiation, and not dependent on anyone's approval. It is rooted in the unchanging character of a God who crafted you with intention, purpose, and love.",
      "Today, let's slow down, breathe, and rediscover who God says you are—because when you know that, everything else in your life begins to align."
    ],
    verses: [
      {
        title: "You Are Known and Appointed",
        verse: "\"Before I formed you in the womb I knew you, before you were born I set you apart…\" — Jeremiah 1:5",
        insight: "This wasn't just spoken to Jeremiah—it reveals God's pattern. Identity begins in the mind of God long before it's lived out on earth."
      },
      {
        title: "You Are Adopted Into God's Family",
        verse: "\"The Spirit you received brought about your adoption to sonship. And by Him we cry, 'Abba, Father.'\" — Romans 8:15",
        insight: "In ancient Rome, adoption was permanent and legally stronger than biological ties. Paul uses this cultural truth to show how secure your identity is in Christ."
      },
      {
        title: "You Are Sealed With Purpose",
        verse: "\"Having believed, you were marked in Him with a seal, the promised Holy Spirit…\" — Ephesians 1:13",
        insight: "A seal in biblical times represented ownership, authority, and protection. God's seal on your life is unbreakable."
      }
    ],
    reflection: [
      "Identity has always been a battleground. From Genesis to Revelation, you see a pattern: God declares who His people are, and the enemy immediately tries to distort, distract, or destroy that identity. This isn't new—it's ancient spiritual warfare. The first attack in Scripture wasn't on Eve's body or her circumstances; it was on her identity and her relationship with God. The serpent whispered, \"Did God really say…?\"—a question designed to plant doubt about God's character and her own.",
      "Throughout biblical history, God repeatedly affirmed His people's identity because He knew how easily they forgot it. When Israel was enslaved in Egypt, they weren't just physically oppressed—they were mentally conditioned to believe they were nothing more than laborers and property. But when God delivered them, He didn't just bring them out of Egypt; He reminded them who they were: \"My treasured possession… a kingdom of priests and a holy nation.\" Their identity was restored before their destiny unfolded.",
      "Fast forward to the New Testament. Jesus begins His ministry with a public declaration of identity: \"This is my beloved Son, in whom I am well pleased.\" Immediately after, He is led into the wilderness—where the enemy attacks the very thing God just affirmed: \"If You are the Son of God…\" The enemy always targets identity because identity determines authority.",
      "And today, the same pattern continues. The enemy doesn't need to destroy your life if he can distort your identity. If he can convince you that you're unworthy, unloved, forgotten, or insignificant, he can keep you from walking in the fullness of your calling. But God's Word cuts through every lie with truth that has stood firm for thousands of years."
    ],
    reflectionQuestions: [
      {
        category: "Identity & Internal Dialogue",
        questions: [
          "What internal narratives or quiet thoughts about myself have I been believing that contradict God's Word, and where did those narratives originate in my life story?",
          "When I think about who God says I am, which part feels hardest to accept—and what does that resistance reveal about my wounds, fears, or past experiences?"
        ]
      },
      {
        category: "Spiritual Warfare & Identity",
        questions: [
          "In what areas of my life do I feel the enemy tries hardest to distort my identity, and how can I use Scripture to confront those lies in real time?",
          "When I look at the patterns of my life, where can I see moments where God affirmed my identity, even when I didn't recognize it at the time?"
        ]
      },
      {
        category: "Purpose & Calling",
        questions: [
          "If I fully embraced my identity as God's masterpiece, what bold decisions, conversations, or steps of faith would I take that I've been avoiding?",
          "How would my relationships, work ethic, or daily habits shift if I lived from a place of God-given identity instead of insecurity or comparison?"
        ]
      },
      {
        category: "Emotional Healing & Restoration",
        questions: [
          "What past labels—spoken by family, friends, culture, or even myself—still cling to me, and what would it look like to surrender them to God today?",
          "Where in my life do I still feel \"enslaved\" to old identities, and how does God's deliverance of Israel from Egypt speak to my own journey of freedom?"
        ]
      }
    ],
    callToChrist: {
      title: "Stepping Into the Identity God Spoke Over You",
      intro: "When you discover who God says you are, something awakens inside you. But identity isn't fully realized until it's rooted in Christ. You can know the verses, repeat the affirmations, and even desire change—but true identity transformation happens when you walk closely with Jesus.",
      steps: [
        { title: "Let God's Voice Become the Loudest Voice", description: "Spend intentional time asking God to reveal how He sees you." },
        { title: "Immerse Yourself in Scripture", description: "Read identity-focused passages repeatedly and out loud." },
        { title: "Confront Every Lie With Truth", description: "Identify false labels and replace them with God's declarations." },
        { title: "Surround Yourself With Truth-Speakers", description: "Connect with believers who see you as God sees you." },
        { title: "Practice Obedience as Expression", description: "Make decisions that reflect your identity as God's masterpiece." },
        { title: "Invite God Into Broken Places", description: "Ask God to heal where you were mislabeled." }
      ]
    },
    prayer: "Heavenly Father, thank You for calling me chosen, loved, and wonderfully made. Help me silence every voice that contradicts Your truth. Renew my mind and reshape my identity according to Your Word. Strengthen me to walk boldly in the purpose You designed for me. Let my life reflect Your glory and remind me daily that I am Your masterpiece. In Jesus' name, Amen.",
    conclusion: [
      "As you close this devotional, pause for a moment and let the truth settle into your spirit: you are who God says you are. Not who life said you were. Not who pain shaped you to be. Not who people assumed you were. Your identity is anchored in the eternal voice of God—the One who formed you, called you, and set you apart long before you ever took your first breath.",
      "This journey of rediscovering your identity isn't meant to end here. In fact, this is only the beginning. Every day, God invites you deeper—deeper into His presence, deeper into His truth, deeper into the version of yourself that He designed with intention and love.",
      "You are chosen. You are loved. You are crafted with purpose. You are God's masterpiece.",
      "And the best part? God is not done writing your story. There is more to discover, more to grow into, more to become. Lean in. Stay expectant. Keep seeking. Because the more you learn about who God is, the more you'll understand who you truly are."
    ]
  },
  'power-commitment': {
    introduction: [
      "In the landscape of our relationships, few forces are as transformative and enduring as the power of commitment. This unwavering dedication to our partner and to God forms the bedrock of trust, love, and growth that enables us to navigate life's challenges together. As we embark on this devotional journey, we will explore the profound significance of commitment in fostering emotional connection, personal development, and spiritual growth.",
      "The act of committing ourselves to our partner signifies a solemn vow to love, cherish, and support them through the ebbs and flows of life. This enduring promise not only strengthens the bond we share but also provides a stable foundation for individual growth and self-discovery. Moreover, when we invite Christ into our relationship, we tap into a divine wellspring of guidance, wisdom, and grace that nurtures our commitment and enriches our connection.",
      "As we delve into the wisdom of Scripture and reflect on the role of commitment in our relationships, may we be inspired to deepen our dedication to our partner and to God. In doing so, we create a union rooted in love, faith, and the transformative power of devotion, enabling us to cultivate a relationship that flourishes in the light of Christ's love."
    ],
    verses: [
      {
        title: "Commit to the Lord",
        verse: "\"Commit to the Lord whatever you do, and he will establish your plans.\" - Proverbs 16:3 (NIV)",
        insight: "This verse speaks to the significance of dedicating our actions to God and reminds us that commitment to our partner is intertwined with our devotion to the divine."
      },
      {
        title: "For Better or Worse",
        verse: "\"For better or for worse... I will love and honor [you] all the days of my life.\" - Adapted from traditional wedding vows, reflecting the spirit of Ruth 1:16-17",
        insight: "This enduring pledge is rooted in the understanding that love transcends the fluctuations of life's circumstances, as exemplified by Ruth's unwavering faithfulness."
      },
      {
        title: "One Flesh",
        verse: "\"So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.\" - Matthew 19:6 (NIV)",
        insight: "This powerful declaration underscores the indissoluble nature of a union rooted in dedication and trust."
      }
    ],
    reflection: [
      "Commitment, as a foundational principle in our relationships, can be traced back to the earliest accounts of marriage in the Bible. In Genesis 2:24, we read, \"Therefore a man shall leave his father and his mother and hold fast to his wife, and they shall become one flesh.\" This sacred bond between partners lays the groundwork for the enduring commitment that has shaped the institution of marriage throughout history.",
      "The importance of commitment is further emphasized in the wisdom of Proverbs 16:3, which declares, \"Commit to the Lord whatever you do, and he will establish your plans.\" This verse not only speaks to the significance of dedicating our actions to God but also serves as a reminder that commitment to our partner is intertwined with our devotion to the divine. By inviting the Lord into our relationships, we tap into the transformative power of His love and guidance, creating a union that reflects the unity of the Holy Trinity.",
      "In the spirit of traditional wedding vows, commitment is expressed as a lifelong promise to love and honor our partner \"for better or for worse.\" This enduring pledge is rooted in the understanding that love transcends the fluctuations of life's circumstances, as exemplified by the unwavering faithfulness of Ruth to her mother-in-law, Naomi, in the book of Ruth.",
      "Moreover, the sanctity of commitment is echoed in Matthew 19:6, which proclaims, \"So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.\" This powerful declaration underscores the indissoluble nature of a union rooted in dedication and trust, challenging us to treasure and protect the sacred connection we share with our spouse.",
      "As we reflect on the profound significance of commitment in our relationships, let us be reminded that this dedication to our partner is a reflection of our devotion to God. By embracing the transformative potential of commitment, we create a love that transcends the trials and triumphs of life, forging a bond that flourishes in the light of Christ's love."
    ],
    reflectionQuestions: [
      {
        category: "General Reflection",
        questions: [
          "How has your understanding of commitment evolved throughout your relationship, and how has this influenced your emotional connection with your partner?",
          "In what ways can you draw inspiration from biblical accounts of commitment, such as Ruth's devotion to Naomi, to deepen your dedication to your partner?",
          "How can you cultivate a sense of unity and oneness within your relationship, as described in Matthew 19:6, to strengthen your emotional bond?",
          "What spiritual practices can you incorporate into your partnership to foster a shared commitment to God and one another?",
          "As you reflect on the role of commitment in your relationship, how can you support your partner in their personal growth and development, while also nurturing your connection?"
        ]
      }
    ],
    callToChrist: {
      title: "Strengthening Your Commitment",
      intro: "To strengthen your commitment to your partner and your relationship, consider incorporating the following Christ-centered practices into your daily lives:",
      steps: [
        { title: "Pray together daily", description: "Unite your hearts and voices in prayer, seeking God's guidance and provision for your relationship. Praying as a couple not only deepens your spiritual connection but also serves as a powerful expression of your shared commitment to the Lord and to one another." },
        { title: "Study Scripture together", description: "Explore the wisdom of God's Word side by side, discussing its teachings and reflecting on its relevance to your partnership. Engaging in biblical study as a couple invites divine wisdom and insight into your relationship." },
        { title: "Participate in worship and fellowship", description: "Attend church services and join faith-based communities to surround yourselves with like-minded individuals who share your values and beliefs." },
        { title: "Serve together", description: "Demonstrate your dedication to Christ and your love for one another by engaging in acts of service within your community. By working alongside each other in ministry, you can cultivate a deeper sense of purpose and unity." },
        { title: "Practice forgiveness and grace", description: "Embrace the transformative power of forgiveness by extending grace to one another in moments of conflict or hurt. Model your relationship after Christ's example of unconditional love and mercy." },
        { title: "Prioritize spiritual growth", description: "Support each other's individual spiritual journeys by setting goals for personal growth, such as attending retreats, reading Christian literature, or seeking the guidance of a spiritual mentor." }
      ]
    },
    prayer: "Heavenly Father, we thank You for the gift of commitment and the transformative power it holds in our relationships. Guide us in our journey to deepen our dedication to our partner and to You, fostering love, trust, and growth in every aspect of our lives. In Your name, we pray, Amen.",
    conclusion: [
      "As we draw our exploration of commitment and growth to a close, we are reminded of the transformative power of dedication, trust, and love in our relationships. By embracing the significance of commitment and nurturing our connection through shared experiences, vulnerability, and spiritual practices, we can create a partnership that reflects the divine design for marriage.",
      "Throughout this devotional, we have delved into the wisdom of Scripture, uncovering the profound insights it offers on the role of commitment in fostering emotional intimacy and personal growth. We have engaged in self-reflection and dialogue, inviting vulnerability and understanding as we navigate the complexities of our relationships. And we have explored practical strategies for deepening our commitment to our partners and to God, ensuring that our love remains rooted in the eternal truths of our faith.",
      "As you continue on your journey together, remember the lessons and insights gleaned from this devotional. Allow the wisdom of God's Word to guide your steps, and draw strength and inspiration from the example of Christ's unwavering love and devotion. Embrace the challenges and triumphs that lie ahead, knowing that your commitment to one another and to the Lord will serve as a steadfast anchor in the midst of life's storms.",
      "In closing, we extend our heartfelt gratitude for your dedication to this devotional and your commitment to nurturing a strong, Christ-centered relationship. May your love for one another continue to flourish, reflecting the divine purpose of marriage and the transformative power of commitment in the lives of those who walk in faith."
    ]
  }
};

export default function DevotionalArticle({ devotional, onBack }) {
  const content = devotionalContentMap[devotional.id];

  if (!content) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] p-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p className="text-center text-gray-500 mt-20">Devotional content not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-gray-600 dark:text-gray-400 hover:text-[#1a1a2e] dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 rounded-2xl overflow-hidden mb-6"
        >
          <img
            src={devotional.image}
            alt={devotional.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl font-bold text-white mb-2">{devotional.title}</h1>
            <p className="text-white/90">{devotional.subtitle}</p>
          </div>
        </motion.div>

        {/* Introduction */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#c9a227]" />
            Introduction
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.introduction.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Card>

        {/* Key Bible Verses */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-[#c9a227] mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Key Bible Verses</h2>
          <div className="space-y-4">
            {content.verses.map((verse, index) => (
              <div key={index}>
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">{index + 1}. {verse.title}</h3>
                <p className="italic text-gray-700 dark:text-gray-300 mb-2">{verse.verse}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{verse.insight}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Reflection */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Reflection</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.reflection.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Card>

        {/* Reflection Questions */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Reflection Questions</h2>
          <div className="space-y-4">
            {content.reflectionQuestions.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">{section.category}</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  {section.questions.map((question, qIndex) => (
                    <li key={qIndex}>{question}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* Call to Christ */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-600" />
            Call to Christ
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p className="font-semibold">{content.callToChrist.title}</p>
            <p>{content.callToChrist.intro}</p>
            
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white">
                {devotional.id === 'identity-christ' ? 'How to Grow in Christ Through Identity' : 'Practical Steps'}
              </h3>
              <ol className="list-decimal pl-5 space-y-3 text-sm">
                {content.callToChrist.steps.map((step, index) => (
                  <li key={index}>
                    <strong>{step.title}</strong> - {step.description}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Card>

        {/* Prayer */}
        <Card className="p-6 bg-gradient-to-br from-[#c9a227]/10 to-[#8fa68a]/10 border-l-4 border-[#c9a227] mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Prayer</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
            {content.prayer}
          </p>
        </Card>

        {/* Conclusion */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Conclusion</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.conclusion.map((paragraph, index) => (
              <p key={index} className={paragraph.includes('chosen') || paragraph.includes('masterpiece') ? 'font-semibold text-[#1a1a2e] dark:text-white' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}