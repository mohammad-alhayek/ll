import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  url: string;
  duration?: number | null;
}

export default function AudioPlayer({ url }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTimeStr = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (value / 100) * duration;
      setProgress(value);
    }
  };

  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3 shadow-sm" onClick={(e) => e.stopPropagation()}>
      <audio ref={audioRef} src={url} preload="metadata" />
      
      <button
        type="button"
        onClick={togglePlay}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95"
      >
        {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
      </button>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-1 h-6 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: isPlaying ? ['20%', '80%', '40%', '100%', '30%'][Math.floor(Math.random() * 5)] : '20%'
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: isPlaying ? Infinity : 0,
                repeatType: "reverse"
              }}
              className="w-1 rounded-full bg-primary/40"
              style={{
                backgroundColor: (i / 24) * 100 <= progress ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)'
              }}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground w-8">
            {formatTimeStr(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-primary/20 accent-primary outline-none"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--primary) / 0.2) ${progress}%)`
            }}
          />
          <span className="text-[10px] font-medium text-muted-foreground w-8 text-right">
            {formatTimeStr(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
