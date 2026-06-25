import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import StudyGuideCard from './StudyGuideCard';
import StudyGuideArticle from './StudyGuideArticle';

const studyGuides = [
  {
    id: 'genesis', testament: 'ot',
    title: 'Genesis: A Comprehensive Study',
    subtitle: 'The Book of Origins and Redemption',
    description: 'Explore the foundational book of the Bible with an in-depth study of creation, key characters like Abraham and Joseph, and God\'s redemptive plan for humanity.',
    chapters: 50
  },
  {
    id: 'exodus', testament: 'ot',
    title: 'Exodus: Deliverance and Law',
    subtitle: 'From Slavery to Freedom',
    description: 'Follow Israel\'s dramatic deliverance from Egypt, the giving of the Law at Sinai, and the establishment of covenant worship.',
    chapters: 40,
    image: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=600'
  },
  {
    id: 'leviticus', testament: 'ot',
    title: 'Leviticus: The Way of Holiness',
    subtitle: 'Laws for Holy Living',
    description: 'Understand the sacrificial system, purity laws, and God\'s call for His people to be holy as He is holy.',
    chapters: 27,
    image: 'https://images.unsplash.com/photo-1518998054346-d0498a4d1b5f?w=600'
  },
  {
    id: 'numbers', testament: 'ot',
    title: 'Numbers: Wilderness Journey',
    subtitle: 'Testing and Transformation',
    description: 'Journey through forty years of wilderness wandering, learning from Israel\'s failures and God\'s faithfulness.',
    chapters: 36,
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600'
  },
  {
    id: 'deuteronomy', testament: 'ot',
    title: 'Deuteronomy: Choose Life',
    subtitle: 'Moses\' Farewell Addresses',
    description: 'Hear Moses\' final teachings calling Israel to wholehearted devotion and obedience to God\'s commands.',
    chapters: 34,
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600'
  },
  {
    id: 'joshua', testament: 'ot',
    title: 'Joshua: Conquest of Canaan',
    subtitle: 'Courage and Conquest',
    description: 'Witness God\'s faithfulness as Israel conquers the Promised Land under Joshua\'s courageous leadership.',
    chapters: 24,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: 'judges', testament: 'ot',
    title: 'Judges: Cycles of Rebellion',
    subtitle: 'When Everyone Did What Was Right',
    description: 'Explore the dark period of judges with its cycles of sin, oppression, and deliverance.',
    chapters: 21,
    image: 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=600'
  },
  {
    id: 'ruth', testament: 'ot',
    title: 'Ruth: Redemption Story',
    subtitle: 'Loyalty and Providence',
    description: 'A beautiful story of faith, loyalty, and God\'s redemptive grace during the time of the judges.',
    chapters: 4,
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=600'
  },
  {
    id: '1samuel', testament: 'ot',
    title: '1 Samuel: From Judges to Kings',
    subtitle: 'Samuel, Saul, and David',
    description: 'Follow Israel\'s transition to monarchy through the lives of prophet Samuel, King Saul, and the young David.',
    chapters: 31,
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600'
  },
  {
    id: '2samuel', testament: 'ot',
    title: '2 Samuel: David\'s Reign',
    subtitle: 'Triumph and Tragedy',
    description: 'Examine David\'s reign as king—his victories, failures, and God\'s eternal covenant with his dynasty.',
    chapters: 24,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600'
  },
  {
    id: '1kings', testament: 'ot',
    title: '1 Kings: Glory and Division',
    subtitle: 'Solomon to the Divided Kingdom',
    description: 'Study Solomon\'s wisdom and the Temple, then the kingdom\'s tragic division and decline into idolatry.',
    chapters: 22,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: '2kings', testament: 'ot',
    title: '2 Kings: Fall of Kingdoms',
    subtitle: 'Prophets and Exile',
    description: 'Chronicle the fall of both Israel and Judah, interspersed with prophetic ministry and occasional reform.',
    chapters: 25,
    image: 'https://images.unsplash.com/photo-1501696461415-6bd6660c6742?w=600'
  },
  {
    id: '1chronicles', testament: 'ot',
    title: '1 Chronicles: David\'s Legacy',
    subtitle: 'Genealogies and Worship',
    description: 'Explore Israel\'s history with focus on David\'s preparations for the Temple and organization of worship.',
    chapters: 29,
    image: 'https://images.unsplash.com/photo-1476900164809-ff19b8ae5968?w=600'
  },
  {
    id: '2chronicles', testament: 'ot',
    title: '2 Chronicles: Temple and Kings',
    subtitle: 'From Solomon to Exile',
    description: 'Follow Judah\'s history through the lens of Temple worship and covenant faithfulness.',
    chapters: 36,
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600'
  },
  {
    id: 'ezra', testament: 'ot',
    title: 'Ezra: Return and Rebuild',
    subtitle: 'Restoration After Exile',
    description: 'Witness the return from Babylon and the rebuilding of the Temple and spiritual life.',
    chapters: 10,
    image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=600'
  },
  {
    id: 'nehemiah', testament: 'ot',
    title: 'Nehemiah: Walls and Renewal',
    subtitle: 'Rebuilding What Was Broken',
    description: 'Learn from Nehemiah\'s leadership in rebuilding Jerusalem\'s walls and renewing covenant commitment.',
    chapters: 13,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600'
  },
  {
    id: 'esther', testament: 'ot',
    title: 'Esther: For Such a Time',
    subtitle: 'Providence and Courage',
    description: 'Discover how God works behind the scenes through Esther\'s courage to save her people from genocide.',
    chapters: 10,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600'
  },
  {
    id: 'job', testament: 'ot',
    title: 'Job: When the Righteous Suffer',
    subtitle: 'Wrestling with Pain',
    description: 'Grapple with the problem of suffering through Job\'s story and God\'s response to his questions.',
    chapters: 42,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: 'psalms', testament: 'ot',
    title: 'Psalms: Prayers and Praise',
    subtitle: 'The Songbook of Israel',
    description: 'Discover the beauty and depth of the Psalms, exploring prayers of joy, sorrow, faith, and worship that resonate across generations.',
    chapters: 150,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600'
  },
  {
    id: 'proverbs', testament: 'ot',
    title: 'Proverbs: Wisdom Literature',
    subtitle: 'Practical Wisdom for Living',
    description: 'Explore the timeless wisdom of Proverbs, learning practical guidance for relationships, finances, character, and spiritual living.',
    chapters: 31,
    image: 'https://images.unsplash.com/photo-1505148968435-52f47ae32147?w=600'
  },
  {
    id: 'ecclesiastes', testament: 'ot',
    title: 'Ecclesiastes: Life Under the Sun',
    subtitle: 'Searching for Meaning',
    description: 'Explore the Teacher\'s honest quest for meaning and the conclusion that fearing God is humanity\'s purpose.',
    chapters: 12,
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600'
  },
  {
    id: 'songofsolomon', testament: 'ot',
    title: 'Song of Solomon: Love Songs',
    subtitle: 'Celebrating Marital Love',
    description: 'Study the beautiful poetry celebrating romantic love within marriage as God\'s good gift.',
    chapters: 8,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600'
  },
  {
    id: 'isaiah', testament: 'ot',
    title: 'Isaiah: The Suffering Servant',
    subtitle: 'Prophecies of Judgment and Hope',
    description: 'Explore major messianic prophecies and themes of judgment, comfort, and future restoration.',
    chapters: 66,
    image: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=600'
  },
  {
    id: 'jeremiah', testament: 'ot',
    title: 'Jeremiah: The Weeping Prophet',
    subtitle: 'Warning and New Covenant',
    description: 'Follow Jeremiah\'s difficult ministry and learn about the promised new covenant written on hearts.',
    chapters: 52,
    image: 'https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=600'
  },
  {
    id: 'lamentations', testament: 'ot',
    title: 'Lamentations: Songs of Sorrow',
    subtitle: 'Mourning with Hope',
    description: 'Express grief over Jerusalem\'s fall while discovering that God\'s mercies are new every morning.',
    chapters: 5,
    image: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600'
  },
  {
    id: 'ezekiel', testament: 'ot',
    title: 'Ezekiel: Visions and Restoration',
    subtitle: 'From Exile to New Hearts',
    description: 'Experience Ezekiel\'s dramatic visions and God\'s promise to give new hearts and His Spirit.',
    chapters: 48,
    image: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=600'
  },
  {
    id: 'daniel', testament: 'ot',
    title: 'Daniel: Faithful in Exile',
    subtitle: 'Kingdoms and Courage',
    description: 'Learn faithfulness from Daniel and friends while exploring visions of God\'s sovereign control over empires.',
    chapters: 12,
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600'
  },
  {
    id: 'hosea', testament: 'ot',
    title: 'Hosea: Unfailing Love',
    subtitle: 'God\'s Pursuing Heart',
    description: 'Understand God\'s faithful love through Hosea\'s marriage to an unfaithful wife.',
    chapters: 14,
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600'
  },
  {
    id: 'joel', testament: 'ot',
    title: 'Joel: The Day of the Lord',
    subtitle: 'Judgment and Spirit Outpouring',
    description: 'Learn from the locust plague about repentance and God\'s promise to pour out His Spirit.',
    chapters: 3,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600'
  },
  {
    id: 'amos', testament: 'ot',
    title: 'Amos: Justice Like a River',
    subtitle: 'The Shepherd Prophet',
    description: 'Hear God\'s call for justice and righteousness from this shepherd turned prophet.',
    chapters: 9,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: 'obadiah', testament: 'ot',
    title: 'Obadiah: Pride and Justice',
    subtitle: 'Judgment on Edom',
    description: 'The shortest Old Testament book addressing pride, betrayal, and divine justice.',
    chapters: 1,
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600'
  },
  {
    id: 'jonah', testament: 'ot',
    title: 'Jonah: The Reluctant Prophet',
    subtitle: 'God\'s Compassion for All',
    description: 'Follow the famous story of Jonah and the fish, learning about God\'s universal mercy.',
    chapters: 4,
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600'
  },
  {
    id: 'micah', testament: 'ot',
    title: 'Micah: Act Justly, Love Mercy',
    subtitle: 'Justice and the Coming King',
    description: 'Explore Micah\'s call for justice and his prophecy of the Messiah from Bethlehem.',
    chapters: 7,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600'
  },
  {
    id: 'nahum', testament: 'ot',
    title: 'Nahum: God\'s Vengeance',
    subtitle: 'Judgment on Nineveh',
    description: 'See God\'s justice against oppressive Assyria and comfort for the oppressed.',
    chapters: 3,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: 'habakkuk', testament: 'ot',
    title: 'Habakkuk: Living by Faith',
    subtitle: 'Questions and Trust',
    description: 'Wrestling with why the wicked prosper while learning to trust God and live by faith.',
    chapters: 3,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600'
  },
  {
    id: 'zephaniah', testament: 'ot',
    title: 'Zephaniah: The Day Approaches',
    subtitle: 'Judgment and Rejoicing',
    description: 'Prepare for the Day of the Lord with its judgment and promise of God\'s joyful restoration.',
    chapters: 3,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600'
  },
  {
    id: 'haggai', testament: 'ot',
    title: 'Haggai: Rebuild the Temple',
    subtitle: 'Priorities and Promise',
    description: 'Learn about right priorities as Haggai calls the people to rebuild God\'s house.',
    chapters: 2,
    image: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600'
  },
  {
    id: 'zechariah', testament: 'ot',
    title: 'Zechariah: Visions of Hope',
    subtitle: 'The Coming King',
    description: 'Journey through night visions and messianic prophecies pointing to Christ\'s coming.',
    chapters: 14,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: 'malachi', testament: 'ot',
    title: 'Malachi: The Final Word',
    subtitle: 'Before the Silence',
    description: 'Hear God\'s final Old Testament message calling for faithfulness and announcing the coming messenger.',
    chapters: 4,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600'
  },
  {
    id: 'matthew', testament: 'nt',
    title: 'Matthew: The Gospel Account',
    subtitle: 'Jesus as the Messiah King',
    description: 'Study the life and teachings of Jesus Christ as revealed through Matthew\'s gospel, emphasizing His role as the promised Messiah.',
    chapters: 28,
    image: 'https://images.unsplash.com/photo-1507927391077-f47267a0b55e?w=600'
  },
  {
    id: 'mark', testament: 'nt',
    title: 'Mark: The Suffering Servant',
    subtitle: 'Action and Service',
    description: 'Experience the fast-paced gospel emphasizing Jesus as servant who came to give His life as ransom.',
    chapters: 16,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: 'luke', testament: 'nt',
    title: 'Luke: Savior of All People',
    subtitle: 'Compassion and Inclusion',
    description: 'Discover Jesus as the compassionate Savior who seeks and saves the lost from all backgrounds.',
    chapters: 24,
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600'
  },
  {
    id: 'john', testament: 'nt',
    title: 'John: The Gospel of Belief',
    subtitle: 'Encounters with the Word Made Flesh',
    description: 'Examine the unique perspective of John\'s gospel, featuring profound signs and teachings about believing in Jesus Christ.',
    chapters: 21,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'
  },
  {
    id: 'acts', testament: 'nt',
    title: 'Acts: The Church Begins',
    subtitle: 'Spirit-Empowered Mission',
    description: 'Follow the early Church\'s growth from Jerusalem to Rome through the Spirit\'s power.',
    chapters: 28,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600'
  },
  {
    id: 'romans', testament: 'nt',
    title: 'Romans: The Gospel of Grace',
    subtitle: 'Faith, Justification, and Redemption',
    description: 'Understand Paul\'s theological masterpiece explaining salvation through faith in Christ and the transforming power of God\'s grace.',
    chapters: 16,
    image: 'https://images.unsplash.com/photo-1516541196182-e1c5926573e5?w=600'
  },
  {
    id: '1corinthians', testament: 'nt',
    title: '1 Corinthians: Church Problems',
    subtitle: 'Love and Unity',
    description: 'Address divisions, immorality, and disorder while learning about love and spiritual gifts.',
    chapters: 16,
    image: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=600'
  },
  {
    id: '2corinthians', testament: 'nt',
    title: '2 Corinthians: Strength in Weakness',
    subtitle: 'Ministry and Suffering',
    description: 'Discover how God\'s power is perfected in weakness through Paul\'s personal ministry reflections.',
    chapters: 13,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: 'galatians', testament: 'nt',
    title: 'Galatians: Freedom in Christ',
    subtitle: 'Grace Not Law',
    description: 'Defend the gospel of grace against legalism and discover freedom in Christ.',
    chapters: 6,
    image: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=600'
  },
  {
    id: 'ephesians', testament: 'nt',
    title: 'Ephesians: God\'s Grand Plan',
    subtitle: 'Unity in Christ',
    description: 'Explore the Church as Christ\'s body and learn to walk worthy of your calling.',
    chapters: 6,
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600'
  },
  {
    id: 'philippians', testament: 'nt',
    title: 'Philippians: Joy in Christ',
    subtitle: 'Rejoicing Always',
    description: 'Learn to rejoice in all circumstances and pursue Christ above everything else.',
    chapters: 4,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: 'colossians', testament: 'nt',
    title: 'Colossians: Christ Supreme',
    subtitle: 'Complete in Him',
    description: 'Discover Christ\'s supremacy over creation and sufficiency for all spiritual needs.',
    chapters: 4,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600'
  },
  {
    id: '1thessalonians', testament: 'nt',
    title: '1 Thessalonians: His Return',
    subtitle: 'Hope and Holiness',
    description: 'Live in light of Christ\'s return with hope, holiness, and encouragement.',
    chapters: 5,
    image: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600'
  },
  {
    id: '2thessalonians', testament: 'nt',
    title: '2 Thessalonians: Stand Firm',
    subtitle: 'Clarity About the End',
    description: 'Understand the Day of the Lord while living responsibly as you wait.',
    chapters: 3,
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600'
  },
  {
    id: '1timothy', testament: 'nt',
    title: '1 Timothy: Church Leadership',
    subtitle: 'Sound Doctrine and Order',
    description: 'Learn qualifications for leaders and instructions for healthy church life.',
    chapters: 6,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: '2timothy', testament: 'nt',
    title: '2 Timothy: Final Charge',
    subtitle: 'Guard the Gospel',
    description: 'Receive Paul\'s final instructions to remain faithful and pass on the truth.',
    chapters: 4,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600'
  },
  {
    id: 'titus', testament: 'nt',
    title: 'Titus: Sound Teaching',
    subtitle: 'Doctrine and Conduct',
    description: 'Understand how sound doctrine produces godly living and transforms communities.',
    chapters: 3,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600'
  },
  {
    id: 'philemon', testament: 'nt',
    title: 'Philemon: Radical Forgiveness',
    subtitle: 'Brothers in Christ',
    description: 'A personal letter about reconciliation and how the gospel transforms relationships.',
    chapters: 1,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600'
  },
  {
    id: 'hebrews', testament: 'nt',
    title: 'Hebrews: Christ Superior',
    subtitle: 'The Better Covenant',
    description: 'Discover Christ\'s superiority to all Old Testament provisions and His perfect priesthood.',
    chapters: 13,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: 'james', testament: 'nt',
    title: 'James: Faith That Works',
    subtitle: 'Practical Christianity',
    description: 'Learn that genuine faith produces godly action and transforms daily living.',
    chapters: 5,
    image: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600'
  },
  {
    id: '1peter', testament: 'nt',
    title: '1 Peter: Hope in Suffering',
    subtitle: 'Strangers and Exiles',
    description: 'Find encouragement for enduring persecution with hope in your eternal inheritance.',
    chapters: 5,
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600'
  },
  {
    id: '2peter', testament: 'nt',
    title: '2 Peter: Growing and Guarding',
    subtitle: 'Truth and False Teachers',
    description: 'Grow in grace while guarding against false teaching and awaiting Christ\'s return.',
    chapters: 3,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: '1john', testament: 'nt',
    title: '1 John: Love and Truth',
    subtitle: 'Tests of Genuine Faith',
    description: 'Know that you have eternal life through believing rightly, obeying fully, and loving genuinely.',
    chapters: 5,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600'
  },
  {
    id: '2john', testament: 'nt',
    title: '2 John: Love in Truth',
    subtitle: 'Balance and Boundaries',
    description: 'Walk in love while maintaining doctrinal boundaries against false teaching.',
    chapters: 1,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600'
  },
  {
    id: '3john', testament: 'nt',
    title: '3 John: Support and Oppose',
    subtitle: 'Hospitality and Humility',
    description: 'Learn the importance of supporting gospel workers while opposing prideful leadership.',
    chapters: 1,
    image: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600'
  },
  {
    id: 'jude', testament: 'nt',
    title: 'Jude: Contend for Faith',
    subtitle: 'Standing Against Error',
    description: 'Urgent warning to defend the faith against false teachers who pervert grace.',
    chapters: 1,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600'
  },
  {
    id: 'revelation', testament: 'nt',
    title: 'Revelation: Christ Victorious',
    subtitle: 'The End and New Beginning',
    description: 'Journey through apocalyptic visions revealing Christ\'s victory and the new creation.',
    chapters: 22,
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600'
  }
];

// Featured picks (curated starter books)
const FEATURED = ['genesis', 'psalms', 'john', 'romans', 'revelation'];

export default function BibleStudyGuide({ filterQuery = '' }) {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [tab, setTab] = useState('all'); // all | ot | nt
  const [showAll, setShowAll] = useState(false);
  const queryClient = useQueryClient();

  // Cached Recraft cover images (shared PlanImage entity, namespaced with a
  // "studyguide-" prefix so they never collide with reading-plan covers).
  const { data: guideImages = [] } = useQuery({
    queryKey: ['studyGuideImages'],
    queryFn: () => base44.entities.PlanImage.filter({ plan_id: { $regex: '^studyguide-' } })
  });
  const imageByGuideId = React.useMemo(() => {
    const map = {};
    guideImages.forEach((pi) => {
      if (pi.image_url) map[pi.plan_id.replace('studyguide-', '')] = pi.image_url;
    });
    return map;
  }, [guideImages]);

  // Lazily generate a cover for each guide that doesn't have one cached yet,
  // one at a time, caching the result so Recraft credits are spent only once.
  useEffect(() => {
    if (guideImages === undefined) return;
    const missing = studyGuides.filter((g) => !imageByGuideId[g.id]);
    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      for (const guide of missing) {
        if (cancelled) break;
        try {
          await base44.functions.invoke('generatePlanImage', {
            plan_id: `studyguide-${guide.id}`,
            plan_name: guide.title,
            description: guide.description,
            subject: `${guide.title} — ${guide.subtitle}`,
          });
          if (!cancelled) queryClient.invalidateQueries(['studyGuideImages']);
        } catch {
          // Skip on failure; the emoji badge is shown meanwhile.
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideImages]);

  if (selectedGuide) {
    return (
      <StudyGuideArticle
        guide={selectedGuide}
        imageUrl={imageByGuideId[selectedGuide.id]}
        onBack={() => setSelectedGuide(null)}
      />
    );
  }

  const q = filterQuery.toLowerCase().trim();
  const filtered = q
    ? studyGuides.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.subtitle.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      )
    : studyGuides;

  const byTab = tab === 'all' ? filtered : filtered.filter(g => g.testament === tab);
  const featured = studyGuides.filter(g => FEATURED.includes(g.id));
  const displayList = showAll ? byTab : byTab.slice(0, 12);

  return (
    <div className="space-y-5">
      {/* Header */}
      {!filterQuery && (
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 dark:from-amber-900/15 dark:to-amber-800/5 rounded-2xl p-5 border border-[#FAD98D]/15 dark:border-[#FAD98D]/8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAD98D]/20 flex items-center justify-center text-xl">📚</div>
              <div>
                <h2 className="text-lg font-bold text-[#0A1A2F] dark:text-white">Study the Word</h2>
                <p className="text-xs text-[#0A1A2F]/50 dark:text-white/45">66 books. Thousands of years of wisdom.</p>
              </div>
            </div>
            <p className="text-xs text-[#0A1A2F]/60 dark:text-white/50 leading-relaxed">
              Dive deep into every book of the Bible with guided study notes, key verses, historical context, and reflection questions.
            </p>
          </div>
        </motion.div>
      )}

      {/* Featured Picks (horizontal scroll) */}
      {!filterQuery && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <p className="text-xs font-bold text-[#c9a227] uppercase tracking-widest mb-2.5 px-1">Where to Start</p>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
            {featured.map((g, i) => {
              const ICONS = { genesis: '🌍', psalms: '🎵', john: '✝️', romans: '⚖️', revelation: '🌈' };
              return (
                <motion.button
                  key={g.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGuide(g)}
                  className="flex-shrink-0 w-28 bg-gradient-to-br from-[#FAD98D]/15 to-[#FAD98D]/5 dark:from-[#FAD98D]/10 dark:to-[#FAD98D]/3 rounded-xl p-3 border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 text-center hover:shadow-md transition-all"
                >
                  <span className="text-2xl block mb-1.5">{ICONS[g.id] || '📖'}</span>
                  <p className="text-xs font-bold text-[#0A1A2F] dark:text-white truncate">{g.title.replace(/:.+/, '')}</p>
                  <p className="text-[9px] text-[#0A1A2F]/40 dark:text-white/35 mt-0.5">{g.chapters} chapters</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Testament Tabs */}
      {!filterQuery && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex gap-1.5 bg-[#0A1A2F]/5 dark:bg-white/5 rounded-xl p-1">
          {[
            { key: 'all', label: 'All Books', count: filtered.length },
            { key: 'ot', label: 'Old Testament', count: filtered.filter(g => g.testament === 'ot').length },
            { key: 'nt', label: 'New Testament', count: filtered.filter(g => g.testament === 'nt').length },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setShowAll(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === t.key
                  ? 'bg-[#c9a227] text-white shadow-sm'
                  : 'text-[#0A1A2F]/50 dark:text-white/40 hover:text-[#0A1A2F] dark:hover:text-white'
              }`}>
              {t.label} <span className="opacity-50 ml-0.5">({t.count})</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* No results */}
      {byTab.length === 0 && (
        <p className="text-center text-[#0A1A2F]/40 dark:text-white/40 text-sm py-8">
          {filterQuery ? `No guides match "${filterQuery}"` : 'No books in this section'}
        </p>
      )}

      {/* Book Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        {displayList.map((guide, index) => (
          <StudyGuideCard
            key={guide.id}
            guide={guide}
            imageUrl={imageByGuideId[guide.id]}
            onClick={() => setSelectedGuide(guide)}
            index={index}
          />
        ))}
      </div>

      {/* Show More / Less */}
      {byTab.length > 12 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-2 pb-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold text-[#c9a227] bg-[#FAD98D]/15 dark:bg-[#FAD98D]/8 px-5 py-2.5 rounded-full hover:bg-[#FAD98D]/25 transition-all"
          >
            {showAll ? 'Show Less' : `Show All ${byTab.length} Books`}
          </button>
        </motion.div>
      )}
    </div>
  );
}