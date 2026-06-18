import React from 'react';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import { MoodState } from '@/types/monster';

interface Props {
  mood: MoodState;
  size?: number;
}

const OPACITIES: Record<MoodState, number> = {
  ecstatic: 0.95,
  happy: 0.85,
  neutral: 0.70,
  sad: 0.55,
  distressed: 0.45,
};

const EYES: Record<MoodState, React.ReactNode> = {
  ecstatic: (
    <G>
      <Ellipse cx="40" cy="52" rx="6" ry="7" fill="#1E1810" />
      <Ellipse cx="60" cy="52" rx="6" ry="7" fill="#1E1810" />
      <Circle cx="42" cy="50" r="2" fill="white" />
      <Circle cx="62" cy="50" r="2" fill="white" />
    </G>
  ),
  happy: (
    <G>
      <Ellipse cx="40" cy="53" rx="5" ry="6" fill="#1E1810" />
      <Ellipse cx="60" cy="53" rx="5" ry="6" fill="#1E1810" />
      <Circle cx="42" cy="51" r="2" fill="white" />
      <Circle cx="62" cy="51" r="2" fill="white" />
    </G>
  ),
  neutral: (
    <G>
      <Ellipse cx="40" cy="53" rx="5" ry="5" fill="#1E1810" />
      <Ellipse cx="60" cy="53" rx="5" ry="5" fill="#1E1810" />
      <Circle cx="42" cy="51" r="2" fill="white" />
      <Circle cx="62" cy="51" r="2" fill="white" />
    </G>
  ),
  sad: (
    <G>
      <Ellipse cx="40" cy="54" rx="5" ry="4" fill="#1E1810" />
      <Ellipse cx="60" cy="54" rx="5" ry="4" fill="#1E1810" />
      <Circle cx="42" cy="52" r="1.5" fill="white" />
      <Circle cx="62" cy="52" r="1.5" fill="white" />
    </G>
  ),
  distressed: (
    <G>
      <Ellipse cx="40" cy="55" rx="4" ry="6" fill="#1E1810" />
      <Ellipse cx="60" cy="55" rx="4" ry="6" fill="#1E1810" />
      <Circle cx="42" cy="52" r="1.5" fill="white" />
      <Circle cx="62" cy="52" r="1.5" fill="white" />
    </G>
  ),
};

const MOUTHS: Record<MoodState, React.ReactNode> = {
  ecstatic: <Path d="M 38 66 Q 50 76 62 66" stroke="#1E1810" strokeWidth="2" fill="none" strokeLinecap="round" />,
  happy: <Path d="M 40 65 Q 50 73 60 65" stroke="#1E1810" strokeWidth="2" fill="none" strokeLinecap="round" />,
  neutral: <Ellipse cx="50" cy="65" rx="5" ry="3" fill="#1E1810" opacity="0.7" />,
  sad: <Path d="M 40 68 Q 50 62 60 68" stroke="#1E1810" strokeWidth="2" fill="none" strokeLinecap="round" />,
  distressed: <Path d="M 38 70 Q 50 60 62 70" stroke="#1E1810" strokeWidth="2" fill="none" strokeLinecap="round" />,
};

export default function Wisper({ mood, size = 200 }: Props) {
  const opacity = OPACITIES[mood];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Ghost body with wavy bottom */}
      <Path
        d="M 18 55 Q 18 20 50 18 Q 82 20 82 55 L 82 82 Q 72 74 62 82 Q 52 90 50 82 Q 48 90 38 82 Q 28 74 18 82 Z"
        fill="#EFE6D2"
        opacity={opacity}
      />
      {/* Eyes */}
      {EYES[mood]}
      {/* Mouth */}
      {MOUTHS[mood]}
      {/* Subtle glow */}
      <Circle cx="50" cy="50" r="35" fill="#B0822F" opacity={0.06} />
    </Svg>
  );
}
