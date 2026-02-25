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
    },
    'soulmates-sync': {
    introduction: [
    "In the vast landscape of marriage, few aspects are as essential and transformative as intimacy. The emotional connection experienced through vulnerability, trust, and shared experiences is an irreplaceable component of a thriving relationship. This devotional aims to guide you through the depths of fostering intimacy in your relationship, deepening your emotional connection, and honoring God in the process.",
    "The bond between two individuals in marriage is a sacred reflection of God's divine love for us. As we dive into the importance of nurturing intimacy, we draw wisdom from Scripture and discover the beauty of a relationship grounded in Christ. By exploring key verses and engaging in practical exercises, you will uncover the power of intentionality and vulnerability in creating an environment where emotional connection can flourish.",
    "Throughout this devotional, we invite you to explore the various dimensions of intimacy and its impact on your relationship. We will discuss the significance of emotional vulnerability, the transformative nature of empathy, and the role of shared experiences in creating lasting bonds. As you embark on this journey, our hope is that you will discover newfound insights and tools that empower you to create a relationship filled with love, understanding, and unwavering emotional connection.",
    "As we begin, let us remember the words of Ecclesiastes 4:9-10: 'Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up. But pity anyone who falls and has no one to help them up.' May this devotional serve as a reminder of the beauty of your union and the blessings that come from fostering an intimate and supportive relationship."
    ],
    verses: [
    {
      title: "Becoming One Flesh",
      verse: "\"That is why a man leaves his father and mother and is united to his wife, and they become one flesh.\" - Genesis 2:24",
      insight: "This powerful verse establishes the foundation for the deep emotional connection God intended for married couples. Marriage is about unity—two becoming one in purpose, mission, and love."
    },
    {
      title: "Stolen Hearts",
      verse: "\"You have stolen my heart, my sister, my bride; you have stolen my heart with one glance of your eyes, with one jewel of your necklace.\" - Song of Songs 4:9",
      insight: "The passionate and emotional connection between two lovers is vividly depicted here, offering insight into the beauty of a relationship grounded in love and intimacy."
    },
    {
      title: "Love in Action",
      verse: "\"Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.\" - 1 Corinthians 13:4-7",
      insight: "Biblical love is not just a feeling—it's a commitment to action. This passage provides guidance on the importance of love and unity within marriage, showing us how to demonstrate sacrificial love in our daily interactions."
    }
    ],
    reflection: [
    "Intimacy has been a cornerstone of healthy relationships since the very beginning, as evidenced by the creation story in Genesis. Throughout Scripture, we find examples of intimate relationships that have stood the test of time. In the Song of Songs, the passionate and emotional connection between two lovers is vividly depicted, offering insight into the beauty of a relationship grounded in love and intimacy.",
    "In the New Testament, the apostle Paul provides further guidance on the importance of love and unity within marriage. In Ephesians 5:25, he writes, 'Husbands, love your wives, just as Christ loved the church and gave himself up for her.' This powerful instruction calls spouses to emulate Christ's sacrificial love, fostering an environment of deep emotional connection and mutual support.",
    "As we reflect on these passages and the timeless wisdom they offer, consider the transformative power of vulnerability and empathy in your own relationship. Embracing emotional vulnerability allows you to connect with your partner on a profound level, creating a safe haven for sharing thoughts, feelings, and dreams. By practicing empathy and compassion, you can demonstrate your love and commitment to one another, echoing the selfless love Christ has for us.",
    "Take a moment to meditate on these reflections, allowing the richness of Scripture to deepen your understanding of intimacy and its importance in your relationship. As you explore the beauty of this divinely inspired connection, may you find the strength and guidance to nurture an intimate, loving, and faith-filled partnership."
    ],
    reflectionQuestions: [
    {
      category: "Divine Purpose and Unity",
      questions: [
        "How can the creation story in Genesis 2:24 inspire you to deepen your emotional connection with your partner and honor the divine purpose of your union?",
        "Reflect on the passionate emotional connection depicted in Song of Songs 4:9. In what ways can you cultivate a similar level of passion and emotional depth in your relationship?"
      ]
    },
    {
      category: "Sacrificial Love",
      questions: [
        "How can you apply Paul's guidance from Ephesians 5:25 to your marriage by demonstrating sacrificial love and fostering an environment of emotional connection and mutual support?",
        "What are some ways you can create a safe space for vulnerability in your relationship, encouraging open and honest communication?"
      ]
    },
    {
      category: "Empathy and Connection",
      questions: [
        "How can you practice empathy and compassion to strengthen your emotional bond, and what specific actions can you take to show love and commitment to your partner?",
        "Reflect on a time when emotional intimacy enhanced your relationship. What steps can you take to recreate that level of connection?",
        "How can you integrate prayer and spiritual practices into your efforts to deepen intimacy, inviting God's presence into your journey together?"
      ]
    }
    ],
    callToChrist: {
    title: "Drawing Closer to Christ Through Intimacy",
    intro: "Fostering intimacy in your relationship is not only essential for deepening your emotional connection but also for drawing closer to Christ. As you embark on this journey, consider the following actions to grow in your relationship with God and each other:",
    steps: [
      { title: "Pray together consistently", description: "Set aside dedicated time each day to join in prayer, seeking God's guidance, wisdom, and strength for your relationship. By praying together, you invite Christ to be at the center of your union, modeling the beautiful intimacy that exists within the Trinity." },
      { title: "Study Scripture as a couple", description: "Engage in a daily or weekly Bible study, exploring passages that relate to love, marriage, and emotional connection. Discuss how these passages apply to your relationship and encourage one another to implement the wisdom you uncover." },
      { title: "Practice forgiveness and grace", description: "Embrace the Biblical principles of forgiveness and grace, extending these gifts to your partner as Christ extends them to us. By doing so, you create an environment where emotional vulnerability and connection can thrive." },
      { title: "Attend worship services together", description: "Strengthen your faith and spiritual growth by regularly attending worship services and engaging in church activities as a couple. This shared experience can forge a deeper bond between you and foster a sense of community and support." },
      { title: "Serve others together", description: "Follow Christ's example of selfless love and service by volunteering in your community, participating in outreach programs, or supporting local ministries. Serving side by side can deepen your emotional connection and draw you closer to the heart of Christ." },
      { title: "Embrace vulnerability and authenticity", description: "Cultivate an atmosphere of emotional transparency in your relationship, knowing that Christ sees and loves every part of you. This vulnerability not only deepens your connection but also opens the door for spiritual growth and transformation." },
      { title: "Seek Christian counsel when needed", description: "If you encounter challenges in your pursuit of intimacy, consider seeking guidance from a trusted Christian mentor or faith-based counselor. Their wisdom and experience can provide valuable insights as you navigate your journey together." }
    ]
    },
    prayer: "Dear God, we thank You for the gift of intimacy in our relationship. Help us to cherish and nurture this sacred connection, guiding us as we grow in love and understanding. May our relationship be a testament to Your divine plan for marriage, and may we always seek Your wisdom and guidance on this journey. Above all, help us cherish the gift of emotional intimacy and the deep, abiding love it fosters in our relationship. May our journey together be richly blessed, and may our love story serve as a testament to the beauty and power of a Christ-centered marriage. Amen.",
    conclusion: [
    "As we come to the end of this devotional on fostering intimacy, take a moment to reflect on the profound impact that emotional connection can have on your relationship. By nurturing vulnerability, empathy, and shared experiences, you not only deepen your bond with your partner but also honor God's divine purpose for marriage.",
    "Throughout this week, you've had the opportunity to explore the significance of intimacy in your relationship, drawing wisdom from Scripture and engaging in personal reflection. By applying these insights to your daily lives, you can create an environment where emotional intimacy thrives, transforming your connection with each other and your relationship with Christ.",
    "As you move forward, remember that intimacy is an ongoing journey, requiring consistent effort, vulnerability, and communication. Keep the lessons from this devotional close to your heart, and continue to seek God's guidance as you navigate the joys and challenges of your partnership.",
    "Above all, cherish the gift of emotional intimacy and the deep, abiding love it fosters in your relationship. May your journey together be richly blessed, and may your love story serve as a testament to the beauty and power of a Christ-centered marriage."
    ]
    },
    'embracing-emotional-expression': {
    introduction: [
    "Our lives are filled with a wide range of emotions that shape our experiences, relationships, and overall well-being. As human beings, we are designed to feel, process, and express our emotions, which play a vital role in our personal growth and connection with others. However, effectively communicating our emotions can sometimes be challenging, particularly when we are faced with complex or intense feelings.",
    "This devotional is designed to guide you through the process of understanding, acknowledging, and expressing your emotions in a way that honors God and fosters healthy relationships. By diving into biblical principles and key verses, we will explore the significance of emotional expression and its impact on our lives.",
    "Throughout this devotional, you will be encouraged to reflect on your own emotional experiences and learn practical strategies for communicating your feelings with grace, compassion, and clarity. As you embark on this journey, may you find comfort in knowing that God cares deeply about your emotional well-being, and He desires for you to live a life filled with genuine connection and understanding."
    ],
    verses: [
    {
      title: "Speaking Truth in Love",
      verse: "\"Instead, speaking the truth in love, we will grow to become in every respect the mature body of him who is the head, that is, Christ.\" - Ephesians 4:15",
      insight: "This verse reminds us of the importance of speaking truth in love, fostering growth and maturity in Christ through honest yet compassionate communication."
    },
    {
      title: "The Power of Gentle Words",
      verse: "\"A gentle answer turns away wrath, but a harsh word stirs up anger.\" - Proverbs 15:1",
      insight: "Our words carry immense power. A gentle response can diffuse anger and promote peace, while harsh words escalate conflict and division."
    },
    {
      title: "Listen Before Speaking",
      verse: "\"My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak, and slow to become angry.\" - James 1:19",
      insight: "This verse emphasizes the value of patience and restraint in our interactions, encouraging us to prioritize listening and understanding before responding."
    }
    ],
    reflection: [
    "Throughout history, emotions have played a significant role in shaping human experiences and connections. From biblical times to the present day, people have grappled with the complexities of emotional expression, seeking guidance and wisdom from both God and one another.",
    "In the Old Testament, we see numerous examples of individuals grappling with intense emotions, such as King David pouring out his heart in the Psalms, expressing feelings of joy, sorrow, and everything in between. Similarly, the New Testament demonstrates the power of emotional connection, as Jesus models empathy and compassion for those around Him, offering comfort, healing, and understanding.",
    "As we delve into key verses like Ephesians 4:15, Proverbs 15:1, and James 1:19, we uncover timeless wisdom that guides us in expressing our emotions effectively. These passages remind us that emotional expression is not just about releasing feelings—it's about communicating them in a way that builds up rather than tears down, that creates connection rather than division.",
    "In reflecting on these verses and the examples set forth in Scripture, we can begin to understand the significance of emotional expression in our own lives. By embracing our feelings and learning to communicate them effectively, we not only honor God's design for our emotional well-being but also create opportunities for deeper connections with those around us.",
    "As you ponder your own emotional experiences, consider the ways in which God has been present in moments of joy, sorrow, frustration, or confusion. Recognize that He cares deeply about your emotional journey and desires for you to live a life filled with genuine connection, understanding, and support. By seeking His guidance and applying biblical principles to your emotional expression, you can experience the transformative power of authentic communication in your relationships and personal growth."
    ],
    reflectionQuestions: [
    {
      category: "Personal Growth & Relationships",
      questions: [
        "In what ways have you experienced the power of effective emotional expression in your relationships? How has it impacted your connections with others and your personal growth?",
        "Reflect on a time when you felt deeply understood and supported by someone. What aspects of their communication made you feel heard and valued?"
      ]
    },
    {
      category: "Applying Biblical Wisdom",
      questions: [
        "Consider a situation in your life where you may be struggling to communicate your emotions effectively. How might applying the wisdom from Ephesians 4:15, Proverbs 15:1, and James 1:19 transform your approach to emotional expression?",
        "How can you cultivate a deeper awareness of your emotions and their impact on your relationships? What practices or habits might help you grow in emotional self-awareness and communication?"
      ]
    },
    {
      category: "Spiritual Connection",
      questions: [
        "In what ways can you actively seek God's guidance and support as you navigate the complexities of emotional expression? How might this deepen your connection with Him and others?"
      ]
    }
    ],
    callToChrist: {
    title: "Deepening Your Relationship with Christ Through Emotional Expression",
    intro: "To deepen your relationship with Christ and apply the principles of effective emotional expression, consider taking the following actions:",
    steps: [
      { title: "Pray for Guidance", description: "Start by seeking God's guidance and wisdom in your journey towards healthy emotional expression. Ask the Holy Spirit to help you develop discernment, self-control, and empathy in your interactions with others." },
      { title: "Study God's Word", description: "Regularly engage with Scripture, exploring passages that highlight the importance of emotional expression and communication. Reflect on how these verses apply to your own life and relationships, seeking to implement the wisdom they offer." },
      { title: "Practice Active Listening", description: "Make a conscious effort to actively listen to those around you, offering your undivided attention and empathetic understanding. By prioritizing this essential skill, you can create an environment where others feel heard, valued, and supported." },
      { title: "Embrace Vulnerability", description: "Allow yourself to be vulnerable in your communication, sharing your thoughts and emotions openly and honestly. This can foster a deeper sense of trust, intimacy, and understanding in your relationships." },
      { title: "Model Compassion and Empathy", description: "In your interactions, strive to embody the empathy and compassion demonstrated by Jesus throughout the New Testament. Extend grace, understanding, and support to others, and encourage them to do the same." },
      { title: "Engage in Christian Community", description: "Connect with fellow believers who can provide encouragement, accountability, and guidance in your journey towards effective emotional expression. Participate in small groups, Bible studies, or other community-focused activities that foster spiritual growth and connection." },
      { title: "Reflect and Journal", description: "Regularly reflect on your progress and challenges, documenting your thoughts and insights in a journal. This practice can help you track your growth, identify areas for improvement, and maintain a sense of self-awareness." },
      { title: "Seek Professional Support", description: "If needed, consider seeking guidance from a Christian counselor or therapist who can help you navigate the complexities of emotional expression and provide additional tools and resources for personal growth." }
    ]
    },
    prayer: "Dear God, we thank You for creating us with a range of emotions. Help us to understand, acknowledge, and express our feelings effectively, in a manner that honors You and nurtures our relationships. Guide us as we seek to grow in wisdom and discernment, and may our words be a reflection of Your love and grace. Amen.",
    conclusion: [
    "As we come to the end of this devotional, it is clear that effective communication and emotional expression are integral to our relationships, personal growth, and spiritual journeys. By embracing the wisdom of Scripture and actively seeking to improve our communication skills, we can cultivate deeper connections, foster empathy, and create a more supportive and understanding environment for ourselves and those around us.",
    "Throughout this exploration, we have uncovered the importance of active listening, empathy, vulnerability, and clarity in our interactions. By implementing these essential components, we can transform our relationships, creating a strong foundation of trust, intimacy, and mutual understanding.",
    "Moreover, by seeking God's guidance and engaging in practices that deepen our connection with Christ, we can experience the transformative power of His love and wisdom in our daily lives. Through prayer, studying Scripture, participating in Christian community, and embracing vulnerability, we can grow in our faith and our ability to communicate effectively.",
    "As you continue on this journey, remember that emotional expression is an ongoing process that requires patience, self-awareness, and a willingness to learn and grow. Embrace the challenges and opportunities that arise, knowing that each experience brings you closer to the genuine connection and understanding that God desires for your life.",
    "In conclusion, may you find comfort and strength in the knowledge that God is with you every step of the way, guiding and supporting you as you navigate the complexities of emotional expression. By investing in your communication skills and spiritual growth, you can experience the profound impact of effective communication on your relationships and personal journey, ultimately creating a life filled with love, connection, and understanding."
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