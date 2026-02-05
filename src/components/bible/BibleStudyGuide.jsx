import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function BibleStudyGuide() {
  const [expandedSections, setExpandedSections] = useState({
    introduction: true,
    historicalContext: false,
    keyCharacters: false,
    keyEvents: false,
    keyScriptures: false,
    keyLocations: false,
    keyLessons: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
    <div className="space-y-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white mb-1">Genesis: A Comprehensive Study</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">The Book of Origins and Redemption</p>
      </motion.div>

      {/* Introduction */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeader title="Introduction" section="introduction" isExpanded={expandedSections.introduction} />
        {expandedSections.introduction && (
          <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>As the first book of the Bible, the Book of Genesis holds immense significance for both Judaism and Christianity. Its name, derived from the Greek term γένεσις (genesis), translates to "origin" or "birth," alluding to its primary purpose of providing an account of the creation of the universe, earth, and humanity.</p>
            
            <p>Composed as a collection of stories and narratives, Genesis serves as the cornerstone of biblical history. Its vivid imagery and deeply symbolic language illustrate the genesis of the world and provide a rich tapestry of early human experiences. The book's authorship is traditionally attributed to Moses, who is believed to have compiled the narratives from ancient oral traditions, creating a cohesive story of God's redemptive plan for humanity.</p>

            <p>The Book of Genesis is divided into two primary sections: the primeval history (chapters 1-11) and the ancestral history (chapters 12-50). The primeval history begins with the creation story and proceeds to narrate the world's early days, including tales of Adam and Eve, Noah's ark, and the Tower of Babel. The ancestral history focuses on God's covenant with Abraham and follows the lives of his descendants, Isaac, Jacob, and Joseph.</p>

            <p>Beyond its historical significance, the Book of Genesis addresses timeless themes such as obedience, faith, and redemption. Its teachings lay the groundwork for understanding God's nature and His interaction with humanity throughout the rest of the biblical narrative. In essence, the Book of Genesis serves as the foundation upon which the entire Bible stands, providing a vital context for comprehending God's plan for creation and redemption.</p>
          </Card>
        )}
      </motion.div>

      {/* Historical Context */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SectionHeader title="Historical Context" section="historicalContext" isExpanded={expandedSections.historicalContext} />
        {expandedSections.historicalContext && (
          <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Time Period</h3>
              <p>The Book of Genesis, dating back to approximately the second millennium BCE, is situated within the broader context of the ancient Near East. This period was characterized by the rise and fall of various civilizations, including the Sumerians, Babylonians, Egyptians, and early Semitic peoples.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Authorship and Sources</h3>
              <p>Traditionally attributed to Moses, the authorship of Genesis has been a subject of scholarly debate. Some scholars suggest that multiple authors contributed to the text, while others argue for a single author drawing upon various sources. Regardless of its precise authorship, Genesis reflects the perspectives and beliefs of the ancient Israelite people.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Cultural and Geographical Settings</h3>
              <p>The geographical locations mentioned in Genesis, such as the Garden of Eden, Babel, Canaan, and Egypt, provide insight into the movements and interactions of ancient peoples. The narrative takes place within the Fertile Crescent, a region in the ancient Near East known for its agricultural productivity and diverse civilizations.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Oral Transmission and Written Records</h3>
              <p>The stories within Genesis were likely passed down through oral tradition before being written down. The significance of these narratives for ancient Israelite society and identity cannot be overstated, as they provided a shared understanding of the people's origins, values, and religious beliefs.</p>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Key Characters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <SectionHeader title="Key Characters" section="keyCharacters" isExpanded={expandedSections.keyCharacters} />
        {expandedSections.keyCharacters && (
          <Card className="p-6 mt-2 space-y-6 text-gray-700 dark:text-gray-300">
            {[
              { name: 'Adam and Eve', desc: 'The first humans created by God in the Garden of Eden. Their disobedience leads to the fall of humanity and the introduction of sin into the world.' },
              { name: 'Noah', desc: 'A righteous man chosen by God to build an ark and survive the great flood. His obedience demonstrates the importance of faith in corrupt times.' },
              { name: 'Abraham', desc: 'The father of faith and ancestor of the Israelites. God establishes a covenant with him, promising to make his descendants a great nation.' },
              { name: 'Isaac', desc: 'The son of Abraham and father of Jacob. His birth in Abraham\'s old age is a miraculous fulfillment of God\'s promise.' },
              { name: 'Jacob', desc: 'Later named Israel, Jacob is the son of Isaac. His life shows the transformative power of God\'s grace and the importance of forgiveness.' },
              { name: 'Joseph', desc: 'The favorite son of Jacob who experiences betrayal and slavery but rises to power in Egypt, demonstrating God\'s ability to bring good from adversity.' }
            ].map((character, index) => (
              <div key={index} className="border-l-4 border-[#c9a227] pl-4">
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{character.name}</h3>
                <p className="text-sm">{character.desc}</p>
              </div>
            ))}
          </Card>
        )}
      </motion.div>

      {/* Key Events */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <SectionHeader title="Key Events" section="keyEvents" isExpanded={expandedSections.keyEvents} />
        {expandedSections.keyEvents && (
          <Card className="p-6 mt-2 space-y-6 text-gray-700 dark:text-gray-300">
            {[
              { event: 'The Creation', desc: 'God creates the universe, earth, and all living creatures in six days, declaring all He made "very good."' },
              { event: 'The Fall of Humanity', desc: 'Adam and Eve\'s disobedience in the Garden of Eden introduces sin, death, and suffering into the world.' },
              { event: 'The Great Flood', desc: 'God sends a global flood to cleanse the earth of wickedness. Noah\'s obedience preserves life through the ark.' },
              { event: 'God\'s Covenant with Abraham', desc: 'God establishes a covenant with Abraham, promising to bless his descendants and make them a great nation.' },
              { event: 'Destruction of Sodom and Gomorrah', desc: 'God\'s judgment falls upon these wicked cities, demonstrating His intolerance for sin.' },
              { event: 'Jacob\'s Ladder Vision', desc: 'Jacob dreams of a ladder to heaven with angels ascending and descending. God reaffirms His covenant.' },
              { event: 'Joseph in Egypt', desc: 'Joseph is sold into slavery but rises to power as governor, saving his family from famine.' }
            ].map((item, index) => (
              <div key={index} className="border-l-4 border-[#8fa68a] pl-4">
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{item.event}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </Card>
        )}
      </motion.div>

      {/* Key Scriptures */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <SectionHeader title="Key Scriptures" section="keyScriptures" isExpanded={expandedSections.keyScriptures} />
        {expandedSections.keyScriptures && (
          <Card className="p-6 mt-2 space-y-6 text-gray-700 dark:text-gray-300 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            {[
              { verse: 'Genesis 1:1', text: '"In the beginning, God created the heavens and the earth."', insight: 'Establishes God\'s sovereignty and role as the divine architect of the universe.' },
              { verse: 'Genesis 1:26', text: '"Let us make man in our image, after our likeness."', insight: 'Affirms the unique nature of humans as beings created in God\'s image with inherent worth.' },
              { verse: 'Genesis 12:2', text: '"I will make of you a great nation, and I will bless you and make your name great."', insight: 'God\'s foundational promise to Abraham, central to His redemptive plan.' }
            ].map((item, index) => (
              <div key={index}>
                <p className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{item.verse}</p>
                <p className="italic mb-2">{item.text}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.insight}</p>
              </div>
            ))}
          </Card>
        )}
      </motion.div>

      {/* Key Locations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <SectionHeader title="Key Locations" section="keyLocations" isExpanded={expandedSections.keyLocations} />
        {expandedSections.keyLocations && (
          <Card className="p-6 mt-2 space-y-6 text-gray-700 dark:text-gray-300">
            {[
              { location: 'The Garden of Eden', desc: 'The idyllic paradise where God places Adam and Eve. A symbol of humanity\'s original, untainted state.' },
              { location: 'Babel', desc: 'The location of the Tower of Babel, where people attempt to build a tower reaching the heavens, explaining the origin of different languages.' },
              { location: 'The Promised Land (Canaan)', desc: 'The territory God promises to give to Abraham\'s descendants, located between the Jordan River and Mediterranean Sea.' },
              { location: 'Egypt', desc: 'Joseph is sold into slavery there and eventually rises to power, saving his family from famine.' },
              { location: 'Mount Moriah', desc: 'The sacred location where God tests Abraham\'s faith by commanding him to sacrifice Isaac.' }
            ].map((item, index) => (
              <div key={index} className="border-l-4 border-[#c9a227] pl-4">
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{item.location}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </Card>
        )}
      </motion.div>

      {/* Key Lessons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <SectionHeader title="Key Lessons" section="keyLessons" isExpanded={expandedSections.keyLessons} />
        {expandedSections.keyLessons && (
          <Card className="p-6 mt-2 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">1. The Sovereignty of God</h3>
              <p>God is portrayed as the all-powerful creator and ruler of the universe. His actions shape history, and His will is consistently accomplished.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">2. The Consequences of Sin</h3>
              <p>Genesis repeatedly highlights the destructive nature of sin, from Adam and Eve's disobedience to the destruction of Sodom and Gomorrah.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">3. The Power of Faith and Obedience</h3>
              <p>Figures like Abraham, Isaac, and Joseph demonstrate the transformative power of faith and obedience, even in difficult circumstances.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">4. The Significance of Covenant</h3>
              <p>God's covenants illustrate His faithfulness and provide hope for redemption and restoration.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">5. The Value of Forgiveness and Reconciliation</h3>
              <p>Stories like Joseph's reconciliation with his brothers highlight the power of forgiveness to restore broken relationships.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">6. The Promise of Redemption</h3>
              <p>Genesis lays the groundwork for God's ultimate redemptive plan through Jesus Christ, demonstrating His purpose to restore His people.</p>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Conclusion */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 mt-6">
          <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-white mb-4">Study Takeaway</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            The Book of Genesis serves as the foundation upon which the entire Bible stands. Its narratives about faith, obedience, and redemption remain profoundly relevant today. Through the lives of its key characters, we learn that even the greatest figures in history struggled with doubt and uncertainty, yet through faith in God's promises, they found purpose and blessing.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
            Genesis invites us to reflect on our place in God's redemptive plan and to embrace the timeless values of faith, obedience, and trust in the sovereign God who created and sustains the universe.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}