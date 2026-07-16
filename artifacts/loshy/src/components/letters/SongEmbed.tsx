import React from 'react';
import { Music, PlayCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface SongEmbedProps {
  url: string;
  title?: string | null;
}

export default function SongEmbed({ url, title }: SongEmbedProps) {
  if (!url) return null;

  const isSpotify = url.includes('spotify.com');
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');

  const brandColor = isSpotify ? 'bg-[#1DB954]' : isYoutube ? 'bg-[#FF0000]' : 'bg-primary';
  const brandTextColor = isSpotify ? 'text-[#1DB954]' : isYoutube ? 'text-[#FF0000]' : 'text-primary';
  const brandBgLight = isSpotify ? 'bg-[#1DB954]/10 border-[#1DB954]/20' : isYoutube ? 'bg-[#FF0000]/10 border-[#FF0000]/20' : 'bg-primary/10 border-primary/20';
  const brandName = isSpotify ? 'Spotify' : isYoutube ? 'YouTube' : 'Link';

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => e.stopPropagation()}
      className={`card-lift flex w-full items-center gap-4 rounded-2xl border p-4 ${brandBgLight} transition-colors`}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${brandColor} text-white shadow-sm`}>
        {isYoutube ? <PlayCircle className="h-6 w-6" /> : <Music className="h-6 w-6" />}
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <h4 className="truncate font-semibold text-foreground">
          {title || 'Shared Song'}
        </h4>
        <span className={`text-xs font-medium ${brandTextColor}`}>
          Listen on {brandName}
        </span>
      </div>
      
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm">
        <ExternalLink className="h-4 w-4" />
      </div>
    </motion.a>
  );
}
