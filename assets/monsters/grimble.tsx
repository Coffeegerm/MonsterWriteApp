import React from 'react';
import Svg, { Circle, Ellipse, Path, Polygon, G, Rect } from 'react-native-svg';
import { MoodState } from '@/types/monster';
import { MoodColors } from '@/constants/theme';

interface Props {
  mood: MoodState;
  size?: number;
}

// Eyebrow angle reflects mood: negative = frown brows, positive = raised/arched
const EYEBROWS: Record<MoodState, { left: string; right: string }> = {
  ecstatic: {
    left: 'M 27 68 Q 35 62 43 66',
    right: 'M 57 66 Q 65 62 73 68',
  },
  happy: {
    left: 'M 28 70 Q 35 65 42 69',
    right: 'M 58 69 Q 65 65 72 70',
  },
  neutral: {
    left: 'M 28 71 L 42 71',
    right: 'M 58 71 L 72 71',
  },
  sad: {
    left: 'M 28 69 Q 35 74 42 71',
    right: 'M 58 71 Q 65 74 72 69',
  },
  distressed: {
    left: 'M 27 68 Q 35 76 43 72',
    right: 'M 57 72 Q 65 76 73 68',
  },
};

const MOUTHS: Record<MoodState, React.ReactNode> = {
  ecstatic: <Path d="M 36 90 Q 50 100 64 90" stroke="#1E1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  happy: <Path d="M 38 89 Q 50 97 62 89" stroke="#1E1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  neutral: <Path d="M 38 89 L 62 89" stroke="#1E1810" strokeWidth="2.5" strokeLinecap="round" />,
  sad: <Path d="M 38 92 Q 50 85 62 92" stroke="#1E1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  distressed: <Path d="M 36 94 Q 50 84 64 94" stroke="#1E1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
};

const BODY_COLORS = MoodColors;

export default function Grimble({ mood, size = 200 }: Props) {
  const bodyColor = BODY_COLORS[mood];
  const brows = EYEBROWS[mood];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Body — angular gremlin */}
      <Polygon points="20,90 15,55 30,35 50,28 70,35 85,55 80,90" fill={bodyColor} />
      {/* Ears/horns */}
      <Polygon points="28,35 22,18 36,30" fill={bodyColor} />
      <Polygon points="72,35 78,18 64,30" fill={bodyColor} />
      {/* Eyes */}
      <Ellipse cx="37" cy="60" rx="7" ry="8" fill="#1E1810" />
      <Ellipse cx="63" cy="60" rx="7" ry="8" fill="#1E1810" />
      <Circle cx="39" cy="58" r="2.5" fill="white" />
      <Circle cx="65" cy="58" r="2.5" fill="white" />
      {/* Eyebrows */}
      <Path d={brows.left} stroke="#1E1810" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d={brows.right} stroke="#1E1810" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Mouth */}
      {MOUTHS[mood]}
      {/* Teeth (shows on happy/ecstatic) */}
      {(mood === 'happy' || mood === 'ecstatic') && (
        <G>
          <Rect x="43" y="89" width="6" height="5" rx="1" fill="white" />
          <Rect x="51" y="89" width="6" height="5" rx="1" fill="white" />
        </G>
      )}
    </Svg>
  );
}
