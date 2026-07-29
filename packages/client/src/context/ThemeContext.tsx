import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'teal' | 'dark' | 'blue' | 'violet' | 'sunset';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  icon: string;
  description: string;
  headerBg: string;
  headerText: string;
  mainBg: string;
  sidebarBg: string;
  sidebarText: string;
  cardBg: string;
  cardBorder: string;
  accentBg: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
  isDark: boolean;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  teal: {
    id: 'teal',
    name: 'Emerald Teal (Default)',
    icon: '🌿',
    description: 'Classic SpashtCare medical theme with teal and emerald accents.',
    headerBg: 'bg-brand-teal',
    headerText: 'text-white',
    mainBg: 'bg-slate-50',
    sidebarBg: 'bg-slate-50/95',
    sidebarText: 'text-slate-800',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    accentBg: 'bg-brand-teal',
    accentText: 'text-white',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    isDark: false,
  },
  dark: {
    id: 'dark',
    name: 'Midnight Dark',
    icon: '🌙',
    description: 'Sleek dark mode for high-contrast, night-time monitoring.',
    headerBg: 'bg-slate-900',
    headerText: 'text-slate-100',
    mainBg: 'bg-slate-950 text-slate-100',
    sidebarBg: 'bg-slate-900/95 text-slate-100 border-slate-800',
    sidebarText: 'text-slate-200',
    cardBg: 'bg-slate-900',
    cardBorder: 'border-slate-800',
    accentBg: 'bg-teal-500',
    accentText: 'text-slate-950',
    badgeBg: 'bg-teal-950',
    badgeText: 'text-teal-300',
    isDark: true,
  },
  blue: {
    id: 'blue',
    name: 'Sapphire Royal',
    icon: '💙',
    description: 'Clinical trust theme with deep ocean blue and navy tones.',
    headerBg: 'bg-blue-900',
    headerText: 'text-white',
    mainBg: 'bg-blue-50/60',
    sidebarBg: 'bg-slate-50/95',
    sidebarText: 'text-slate-800',
    cardBg: 'bg-white',
    cardBorder: 'border-blue-200',
    accentBg: 'bg-blue-700',
    accentText: 'text-white',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    isDark: false,
  },
  violet: {
    id: 'violet',
    name: 'Cyber Violet',
    icon: '💜',
    description: 'Modern healthcare aesthetic with deep indigo and purple accents.',
    headerBg: 'bg-indigo-900',
    headerText: 'text-white',
    mainBg: 'bg-purple-50/50',
    sidebarBg: 'bg-slate-50/95',
    sidebarText: 'text-slate-800',
    cardBg: 'bg-white',
    cardBorder: 'border-purple-200',
    accentBg: 'bg-purple-700',
    accentText: 'text-white',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    isDark: false,
  },
  sunset: {
    id: 'sunset',
    name: 'Warm Terracotta',
    icon: '🌅',
    description: 'Comforting warm tones with amber and terracotta highlights.',
    headerBg: 'bg-amber-800',
    headerText: 'text-white',
    mainBg: 'bg-amber-50/50',
    sidebarBg: 'bg-amber-50/90',
    sidebarText: 'text-amber-950',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-200',
    accentBg: 'bg-amber-700',
    accentText: 'text-white',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    isDark: false,
  },
};

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'teal',
  setTheme: () => {},
  config: THEMES.teal,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('spashtcare_theme') as ThemeName;
    return saved && THEMES[saved] ? saved : 'teal';
  });

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem('spashtcare_theme', t);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (THEMES[theme].isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);