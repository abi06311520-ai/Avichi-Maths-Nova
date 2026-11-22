export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { text, targetLang } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (!text || !targetLang || targetLang === 'en') {
      return res.status(200).json({ translated: text || '' });
    }
    const r = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + encodeURIComponent(targetLang) + '&dt=t&q=' + encodeURIComponent(text));
    const d: any = await r.json();
    const translated = Array.isArray(d?.[0]) ? d[0].map((s: any) => s?.[0] || '').join('') : text;
    res.status(200).json({ translated: translated || text });
  } catch {
    res.status(200).json({ translated: '' });
  }
}
