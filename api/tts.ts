import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
const VOICE_MAP: Record<string, string> = {
  en: 'en-IN-PrabhatNeural',
  ta: 'ta-IN-ValluvarNeural',
  te: 'te-IN-MohanNeural',
  ml: 'ml-IN-MidhunNeural',
  hi: 'hi-IN-MadhurNeural',
  kn: 'kn-IN-GaganNeural',
};
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { text, lang = 'en' } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const voice = VOICE_MAP[lang] || VOICE_MAP.en;
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text, { pitch: '-6Hz', rate: '+0%' });
    res.setHeader('Content-Type', 'audio/mpeg');
    audioStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
