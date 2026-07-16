import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  urls: string[];
  editable?: boolean;
  onRemove?: (index: number) => void;
}

export default function ImageGallery({ urls, editable, onRemove }: ImageGalleryProps) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (!urls?.length) return null;

  return (
    <>
      <div className={`grid gap-2 ${urls.length === 1 ? 'grid-cols-1' : urls.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {urls.map((url, i) => (
          <div key={url + i} className="relative aspect-square overflow-hidden rounded-xl bg-muted group">
            <img 
              src={url} 
              alt={`Gallery image ${i + 1}`} 
              className="h-full w-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setSelectedImg(url); }}
            />
            {editable && onRemove && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-destructive backdrop-blur-sm transition-colors hover:bg-background"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {!editable && (
              <div className="pointer-events-none absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background/50 text-foreground backdrop-blur-md">
                <ZoomIn className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={(e) => { e.stopPropagation(); setSelectedImg(null); }}
          >
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute right-4 top-safe-top mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={selectedImg}
              alt="Fullscreen view"
              className="max-h-[90vh] max-w-full rounded-md object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
