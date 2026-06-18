import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { BrandColors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProgressRingProps {
  wordCount: number;
  goal: number;
  size?: number;
}

export default function ProgressRing({ wordCount, goal, size = 160 }: ProgressRingProps) {
  const scheme = useColorScheme() ?? 'light';
  const progress = Math.min(wordCount / goal, 1);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  const ringColor =
    wordCount === 0
      ? Colors[scheme].tabIconDefault
      : progress >= 1
        ? BrandColors.olive
        : BrandColors.brass;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors[scheme].border}
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
        <Text className="font-mono text-3xl text-ink dark:text-paper">
          {wordCount.toLocaleString()}
        </Text>
        <Text className="font-mono text-xs text-muted-foreground">
          / {goal.toLocaleString()} words
        </Text>
      </View>
    </View>
  );
}
