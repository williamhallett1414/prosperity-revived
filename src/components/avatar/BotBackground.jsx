// BotBackground — entry component, routes character prop to the right SVG background
// Pure presentational — memo-wrapped, no re-renders on message updates
// Props:
//   character  string  'gideon' | 'coach' | 'chef' | 'hannah' | 'paul'
//   speaking   bool    bot is currently speaking TTS
//   listening  bool    mic is active (STT)
//   thinking   bool    waiting for API response

import { memo } from 'react';
import GideonBackground from './backgrounds/GideonBackground';
import DanielBackground from './backgrounds/DanielBackground';
import DavidBackground  from './backgrounds/DavidBackground';
import HannahBackground from './backgrounds/HannahBackground';
import PaulBackground   from './backgrounds/PaulBackground';

const BACKGROUNDS = {
  gideon: GideonBackground,
  chef:   DanielBackground,
  coach:  DavidBackground,
  hannah: HannahBackground,
  paul:   PaulBackground,
};

const BotBackground = memo(function BotBackground({ character, speaking = false, listening = false, thinking = false }) {
  const Background = BACKGROUNDS[character] ?? GideonBackground;
  return (
    <Background
      speaking={speaking}
      listening={listening}
      thinking={thinking}
    />
  );
});

export default BotBackground;
