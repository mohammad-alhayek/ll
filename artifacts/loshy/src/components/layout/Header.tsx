import React from 'react';
import { useLocation, useParams, useRoute } from 'wouter';
import { Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const [location, setLocation] = useLocation();
  const { profile } = useAuth();
  const { t } = useTranslation();
  
  const [isLetterDetail] = useRoute('/letters/:id');

  const getTitle = () => {
    if (isLetterDetail && location !== '/letters/new') return 'Letter';
    switch (location) {
      case '/': return 'Loshy ❤️';
      case '/letters': return t('letters.title');
      case '/letters/new': return 'New Letter';
      case '/memories': return t('memories.title');
      case '/together': return t('together.title');
      case '/reminders': return t('reminders.title');
      case '/settings': return t('settings.title');
      default: return 'Loshy ❤️';
    }
  };

  const showBackButton = !['/', '/letters', '/memories', '/together', '/settings'].includes(location);

  const handleBack = () => {
    if (location === '/reminders') setLocation('/');
    else if (location.startsWith('/letters/')) setLocation('/letters');
    else setLocation('/');
  };

  return (
    <header className="safe-top flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-card/80 px-4 backdrop-blur-md z-30">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold tracking-tight text-foreground">{getTitle()}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setLocation('/settings')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </button>
        {profile?.initials && (
          <div 
            onClick={() => setLocation('/settings')}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
          >
            {profile.initials}
          </div>
        )}
      </div>
    </header>
  );
}
