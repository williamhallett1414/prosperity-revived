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
    id: 'romans',
    title: 'Romans: The Gospel of Grace',
    subtitle: 'Faith, Justification, and Redemption',
    description: 'Understand Paul\'s theological masterpiece explaining salvation through faith in Christ and the transforming power of God\'s grace.',
    chapters: 16,
    image: 'https://images.unsplash.com/photo-1516541196182-e1c5926573e5?w=600'
  },
  {
    id: 'john',
    title: 'John: The Gospel of Belief',
    subtitle: 'Encounters with the Word Made Flesh',
    description: 'Examine the unique perspective of John\'s gospel, featuring profound signs and teachings about believing in Jesus Christ.',
    chapters: 21,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'
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