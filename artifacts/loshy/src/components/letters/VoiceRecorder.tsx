import React, { useState, useRef } from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AudioPlayer from './AudioPlayer';

interface VoiceRecorderProps {
  onRecorded: (blob: Blob | null) => void;
}

export default function VoiceRecorder({ onRecorded }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecorded(audioBlob);
        audioChunks.current = [];
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    onRecorded(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (audioUrl) {
    return (
      <div className="flex w-full items-center gap-3">
        <div className="flex-1">
          <AudioPlayer url={audioUrl} />
        </div>
        <button
          type="button"
          onClick={deleteRecording}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      {isRecording ? (
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 ring-4 ring-red-500/20"
          >
            <button
              type="button"
              onClick={stopRecording}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform active:scale-95"
            >
              <Square className="h-5 w-5 fill-current" />
            </button>
          </motion.div>
          <span className="text-sm font-medium text-red-500 tabular-nums">
            {formatTime(recordingTime)}
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105 active:scale-95">
            <Mic className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Tap to record</span>
        </button>
      )}
    </div>
  );
}
