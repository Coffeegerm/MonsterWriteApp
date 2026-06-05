import { Platform } from 'react-native';

// MonsterWrite brand palette
export const BrandColors = {
  inkwell: '#1A1625',
  duskPlum: '#2E2640',
  parchment: '#F2EDE4',
  monsterGreen: '#5BF178',
  hungryOrange: '#FF7B3A',
  happyGold: '#FFD166',
  sadBlue: '#6CAFD8',
  mysticViolet: '#9B72CF',
} as const;

export const Colors = {
  light: {
    text: '#1A1625',
    background: '#F2EDE4',
    tint: '#5BF178',
    icon: '#2E2640',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#5BF178',
    tabBar: '#F2EDE4',
    card: '#FFFFFF',
    border: '#E0D9CE',
    ...BrandColors,
  },
  dark: {
    text: '#F2EDE4',
    background: '#1A1625',
    tint: '#5BF178',
    icon: '#9B72CF',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#5BF178',
    tabBar: '#1A1625',
    card: '#2E2640',
    border: '#3D3255',
    ...BrandColors,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
