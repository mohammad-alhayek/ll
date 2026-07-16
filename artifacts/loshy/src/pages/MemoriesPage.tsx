import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageWrapper from '@/components/layout/PageWrapper';

export default function MemoriesPage() {
  const { t } = useTranslation();

  return (
    <PageWrapper className="flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ImageIcon className="h-10 w-10 text-primary/60" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">{t('memories.title')}</h2>
        <p className="text-muted-foreground">Coming in Phase 2</p>
      </div>
    </PageWrapper>
  );
}
