import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { BrandColors } from '@/constants/theme';

interface ProgressRingProps {
  wordCount: number;
  goal: number;
  size?: number;
}

export default function ProgressRing({ wordCount, goal, size = 160 }: ProgressRingProps) {
  const progress = Math.min(wordCount / goal, 1);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  const ringColor =
    wordCount === 0
      ? BrandColors.sadBlue
      : progress >= 1
        ? BrandColors.monsterGreen
        : BrandColors.hungryOrange;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={10}
          fill="transparent"
        />
        {/* Progress arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={ringColor}
          strokeWidth={10}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      {/* Text in center */}
      <View className="items-center">
        <Text className="text-2xl font-bold text-inkwell dark:text-parchment">
          {wordCount.toLocaleString()}
        </Text>
        <Text className="text-xs text-dusk-plum dark:text-mystic-violet">
          / {goal.toLocaleString()} words
        </Text>
      </View>
    </View>
  );
}
