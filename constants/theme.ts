// MonsterWrite brand palette — warm dark academia.
// Light = candle-lit study (parchment). Dark = midnight library (espresso).
// No pure white, no pure grey, no pure black. See docs/design-system.md.
export const BrandColors = {
  // warm neutrals
  paper: '#F0E6D1', // light bg (parchment)
  surface: '#FBF6EB', // light card
  ink: '#14100A', // espresso (dark bg / primary text)
  inkSurface: '#2A2117', // dark card
  // accents
  brass: '#B0822F', // primary accent / gilt
  oxblood: '#74302E', // emphasis + destructive
  olive: '#5E6535', // success / "fed"
  terracotta: '#B05C36', // warning / hunger
  studyTeal: '#3F6B66', // info
} as const;

// Monster mood scale (flourishing -> fading)
export const MoodColors = {
  ecstatic: '#6E7A33', // flourishing (olive-green)
  happy: '#C2902F', // amber gold
  neutral: '#A87B4E', // clay
  sad: '#6E8597', // cold dusty slate-blue
  distressed: '#6B5560', // ashen plum
} as const;

export const Colors = {
  light: {
    text: '#14100A',
    background: '#F0E6D1',
    card: '#FBF6EB',
    border: '#D9C7A4',
    tint: '#14100A', // primary / ink button
    primary: '#14100A',
    accent: '#B0822F',
    icon: '#14100A',
    tabBar: '#F0E6D1',
    tabIconDefault: '#7A6A50',
    tabIconSelected: '#B0822F',
    ...BrandColors,
    ...MoodColors,
  },
  dark: {
    text: '#F6EEDD',
    background: '#1E1810',
    card: '#2A2117',
    border: '#3A2E1F',
    tint: '#F6EEDD', // primary / paper button
    primary: '#F6EEDD',
    accent: '#C99A45',
    icon: '#F6EEDD',
    tabBar: '#1E1810',
    tabIconDefault: '#9A8868',
    tabIconSelected: '#C99A45',
    ...BrandColors,
    ...MoodColors,
  },
};

// Font families — loaded in app/_layout.tsx via useFonts.
// display = titles & monster names · serif = body & UI · mono = word counts, stats, editor.
export const Fonts = {
  display: 'CormorantGaramond_600SemiBold',
  displayBold: 'CormorantGaramond_700Bold',
  serif: 'EBGaramond_400Regular',
  serifMedium: 'EBGaramond_500Medium',
  serifSemiBold: 'EBGaramond_600SemiBold',
  mono: 'CourierPrime_400Regular',
  monoBold: 'CourierPrime_700Bold',
  sans: 'EBGaramond_400Regular', // serif-forward brand; sans kept as a fallback alias
} as const;
