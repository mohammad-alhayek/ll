import React from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  return (
    <PageWrapper className="flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-4xl">
          💔
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>
        </div>
        <button
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          <Home className="h-5 w-5" />
          <span>{t('nav.home')}</span>
        </button>
      </div>
    </PageWrapper>
  );
}
