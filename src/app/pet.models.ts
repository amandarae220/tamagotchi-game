export type Theme = 'tan' | 'mint' | 'lavender' | 'peach' | 'sky';
export type PetType = 'duck' | 'dog';

export type PetVisualState =
  | 'idle'
  | 'eating'
  | 'sleeping'
  | 'bathing'
  | 'happy'
  | 'sad';

export type PetEvent =
  | 'FEED'
  | 'PLAY'
  | 'SLEEP'
  | 'BATHE'
  | 'CUDDLE'
  | 'TIME_TICK';

export interface PetNeeds {
  fullness: number;
  energy: number;
  joy: number;
  clean: number;
}

export interface ThemeOption {
  id: Theme;
  label: string;
  previewStyle: Record<string, string>;
}

export interface PetOption {
  id: PetType;
  label: string;
}

export interface StatOption {
  key: keyof PetNeeds;
  label: string;
  tone: 'yellow' | 'green' | 'blue' | 'purple';
}

const themeStyle = (bg: string, dot: string): Record<string, string> => ({
  backgroundColor: bg,
  backgroundImage: `
    radial-gradient(${dot} 1.5px, transparent 2px),
    radial-gradient(${dot} 1.5px, transparent 2px)
  `,
  backgroundPosition: '0 0, 12px 12px',
  backgroundSize: '24px 24px'
});

export const THEME_STYLES: Record<Theme, Record<string, string>> = {
  tan: themeStyle('#fffdf8', '#eadfce'),
  mint: themeStyle('#fbfffd', '#d3f5e6'),
  lavender: themeStyle('#fdfbff', '#e8e1ff'),
  peach: themeStyle('#fffaf6', '#ffd9c2'),
  sky: themeStyle('#f9fbff', '#d9eafe')
};

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'tan', label: 'tan', previewStyle: THEME_STYLES.tan },
  { id: 'mint', label: 'mint', previewStyle: THEME_STYLES.mint },
  { id: 'lavender', label: 'lavender', previewStyle: THEME_STYLES.lavender },
  { id: 'peach', label: 'peach', previewStyle: THEME_STYLES.peach },
  { id: 'sky', label: 'sky', previewStyle: THEME_STYLES.sky }
];

export const PET_OPTIONS: PetOption[] = [
  { id: 'duck', label: 'duck' },
  { id: 'dog', label: 'dog' }
];

export const STAT_OPTIONS: StatOption[] = [
  { key: 'fullness', label: 'Fullness', tone: 'yellow' },
  { key: 'energy', label: 'Energy', tone: 'green' },
  { key: 'joy', label: 'Joy', tone: 'blue' },
  { key: 'clean', label: 'Clean', tone: 'purple' }
];

export const INITIAL_NEEDS: PetNeeds = {
  fullness: 100,
  energy: 100,
  joy: 100,
  clean: 100
};
