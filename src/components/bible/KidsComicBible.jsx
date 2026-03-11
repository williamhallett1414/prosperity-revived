import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart, Zap, BookOpen, Sparkles } from 'lucide-react';

// ── Comic stories data ────────────────────────────────────────────────────────
const STORIES = [
  {
    id: 'creation',
    title: 'God Makes Everything!',
    emoji: '🌍',
    color: '#6366F1',
    bgGrad: 'from-indigo-400 to-purple-500',
    badge: 'Genesis 1',
    panels: [
      {
        bg: '#1a1a2e',
        caption: 'DAY 1',
        icon: '✨',
        title: 'Let There Be Light!',
        verse: '"God said, \'Let there be light,\' and there was light!" — Genesis 1:3',
        description: 'Before anything existed, it was completely dark everywhere. Then God spoke — and BOOM! Bright, glowing light filled everything!',
        characters: [
          { emoji: '🌟', label: 'The First Light!', x: 50, y: 35, size: 80 },
          { emoji: '✨', label: '', x: 20, y: 20, size: 30 },
          { emoji: '✨', label: '', x: 75, y: 25, size: 25 },
        ],
        bgColors: ['#0f0c29', '#302b63', '#24243e'],
        soundFx: '✨ FLASH! ✨',
        fxColor: '#FFD700',
      },
      {
        bg: '#0d4f8b',
        caption: 'DAY 2',
        icon: '☁️',
        title: 'Sky and Oceans!',
        verse: '"God made the sky... and called it \'sky.\'" — Genesis 1:8',
        description: 'God stretched out a huge beautiful sky! Blue above and deep rolling oceans below. Everything had its own special place.',
        characters: [
          { emoji: '☁️', label: 'Fluffy Clouds!', x: 30, y: 20, size: 50 },
          { emoji: '🌊', label: 'Big Waves!', x: 50, y: 65, size: 60 },
          { emoji: '☁️', label: '', x: 70, y: 15, size: 35 },
        ],
        bgColors: ['#1565C0', '#1976D2', '#42A5F5'],
        soundFx: '💧 SPLASH! 💧',
        fxColor: '#29B6F6',
      },
      {
        bg: '#1b5e20',
        caption: 'DAY 3',
        icon: '🌱',
        title: 'Plants & Fruit!',
        verse: '"Let the land burst forth with plants!" — Genesis 1:11',
        description: 'God called dry land to appear from the water! Then — WHOOSH — colorful flowers, tall trees, and yummy fruit popped up everywhere!',
        characters: [
          { emoji: '🌳', label: 'Tall Trees!', x: 20, y: 40, size: 65 },
          { emoji: '🍎', label: 'Yummy Apples!', x: 60, y: 30, size: 40 },
          { emoji: '🌸', label: 'Pretty Flowers!', x: 75, y: 60, size: 35 },
          { emoji: '🌱', label: '', x: 40, y: 65, size: 28 },
        ],
        bgColors: ['#2E7D32', '#388E3C', '#66BB6A'],
        soundFx: '🌿 SPROUT! 🌿',
        fxColor: '#A5D6A7',
      },
      {
        bg: '#311b92',
        caption: 'DAY 4',
        icon: '⭐',
        title: 'Sun, Moon & Stars!',
        verse: '"God made two great lights — the greater light to rule the day, and the lesser light to rule the night." — Genesis 1:16',
        description: 'God hung the big bright sun in the sky for daytime, and the glowing moon at night. Then He sprinkled BILLIONS of stars across the sky like glitter!',
        characters: [
          { emoji: '☀️', label: 'The Sun!', x: 20, y: 20, size: 60 },
          { emoji: '🌙', label: 'The Moon!', x: 70, y: 15, size: 45 },
          { emoji: '⭐', label: '', x: 45, y: 10, size: 22 },
          { emoji: '🌟', label: '', x: 60, y: 50, size: 20 },
          { emoji: '⭐', label: '', x: 80, y: 60, size: 18 },
        ],
        bgColors: ['#1A237E', '#283593', '#3949AB'],
        soundFx: '🌟 SPARKLE! 🌟',
        fxColor: '#FFF9C4',
      },
      {
        bg: '#004d40',
        caption: 'DAYS 5 & 6',
        icon: '🐋',
        title: 'Animals Everywhere!',
        verse: '"God made all sorts of wild animals, livestock, and small animals!" — Genesis 1:25',
        description: 'The oceans filled with fish, dolphins, and GIANT whales! Birds soared in the sky! Lions, elephants, puppies and every creature ran across the land!',
        characters: [
          { emoji: '🦁', label: 'Roar!', x: 15, y: 50, size: 55 },
          { emoji: '🐋', label: 'Splash!', x: 65, y: 55, size: 60 },
          { emoji: '🦅', label: 'Soar!', x: 50, y: 15, size: 40 },
          { emoji: '🐘', label: '', x: 80, y: 60, size: 35 },
        ],
        bgColors: ['#00695C', '#00796B', '#26A69A'],
        soundFx: '🐾 ROAR! 🐾',
        fxColor: '#B2DFDB',
      },
      {
        bg: '#bf360c',
        caption: 'DAY 6',
        icon: '👫',
        title: 'God Makes People!',
        verse: '"God created human beings in his own image." — Genesis 1:27',
        description: 'God saved the most special creation for last — US! He made people to be His friends, to take care of His world, and to show His love to everyone!',
        characters: [
          { emoji: '👩', label: 'You!', x: 35, y: 35, size: 65 },
          { emoji: '👦', label: 'And Me!', x: 60, y: 38, size: 60 },
          { emoji: '💖', label: 'God\'s Love!', x: 50, y: 10, size: 35 },
        ],
        bgColors: ['#E64A19', '#F4511E', '#FF7043'],
        soundFx: '💖 CREATED! 💖',
        fxColor: '#FFCCBC',
      },
    ],
  },
  {
    id: 'noah',
    title: "Noah's Big Boat!",
    emoji: '🚢',
    color: '#0891B2',
    bgGrad: 'from-cyan-500 to-blue-600',
    badge: 'Genesis 6–9',
    panels: [
      {
        caption: 'THE CALL',
        icon: '📢',
        title: 'God Talks to Noah!',
        verse: '"Noah was a righteous man, the only blameless person living on earth at the time." — Genesis 6:9',
        description: 'Noah was a good, kind man who loved God with his whole heart. While other people made bad choices, Noah listened to God every single day.',
        characters: [
          { emoji: '👴', label: 'Noah!', x: 40, y: 30, size: 70 },
          { emoji: '🌟', label: 'God\'s favor!', x: 65, y: 15, size: 35 },
          { emoji: '🌿', label: '', x: 15, y: 60, size: 30 },
        ],
        bgColors: ['#1B5E20', '#2E7D32', '#43A047'],
        soundFx: '📢 GOD SPEAKS! 📢',
        fxColor: '#C8E6C9',
      },
      {
        caption: 'BUILD IT!',
        icon: '🔨',
        title: 'Build a Huge Boat!',
        verse: '"Build a large boat from cypress wood and waterproof it." — Genesis 6:14',
        description: 'God told Noah to build a GIGANTIC boat called an ark. It was as long as 1.5 football fields! Noah worked hard every day and never gave up!',
        characters: [
          { emoji: '🚢', label: 'The Ark!', x: 45, y: 45, size: 80 },
          { emoji: '🔨', label: 'Hard work!', x: 15, y: 30, size: 38 },
          { emoji: '🪵', label: 'Wood!', x: 80, y: 60, size: 30 },
        ],
        bgColors: ['#4E342E', '#5D4037', '#795548'],
        soundFx: '🔨 BANG BANG! 🔨',
        fxColor: '#D7CCC8',
      },
      {
        caption: 'TWO BY TWO!',
        icon: '🐾',
        title: 'Animals Line Up!',
        verse: '"Two of each kind of animal... came to Noah and entered the ark." — Genesis 7:9',
        description: 'Then something AMAZING happened — pairs of animals came marching from everywhere! Giraffes, tigers, penguins, and bunnies all walked up the ramp!',
        characters: [
          { emoji: '🦒', label: 'Giraffe!', x: 20, y: 30, size: 55 },
          { emoji: '🐯', label: 'Tiger!', x: 55, y: 35, size: 50 },
          { emoji: '🐧', label: 'Penguin!', x: 80, y: 55, size: 35 },
          { emoji: '🐰', label: 'Bunny!', x: 40, y: 65, size: 30 },
        ],
        bgColors: ['#1A237E', '#283593', '#3949AB'],
        soundFx: '🐾 MARCH! MARCH! 🐾',
        fxColor: '#C5CAE9',
      },
      {
        caption: 'RAIN!',
        icon: '🌧️',
        title: 'The Rain Begins!',
        verse: '"The rain continued to fall for forty days and forty nights." — Genesis 7:12',
        description: 'It rained and rained and RAINED for 40 whole days! Water covered everything. But Noah, his family, and all the animals were safe and cozy on the ark!',
        characters: [
          { emoji: '🌧️', label: '40 days!', x: 50, y: 15, size: 55 },
          { emoji: '🚢', label: 'Safe inside!', x: 45, y: 60, size: 65 },
          { emoji: '💧', label: '', x: 20, y: 40, size: 25 },
          { emoji: '💧', label: '', x: 75, y: 35, size: 20 },
        ],
        bgColors: ['#1565C0', '#1976D2', '#1E88E5'],
        soundFx: '💧 SPLASH! 💧',
        fxColor: '#BBDEFB',
      },
      {
        caption: 'RAINBOW! 🌈',
        icon: '🌈',
        title: "God's Promise!",
        verse: '"I have placed my rainbow in the clouds. It is the sign of my covenant with you." — Genesis 9:13',
        description: 'After the flood, God painted a beautiful rainbow in the sky — a forever promise that He would always take care of His people. Every rainbow reminds us of His love!',
        characters: [
          { emoji: '🌈', label: "God's Promise!", x: 50, y: 20, size: 80 },
          { emoji: '🕊️', label: 'Peace!', x: 70, y: 50, size: 40 },
          { emoji: '☀️', label: 'Hope!', x: 15, y: 20, size: 42 },
        ],
        bgColors: ['#FF6F00', '#FFA000', '#FFB300'],
        soundFx: '🌈 PROMISE! 🌈',
        fxColor: '#FFF8E1',
      },
    ],
  },
  {
    id: 'david_goliath',
    title: 'David vs Giant!',
    emoji: '🪃',
    color: '#DC2626',
    bgGrad: 'from-red-500 to-orange-500',
    badge: '1 Samuel 17',
    panels: [
      {
        caption: 'THE GIANT',
        icon: '😤',
        title: 'Goliath the Giant!',
        verse: '"Goliath... was over nine feet tall!" — 1 Samuel 17:4',
        description: 'There was a HUGE scary warrior named Goliath. He was over 9 FEET TALL — taller than your ceiling! He shouted and scared everyone. But not young David!',
        characters: [
          { emoji: '💪', label: '9 FEET TALL!', x: 50, y: 25, size: 85 },
          { emoji: '⚔️', label: 'Big spear!', x: 75, y: 55, size: 45 },
          { emoji: '😨', label: 'Everyone scared!', x: 15, y: 60, size: 35 },
        ],
        bgColors: ['#B71C1C', '#C62828', '#D32F2F'],
        soundFx: '💥 BOOM! BOOM! 💥',
        fxColor: '#FFCDD2',
      },
      {
        caption: 'YOUNG DAVID',
        icon: '🎵',
        title: 'Just a Shepherd Boy!',
        verse: '"David was just a young man." — 1 Samuel 17:42',
        description: 'David was just a kid — a young shepherd who took care of his family\'s sheep and played music for God. People laughed and said he was too small. But David knew the truth!',
        characters: [
          { emoji: '👦', label: 'Young David!', x: 40, y: 30, size: 65 },
          { emoji: '🐑', label: 'His sheep!', x: 70, y: 60, size: 40 },
          { emoji: '🎵', label: 'Music for God!', x: 15, y: 25, size: 35 },
        ],
        bgColors: ['#1A237E', '#283593', '#3949AB'],
        soundFx: '🎵 LA LA LA! 🎵',
        fxColor: '#C5CAE9',
      },
      {
        caption: 'NOT AFRAID!',
        icon: '🦁',
        title: "David's Secret Weapon!",
        verse: '"The Lord who rescued me from the lion and the bear will rescue me from this giant!" — 1 Samuel 17:37',
        description: 'David remembered how God helped him fight off a LION and a BEAR to protect his sheep! David\'s secret weapon was his FAITH in God — and it was stronger than any armor!',
        characters: [
          { emoji: '🦁', label: 'Beat a lion!', x: 15, y: 35, size: 55 },
          { emoji: '🐻', label: 'Beat a bear!', x: 75, y: 40, size: 50 },
          { emoji: '✝️', label: 'Faith in God!', x: 50, y: 15, size: 40 },
        ],
        bgColors: ['#1B5E20', '#2E7D32', '#388E3C'],
        soundFx: '⚡ FAITH! ⚡',
        fxColor: '#C8E6C9',
      },
      {
        caption: 'THE MOMENT!',
        icon: '🎯',
        title: 'One Small Stone!',
        verse: '"David reached into his shepherd\'s bag and took out a stone. He hurled it with his sling..." — 1 Samuel 17:49',
        description: 'David ran TOWARD the giant — not away! He picked up just 5 smooth stones from a stream, spun his sling, and let one fly. It flew straight and true!',
        characters: [
          { emoji: '🪃', label: 'Sling!', x: 25, y: 35, size: 55 },
          { emoji: '🎯', label: 'Right on target!', x: 65, y: 30, size: 50 },
          { emoji: '💨', label: 'Whoooosh!', x: 45, y: 15, size: 30 },
        ],
        bgColors: ['#E65100', '#EF6C00', '#F57C00'],
        soundFx: '💨 WHOOOOSH! 💨',
        fxColor: '#FFE0B2',
      },
      {
        caption: 'VICTORY! 🎉',
        icon: '🏆',
        title: 'God Wins!',
        verse: '"The battle belongs to the Lord!" — 1 Samuel 17:47',
        description: 'CRASH! The giant fell down! Everyone cheered! David won NOT because he was the biggest or strongest — but because he trusted GOD with all his heart. You can too!',
        characters: [
          { emoji: '🏆', label: 'Victory!', x: 50, y: 15, size: 65 },
          { emoji: '🎉', label: 'Celebrate!', x: 20, y: 45, size: 45 },
          { emoji: '👦', label: 'David wins!', x: 70, y: 40, size: 50 },
        ],
        bgColors: ['#F57F17', '#F9A825', '#FBC02D'],
        soundFx: '🏆 VICTORY! 🏆',
        fxColor: '#FFF9C4',
      },
    ],
  },
  {
    id: 'jonah',
    title: 'Jonah & the Fish!',
    emoji: '🐳',
    color: '#0891B2',
    bgGrad: 'from-blue-500 to-teal-500',
    badge: 'Jonah 1–4',
    panels: [
      {
        caption: 'THE MISSION!',
        icon: '📣',
        title: 'God Has a Job for Jonah!',
        verse: '"Get up and go to the great city of Nineveh!" — Jonah 1:2',
        description: 'God asked Jonah to go to a city called Nineveh and tell the people to change their ways. Simple, right? But Jonah got scared and decided to RUN AWAY instead!',
        characters: [
          { emoji: '🏃', label: 'Running away!', x: 55, y: 35, size: 65 },
          { emoji: '📣', label: "God's call!", x: 20, y: 20, size: 38 },
          { emoji: '🚢', label: 'A ship to escape!', x: 75, y: 55, size: 45 },
        ],
        bgColors: ['#01579B', '#0277BD', '#0288D1'],
        soundFx: '🏃 RUN RUN! 🏃',
        fxColor: '#B3E5FC',
      },
      {
        caption: 'STORM!',
        icon: '⛈️',
        title: 'Uh Oh! Big Storm!',
        verse: '"The Lord hurled a powerful wind over the sea, causing a violent storm." — Jonah 1:4',
        description: 'A HUGE storm came! The ship was rocking wildly, waves crashing everywhere! The sailors were terrified. Jonah knew it was because he ran from God.',
        characters: [
          { emoji: '⛈️', label: 'GIANT storm!', x: 50, y: 15, size: 65 },
          { emoji: '🌊', label: 'Huge waves!', x: 20, y: 60, size: 55 },
          { emoji: '😱', label: 'Sailors scared!', x: 75, y: 50, size: 35 },
        ],
        bgColors: ['#263238', '#37474F', '#455A64'],
        soundFx: '⚡ BOOM! CRACK! ⚡',
        fxColor: '#CFD8DC',
      },
      {
        caption: 'INTO THE SEA!',
        icon: '🐳',
        title: 'A Big Fish Saves Him!',
        verse: '"The Lord had arranged for a great fish to swallow Jonah." — Jonah 1:17',
        description: 'Jonah was thrown overboard — SPLASH! Then a GIANT fish swallowed him whole! Inside the fish, Jonah prayed and prayed and said sorry to God. God heard him!',
        characters: [
          { emoji: '🐳', label: 'GIANT fish!', x: 50, y: 50, size: 85 },
          { emoji: '💧', label: 'Splash!', x: 15, y: 30, size: 35 },
          { emoji: '🙏', label: 'Jonah prays!', x: 48, y: 48, size: 30 },
        ],
        bgColors: ['#0D47A1', '#1565C0', '#1976D2'],
        soundFx: '💦 GULP! SPLASH! 💦',
        fxColor: '#BBDEFB',
      },
      {
        caption: '3 DAYS LATER!',
        icon: '🌅',
        title: 'The Fish Spits Him Out!',
        verse: '"The Lord ordered the fish to spit Jonah out onto the beach." — Jonah 2:10',
        description: 'After 3 days, the fish swam to shore and — BLEEECH — spit Jonah out on dry land! He was so happy to be out! Sometimes God uses unexpected things to help us!',
        characters: [
          { emoji: '🏖️', label: 'Dry land!', x: 50, y: 65, size: 70 },
          { emoji: '🐳', label: 'Goodbye fish!', x: 20, y: 45, size: 55 },
          { emoji: '😅', label: 'Jonah safe!', x: 70, y: 40, size: 45 },
        ],
        bgColors: ['#1B5E20', '#2E7D32', '#388E3C'],
        soundFx: '🤮 BLEEECH! 🤮',
        fxColor: '#C8E6C9',
      },
      {
        caption: 'SECOND CHANCE!',
        icon: '💛',
        title: 'God Gives Second Chances!',
        verse: '"Then the Lord spoke to Jonah again: \'Get up and go to Nineveh.\'" — Jonah 3:1',
        description: 'God gave Jonah a SECOND CHANCE! This time Jonah obeyed. He went to Nineveh, shared God\'s message, and the whole city changed! God loves to give second chances — to all of us!',
        characters: [
          { emoji: '🌟', label: 'New beginning!', x: 50, y: 15, size: 55 },
          { emoji: '👴', label: 'Jonah obeys!', x: 30, y: 45, size: 60 },
          { emoji: '🏙️', label: 'Nineveh!', x: 70, y: 50, size: 50 },
        ],
        bgColors: ['#FF6F00', '#FFA000', '#FFC107'],
        soundFx: '💛 NEW CHANCE! 💛',
        fxColor: '#FFF8E1',
      },
    ],
  },
  {
    id: 'jesus_feeds',
    title: 'Jesus Feeds 5000!',
    emoji: '🐟',
    color: '#059669',
    bgGrad: 'from-emerald-500 to-green-600',
    badge: 'John 6:1-14',
    panels: [
      {
        caption: 'BIG CROWD!',
        icon: '👥',
        title: '5,000 Hungry People!',
        verse: '"A huge crowd kept following him." — John 6:2',
        description: 'Thousands and THOUSANDS of people came to hear Jesus teach. There were 5,000 men PLUS all the women and kids! Everyone was getting hungry. What would they do?',
        characters: [
          { emoji: '👥', label: '5,000 people!', x: 50, y: 30, size: 75 },
          { emoji: '😟', label: 'Everyone hungry!', x: 80, y: 60, size: 35 },
          { emoji: '🌅', label: 'Far from home!', x: 15, y: 20, size: 35 },
        ],
        bgColors: ['#1A237E', '#283593', '#3949AB'],
        soundFx: '👥 SO MANY! 👥',
        fxColor: '#E8EAF6',
      },
      {
        caption: 'A BOY\'S LUNCH!',
        icon: '🧒',
        title: 'One Small Lunch Basket!',
        verse: '"There\'s a young boy here with five barley loaves and two fish." — John 6:9',
        description: 'A little boy was in the crowd. He had PACKED his lunch — 5 small rolls and 2 tiny fish. It wasn\'t much, but he SHARED it with Jesus! That was very brave and generous!',
        characters: [
          { emoji: '🧒', label: 'The boy!', x: 35, y: 35, size: 65 },
          { emoji: '🐟', label: '2 fish!', x: 65, y: 55, size: 40 },
          { emoji: '🍞', label: '5 loaves!', x: 70, y: 30, size: 38 },
        ],
        bgColors: ['#4E342E', '#5D4037', '#6D4C41'],
        soundFx: '🎁 SHARING! 🎁',
        fxColor: '#D7CCC8',
      },
      {
        caption: 'JESUS PRAYS!',
        icon: '🙏',
        title: 'Thank You, God!',
        verse: '"Jesus took the loaves, gave thanks to God, and distributed them to the people." — John 6:11',
        description: 'Jesus took that tiny lunch, looked up to heaven, said thank you to God, and started handing out food. Something INCREDIBLE was about to happen!',
        characters: [
          { emoji: '✋', label: 'Jesus blesses!', x: 45, y: 25, size: 70 },
          { emoji: '✨', label: 'God\'s power!', x: 20, y: 20, size: 35 },
          { emoji: '🙏', label: 'Thankful!', x: 75, y: 55, size: 38 },
        ],
        bgColors: ['#F57F17', '#F9A825', '#FBC02D'],
        soundFx: '✨ THANK YOU GOD! ✨',
        fxColor: '#FFF9C4',
      },
      {
        caption: 'MIRACLE!',
        icon: '✨',
        title: 'Food for EVERYONE!',
        verse: '"They all ate as much as they wanted!" — John 6:11',
        description: 'AMAZING! The food kept multiplying! Every single person — all 5,000+ of them — ate until they were FULL and satisfied! This was an incredible miracle from Jesus!',
        characters: [
          { emoji: '🎉', label: 'Everyone eats!', x: 50, y: 20, size: 60 },
          { emoji: '🐟', label: 'More fish!', x: 20, y: 55, size: 45 },
          { emoji: '🍞', label: 'More bread!', x: 75, y: 50, size: 42 },
          { emoji: '😄', label: 'So happy!', x: 50, y: 65, size: 35 },
        ],
        bgColors: ['#1B5E20', '#2E7D32', '#43A047'],
        soundFx: '✨ MIRACLE! ✨',
        fxColor: '#C8E6C9',
      },
      {
        caption: 'LEFTOVERS!',
        icon: '🧺',
        title: '12 Baskets Left Over!',
        verse: '"After everyone was full, Jesus told his disciples, \'Now gather the leftovers...\' They filled twelve baskets!" — John 6:12',
        description: 'After EVERYONE had eaten, there were 12 huge baskets of food LEFT OVER! Starting with almost nothing, Jesus made MORE than enough. He always provides more than we need!',
        characters: [
          { emoji: '🧺', label: 'So much left!', x: 30, y: 50, size: 55 },
          { emoji: '🧺', label: '12 baskets!', x: 65, y: 45, size: 50 },
          { emoji: '🌟', label: 'God provides!', x: 50, y: 10, size: 40 },
        ],
        bgColors: ['#E65100', '#EF6C00', '#F57C00'],
        soundFx: '🧺 MORE THAN ENOUGH! 🧺',
        fxColor: '#FFE0B2',
      },
    ],
  },
];

// ── Story Select Screen ───────────────────────────────────────────────────────
function StorySelectScreen({ onSelect }) {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl mb-5 p-5"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}>
        <div className="absolute -right-4 -top-4 text-8xl opacity-20">📚</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📖</span>
            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">Kids Bible</span>
          </div>
          <h2 className="text-white text-2xl font-extrabold leading-tight">Comic Bible Stories!</h2>
          <p className="text-white/75 text-sm mt-1">Fun, colorful, easy to understand</p>
        </div>
      </div>

      {/* Story cards */}
      <div className="space-y-3">
        {STORIES.map((story, i) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => onSelect(story)}
            className="w-full text-left rounded-2xl overflow-hidden shadow-md active:scale-98 transition-transform"
          >
            <div className={`bg-gradient-to-r ${story.bgGrad} p-4 flex items-center gap-4`}>
              <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-3xl">{story.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{story.badge}</span>
                <p className="text-white font-extrabold text-lg mt-1 leading-tight">{story.title}</p>
                <p className="text-white/70 text-xs">{story.panels.length} comic panels</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60 flex-shrink-0" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Fun footer */}
      <div className="mt-5 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
        <span className="text-2xl">⭐</span>
        <p className="font-bold text-yellow-700 text-sm mt-1">More stories coming soon!</p>
        <p className="text-yellow-600 text-xs">Daniel, Moses, Easter & more!</p>
      </div>
    </div>
  );
}

// ── Comic Panel ───────────────────────────────────────────────────────────────
function ComicPanel({ panel, storyColor }) {
  const [bgIdx] = useState(0);
  const bgColor = panel.bgColors?.[0] || '#1a1a2e';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl overflow-hidden shadow-2xl"
      style={{ border: `3px solid ${storyColor}` }}
    >
      {/* Comic scene */}
      <div className="relative overflow-hidden" style={{
        height: 220,
        background: `linear-gradient(160deg, ${panel.bgColors?.[0] || bgColor}, ${panel.bgColors?.[1] || bgColor}, ${panel.bgColors?.[2] || bgColor})`,
      }}>
        {/* Halftone dots pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }} />

        {/* Caption tag */}
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-lg"
            style={{ background: storyColor, color: 'white' }}>
            <span>{panel.icon}</span>
            <span className="uppercase tracking-wide">{panel.caption}</span>
          </div>
        </div>

        {/* Sound FX */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="absolute bottom-3 right-3 z-10"
        >
          <div className="px-2.5 py-1 rounded-xl text-xs font-extrabold shadow-lg transform rotate-3"
            style={{ background: panel.fxColor || '#FFD700', color: '#1a1a2e', border: '2px solid rgba(0,0,0,0.15)' }}>
            {panel.soundFx}
          </div>
        </motion.div>

        {/* Characters */}
        {panel.characters?.map((char, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="absolute flex flex-col items-center"
            style={{ left: `${char.x}%`, top: `${char.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <span style={{ fontSize: char.size }}>{char.emoji}</span>
            {char.label && (
              <div className="mt-1 bg-white/90 text-gray-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow whitespace-nowrap max-w-20 text-center leading-tight">
                {char.label}
              </div>
            )}
          </motion.div>
        ))}

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2.5"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
          <p className="text-white font-extrabold text-lg leading-tight drop-shadow-md">{panel.title}</p>
        </div>
      </div>

      {/* Verse strip */}
      <div className="px-4 py-2.5" style={{ background: storyColor + '18', borderTop: `2px dashed ${storyColor}50` }}>
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0 mt-0.5">📖</span>
          <p className="text-[#0A1A2F] text-xs font-semibold leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
            {panel.verse}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white px-4 py-3">
        <p className="text-[#1a1a2e] text-sm leading-relaxed font-medium">{panel.description}</p>
      </div>
    </motion.div>
  );
}

// ── Story Reader ──────────────────────────────────────────────────────────────
function StoryReader({ story, onBack }) {
  const [panelIdx, setPanelIdx] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const panel = story.panels[panelIdx];
  const isLast = panelIdx === story.panels.length - 1;

  const goNext = () => {
    if (isLast) { setShowComplete(true); return; }
    setPanelIdx(i => i + 1);
  };
  const goPrev = () => setPanelIdx(i => Math.max(0, i - 1));

  if (showComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-4"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold text-[#0A1A2F] mb-2">Story Complete!</h2>
        <p className="text-[#0A1A2F]/60 text-sm mb-6">You finished <strong>{story.title}</strong></p>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 mb-6 text-left">
          <p className="font-bold text-yellow-800 text-sm mb-2">💡 What did you learn?</p>
          <p className="text-yellow-700 text-xs leading-relaxed">
            {story.id === 'creation' && 'God made everything — including YOU — and it was all very good! You are special and loved!'}
            {story.id === 'noah' && "When we trust God, He keeps us safe. God always keeps His promises — just like the rainbow!"}
            {story.id === 'david_goliath' && "God makes you brave! You don't have to be big or strong — you just have to trust God like David did!"}
            {story.id === 'jonah' && 'God gives second chances! When we say sorry and obey God, amazing things can happen!'}
            {story.id === 'jesus_feeds' && 'When you share what you have, God can do AMAZING things with it! Never think you\'re too small to help!'}
          </p>
        </div>
        {/* Star rating decoration */}
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
              <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
            </motion.div>
          ))}
        </div>
        <button
          onClick={onBack}
          className="w-full py-3.5 rounded-2xl font-extrabold text-white text-base shadow-lg"
          style={{ background: `linear-gradient(135deg, ${story.color}, ${story.color}cc)` }}
        >
          ← Read Another Story!
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Story header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
          <ChevronLeft className="w-5 h-5 text-[#0A1A2F]" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{story.emoji}</span>
            <p className="font-extrabold text-[#0A1A2F] text-sm truncate">{story.title}</p>
          </div>
          <p className="text-[#0A1A2F]/45 text-xs">{story.badge}</p>
        </div>
        <div className="bg-white rounded-xl px-2.5 py-1 shadow-sm border border-gray-100">
          <p className="text-xs font-bold" style={{ color: story.color }}>
            {panelIdx + 1} / {story.panels.length}
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-4 justify-center">
        {story.panels.map((_, i) => (
          <button key={i} onClick={() => setPanelIdx(i)}>
            <motion.div
              animate={{ scale: i === panelIdx ? 1.3 : 1 }}
              className="rounded-full transition-all"
              style={{
                width: i === panelIdx ? 20 : 8,
                height: 8,
                background: i <= panelIdx ? story.color : '#e5e7eb',
              }}
            />
          </button>
        ))}
      </div>

      {/* Comic panel */}
      <AnimatePresence mode="wait">
        <motion.div key={panelIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}>
          <ComicPanel panel={panel} storyColor={story.color} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-4">
        {panelIdx > 0 && (
          <button onClick={goPrev}
            className="flex-1 py-3 rounded-2xl font-bold text-sm border-2 border-gray-200 text-[#0A1A2F]/60 flex items-center justify-center gap-1.5 bg-white">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
        )}
        <motion.button
          onClick={goNext}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-2xl font-extrabold text-white text-sm flex items-center justify-center gap-1.5 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${story.color}, ${story.color}cc)` }}
        >
          {isLast ? '🎉 Finish!' : (<>Next <ChevronRight className="w-4 h-4" /></>)}
        </motion.button>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function KidsComicBible() {
  const [selectedStory, setSelectedStory] = useState(null);

  return (
    <div>
      <AnimatePresence mode="wait">
        {!selectedStory ? (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StorySelectScreen onSelect={setSelectedStory} />
          </motion.div>
        ) : (
          <motion.div key="reader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StoryReader story={selectedStory} onBack={() => setSelectedStory(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}