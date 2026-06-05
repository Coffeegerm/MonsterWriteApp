import React from 'react';
import Svg, { Circle, Ellipse, Path, Polygon, G } from 'react-native-svg';
import { MoodState } from '@/types/monster';

interface Props {
  mood: MoodState;
  size?: number;
}

const BODY_COLORS: Record<MoodState, string> = {
  ecstatic: '#FF4500',
  happy: '#FF6B35',
  neutral: '#B85C38',
  sad: '#6CAFD8',
  distressed: '#9B72CF',
};

const FLAME_OPACITY: Record<MoodState, number> = {
  ecstatic: 1.0,
  happy: 0.85,
  neutral: 0.5,
  sad: 0.2,
  distressed: 0.1,
};

const EYES: Record<MoodState, React.ReactNode> = {
  ecstatic: (
    <G>
      <Circle cx="40" cy="55" r="7" fill="#FFD166" />
      <Circle cx="60" cy="55" r="7" fill="#FFD166" />
      <Circle cx="40" cy="55" r="4" fill="#1A1625" />
      <Circle cx="60" cy="55" r="4" fill="#1A1625" />
      <Circle cx="42" cy="53" r="1.5" fill="white" />
      <Circle cx="62" cy="53" r="1.5" fill="white" />
    </G>
  ),
  happy: (
    <G>
      <Circle cx="40" cy="56" r="6" fill="#FFD166" />
      <Circle cx="60" cy="56" r="6" fill="#FFD166" />
      <Circle cx="40" cy="56" r="3.5" fill="#1A1625" />
      <Circle cx="60" cy="56" r="3.5" fill="#1A1625" />
      <Circle cx="42" cy="54" r="1.5" fill="white" />
      <Circle cx="62" cy="54" r="1.5" fill="white" />
    </G>
  ),
  neutral: (
    <G>
      <Circle cx="40" cy="56" r="6" fill="#FFD166" />
      <Circle cx="60" cy="56" r="6" fill="#FFD166" />
      <Circle cx="40" cy="57" r="3.5" fill="#1A1625" />
      <Circle cx="60" cy="57" r="3.5" fill="#1A1625" />
      <Circle cx="42" cy="55" r="1.5" fill="white" />
      <Circle cx="62" cy="55" r="1.5" fill="white" />
    </G>
  ),
  sad: (
    <G>
      <Circle cx="40" cy="57" r="6" fill="#6CAFD8" />
      <Circle cx="60" cy="57" r="6" fill="#6CAFD8" />
      <Circle cx="40" cy="58" r="3.5" fill="#1A1625" />
      <Circle cx="60" cy="58" r="3.5" fill="#1A1625" />
      <Circle cx="42" cy="56" r="1.5" fill="white" />
      <Circle cx="62" cy="56" r="1.5" fill="white" />
    </G>
  ),
  distressed: (
    <G>
      <Circle cx="40" cy="58" r="6" fill="#9B72CF" />
      <Circle cx="60" cy="58" r="6" fill="#9B72CF" />
      <Ellipse cx="40" cy="59" rx="3.5" ry="5" fill="#1A1625" />
      <Ellipse cx="60" cy="59" rx="3.5" ry="5" fill="#1A1625" />
      <Circle cx="42" cy="56" r="1.5" fill="white" />
      <Circle cx="62" cy="56" r="1.5" fill="white" />
    </G>
  ),
};

const MOUTHS: Record<MoodState, React.ReactNode> = {
  ecstatic: <Path d="M 34 70 Q 50 84 66 70" stroke="#1A1625" strokeWidth="3" fill="none" strokeLinecap="round" />,
  happy: <Path d="M 36 70 Q 50 80 64 70" stroke="#1A1625" strokeWidth="3" fill="none" strokeLinecap="round" />,
  neutral: <Path d="M 38 70 L 62 70" stroke="#1A1625" strokeWidth="3" strokeLinecap="round" />,
  sad: <Path d="M 36 73 Q 50 65 64 73" stroke="#1A1625" strokeWidth="3" fill="none" strokeLinecap="round" />,
  distressed: <Path d="M 34 75 Q 50 62 66 75" stroke="#1A1625" strokeWidth="3" fill="none" strokeLinecap="round" />,
};

export default function Cindra({ mood, size = 200 }: Props) {
  const bodyColor = BODY_COLORS[mood];
  const flameOpacity = FLAME_OPACITY[mood];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Tail */}
      <Path d="M 75 75 Q 90 68 88 55 Q 86 42 78 50" stroke={bodyColor} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Body */}
      <Ellipse cx="50" cy="70" rx="28" ry="22" fill={bodyColor} />
      {/* Head */}
      <Circle cx="50" cy="50" r="24" fill={bodyColor} />
      {/* Horns */}
      <Polygon points="36,30 30,12 42,26" fill={bodyColor} />
      <Polygon points="64,30 70,12 58,26" fill={bodyColor} />
      {/* Flame breath (varies by mood) */}
      <G opacity={flameOpacity}>
        <Path d="M 43 74 Q 40 82 36 86 Q 38 80 34 84 Q 37 76 33 78 Q 38 70 43 74 Z" fill="#FF7B3A" />
        <Path d="M 50 76 Q 48 86 50 92 Q 52 86 50 76 Z" fill="#FFD166" />
        <Path d="M 57 74 Q 60 82 64 86 Q 62 80 66 84 Q 63 76 67 78 Q 62 70 57 74 Z" fill="#FF7B3A" />
      </G>
      {/* Eyes */}
      {EYES[mood]}
      {/* Mouth */}
      {MOUTHS[mood]}
      {/* Wing hints */}
      <Path d="M 22 58 Q 8 46 14 36 Q 18 50 26 54" fill={bodyColor} opacity="0.8" />
      <Path d="M 78 58 Q 92 46 86 36 Q 82 50 74 54" fill={bodyColor} opacity="0.8" />
    </Svg>
  );
}
