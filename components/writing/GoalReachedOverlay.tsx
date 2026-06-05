import { useEffect } from 'react';
import { View, Text } from 'react-native';
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
    <View className="absolute inset-0 items-center justify-center bg-black/40">
      <Animated.View
        style={containerStyle}
        className="mx-8 rounded-3xl bg-monster-green px-8 py-10 items-center gap-3">
        <Text style={{ fontSize: 56 }}>🎉</Text>
        <Text className="text-2xl font-bold text-inkwell">Monster Fed!</Text>
        <Text className="text-center text-sm text-inkwell/80">
          Your monster is happy and full. Keep writing to rack up more words!
        </Text>
      </Animated.View>
    </View>
  );
}
