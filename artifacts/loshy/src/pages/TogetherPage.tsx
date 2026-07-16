import React from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageWrapper from '@/components/layout/PageWrapper';
import { getDaysTogether, getWeeksTogether, getMonthsTogether, getYearsTogether, formatTogetherSince, TOGETHER_SINCE } from '@/utils/dateUtils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TogetherPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const stats = [
    { value: getDaysTogether(), label: t('home.days') },
    { value: getWeeksTogether(), label: t('home.weeks') },
    { value: getMonthsTogether(), label: t('home.months') },
    { value: getYearsTogether(), label: t('home.years') },
  ];

  const appStats = [
    { label: t('together.totalLetters'), value: 0 },
    { label: t('together.totalImages'), value: 0 },
    { label: t('together.totalSongs'), value: 0 },
    { label: t('together.totalReminders'), value: 0 },
  ];

  return (
    <PageWrapper className="space-y-6 p-4 pb-8">
      <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
        <Heart className="h-12 w-12 fill-primary text-primary drop-shadow-sm" />
        <h2 className="mt-4 text-2xl font-bold text-foreground">
          {t('together.since')} {formatTogetherSince(TOGETHER_SINCE, language)}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 shadow-sm">
            <span className="text-3xl font-bold text-primary">{stat.value}</span>
            <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-foreground">{t('together.streak')}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            🔥 {t('together.currentStreak')}:
          </span>
          <span className="font-medium text-foreground">0 {t('together.days')}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            🏆 {t('together.longestStreak')}:
          </span>
          <span className="font-medium text-foreground">0 {t('together.days')}</span>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-foreground">{t('together.stats')}</h3>
        <div className="space-y-4">
          {appStats.map((stat, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span className="font-medium text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
