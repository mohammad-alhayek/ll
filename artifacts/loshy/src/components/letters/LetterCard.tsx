import React from 'react';
import { useLocation } from 'wouter';
import { motion, PanInfo } from 'framer-motion';
import { Heart, Star, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getMoodConfig } from '@/utils/moodConfig';
import { formatDate, formatTime } from '@/utils/dateUtils';
import type { Letter } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface LetterCardProps {
  letter: Letter;
  currentUserUid: string;
  onLike: () => void;
  onFavorite: () => void;
  onDelete?: () => void;
  index?: number;
}

export default function LetterCard({ letter, currentUserUid, onLike, onFavorite, onDelete, index = 0 }: LetterCardProps) {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const config = getMoodConfig(letter.mood);
  
  const isUnread = !letter.isRead && letter.authorUid !== currentUserUid;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -80 && onDelete) {
      onDelete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative w-full"
    >
      <motion.div
        drag={onDelete ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.2, right: 0 }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
        onClick={() => setLocation(`/letters/${letter.id}`)}
        className="card-lift relative flex w-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm z-10 touch-pan-y"
      >
        <div className="absolute top-0 w-full h-1" style={{ backgroundColor: config.color }} />
        
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm"
                style={{ backgroundColor: config.bgColor, color: config.color }}
              >
                {letter.authorRole === 'mohammad' ? 'M' : 'L'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground capitalize">{letter.authorRole}</span>
                <span className="text-[10px] text-muted-foreground">
                  {formatDate(letter.createdAt, language)} • {formatTime(letter.createdAt, language)}
                </span>
              </div>
            </div>
            {isUnread && (
              <div className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
            )}
          </div>

          <h3 className="mb-2 text-lg font-bold text-foreground line-clamp-1">{letter.title}</h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed whitespace-pre-wrap">
            {letter.body}
          </p>

          <div className="flex items-center justify-between border-t border-border/50 pt-3">
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: config.bgColor, color: config.darkColor }}>
              <span>{config.emoji}</span>
              <span>{t(`moods.${letter.mood}`)}</span>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); onLike(); }}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
              >
                <Heart className={`h-4 w-4 ${letter.isLiked ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onFavorite(); }}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
              >
                <Star className={`h-4 w-4 ${letter.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {onDelete && (
        <div className="absolute right-0 top-0 flex h-full w-24 items-center justify-end rounded-2xl bg-destructive/10 px-6 z-0">
          <Trash2 className="h-6 w-6 text-destructive" />
        </div>
      )}
    </motion.div>
  );
}
