let currentAudio: HTMLAudioElement | null = null;
export async function speakIndianMale(
  text: string,
  langCode: 'en' | 'ta' | 'te' | 'ml' | 'hi' = 'en',
  onEnd?: () => void
) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang: langCode }),
  });
  if (!response.ok) throw new Error('TTS generation failed');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;
  audio.onended = () => {
    URL.revokeObjectURL(url);
    if (onEnd) onEnd();
  };
  await audio.play();
}
