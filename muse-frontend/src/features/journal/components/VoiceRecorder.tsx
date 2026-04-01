import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface Props {
  onTranscription: (text: string) => void;
}

export default function VoiceRecorder({ onTranscription }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRecorder.current && isRecording) {
        mediaRecorder.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        await processAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (blob: Blob) => {
    // Mock transcription - in production, use Web Speech API or backend service
    setTimeout(() => {
      const mockText = "This is a voice recorded journal entry. I'm reflecting on today's events and how they made me feel.";
      onTranscription(mockText);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className={`p-3 rounded-xl transition-all ${
        isRecording
          ? 'bg-white text-black animate-pulse'
          : 'bg-white/5 hover:bg-white/10 border border-white/10'
      }`}
    >
      {isProcessing ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Mic size={18} className={isRecording ? 'text-black' : 'text-white'} />
      )}
    </button>
  );
}