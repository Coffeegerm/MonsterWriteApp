import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

interface GoalReachedOverlayProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function GoalReachedOverlay({ visible, onDismiss }: GoalReachedOverlayProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });
      // Auto-dismiss after 2.5s
      opacity.value = withDelay(2200, withTiming(0, { duration: 300 }, (finished) => {
        if (finished) runOnJS(onDismiss)();
      }));
    } else {
      opacity.value = 0;
      scale.value = 0.8;
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <View className="absolute inset-0 items-center justify-center bg-ink/60">
      <Animated.View
        style={containerStyle}
        className="mx-8 rounded-xl bg-olive px-8 py-10 items-center gap-3">
        <Sparkles size={48} strokeWidth={2} color="#F0E6D1" />
        <Text className="font-display text-3xl text-paper">Monster fed</Text>
        <Text className="text-center font-serif text-sm text-paper/80">
          Your monster is content and full. Keep writing to gather more words.
        </Text>
      </Animated.View>
    </View>
  );
}
