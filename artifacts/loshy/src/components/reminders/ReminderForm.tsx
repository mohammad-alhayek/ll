import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createReminder } from '@/services/reminderService';
import type { ReminderRepeat, ReminderReceiver } from '@/types';

interface ReminderFormProps {
  isOpen: boolean;
  onClose: () => void;
  createdBy: string;
}

export default function ReminderForm({ isOpen, onClose, createdBy }: ReminderFormProps) {
  const { t } = useTranslation();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [repeat, setRepeat] = useState<ReminderRepeat>('none');
  const [receiver, setReceiver] = useState<ReminderReceiver>('both');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;

    setLoading(true);
    try {
      const dateTime = new Date(`${date}T${time}`);
      await createReminder({
        createdBy,
        title,
        description,
        dateTime,
        repeat,
        receiver,
      });
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-3xl bg-background shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border/50 p-4">
              <h3 className="text-lg font-semibold text-foreground">{t('reminders.add')}</h3>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 scroll-smooth-ios">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-[env(safe-area-inset-bottom)]">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g., Take medicine..."
                    className="rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details..."
                    className="min-h-[60px] rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-xl border border-input bg-transparent px-3 py-2 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full rounded-xl border border-input bg-transparent px-3 py-2 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">{t('reminders.repeat')}</label>
                  <div className="flex rounded-xl bg-muted p-1">
                    {(['none', 'daily', 'weekly', 'monthly'] as ReminderRepeat[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRepeat(r)}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-medium capitalize transition-colors ${repeat === r ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                      >
                        {t(`reminders.${r}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">{t('reminders.receiver')}</label>
                  <div className="flex rounded-xl bg-muted p-1">
                    {(['mohammad', 'loshy', 'both'] as ReminderReceiver[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReceiver(r)}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-medium capitalize transition-colors ${receiver === r ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                      >
                        {t(`reminders.${r}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? t('common.loading') : t('common.save')}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
