import React from 'react';
import { motion } from 'framer-motion';
import { MOOD_CONFIG, getMoodConfig } from '@/utils/moodConfig';
import type { Mood } from '@/types';
import { useTranslation } from 'react-i18next';

interface MoodPickerProps {
  value: Mood;
  onChange: (mood: Mood) => void;
}

export default function MoodPicker({ value, onChange }: MoodPickerProps) {
  const { t } = useTranslation();
  const moods = Object.keys(MOOD_CONFIG) as Mood[];

  return (
    <div className="flex w-full gap-3 overflow-x-auto scroll-smooth-ios pb-4 px-1 -mx-1 [&::-webkit-scrollbar]:hidden">
      {moods.map((mood) => {
        const config = getMoodConfig(mood);
        const isSelected = value === mood;

        return (
          <motion.button
            key={mood}
            type="button"
            onClick={() => onChange(mood)}
            whileTap={{ scale: 0.95 }}
            className="relative flex shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 min-w-[80px] transition-colors"
            style={{
              borderColor: isSelected ? config.color : 'hsl(var(--border))',
              backgroundColor: isSelected ? config.bgColor : 'transparent',
            }}
          >
            <span className="text-2xl drop-shadow-sm">{config.emoji}</span>
            <span 
              className="text-xs font-medium"
              style={{ color: isSelected ? config.darkColor : 'hsl(var(--muted-foreground))' }}
            >
              {t(`moods.${mood}`)}
            </span>
            {isSelected && (
              <motion.div
                layoutId="mood-indicator"
                className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                style={{ borderColor: config.color }}
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
