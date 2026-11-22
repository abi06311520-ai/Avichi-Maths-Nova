import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
const VOICE_MAP: Record<string, string> = {
  en: 'en-IN-PrabhatNeural',
  ta: 'ta-IN-ValluvarNeural',
  te: 'te-IN-MohanNeural',
  ml: 'ml-IN-MidhunNeural',
  hi: 'hi-IN-MadhurNeural',
  kn: 'kn-IN-GaganNeural',
};
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'indian-male-tts-and-translate',
      configureServer(server) {
        server.middlewares.use('/api/translate', async (req, res) => {
          if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
          let body = '';
          req.on('data', c => (body += c));
          req.on('end', async () => {
            try {
              const { text, targetLang } = JSON.parse(body);
              if (!text || !targetLang || targetLang === 'en') {
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ translated: text || '' }));
              }
              const r = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + encodeURIComponent(targetLang) + '&dt=t&q=' + encodeURIComponent(text));
              const d: any = await r.json();
              const translated = Array.isArray(d?.[0]) ? d[0].map((s: any) => s?.[0] || '').join('') : text;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ translated: translated || text }));
            } catch {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ translated: '' }));
            }
          });
        });
        server.middlewares.use('/api/tts', async (req, res) => {
          if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
          let body = '';
          req.on('data', c => (body += c));
          req.on('end', async () => {
            try {
              const { text, lang = 'en' } = JSON.parse(body);
              const voice = VOICE_MAP[lang] || VOICE_MAP.en;
              const tts = new MsEdgeTTS();
              await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
              const { audioStream } = tts.toStream(text, { pitch: '-6Hz', rate: '+0%' });
              res.setHeader('Content-Type', 'audio/mpeg');
              audioStream.pipe(res);
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
        });
      },
    },
  ],
});
