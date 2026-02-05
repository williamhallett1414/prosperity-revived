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