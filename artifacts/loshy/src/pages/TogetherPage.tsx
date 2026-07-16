import React from 'react';
import { Heart, Mail, Image as ImageIcon, Music, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageWrapper from '@/components/layout/PageWrapper';
import { getDaysTogether, getWeeksTogether, getMonthsTogether, getYearsTogether, formatTogetherSince, TOGETHER_SINCE } from '@/utils/dateUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStreak } from '@/hooks/useStreak';
import { useTogetherStats } from '@/hooks/useTogetherStats';
import { motion } from 'framer-motion';

export default function TogetherPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { streak } = useStreak();
  const { stats: appStats } = useTogetherStats();

  const stats = [
    { value: getDaysTogether(), label: t('home.days') },
    { value: getWeeksTogether(), label: t('home.weeks') },
    { value: getMonthsTogether(), label: t('home.months') },
    { value: getYearsTogether(), label: t('home.years') },
  ];

  const storyStats = [
    { label: t('together.totalLetters'), value: appStats?.totalLetters || 0, icon: Mail, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: t('together.totalImages'), value: appStats?.totalImages || 0, icon: ImageIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: t('together.totalSongs'), value: appStats?.totalSongs || 0, icon: Music, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: t('together.totalReminders'), value: appStats?.totalReminders || 0, icon: Bell, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <PageWrapper className="space-y-6 p-4 pb-8">
      {/* Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-loshy py-8 px-4 text-center shadow-md text-white"
      >
        <h2 className="text-2xl font-bold">{t('app.couple')}</h2>
        <p className="text-white/80">{t('together.since')} {formatTogetherSince(TOGETHER_SINCE, language)}</p>
        
        <div className="grid grid-cols-4 gap-3 w-full mt-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center justify-center rounded-2xl bg-white/20 p-3 backdrop-blur-sm"
            >
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-wider text-white/80">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Our Story Grid */}
      <div>
        <h3 className="mb-4 px-2 font-semibold text-foreground">{t('together.stats')}</h3>
        <div className="grid grid-cols-2 gap-4">
          {storyStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Streak */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-3xl border border-border bg-card p-6 shadow-sm overflow-hidden relative"
      >
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-orange-500/10 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔥</span>
            <h3 className="font-semibold text-foreground">{t('together.streak')}</h3>
          </div>
          
          <div className="flex items-end gap-3 mb-2">
            <span className="text-5xl font-bold text-orange-500">{streak?.currentStreak || 0}</span>
            <span className="text-lg text-muted-foreground mb-1">{t('together.days')}</span>
          </div>
          
          <p className="text-sm font-medium text-muted-foreground mb-4">
            {(streak?.currentStreak || 0) > 0 ? "Keep going! Write every day." : "Start your streak today!"}
          </p>

          <div className="flex items-center justify-between border-t border-border/50 pt-4 text-sm">
            <span className="text-muted-foreground">{t('together.longestStreak')}</span>
            <span className="font-semibold text-foreground">{streak?.longestStreak || 0} {t('together.days')}</span>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
