import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, PenLine, MailOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import { useLetters, useFavoriteLetters } from '@/hooks/useLetters';
import { useAuth } from '@/contexts/AuthContext';
import LetterCard from '@/components/letters/LetterCard';
import { MOOD_CONFIG, getMoodConfig } from '@/utils/moodConfig';
import type { Mood } from '@/types';
import { deleteLetter, toggleLike, toggleFavorite } from '@/services/letterService';

export default function LettersPage() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { profile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMoodFilter, setActiveMoodFilter] = useState<Mood | null>(null);

  const { letters: allLetters, loading: allLoading } = useLetters();
  const { letters: favLetters, loading: favLoading } = useFavoriteLetters();

  const letters = activeTab === 'all' ? allLetters : favLetters;
  const loading = activeTab === 'all' ? allLoading : favLoading;

  const filteredLetters = letters.filter(letter => {
    if (activeMoodFilter && letter.mood !== activeMoodFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return letter.title.toLowerCase().includes(q) || letter.body.toLowerCase().includes(q);
    }
    return true;
  });

  const moods = Object.keys(MOOD_CONFIG) as Mood[];

  return (
    <PageWrapper className="relative flex h-full flex-col">
      <div className="sticky top-0 z-20 bg-background/90 px-4 pb-2 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`relative pb-2 text-sm font-semibold transition-colors ${activeTab === 'all' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              All
              {activeTab === 'all' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`relative pb-2 text-sm font-semibold transition-colors ${activeTab === 'favorites' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {t('letters.favorites')}
              {activeTab === 'favorites' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          </div>
          
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('letters.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card py-2 pl-9 pr-4 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth-ios [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveMoodFilter(null)}
            className={`flex shrink-0 items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ${!activeMoodFilter ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-muted-foreground border-border'}`}
          >
            All Moods
          </button>
          {moods.map((mood) => {
            const config = getMoodConfig(mood);
            const isSelected = activeMoodFilter === mood;
            return (
              <button
                key={mood}
                onClick={() => setActiveMoodFilter(isSelected ? null : mood)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: isSelected ? config.bgColor : 'transparent',
                  borderColor: isSelected ? config.color : 'hsl(var(--border))',
                  color: isSelected ? config.darkColor : 'hsl(var(--muted-foreground))'
                }}
              >
                <span>{config.emoji}</span>
                <span>{t(`moods.${mood}`)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2 scroll-smooth-ios">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filteredLetters.length > 0 ? (
          <div className="space-y-4">
            {filteredLetters.map((letter, i) => (
              <LetterCard 
                key={letter.id}
                letter={letter}
                currentUserUid={profile?.uid || ''}
                index={i}
                onLike={() => toggleLike(letter.id, !letter.isLiked)}
                onFavorite={() => toggleFavorite(letter.id, !letter.isFavorite)}
                onDelete={() => {
                  if (confirm('Are you sure you want to delete this letter?')) {
                    deleteLetter(letter);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <MailOpen className="h-12 w-12 text-primary/60" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{t('letters.noLetters')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Write your first letter and make a new memory.
              </p>
            </div>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLocation('/letters/new')}
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30"
      >
        <PenLine className="h-6 w-6" />
      </motion.button>
    </PageWrapper>
  );
}