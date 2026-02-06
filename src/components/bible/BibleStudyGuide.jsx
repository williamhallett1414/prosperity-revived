import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import StudyGuideCard from './StudyGuideCard';
import StudyGuideArticle from './StudyGuideArticle';

const studyGuides = [
  {
    id: 'genesis',
    title: 'Genesis: A Comprehensive Study',
    subtitle: 'The Book of Origins and Redemption',
    description: 'Explore the foundational book of the Bible with an in-depth study of creation, key characters like Abraham and Joseph, and God\'s redemptive plan for humanity.',
    chapters: 50,
    image: 'https://images.unsplash.com/photo-1507842572673-a9d00c7a8c63?w=600'
  },
  {
    id: 'psalms',
    title: 'Psalms: Prayers and Praise',
    subtitle: 'The Songbook of Israel',
    description: 'Discover the beauty and depth of the Psalms, exploring prayers of joy, sorrow, faith, and worship that resonate across generations.',
    chapters: 150,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600'
  },
  {
    id: 'matthew',
    title: 'Matthew: The Gospel Account',
    subtitle: 'Jesus as the Messiah King',
    description: 'Study the life and teachings of Jesus Christ as revealed through Matthew\'s gospel, emphasizing His role as the promised Messiah.',
    chapters: 28,
    image: 'https://images.unsplash.com/photo-1507927391077-f47267a0b55e?w=600'
  },
  {
    id: 'proverbs',
    title: 'Proverbs: Wisdom Literature',
    subtitle: 'Practical Wisdom for Living',
    description: 'Explore the timeless wisdom of Proverbs, learning practical guidance for relationships, finances, character, and spiritual living.',
    chapters: 31,
    image: 'https://images.unsplash.com/photo-1505148968435-52f47ae32147?w=600'
  },
  {
    id: 'isaiah',
    title: 'Isaiah: Prophecy of the Messiah',
    subtitle: 'Judgment and Comfort',
    description: 'Study prophecies of judgment, comfort, and the coming Suffering Servant.',
    chapters: 66,
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600'
  },
  {
    id: 'jeremiah',
    title: 'Jeremiah: The Weeping Prophet',
    subtitle: 'New Covenant Promise',
    description: 'Walk with Jeremiah through Judah\'s final days and the promise of a new covenant.',
    chapters: 52,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600'
  },
  {
    id: 'ezekiel',
    title: 'Ezekiel: Visions of Restoration',
    subtitle: 'New Hearts and Hope',
    description: 'Experience dramatic visions of judgment and the promise of new hearts and restoration.',
    chapters: 48,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600'
  },
  {
    id: 'daniel',
    title: 'Daniel: Faith in Exile',
    subtitle: 'Courage and Prophecy',
    description: 'Learn faithfulness from Daniel and his friends, and explore apocalyptic visions of God\'s kingdom.',
    chapters: 12,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
  },
  {
    id: 'acts',
    title: 'Acts: The Church Begins',
    subtitle: 'Spirit-Powered Mission',
    description: 'Follow the Holy Spirit\'s work as the gospel spreads from Jerusalem to Rome.',
    chapters: 28,
    image: 'https://images.unsplash.com/photo-1438109491414-7198515b166b?w=600'
  },
  {
    id: '1corinthians',
    title: '1 Corinthians: Love and Order',
    subtitle: 'Church Problems Solved',
    description: 'Address church problems with Paul\'s teaching on unity, purity, gifts, and love.',
    chapters: 16,
    image: 'https://images.unsplash.com/photo-1519974719-33a6947c7fb3?w=600'
  },
  {
    id: 'romans',
    title: 'Romans: The Gospel of Grace',
    subtitle: 'Faith, Justification, and Redemption',
    description: 'Understand Paul\'s theological masterpiece explaining salvation through faith in Christ and the transforming power of God\'s grace.',
    chapters: 16,
    image: 'https://images.unsplash.com/photo-1516541196182-e1c5926573e5?w=600'
  },
  {
    id: 'ephesians',
    title: 'Ephesians: The Church\'s Calling',
    subtitle: 'Identity in Christ',
    description: 'Discover your identity in Christ and the church\'s mission to display God\'s wisdom.',
    chapters: 6,
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600'
  },
  {
    id: 'john',
    title: 'John: The Gospel of Belief',
    subtitle: 'Encounters with the Word Made Flesh',
    description: 'Examine the unique perspective of John\'s gospel, featuring profound signs and teachings about believing in Jesus Christ.',
    chapters: 21,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'
  },
  {
    id: 'revelation',
    title: 'Revelation: The Final Victory',
    subtitle: 'Christ\'s Glorious Return',
    description: 'Explore visions of the end times, Christ\'s return, and God\'s eternal kingdom.',
    chapters: 22,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600'
  }
];

export default function BibleStudyGuide() {
  const [selectedGuide, setSelectedGuide] = useState(null);

  if (selectedGuide) {
    return (
      <StudyGuideArticle
        guide={selectedGuide}
        onBack={() => setSelectedGuide(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-1">Bible Study Guides</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">In-depth explorations of Scripture</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {studyGuides.map((guide, index) => (
          <StudyGuideCard
            key={guide.id}
            guide={guide}
            onClick={() => setSelectedGuide(guide)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}