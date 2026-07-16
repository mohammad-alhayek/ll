import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import { useMemories } from '@/hooks/useMemories';
import ImageGallery from '@/components/letters/ImageGallery';
import { formatDate } from '@/utils/dateUtils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MemoriesPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { memories, loading } = useMemories();

  return (
    <PageWrapper className="flex h-full flex-col px-4 pt-4 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{t('memories.title')}</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {memories.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : memories.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {memories.map((memory, i) => (
              <motion.div
                key={memory.imageUrl + i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col gap-2"
              >
                <div className="overflow-hidden rounded-xl">
                  <ImageGallery urls={[memory.imageUrl]} />
                </div>
                <div className="px-1 text-center">
                  <h4 className="text-xs font-semibold text-foreground line-clamp-1">{memory.letterTitle}</h4>
                  <p className="text-[10px] text-muted-foreground">
                    <span className="capitalize">{memory.authorRole}</span> • {formatDate(memory.createdAt, language)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <ImageIcon className="h-12 w-12 text-primary/60" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{t('memories.noMemories')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your shared memories will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}