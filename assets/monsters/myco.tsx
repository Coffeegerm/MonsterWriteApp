import React from 'react';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import { MoodState } from '@/types/monster';
import { MoodColors } from '@/constants/theme';

interface Props {
  mood: MoodState;
  size?: number;
}

const CAP_COLORS = MoodColors;

const EYES: Record<MoodState, React.ReactNode> = {
  ecstatic: (
    <G>
      <Circle cx="42" cy="72" r="5" fill="#1E1810" />
      <Circle cx="58" cy="72" r="5" fill="#1E1810" />
      <Circle cx="44" cy="70" r="2" fill="white" />
      <Circle cx="60" cy="70" r="2" fill="white" />
    </G>
  ),
  happy: (
    <G>
      <Circle cx="42" cy="73" r="5" fill="#1E1810" />
      <Circle cx="58" cy="73" r="5" fill="#1E1810" />
      <Circle cx="44" cy="71" r="2" fill="white" />
      <Circle cx="60" cy="71" r="2" fill="white" />
    </G>
  ),
  neutral: (
    <G>
      {/* Half-lidded, sleepy eyes */}
      <Ellipse cx="42" cy="73" rx="5" ry="4" fill="#1E1810" />
      <Ellipse cx="58" cy="73" rx="5" ry="4" fill="#1E1810" />
      <Path d="M 37 71 Q 42 69 47 71" stroke="#EFE0C2" strokeWidth="2" fill="#EFE0C2" />
      <Path d="M 53 71 Q 58 69 63 71" stroke="#EFE0C2" strokeWidth="2" fill="#EFE0C2" />
    </G>
  ),
  sad: (
    <G>
      <Circle cx="42" cy="74" r="5" fill="#1E1810" />
      <Circle cx="58" cy="74" r="5" fill="#1E1810" />
      <Circle cx="44" cy="72" r="2" fill="white" />
      <Circle cx="60" cy="72" r="2" fill="white" />
    </G>
  ),
  distressed: (
    <G>
      <Ellipse cx="42" cy="74" rx="5" ry="6" fill="#1E1810" />
      <Ellipse cx="58" cy="74" rx="5" ry="6" fill="#1E1810" />
      <Circle cx="44" cy="71" r="2" fill="white" />
      <Circle cx="60" cy="71" r="2" fill="white" />
    </G>
  ),
};

const MOUTHS: Record<MoodState, React.ReactNode> = {
  ecstatic: <Path d="M 39 84 Q 50 94 61 84" stroke="#1E1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  happy: <Path d="M 40 83 Q 50 91 60 83" stroke="#1E1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  neutral: <Path d="M 41 83 L 59 83" stroke="#1E1810" strokeWidth="2.5" strokeLinecap="round" />,
  sad: <Path d="M 40 86 Q 50 80 60 86" stroke="#1E1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  distressed: <Path d="M 38 88 Q 50 78 62 88" stroke="#1E1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
};

export default function Myco({ mood, size = 200 }: Props) {
  const capColor = CAP_COLORS[mood];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Stem */}
      <Ellipse cx="50" cy="82" rx="16" ry="20" fill="#EFE0C2" />
      {/* Cap */}
      <Path
        d="M 10 52 Q 10 18 50 16 Q 90 18 90 52 Q 80 58 50 60 Q 20 58 10 52 Z"
        fill={capColor}
      />
      {/* Cap spots */}
      <Circle cx="32" cy="36" r="5" fill="white" opacity="0.6" />
      <Circle cx="54" cy="28" r="4" fill="white" opacity="0.6" />
      <Circle cx="70" cy="40" r="6" fill="white" opacity="0.6" />
      {/* Eyes */}
      {EYES[mood]}
      {/* Mouth */}
      {MOUTHS[mood]}
    </Svg>
  );
}
