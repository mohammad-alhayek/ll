import React, { useState } from 'react';
import { Plus, BellOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import { useReminders } from '@/hooks/useReminders';
import ReminderCard from '@/components/reminders/ReminderCard';
import ReminderForm from '@/components/reminders/ReminderForm';
import { completeReminder, deleteReminder } from '@/services/reminderService';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'pending' | 'completed' | 'missed';

export default function RemindersPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { reminders, loading } = useReminders();
  
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredReminders = reminders.filter(r => r.status === activeTab);

  return (
    <PageWrapper className="relative flex h-full flex-col">
      <div className="sticky top-0 z-20 bg-background/90 px-4 pb-2 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4">
            {(['pending', 'completed', 'missed'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-2 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {t(`reminders.${tab}`)}
                {activeTab === tab && (
                  <motion.div layoutId="reminder-tab" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2 scroll-smooth-ios">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filteredReminders.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredReminders.map((reminder, i) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  index={i}
                  onComplete={() => completeReminder(reminder.id)}
                  onDelete={() => {
                    if (confirm('Delete this reminder?')) {
                      deleteReminder(reminder.id);
                    }
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <BellOff className="h-12 w-12 text-primary/60" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{t('reminders.noReminders')}</h3>
            </div>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30"
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      <ReminderForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        createdBy={profile?.uid || ''}
      />
    </PageWrapper>
  );
}