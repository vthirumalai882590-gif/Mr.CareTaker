import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Moon, Sun } from 'lucide-react';
import { useTheme, THEMES, ThemeName } from '../context/ThemeContext';

export const ThemeSelectorDropdown: React.FC = () => {
  const { theme, setTheme, config } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-xs transition shrink-0"
        title="Change App Theme"
      >
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{config.icon} Theme</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-fadeIn">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Choose UI Theme</span>
            <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400">{config.name.split(' ')[0]}</span>
          </div>

          <div className="space-y-1 max-h-80 overflow-y-auto">
            {Object.values(THEMES).map(t => {
              const isSelected = t.id === theme;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <div className="text-xs font-extrabold flex items-center gap-1.5">
                        {t.name}
                        {t.isDark && <span className="bg-slate-800 text-slate-300 text-[9px] font-bold px-1.5 py-0.2 rounded">DARK</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{t.description}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};