import { View, Text, Pressable } from 'react-native';
import { getDateRange, getToday } from '@/lib/date';
import { BrandColors } from '@/constants/theme';

interface DayData {
  date: string;
  wordCount: number;
  goalMet: boolean;
}

interface CalendarHeatmapProps {
  data: DayData[];
  dailyGoal: number;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKS = 12;

function getCellColor(day: DayData | undefined, dailyGoal: number): string {
  if (!day || day.wordCount === 0) return '#E5E7EB';
  if (day.goalMet) {
    const intensity = Math.min(day.wordCount / dailyGoal, 2);
    return intensity >= 1.5 ? BrandColors.monsterGreen : '#7BF198';
  }
  return BrandColors.hungryOrange + '99'; // partial progress
}

export default function CalendarHeatmap({ data, dailyGoal }: CalendarHeatmapProps) {
  const today = getToday();
  const dataMap = new Map(data.map((d) => [d.date, d]));

  // Build 12-week grid ending today
  const todayDate = new Date(today + 'T00:00:00');
  const dayOfWeek = todayDate.getDay(); // 0 = Sunday
  const startDate = new Date(todayDate);
  startDate.setDate(todayDate.getDate() - (WEEKS * 7 - 1) - dayOfWeek);
  const startStr = startDate.toISOString().slice(0, 10);
  const allDates = getDateRange(startStr, WEEKS * 7 + dayOfWeek);

  // Chunk into weeks
  const weeks: string[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7));
  }

  return (
    <View className="gap-2">
      {/* Day labels */}
      <View className="flex-row gap-1 pl-1">
        {DAYS.map((d, i) => (
          <Text
            key={i}
            className="text-[10px] text-dusk-plum dark:text-mystic-violet"
            style={{ width: 18, textAlign: 'center' }}>
            {d}
          </Text>
        ))}
      </View>

      {/* Week columns */}
      <View className="flex-row gap-1">
        {weeks.map((week, wi) => (
          <View key={wi} className="gap-1">
            {week.map((date) => {
              const dayData = dataMap.get(date);
              const isToday = date === today;
              const isFuture = date > today;
              const color = isFuture ? 'transparent' : getCellColor(dayData, dailyGoal);

              return (
                <View
                  key={date}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 3,
                    backgroundColor: isFuture ? 'transparent' : color,
                    borderWidth: isToday ? 1.5 : 0,
                    borderColor: isToday ? BrandColors.monsterGreen : 'transparent',
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View className="flex-row items-center gap-3 mt-1">
        <Text className="text-[10px] text-dusk-plum dark:text-mystic-violet">Less</Text>
        {['#E5E7EB', BrandColors.hungryOrange + '99', '#7BF198', BrandColors.monsterGreen].map((c, i) => (
          <View key={i} style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: c }} />
        ))}
        <Text className="text-[10px] text-dusk-plum dark:text-mystic-violet">More</Text>
      </View>
    </View>
  );
}
