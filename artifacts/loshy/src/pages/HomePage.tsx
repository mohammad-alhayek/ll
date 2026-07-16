import React from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import { getDaysTogether, getWeeksTogether, getMonthsTogether, getYearsTogether, formatTogetherSince, TOGETHER_SINCE } from '@/utils/dateUtils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const days = getDaysTogether();
  const weeks = getWeeksTogether();
  const months = getMonthsTogether();
  const years = getYearsTogether();

  const stats = [
    { value: days, label: t('home.days') },
    { value: weeks, label: t('home.weeks') },
    { value: months, label: t('home.months') },
    { value: years, label: t('home.years') },
  ];

  const features = [
    { id: '/letters', icon: '💌', label: t('home.letters'), color: 'bg-rose-50/50 dark:bg-rose-950/20' },
    { id: '/letters', icon: '⏰', label: t('home.reminders'), color: 'bg-orange-50/50 dark:bg-orange-950/20' },
    { id: '/memories', icon: '📸', label: t('home.memories'), color: 'bg-blue-50/50 dark:bg-blue-950/20' },
    { id: '/together', icon: '❤️', label: t('home.together'), color: 'bg-pink-50/50 dark:bg-pink-950/20' },
  ];

  return (
    <PageWrapper className="space-y-6 p-4 pb-8">
      {/* Section A: Together Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 shadow-sm ring-1 ring-primary/10"
      >
        <div className="mb-4 text-center">
          <h2 className="text-xl font-semibold text-primary">{t('app.couple')}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t('home.togetherSince')}</p>
          <p className="text-sm font-medium text-foreground">{formatTogetherSince(TOGETHER_SINCE, language)}</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center justify-center rounded-xl bg-background/60 p-2 backdrop-blur-sm"
            >
              <span className="text-2xl font-bold text-primary">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section B: Feature Cards */}
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature, i) => (
          <motion.button
            key={feature.label + i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocation(feature.id)}
            className={`card-lift flex flex-col items-center justify-center gap-3 rounded-3xl ${feature.color} border border-border p-6 shadow-sm`}
          >
            <span className="text-4xl">{feature.icon}</span>
            <span className="font-semibold text-foreground">{feature.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Section C: Daily Memory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass relative overflow-hidden rounded-3xl border border-primary/20 bg-background/50 p-6 shadow-sm"
      >
        <div className="absolute start-0 top-0 h-full w-1.5 bg-primary/80"></div>
        <h3 className="mb-2 font-semibold text-foreground">{t('home.todayMemory')}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t('home.noMemories')}
        </p>
      </motion.div>
    </PageWrapper>
  );
}
