import React from 'react';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import { MoodState } from '@/types/monster';
import { MoodColors } from '@/constants/theme';

interface Props {
  mood: MoodState;
  size?: number;
}

const MOODS: Record<MoodState, { eyeExpression: React.ReactNode; mouth: React.ReactNode }> = {
  ecstatic: {
    eyeExpression: (
      <G>
        <Circle cx="38" cy="82" r="8" fill="#1E1810" />
        <Circle cx="62" cy="82" r="8" fill="#1E1810" />
        <Circle cx="41" cy="79" r="3" fill="white" />
        <Circle cx="65" cy="79" r="3" fill="white" />
      </G>
    ),
    mouth: <Path d="M 35 100 Q 50 116 65 100" stroke="#1E1810" strokeWidth="3" fill="none" strokeLinecap="round" />,
  },
  happy: {
    eyeExpression: (
      <G>
        <Circle cx="38" cy="82" r="7" fill="#1E1810" />
        <Circle cx="62" cy="82" r="7" fill="#1E1810" />
        <Circle cx="41" cy="80" r="2.5" fill="white" />
        <Circle cx="65" cy="80" r="2.5" fill="white" />
      </G>
    ),
    mouth: <Path d="M 37 99 Q 50 111 63 99" stroke="#1E1810" strokeWidth="3" fill="none" strokeLinecap="round" />,
  },
  neutral: {
    eyeExpression: (
      <G>
        <Circle cx="38" cy="82" r="7" fill="#1E1810" />
        <Circle cx="62" cy="82" r="7" fill="#1E1810" />
        <Circle cx="40" cy="80" r="2.5" fill="white" />
        <Circle cx="64" cy="80" r="2.5" fill="white" />
      </G>
    ),
    mouth: <Path d="M 38 100 L 62 100" stroke="#1E1810" strokeWidth="3" strokeLinecap="round" />,
  },
  sad: {
    eyeExpression: (
      <G>
        <Circle cx="38" cy="84" r="7" fill="#1E1810" />
        <Circle cx="62" cy="84" r="7" fill="#1E1810" />
        <Circle cx="40" cy="82" r="2.5" fill="white" />
        <Circle cx="64" cy="82" r="2.5" fill="white" />
      </G>
    ),
    mouth: <Path d="M 37 104 Q 50 96 63 104" stroke="#1E1810" strokeWidth="3" fill="none" strokeLinecap="round" />,
  },
  distressed: {
    eyeExpression: (
      <G>
        <Ellipse cx="38" cy="84" rx="7" ry="9" fill="#1E1810" />
        <Ellipse cx="62" cy="84" rx="7" ry="9" fill="#1E1810" />
        <Circle cx="40" cy="81" r="2.5" fill="white" />
        <Circle cx="64" cy="81" r="2.5" fill="white" />
      </G>
    ),
    mouth: <Path d="M 35 106 Q 50 96 65 106" stroke="#1E1810" strokeWidth="3" fill="none" strokeLinecap="round" />,
  },
};

export default function Blobbsworth({ mood, size = 200 }: Props) {
  const bodyColor = MoodColors[mood];
  const { eyeExpression, mouth } = MOODS[mood];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Body — rounded blob */}
      <Ellipse cx="50" cy="68" rx="40" ry="36" fill={bodyColor} />
      {/* Head bump */}
      <Circle cx="50" cy="48" r="26" fill={bodyColor} />
      {/* Stubby arms */}
      <Ellipse cx="16" cy="70" rx="9" ry="6" fill={bodyColor} transform="rotate(-20 16 70)" />
      <Ellipse cx="84" cy="70" rx="9" ry="6" fill={bodyColor} transform="rotate(20 84 70)" />
      {/* Eyes */}
      {eyeExpression}
      {/* Mouth */}
      {mouth}
      {/* Cheek blush */}
      <Ellipse cx="28" cy="92" rx="7" ry="4" fill="#B05C36" opacity="0.4" />
      <Ellipse cx="72" cy="92" rx="7" ry="4" fill="#B05C36" opacity="0.4" />
    </Svg>
  );
}
