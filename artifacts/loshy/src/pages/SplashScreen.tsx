import React from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <div 
      className="flex h-full w-full flex-col items-center justify-center" 
      style={{ background: 'radial-gradient(circle at center, var(--loshy-bg) 0%, hsl(var(--background)) 100%)' }}
    >
      <div className="flex flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="text-[64px]"
        >
          ❤️
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <h1 className="text-gradient text-5xl font-extrabold tracking-tight">Loshy</h1>
          <p className="font-sans text-base italic text-muted-foreground">A little place made only for us.</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
          className="mt-12 text-lg font-medium text-primary"
        >
          Mohammad ❤️ Loshy
        </motion.div>
      </div>
    </div>
  );
}
