import React from 'react';
import { useLocation } from 'wouter';
import { Home, Mail, Image as ImageIcon, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();

  const tabs = [
    { id: '/', label: t('nav.home'), icon: Home },
    { id: '/letters', label: t('nav.letters'), icon: Mail },
    { id: '/memories', label: t('nav.memories'), icon: ImageIcon },
    { id: '/together', label: t('nav.together'), icon: Heart },
  ];

  return (
    <nav className="safe-bottom shrink-0 border-t border-border/50 bg-card/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = location === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setLocation(tab.id)}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10"
              >
                <Icon 
                  className="h-6 w-6" 
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive ? 'currentColor' : 'none'} 
                  fillOpacity={isActive ? 0.2 : 0}
                />
              </motion.div>
              <motion.span
                animate={{
                  color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                }}
                className="text-[10px] font-medium"
              >
                {tab.label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
