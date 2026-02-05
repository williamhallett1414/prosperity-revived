import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import StudyNotes from './StudyNotes';
import ReflectionPrompt from './ReflectionPrompt';
import CompletionTracker from './CompletionTracker';

const studyGuideContentMap = {
  'genesis': {
    introduction: [
      "As the first book of the Bible, the Book of Genesis holds immense significance for both Judaism and Christianity. Its name, derived from the Greek term γένεσις (genesis), translates to \"origin\" or \"birth,\" alluding to its primary purpose of providing an account of the creation of the universe, earth, and humanity.",
      "Composed as a collection of stories and narratives, Genesis serves as the cornerstone of biblical history. Its vivid imagery and deeply symbolic language illustrate the genesis of the world and provide a rich tapestry of early human experiences. The book's authorship is traditionally attributed to Moses, who is believed to have compiled the narratives from ancient oral traditions, creating a cohesive story of God's redemptive plan for humanity.",
      "The Book of Genesis is divided into two primary sections: the primeval history (chapters 1-11) and the ancestral history (chapters 12-50). The primeval history begins with the creation story and proceeds to narrate the world's early days, including tales of Adam and Eve, Noah's ark, and the Tower of Babel. The ancestral history focuses on God's covenant with Abraham and follows the lives of his descendants, Isaac, Jacob, and Joseph.",
      "Beyond its historical significance, the Book of Genesis addresses timeless themes such as obedience, faith, and redemption. Its teachings lay the groundwork for understanding God's nature and His interaction with humanity throughout the rest of the biblical narrative. In essence, the Book of Genesis serves as the foundation upon which the entire Bible stands, providing a vital context for comprehending God's plan for creation and redemption."
    ],
    historicalContext: {
      timePeriod: "The Book of Genesis, dating back to approximately the second millennium BCE, is situated within the broader context of the ancient Near East. This period was characterized by the rise and fall of various civilizations, including the Sumerians, Babylonians, Egyptians, and early Semitic peoples.",
      authorship: "Traditionally attributed to Moses, the authorship of Genesis has been a subject of scholarly debate. Some scholars suggest that multiple authors contributed to the text, while others argue for a single author drawing upon various sources. Regardless of its precise authorship, Genesis reflects the perspectives and beliefs of the ancient Israelite people.",
      geography: "The geographical locations mentioned in Genesis, such as the Garden of Eden, Babel, Canaan, and Egypt, provide insight into the movements and interactions of ancient peoples. The narrative takes place within the Fertile Crescent, a region in the ancient Near East known for its agricultural productivity and diverse civilizations.",
      transmission: "The stories within Genesis were likely passed down through oral tradition before being written down. The significance of these narratives for ancient Israelite society and identity cannot be overstated, as they provided a shared understanding of the people's origins, values, and religious beliefs."
    },
    keyCharacters: [
      { name: 'Adam and Eve', desc: 'The first humans created by God in the Garden of Eden. Their disobedience leads to the fall of humanity and the introduction of sin into the world.' },
      { name: 'Noah', desc: 'A righteous man chosen by God to build an ark and survive the great flood. His obedience demonstrates the importance of faith in corrupt times.' },
      { name: 'Abraham', desc: 'The father of faith and ancestor of the Israelites. God establishes a covenant with him, promising to make his descendants a great nation.' },
      { name: 'Isaac', desc: 'The son of Abraham and father of Jacob. His birth in Abraham\'s old age is a miraculous fulfillment of God\'s promise.' },
      { name: 'Jacob', desc: 'Later named Israel, Jacob is the son of Isaac. His life shows the transformative power of God\'s grace and the importance of forgiveness.' },
      { name: 'Joseph', desc: 'The favorite son of Jacob who experiences betrayal and slavery but rises to power in Egypt, demonstrating God\'s ability to bring good from adversity.' }
    ],
    keyEvents: [
      { event: 'The Creation', desc: 'God creates the universe, earth, and all living creatures in six days, declaring all He made "very good."' },
      { event: 'The Fall of Humanity', desc: 'Adam and Eve\'s disobedience in the Garden of Eden introduces sin, death, and suffering into the world.' },
      { event: 'The Great Flood', desc: 'God sends a global flood to cleanse the earth of wickedness. Noah\'s obedience preserves life through the ark.' },
      { event: 'God\'s Covenant with Abraham', desc: 'God establishes a covenant with Abraham, promising to bless his descendants and make them a great nation.' },
      { event: 'Destruction of Sodom and Gomorrah', desc: 'God\'s judgment falls upon these wicked cities, demonstrating His intolerance for sin.' },
      { event: 'Jacob\'s Ladder Vision', desc: 'Jacob dreams of a ladder to heaven with angels ascending and descending. God reaffirms His covenant.' },
      { event: 'Joseph in Egypt', desc: 'Joseph is sold into slavery but rises to power as governor, saving his family from famine.' }
    ],
    keyScriptures: [
      { verse: 'Genesis 1:1', text: '"In the beginning, God created the heavens and the earth."', insight: 'Establishes God\'s sovereignty and role as the divine architect of the universe.' },
      { verse: 'Genesis 1:26', text: '"Let us make man in our image, after our likeness."', insight: 'Affirms the unique nature of humans as beings created in God\'s image with inherent worth.' },
      { verse: 'Genesis 12:2', text: '"I will make of you a great nation, and I will bless you and make your name great."', insight: 'God\'s foundational promise to Abraham, central to His redemptive plan.' }
    ],
    keyLocations: [
      { location: 'The Garden of Eden', desc: 'The idyllic paradise where God places Adam and Eve. A symbol of humanity\'s original, untainted state.' },
      { location: 'Babel', desc: 'The location of the Tower of Babel, where people attempt to build a tower reaching the heavens, explaining the origin of different languages.' },
      { location: 'The Promised Land (Canaan)', desc: 'The territory God promises to give to Abraham\'s descendants, located between the Jordan River and Mediterranean Sea.' },
      { location: 'Egypt', desc: 'Joseph is sold into slavery there and eventually rises to power, saving his family from famine.' },
      { location: 'Mount Moriah', desc: 'The sacred location where God tests Abraham\'s faith by commanding him to sacrifice Isaac.' }
    ],
    keyLessons: [
      { title: 'The Sovereignty of God', desc: 'God is portrayed as the all-powerful creator and ruler of the universe. His actions shape history, and His will is consistently accomplished.' },
      { title: 'The Consequences of Sin', desc: 'Genesis repeatedly highlights the destructive nature of sin, from Adam and Eve\'s disobedience to the destruction of Sodom and Gomorrah.' },
      { title: 'The Power of Faith and Obedience', desc: 'Figures like Abraham, Isaac, and Joseph demonstrate the transformative power of faith and obedience, even in difficult circumstances.' },
      { title: 'The Significance of Covenant', desc: 'God\'s covenants illustrate His faithfulness and provide hope for redemption and restoration.' },
      { title: 'The Value of Forgiveness and Reconciliation', desc: 'Stories like Joseph\'s reconciliation with his brothers highlight the power of forgiveness to restore broken relationships.' },
      { title: 'The Promise of Redemption', desc: 'Genesis lays the groundwork for God\'s ultimate redemptive plan through Jesus Christ, demonstrating His purpose to restore His people.' }
    ]
  }
};

export default function StudyGuideArticle({ guide, onBack }) {
  const queryClient = useQueryClient();
  const [expandedSections, setExpandedSections] = useState({
    introduction: true,
    historicalContext: false,
    keyCharacters: false,
    keyEvents: false,
    keyScriptures: false,
    keyLocations: false,
    keyLessons: false
  });

  const content = studyGuideContentMap[guide.id];

  // Fetch progress
  const { data: progress } = useQuery({
    queryKey: ['studyProgress', guide.id],
    queryFn: async () => {
      const results = await base44.entities.StudyGuideProgress.filter({
        guide_id: guide.id
      });
      return results[0] || {
        guide_id: guide.id,
        guide_name: guide.title,
        completed_sections: [],
        overall_progress: 0,
        is_completed: false
      };
    }
  });

  // Fetch notes
  const { data: notes = {} } = useQuery({
    queryKey: ['studyNotes', guide.id],
    queryFn: async () => {
      const results = await base44.entities.StudyGuideNote.filter({
        guide_id: guide.id
      });
      const notesMap = {};
      results.forEach(note => {
        const key = `${note.section}-${note.subsection || ''}`;
        notesMap[key] = note.content;
      });
      return notesMap;
    }
  });

  // Mutations
  const updateProgressMutation = useMutation({
    mutationFn: async (newProgress) => {
      if (progress?.id) {
        await base44.entities.StudyGuideProgress.update(progress.id, newProgress);
      } else {
        await base44.entities.StudyGuideProgress.create(newProgress);
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['studyProgress', guide.id])
  });

  const saveNoteMutation = useMutation({
    mutationFn: async ({ section, subsection, content }) => {
      const key = `${section}-${subsection || ''}`;
      const existing = await base44.entities.StudyGuideNote.filter({
        guide_id: guide.id,
        section,
        subsection: subsection || null
      });
      
      if (existing.length > 0) {
        await base44.entities.StudyGuideNote.update(existing[0].id, { content });
      } else {
        await base44.entities.StudyGuideNote.create({
          guide_id: guide.id,
          section,
          subsection: subsection || undefined,
          content
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['studyNotes', guide.id])
  });

  if (!content) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] p-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p className="text-center text-gray-500 mt-20">Study guide content not found.</p>
      </div>
    );
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleToggleCompletion = (section) => {
    const newCompleted = progress?.completed_sections || [];
    if (newCompleted.includes(section)) {
      newCompleted.splice(newCompleted.indexOf(section), 1);
    } else {
      newCompleted.push(section);
    }
    const newProgress = Math.round((newCompleted.length / 7) * 100);
    updateProgressMutation.mutate({
      guide_id: guide.id,
      guide_name: guide.title,
      completed_sections: newCompleted,
      overall_progress: newProgress,
      is_completed: newProgress === 100
    });
  };

  const handleSaveNote = async (section, subsection, content) => {
    await saveNoteMutation.mutateAsync({ section, subsection, content });
  };

  const getNote = (section, subsection) => {
    const key = `${section}-${subsection || ''}`;
    return notes[key] || '';
  };

  const sections = ['introduction', 'historicalContext', 'keyCharacters', 'keyEvents', 'keyScriptures', 'keyLocations', 'keyLessons'];
  const sectionLabels = ['Introduction', 'Historical Context', 'Key Characters', 'Key Events', 'Key Scriptures', 'Key Locations', 'Key Lessons'];

  const SectionHeader = ({ title, section, isExpanded }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#c9a227] to-[#8fa68a] text-white rounded-lg hover:shadow-lg transition-all duration-300"
    >
      <h2 className="text-lg font-semibold flex items-center gap-3">
        <BookOpen className="w-5 h-5" />
        {title}
      </h2>
      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </button>
  );

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

        {/* Completion Tracker */}
        {progress && (
          <CompletionTracker
            sections={sectionLabels}
            completedSections={progress.completed_sections}
            onToggleSection={(label) => {
              const sectionKey = sections[sectionLabels.indexOf(label)];
              handleToggleCompletion(sectionKey);
            }}
            overallProgress={progress.overall_progress}
          />
        )}

        {/* Header Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 rounded-2xl overflow-hidden mb-6"
        >
          <img
            src={guide.image}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl font-bold text-white mb-2">{guide.title}</h1>
            <p className="text-white/90">{guide.subtitle}</p>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SectionHeader title="Introduction" section="introduction" isExpanded={expandedSections.introduction} />
          {expandedSections.introduction && (
            <>
              <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {content.introduction.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </Card>
              <ReflectionPrompt section="Introduction" content={content.introduction.join(' ')} />
              <StudyNotes section="introduction" notes={getNote('introduction')} onSave={(content) => handleSaveNote('introduction', undefined, content)} />
            </>
          )}
        </motion.div>

        {/* Historical Context */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4">
          <SectionHeader title="Historical Context" section="historicalContext" isExpanded={expandedSections.historicalContext} />
          {expandedSections.historicalContext && (
            <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Time Period</h3>
                <p>{content.historicalContext.timePeriod}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Authorship and Sources</h3>
                <p>{content.historicalContext.authorship}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Geographical Settings</h3>
                <p>{content.historicalContext.geography}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Oral Transmission</h3>
                <p>{content.historicalContext.transmission}</p>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Key Characters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4">
          <SectionHeader title="Key Characters" section="keyCharacters" isExpanded={expandedSections.keyCharacters} />
          {expandedSections.keyCharacters && (
            <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300">
              {content.keyCharacters.map((character, index) => (
                <div key={index} className="border-l-4 border-[#c9a227] pl-4">
                  <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{character.name}</h3>
                  <p className="text-sm">{character.desc}</p>
                </div>
              ))}
            </Card>
            <ReflectionPrompt section="Key Characters" content={content.keyCharacters.map(c => c.desc).join(' ')} />
            <StudyNotes section="keyCharacters" notes={getNote('keyCharacters')} onSave={(content) => handleSaveNote('keyCharacters', undefined, content)} />
          )}
        </motion.div>

        {/* Key Events */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4">
          <SectionHeader title="Key Events" section="keyEvents" isExpanded={expandedSections.keyEvents} />
          {expandedSections.keyEvents && (
            <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300">
              {content.keyEvents.map((item, index) => (
                <div key={index} className="border-l-4 border-[#8fa68a] pl-4">
                  <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{item.event}</h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </Card>
            <ReflectionPrompt section="Key Events" content={content.keyEvents.map(e => e.desc).join(' ')} />
            <StudyNotes section="keyEvents" notes={getNote('keyEvents')} onSave={(content) => handleSaveNote('keyEvents', undefined, content)} />
          )}
        </motion.div>

        {/* Key Scriptures */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4">
          <SectionHeader title="Key Scriptures" section="keyScriptures" isExpanded={expandedSections.keyScriptures} />
          {expandedSections.keyScriptures && (
            <Card className="p-6 mt-2 space-y-6 text-gray-700 dark:text-gray-300 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              {content.keyScriptures.map((item, index) => (
                <div key={index}>
                  <p className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{item.verse}</p>
                  <p className="italic mb-2">{item.text}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.insight}</p>
                </div>
              ))}
            </Card>
            <ReflectionPrompt section="Key Scriptures" content={content.keyScriptures.map(s => s.text).join(' ')} />
            <StudyNotes section="keyScriptures" notes={getNote('keyScriptures')} onSave={(content) => handleSaveNote('keyScriptures', undefined, content)} />
          )}
        </motion.div>

        {/* Key Locations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-4">
          <SectionHeader title="Key Locations" section="keyLocations" isExpanded={expandedSections.keyLocations} />
          {expandedSections.keyLocations && (
            <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300">
              {content.keyLocations.map((item, index) => (
                <div key={index} className="border-l-4 border-[#c9a227] pl-4">
                  <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{item.location}</h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </Card>
            <ReflectionPrompt section="Key Locations" content={content.keyLocations.map(l => l.desc).join(' ')} />
            <StudyNotes section="keyLocations" notes={getNote('keyLocations')} onSave={(content) => handleSaveNote('keyLocations', undefined, content)} />
          )}
        </motion.div>

        {/* Key Lessons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-4">
          <SectionHeader title="Key Lessons" section="keyLessons" isExpanded={expandedSections.keyLessons} />
          {expandedSections.keyLessons && (
            <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300">
              {content.keyLessons.map((lesson, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">{index + 1}. {lesson.title}</h3>
                  <p className="text-sm">{lesson.desc}</p>
                </div>
              ))}
            </Card>
            <ReflectionPrompt section="Key Lessons" content={content.keyLessons.map(l => l.desc).join(' ')} />
            <StudyNotes section="keyLessons" notes={getNote('keyLessons')} onSave={(content) => handleSaveNote('keyLessons', undefined, content)} />
          )}
        </motion.div>

        {/* Conclusion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-6">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-white mb-4">Study Takeaway</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The Book of Genesis serves as the foundation upon which the entire Bible stands. Its narratives about faith, obedience, and redemption remain profoundly relevant today. Genesis invites us to reflect on our place in God's redemptive plan and to embrace the timeless values of faith, obedience, and trust in the sovereign God who created and sustains the universe.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}