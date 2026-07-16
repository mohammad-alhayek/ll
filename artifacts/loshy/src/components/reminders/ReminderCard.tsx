import React from 'react';
import { Bell, CheckCircle2, Trash2, Repeat, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime, formatDate } from '@/utils/dateUtils';
import type { Reminder } from '@/types';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReminderCardProps {
  reminder: Reminder;
  onComplete: () => void;
  onDelete: () => void;
  index?: number;
}

export default function ReminderCard({ reminder, onComplete, onDelete, index = 0 }: ReminderCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const isPending = reminder.status === 'pending';
  const isCompleted = reminder.status === 'completed';
  const isMissed = reminder.status === 'missed';

  const statusColor = isPending ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' : 
                      isCompleted ? 'text-green-500 bg-green-50 dark:bg-green-950/30' : 
                      'text-red-500 bg-red-50 dark:bg-red-950/30';
  
  const statusBorder = isPending ? 'border-amber-200 dark:border-amber-900/50' : 
                       isCompleted ? 'border-green-200 dark:border-green-900/50' : 
                       'border-red-200 dark:border-red-900/50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative flex w-full flex-col overflow-hidden rounded-2xl border ${statusBorder} bg-card p-4 shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${statusColor}`}>
            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="font-semibold text-foreground line-clamp-1">{reminder.title}</h4>
            {reminder.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{reminder.description}</p>
            )}
            
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(reminder.dateTime, language)} • {formatTime(reminder.dateTime, language)}
              </span>
              
              {reminder.repeat !== 'none' && (
                <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-primary">
                  <Repeat className="h-3 w-3" />
                  {t(`reminders.${reminder.repeat}`)}
                </span>
              )}

              <span className="rounded-md bg-secondary px-2 py-1 text-secondary-foreground capitalize">
                {t(`reminders.${reminder.receiver}`)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/50 pt-3">
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          {t('common.delete')}
        </button>
        {isPending && (
          <button
            onClick={onComplete}
            className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-500/20"
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete
          </button>
        )}
      </div>
    </motion.div>
  );
}
