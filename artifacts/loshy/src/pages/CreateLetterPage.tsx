import React, { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Image as ImageIcon, Music, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import MoodPicker from '@/components/letters/MoodPicker';
import VoiceRecorder from '@/components/letters/VoiceRecorder';
import ImageGallery from '@/components/letters/ImageGallery';
import type { Mood } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { createLetter } from '@/services/letterService';

export default function CreateLetterPage() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<Mood>('happy');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [songTitle, setSongTitle] = useState('');
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);

  const [showSongInput, setShowSongInput] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const urls = files.map(file => URL.createObjectURL(file));
      setImageFiles(prev => [...prev, ...files]);
      setImageUrls(prev => [...prev, ...urls]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !title.trim() || !body.trim()) return;

    setLoading(true);
    try {
      await createLetter({
        authorUid: profile.uid,
        authorRole: profile.role,
        title,
        body,
        mood,
        language,
        spotifyUrl: spotifyUrl || undefined,
        youtubeUrl: youtubeUrl || undefined,
        songTitle: songTitle || undefined,
        imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
        voiceBlob: voiceBlob || undefined,
      });
      setLocation('/letters');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth-ios">
        <form id="letter-form" onSubmit={handleSubmit} className="flex flex-col gap-8 pb-[env(safe-area-inset-bottom)]">
          {/* Header fields */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your letter a title..."
              className="w-full bg-transparent text-3xl font-bold tracking-tight text-foreground placeholder:text-muted focus:outline-none"
            />
            
            <MoodPicker value={mood} onChange={setMood} />
          </div>

          {/* Body */}
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your heart out..."
            className="min-h-[250px] w-full resize-none bg-transparent text-lg leading-relaxed text-foreground placeholder:text-muted focus:outline-none"
          />

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border/50"></div>
            <span className="shrink-0 px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Extras</span>
            <div className="flex-grow border-t border-border/50"></div>
          </div>

          {/* Voice Note */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Voice Note</span>
            <VoiceRecorder onRecorded={setVoiceBlob} />
          </div>

          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Images</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Add Photo
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <ImageGallery urls={imageUrls} editable onRemove={removeImage} />
          </div>

          {/* Song */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Attach a Song</span>
              <button
                type="button"
                onClick={() => setShowSongInput(!showSongInput)}
                className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/80"
              >
                <Music className="h-3.5 w-3.5" />
                Add Link
              </button>
            </div>

            {showSongInput && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="Song Title (optional)"
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
                    <Music className="h-5 w-5" />
                  </div>
                  <input
                    type="url"
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    placeholder="Spotify URL"
                    className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                    <Youtube className="h-5 w-5" />
                  </div>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="YouTube URL"
                    className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </form>
      </div>

      <div className="border-t border-border/50 bg-background/80 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-md">
        <button
          form="letter-form"
          type="submit"
          disabled={loading || !title.trim() || !body.trim()}
          className="w-full rounded-2xl bg-loshy py-4 font-bold text-white shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? t('common.loading') : 'Send Letter'}
        </button>
      </div>
    </PageWrapper>
  );
}