import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut, Monitor, Moon, Sun, Languages, Bell } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { requestPushPermission } from '@/services/notificationService';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { profile, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [notifsEnabled, setNotifsEnabled] = useState(profile?.notificationsEnabled || false);

  const handleNotifToggle = async () => {
    if (!profile?.uid) return;
    const granted = await requestPushPermission(profile.uid);
    setNotifsEnabled(granted);
  };

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
        {/* Settings Container */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          {/* Language Toggle */}
          <div className="flex items-center justify-between border-b border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <Languages className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">{t('settings.language')}</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${language === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${language === 'ar' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                عربي
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between border-b border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                {theme === 'light' ? <Sun className="h-4 w-4" /> : theme === 'dark' ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              </div>
              <span className="font-medium text-sm">{t('settings.theme')}</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setTheme('light')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${theme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                {t('settings.light')}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                {t('settings.dark')}
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${theme === 'system' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                {t('settings.system')}
              </button>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{t('settings.notifications')}</span>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={notifsEnabled}
              onClick={handleNotifToggle}
              className={`relative h-6 w-11 rounded-full transition-colors ${notifsEnabled ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-1/2 -translate-y-1/2 left-1 h-4 w-4 rounded-full bg-white transition-transform ${notifsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-card p-4 text-destructive shadow-sm transition-colors hover:bg-destructive/10 mt-8"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-semibold">{t('auth.logout')}</span>
        </button>
      </div>
    </PageWrapper>
  );
}
