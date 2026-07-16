import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Heart, Star, Reply, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLetter } from '@/hooks/useLetters';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { markAsRead, toggleLike, toggleFavorite, deleteLetter } from '@/services/letterService';
import { getMoodConfig } from '@/utils/moodConfig';
import { formatDate, formatTime } from '@/utils/dateUtils';

import AudioPlayer from '@/components/letters/AudioPlayer';
import ImageGallery from '@/components/letters/ImageGallery';
import SongEmbed from '@/components/letters/SongEmbed';

export default function LetterDetailPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { profile } = useAuth();
  const { language } = useLanguage();
  
  const { letter, loading } = useLetter(params.id || null);
  const [showEnvelope, setShowEnvelope] = useState(true);

  useEffect(() => {
    if (letter && !letter.isRead && letter.authorUid !== profile?.uid) {
      markAsRead(letter.id);
    }
  }, [letter, profile]);

  useEffect(() => {
    if (letter && showEnvelope) {
      const timer = setTimeout(() => setShowEnvelope(false), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [letter, showEnvelope]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold">Letter not found</h2>
        <button onClick={() => setLocation('/letters')} className="mt-4 text-primary">Go back</button>
      </div>
    );
  }

  const config = getMoodConfig(letter.mood);

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      <AnimatePresence>
        {showEnvelope && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, pointerEvents: 'none' }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#FDFBF7]"
          >
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -180 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
              className="absolute h-48 w-64 rounded-t-lg bg-[#EFE9DB] shadow-md origin-top"
            />
            <div className="absolute h-48 w-64 rounded-b-lg bg-[#EAE2D0] shadow-sm flex items-center justify-center">
              <Heart className="h-8 w-8 text-red-500 opacity-50" />
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -80, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              className="absolute h-40 w-56 rounded-md bg-white shadow-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showEnvelope ? 0 : 1, y: showEnvelope ? 20 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex h-full flex-col"
      >
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth-ios pb-32">
          <div className="mx-auto w-full max-w-lg rounded-3xl border bg-card shadow-sm overflow-hidden">
            <div className="h-2 w-full" style={{ backgroundColor: config.color }} />
            
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-sm"
                    style={{ backgroundColor: config.bgColor, color: config.color }}
                  >
                    {letter.authorRole === 'mohammad' ? 'M' : 'L'}
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize text-foreground">{letter.authorRole}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(letter.createdAt, language)} • {formatTime(letter.createdAt, language)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: config.bgColor, color: config.darkColor }}>
                  <span>{config.emoji}</span>
                  <span>{letter.mood}</span>
                </div>
              </div>

              <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground leading-tight">
                {letter.title}
              </h1>

              <div className="prose prose-p:leading-loose prose-p:text-[17px] dark:prose-invert mb-8 text-foreground/90 whitespace-pre-wrap">
                {letter.body}
              </div>

              <div className="space-y-6">
                {letter.voiceNoteUrl && (
                  <AudioPlayer url={letter.voiceNoteUrl} duration={letter.voiceNoteDuration} />
                )}

                {(letter.spotifyUrl || letter.youtubeUrl) && (
                  <SongEmbed url={(letter.spotifyUrl || letter.youtubeUrl) as string} title={letter.songTitle} />
                )}

                {letter.images && letter.images.length > 0 && (
                  <div className="pt-4">
                    <ImageGallery urls={letter.images} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm rounded-full border border-border/50 bg-background/80 p-2 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-around">
            <button 
              onClick={() => toggleLike(letter.id, !letter.isLiked)}
              className="flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Heart className={`h-6 w-6 ${letter.isLiked ? 'fill-accent text-accent' : ''}`} />
            </button>
            <button 
              onClick={() => toggleFavorite(letter.id, !letter.isFavorite)}
              className="flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Star className={`h-6 w-6 ${letter.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
            <button 
              onClick={() => setLocation('/letters/new')}
              className="flex flex-col items-center gap-1 p-2 text-primary transition-colors hover:text-primary/80"
            >
              <Reply className="h-6 w-6" />
            </button>
            <button 
              onClick={() => {
                if (confirm('Delete this letter?')) {
                  deleteLetter(letter).then(() => setLocation('/letters'));
                }
              }}
              className="flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}