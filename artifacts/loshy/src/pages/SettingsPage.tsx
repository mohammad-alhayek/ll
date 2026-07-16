import React from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut, Monitor, Moon, Sun, Languages } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { profile, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <PageWrapper className="space-y-6 p-4 pb-8">
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center gap-3 py-6">
        <div className="flex -space-x-4 space-x-reverse">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary/20 text-xl font-bold text-primary shadow-sm z-10">
            M
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-accent/20 text-xl font-bold text-accent shadow-sm">
            L
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">{profile?.name || t('app.couple')}</h2>
          <p className="text-sm capitalize text-muted-foreground">{profile?.role || ''}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Language Toggle */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border/50 p-4">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-primary" />
              <span className="font-medium">{t('settings.language')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${language === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${language === 'ar' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun className="h-5 w-5 text-primary" /> : theme === 'dark' ? <Moon className="h-5 w-5 text-primary" /> : <Monitor className="h-5 w-5 text-primary" />}
              <span className="font-medium">{t('settings.theme')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
              <button
                onClick={() => setTheme('light')}
                className={`rounded-md p-1.5 transition-colors ${theme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`rounded-md p-1.5 transition-colors ${theme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`rounded-md p-1.5 transition-colors ${theme === 'system' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive transition-colors hover:bg-destructive/20"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-semibold">{t('auth.logout')}</span>
        </button>
      </div>
    </PageWrapper>
  );
}
