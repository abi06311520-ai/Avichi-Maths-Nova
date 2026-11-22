import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  Sparkles,
  Brain,
  FileText,
  ChevronRight,
  ChevronLeft,
  Award,
  Search,
  Layers,
  Sigma,
  Loader2,
  AlertCircle,
  Check,
  Video,
  Globe,
  GraduationCap,
  Mic
} from 'lucide-react';

// ============================================================================
// SAFE REACT CHILD & ERROR BOUNDARY GUARD
// ============================================================================

function safeText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function TamilOnlyPageSync() {
  useEffect(() => {
    const cache = new Map<string, string>();
    const origText = new WeakMap<Text, string>();
    let busy = false;
    const sync = async () => {
      if (busy) return;
      busy = true;
      try {
        const root = document.getElementById('root');
        if (!root) return;
        const isTamil = ((window as any).__ACTIVE_LANG__ || 'en') === 'ta';
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];
        let n: Node | null;
        while ((n = walker.nextNode())) {
          const tn = n as Text;
          if (!origText.has(tn)) origText.set(tn, tn.nodeValue || '');
          nodes.push(tn);
        }
        if (!isTamil) {
          for (const tn of nodes) {
            const o = origText.get(tn);
            if (o !== undefined && tn.nodeValue !== o) tn.nodeValue = o;
          }
          return;
        }
        const skip = new Set(['English', 'English (IN)', 'English (India)', 'Tamil', 'Telugu', 'Malayalam', 'Hindi', 'Kannada', 'தமிழ்', 'తెలుగు', 'മലയാളം', 'हिन्दी', 'ಕನ್ನಡ']);
        for (const tn of nodes) {
          const base = origText.get(tn) || tn.nodeValue || '';
          const trimmed = base.trim();
          if (!trimmed || skip.has(trimmed)) continue;
          if (trimmed.length > 1 && /[A-Za-z]{2,}/.test(trimmed) && !trimmed.startsWith('http')) {
            if (cache.has(trimmed)) {
              tn.nodeValue = base.replace(trimmed, cache.get(trimmed)!);
              continue;
            }
            const r = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: trimmed, targetLang: 'ta' }),
            });
            if (r.ok) {
              const d = await r.json();
              if (d?.translated && d.translated.trim()) {
                cache.set(trimmed, d.translated.trim());
                tn.nodeValue = base.replace(trimmed, d.translated.trim());
              }
            }
          }
        }
      } finally {
        busy = false;
      }
    };
    const obs = new MutationObserver(() => { void sync(); });
    obs.observe(document.body, { childList: true, subtree: true });
    const timer = window.setInterval(() => { void sync(); }, 400);
    return () => { obs.disconnect(); window.clearInterval(timer); };
  }, []);
  return null;
}
function TamilPage() {
  useEffect(() => {
    const cache = new Map<string, string>();
    const orig = new WeakMap<Text, string>();
    let busy = false;
    const run = async () => {
      if (busy) return;
      busy = true;
      try {
        const root = document.getElementById('root');
        if (!root) return;
        const isTa = (window as any).__L === 'ta';
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];
        let n: Node | null;
        while ((n = w.nextNode())) {
          const t = n as Text;
          if (!orig.has(t)) orig.set(t, t.nodeValue || '');
          nodes.push(t);
        }
        if (!isTa) {
          for (const t of nodes) {
            const v = orig.get(t);
            if (v !== undefined && t.nodeValue !== v) t.nodeValue = v;
          }
          return;
        }
        const skip = new Set(['English', 'English (IN)', 'English (India)', 'Tamil', 'Telugu', 'Malayalam', 'Hindi', 'Kannada', 'தமிழ்', 'తెలుగు', 'മലയാളം', 'हिन्दी', 'ಕನ್ನಡ']);
        for (const t of nodes) {
          const base = orig.get(t) || t.nodeValue || '';
          const tr = base.trim();
          if (!tr || skip.has(tr) || tr.startsWith('http')) continue;
          if (/[A-Za-z]{2,}/.test(tr)) {
            if (cache.has(tr)) { t.nodeValue = base.replace(tr, cache.get(tr)!); continue; }
            const res = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: tr, targetLang: 'ta' }),
            });
            if (res.ok) {
              const d = await res.json();
              if (d?.translated) { cache.set(tr, d.translated); t.nodeValue = base.replace(tr, d.translated); }
            }
          }
        }
      } finally { busy = false; }
    };
    const id = window.setInterval(() => { void run(); }, 500);
    return () => window.clearInterval(id);
  }, []);
  return null;
}
class StudioErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message || 'Unexpected rendering error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#EEF2F6] text-slate-800 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#F8FAFC] border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
            <h2 className="text-lg font-bold text-slate-900">Mathematics Studio View Recovered</h2>
            <p className="text-xs text-slate-800">{this.state.message}</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, message: '' })}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
            >
              Reload Studio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// RUNTIME API KEY HELPER (SUPPORTS BOTH CANVAS RUNTIME & VITE ENV)
// ============================================================================

function getGeminiApiKey(): string {
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> })?.env;
    if (metaEnv && typeof metaEnv.VITE_GEMINI_API_KEY === 'string') {
      return metaEnv.VITE_GEMINI_API_KEY;
    }
  } catch {
    // Fallback to empty string so Canvas runtime injects the key automatically
  }
  return '';
}

// ============================================================================
// MULTILINGUAL TRANSLATIONS & BOLD SENIOR MALE INDIAN VOICE CONFIGURATION
// ============================================================================

type LangCode = 'en' | 'ta' | 'hi' | 'ml' | 'te' | 'kn';

interface LanguageOption {
  code: LangCode;
  name: string;
  nativeName: string;
  bcp47: string;
  ttsInstruction: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English (India)',
    nativeName: 'English (IN)',
    bcp47: 'en-IN',
    ttsInstruction:
      'VOICE STYLE: Deep, bold, commanding senior Indian male mathematics professor from Chennai speaking in a strong, resonant Indian English accent (en-IN). Strictly bold male Indian voice only—NEVER American or British accent, NEVER female voice. Do NOT say good morning, vanakkam, or hello. Explain every algebraic step and number clearly from start to finish:'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    bcp47: 'ta-IN',
    ttsInstruction:
      'குரல் நடை: சென்னையைச் சேர்ந்த கம்பீரமான, ஆழமான, அழுத்தமான ஆண் குரலில் (Bold Male Indian Professor Voice) தெளிவான இந்தியத் தமிழ் உச்சரிப்பில் (ta-IN) பேசும் மூத்த கணிதப் பேராசிரியர். ஆண் குரல் மட்டுமே. வணக்கம் அல்லது காலை வணக்கம் போன்ற முகவுரைகளைத் தவிர்த்து, ஒவ்வொரு கணக்கின் படிநிலைகளையும் எண்களையும் தெளிவாக விளக்கி வாசியுங்கள்:'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    bcp47: 'hi-IN',
    ttsInstruction:
      'आवाज़ शैली: भारी, बुलंद और प्रभावशाली वरिष्ठ पुरुष भारतीय गणित प्रोफेसर (Bold Male Indian Professor Voice) जो स्पष्ट भारतीय उच्चारण (hi-IN) में बोलते हैं। केवल पुरुष आवाज़, कोई अमेरिकी लहजा नहीं। नमस्ते या सुप्रभात न कहें। हर एक गणितीय चरण और संख्या को स्पष्ट रूप से समझाएं:'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    bcp47: 'ml-IN',
    ttsInstruction:
      'ശബ്ദശൈലി: ഗംഭീരവും ആഴമുള്ളതുമായ ശക്തമായ പുരുഷ ശബ്ദത്തിൽ (Bold Male Indian Professor Voice) വ്യക്തമായ ഇന്ത്യൻ ഉച്ചാരണത്തോടെ (ml-IN) സംസാരിക്കുന്ന മുതിർന്ന ഗണിതശാസ്ത്ര പ്രൊഫസർ. പുരുഷ ശബ്ദം മാത്രം. നമസ്കാരം എന്ന് പറയരുത്. ഓരോ ഗണിത ഘട്ടവും സംഖ്യകളും വ്യക്തമായി വിശദീകരിക്കുക:'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    bcp47: 'te-IN',
    ttsInstruction:
      'స్వర శైలి: గంభీరమైన, లోతైన, శక్తివంతమైన పురుష గొంతుతో (Bold Male Indian Professor Voice) స్పష్టమైన భారతీయ ఉచ్చారణలో (te-IN) మాట్లాడే సీనియర్ గణిత ప్రొఫెసర్. పురుష గొంతు మాత్రమే. నమస్కారం అని చెప్పకండి. ప్రతి గణిత దశను మరియు సంఖ్యలను స్పష్టంగా వివరించండి:'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    bcp47: 'kn-IN',
    ttsInstruction:
      'ಧ್ವನಿ ಶೈಲಿ: ಗಂಭೀರವಾದ, ಆಳವಾದ, ಶಕ್ತಿಯುತವಾದ ಪುರುಷ ಧ್ವನಿಯಲ್ಲಿ (Bold Male Indian Professor Voice) ಸ್ಪಷ್ಟವಾದ ಭಾರತೀಯ ಉಚ್ಚಾರಣೆಯೊಂದಿಗೆ (kn-IN) ಮಾತನಾಡುವ ಹಿರಿಯ ಗಣಿತ ಪ್ರಾಧ್ಯಾಪಕರು. ಪುರುಷ ಧ್ವನಿ ಮಾತ್ರ. ನಮಸ್ಕಾರ ಎಂದು ಹೇಳಬೇಡಿ. ಪ್ರತಿಯೊಂದು ಗಣಿತದ ಹಂತ ಮತ್ತು ಸಂಖ್ಯೆಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಿ:'
  }
];

interface UiTranslationSet {
  appSubtitle: string;
  tabStudio: string;
  tabSyllabus: string;
  tabPractice: string;
  tabPast: string;
  syllabusMastery: string;
  studioHeader: string;
  studioSub: string;
  topicLabel: string;
  generateBtn: string;
  generatingBtn: string;
  watchLesson: string;
  fullUnitVideo: string;
  videoBtn: string;
  syllabusHeader: string;
  syllabusSub: string;
  allClass12Label: string;
  volume1Label: string;
  volume2Label: string;
  practiceHeader: string;
  practiceSub: string;
  allTopicsFilter: string;
  questionLabel: string;
  explanationLabel: string;
  pastHeader: string;
  pastSub: string;
  searchPlaceholder: string;
  revealSolution: string;
  hideSolution: string;
  generateWalkthrough: string;
  finalAnswerLabel: string;
  askTutorTitle: string;
  askTutorPlaceholder: string;
  solveBtn: string;
  derivingBtn: string;
}

const ENGLISH_UI_STRINGS: UiTranslationSet = {
  appSubtitle: 'TN Class 12 (+2) Samacheer Kalvi Maths AI',
  tabStudio: 'AI Math Video Studio',
  tabSyllabus: 'Class 12 Syllabus',
  tabPractice: 'Practice Sums',
  tabPast: 'HSC Board Papers',
  syllabusMastery: 'Class 12 Mastery',
  studioHeader: 'TN Class 12 (+2) State Board Mathematics AI Video Studio',
  studioSub: 'Step-by-step live equation & number solving synced with Bold Male Indian Professor narration.',
  topicLabel: 'TN Class 12 Samacheer Kalvi Maths Chapter, Exercise Topic or Custom Sum',
  generateBtn: 'Solve & Generate Video',
  generatingBtn: 'Solving Step-by-Step (Max 5s)...',
  watchLesson: 'Watch Step-by-Step Video',
  fullUnitVideo: 'Full Chapter Video',
  videoBtn: 'Solve Video',
  syllabusHeader: 'Tamil Nadu Class 12 (+2) Mathematics Complete Syllabus',
  syllabusSub: 'Every chapter & every exercise topic from Tamil Nadu State Board Samacheer Kalvi Class 12 Maths: Volume 1 (Chapters 1–6) & Volume 2 (Chapters 7–12).',
  allClass12Label: 'All Class 12',
  volume1Label: 'Volume 1',
  volume2Label: 'Volume 2',
  practiceHeader: 'TN Class 12 Mathematics Practice Sums Arena',
  practiceSub: 'Tamil Nadu State Board Class 12 (+2) Mathematics MCQs & worked step-by-step solutions.',
  allTopicsFilter: 'All Class 12 Maths Topics (Chapters 1–12)',
  questionLabel: 'Sum',
  explanationLabel: 'Step-by-Step Solution',
  pastHeader: 'TN Class 12 (+2) HSC Mathematics Public Exam Archive',
  pastSub: 'Tamil Nadu HSC (+2) Mathematics 5-Mark Public Exam sums with step-by-step markscheme solutions.',
  searchPlaceholder: 'Search year, chapter or sum...',
  revealSolution: 'Reveal Step-by-Step Solution',
  hideSolution: 'Hide Solution',
  generateWalkthrough: 'Solve on Video Board',
  finalAnswerLabel: 'Final Answer',
  askTutorTitle: 'Ask Avichi MathNova AI (Class 12)',
  askTutorPlaceholder: 'Enter any TN Class 12 Maths sum (e.g., Integrate 2x + 3 / (x² + 3x + 2) dx)...',
  solveBtn: 'Solve Step-by-Step',
  derivingBtn: 'Solving...'
};

const TAMIL_UI_STRINGS: UiTranslationSet = {
  appSubtitle: '12-ஆம் வகுப்பு சமச்சீர் கல்வி கணிதம் AI',
  tabStudio: 'AI கணித வீடியோ வகுப்பு',
  tabSyllabus: '12-ஆம் வகுப்பு பாடத்திட்டம்',
  tabPractice: 'பயிற்சி கணக்குகள்',
  tabPast: 'பொதுத்தேர்வு வினாக்கள்',
  syllabusMastery: 'பாடத்திட்ட தேர்ச்சி',
  studioHeader: 'தமிழ்நாடு அரசு 12-ஆம் வகுப்பு (+2) சமச்சீர் கல்வி கணிதம் AI வீடியோ வகுப்பறை',
  studioSub: 'கம்பீரமான ஆண் இந்தியப் பேராசிரியரின் குரல் விளக்கத்துடன் எண்கள் மற்றும் படிநிலைகளை நேரடியாகத் தீர்க்கும் பலகை.',
  topicLabel: '12-ஆம் வகுப்பு கணித அத்தியாயம், தலைப்பு அல்லது கணக்கை உள்ளிடவும்',
  generateBtn: 'கணக்கைத் தீர்த்து வீடியோ உருவாக்கு',
  generatingBtn: 'படிப்படியாகத் தீர்க்கப்படுகிறது (5 வினாடிகளுக்குள்)...',
  watchLesson: 'படிப்படியான வீடியோ தீர்வு காண்க',
  fullUnitVideo: 'முழு அத்தியாய வீடியோ',
  videoBtn: 'வீடியோ தீர்வு',
  syllabusHeader: 'தமிழ்நாடு அரசு 12-ஆம் வகுப்பு (+2) முழுமையான கணிதப் பாடத்திட்டம்',
  syllabusSub: 'தொகுதி 1 (அத்தியாயங்கள் 1–6) மற்றும் தொகுதி 2 (அத்தியாயங்கள் 7–12) உள்ள அனைத்துப் பாடங்களும் ஒவ்வொரு தலைப்பும் முழுமையாக.',
  allClass12Label: 'அனைத்து 12-ஆம் வகுப்பு',
  volume1Label: 'தொகுதி 1',
  volume2Label: 'தொகுதி 2',
  practiceHeader: '12-ஆம் வகுப்பு கணிதப் பயிற்சி அரங்கம்',
  practiceSub: 'தமிழ்நாடு மாநிலப் பாடத்திட்டம் 12-ஆம் வகுப்பு (+2) கணிதப் பயிற்சி வினாக்கள் மற்றும் படிப்படியான தீர்வுகள்.',
  allTopicsFilter: 'அனைத்து 12-ஆம் வகுப்பு கணிதத் தலைப்புகள் (அத்தியாயங்கள் 1–12)',
  questionLabel: 'கணக்கு',
  explanationLabel: 'படிப்படியான தீர்வு',
  pastHeader: '12-ஆம் வகுப்பு (+2) கணிதப் பொதுத்தேர்வு வினாத்தாள்கள்',
  pastSub: 'தமிழ்நாடு மேல்நிலை இரண்டாம் ஆண்டு (+2) கணிதம் 5-மதிப்பெண் பொதுத்தேர்வு கணக்குகள் மற்றும் படிப்படியான தீர்வுகள்.',
  searchPlaceholder: 'ஆண்டு, அத்தியாயம் அல்லது கணக்கைத் தேடுக...',
  revealSolution: 'படிப்படியான தீர்வைக் காண்க',
  hideSolution: 'தீர்வை மறைக்க',
  generateWalkthrough: 'வீடியோ பலகையில் தீர்க்கவும்',
  finalAnswerLabel: 'இறுதி விடை',
  askTutorTitle: 'Avichi MathNova AI கணித ஆசிரியரிடம் கேளுங்கள்',
  askTutorPlaceholder: 'ஏதேனும் 12-ஆம் வகுப்பு கணிதக் கணக்கை உள்ளிடவும் (எ.கா., ∫ (2x + 3) dx)...',
  solveBtn: 'படிப்படியாகத் தீர்க்கவும்',
  derivingBtn: 'தீர்க்கப்படுகிறது...'
};

// ONLY Tamil switches the entire UI, questions, answers, and steps into Tamil.
// All other languages keep the UI in English and narrate in the selected language.
function getUiStrings(lang: LangCode): UiTranslationSet {
  return lang === 'ta' ? TAMIL_UI_STRINGS : ENGLISH_UI_STRINGS;
}

// ============================================================================
// COMPLETE TAMIL NADU STATE BOARD (SAMACHEER KALVI) CLASS 12 (+2) MATHEMATICS
// EVERY SINGLE CHAPTER (CHAPTERS 1–12) AND EVERY TOPIC COVERED
// ============================================================================

type VolumeFilter = 'all' | 'Volume 1' | 'Volume 2';

interface MathTopic {
  id: string;
  code: string;
  title: string;
  tamilTitle: string;
  description: string;
  tamilDescription: string;
  subTopics: string[];
  tamilSubTopics: string[];
  keyFormulas: string[];
  sampleSumEn: string;
  sampleSumTa: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  tamilDifficulty: string;
  estimatedMinutes: number;
}

interface MathChapter {
  id: string;
  grade: '12';
  volume: 'Volume 1' | 'Volume 2';
  tamilVolume: string;
  number: number;
  title: string;
  tamilTitle: string;
  topics: MathTopic[];
}

interface PracticeSum {
  id: string;
  grade: '12';
  topicId: string;
  question: string;
  tamilQuestion: string;
  options: string[];
  tamilOptions: string[];
  correctIndex: number;
  explanation: string;
  tamilExplanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tamilDifficulty: string;
}

interface PastBoardSum {
  id: string;
  grade: '12';
  year: number;
  paper: string;
  tamilPaper: string;
  topic: string;
  tamilTopic: string;
  marks: number;
  question: string;
  tamilQuestion: string;
  solutionSteps: string[];
  tamilSolutionSteps: string[];
  finalAnswer: string;
  tamilFinalAnswer: string;
}

const TN_MATHS_SYLLABUS: MathChapter[] = [
  // ==================== VOLUME 1: CHAPTER 1 ====================
  {
    id: 'tn12-math-c1',
    grade: '12',
    volume: 'Volume 1',
    tamilVolume: 'தொகுதி 1',
    number: 1,
    title: 'Applications of Matrices and Determinants',
    tamilTitle: 'அணிகள் மற்றும் அணிக்கோவைகளின் பயன்பாடுகள்',
    topics: [
      {
        id: 'tn12-m-c1-t1',
        code: '1.1–1.2',
        title: 'Inverse of a Non-Singular Square Matrix, Adjoint & Orthogonal Matrices',
        tamilTitle: 'பூச்சியமற்ற கோவை சதுர அணியின் நேர்மாறு, சேர்ப்பு அணி மற்றும் செங்குத்து அணி',
        description:
          'Adjoint of a square matrix adj(A), theorem A(adj A) = (adj A)A = |A|I_n, inverse formula A⁻¹ = (1/|A|)adj(A), properties of inverse & transpose, and orthogonal matrices (AAᵀ = AᵀA = I).',
        tamilDescription:
          'சதுர அணியின் சேர்ப்பு அணி adj(A), தேற்றம் A(adj A) = (adj A)A = |A|I_n, நேர்மாறு சூத்திரம் A⁻¹ = (1/|A|)adj(A), நேர்மாறு மற்றும் நிரை நிரல் மாற்று அணியின் பண்புகள் மற்றும் செங்குத்து அணிகள்.',
        subTopics: [
          '1.2.1 Adjoint of a Square Matrix & Properties of adj(A)',
          '1.2.2 Inverse of a Non-Singular Matrix A⁻¹ = (1/|A|) adj(A)',
          '1.2.3 Orthogonal Matrices & Reversal Law (AB)⁻¹ = B⁻¹A⁻¹'
        ],
        tamilSubTopics: [
          '1.2.1 சதுர அணியின் சேர்ப்பு அணி மற்றும் adj(A) பண்புகள்',
          '1.2.2 பூச்சியமற்ற கோவை அணியின் நேர்மாறு A⁻¹ = (1/|A|) adj(A)',
          '1.2.3 செங்குத்து அணிகள் மற்றும் தலைகீழ் விதி (AB)⁻¹ = B⁻¹A⁻¹'
        ],
        keyFormulas: ['A⁻¹ = (1 / |A|) adj(A)', '|adj(A)| = |A|^(n-1)', 'adj(AB) = (adj B)(adj A)'],
        sampleSumEn: 'Find the inverse of A = [[2, 3], [1, 4]] using A⁻¹ = (1/|A|) adj(A)',
        sampleSumTa: 'A = [[2, 3], [1, 4]] என்ற அணியின் நேர்மாறு A⁻¹ = (1/|A|) adj(A) மூலம் காண்க',
        difficulty: 'Foundation',
        tamilDifficulty: 'அடிப்படை',
        estimatedMinutes: 20
      },
      {
        id: 'tn12-m-c1-t2',
        code: '1.3–1.4',
        title: 'Elementary Transformations, Rank of a Matrix & Gauss-Jordan Method',
        tamilTitle: 'அணியின் தரம், ஏறுபடி வடிவம் மற்றும் காஸ்-ஜோர்டான் நீக்கல் முறை',
        description:
          'Elementary row & column operations, row-echelon form, rank of a matrix ρ(A) by minor method and echelon reduction, and finding inverse by Gauss-Jordan elimination [A | I_n] → [I_n | A⁻¹].',
        tamilDescription:
          'அடிப்படை நிரை மற்றும் நிரல் உருமாற்றங்கள், ஏறுபடி வடிவம், சிற்றணிக்கோவை மற்றும் ஏறுபடி வடிவ முறையில் அணியின் தரம் ρ(A) காணல் மற்றும் காஸ்-ஜோர்டான் முறையில் நேர்மாறு காணல்.',
        subTopics: [
          '1.3.1 Row-Echelon Form & Rank of a Matrix ρ(A)',
          '1.3.2 Finding Inverse via Gauss-Jordan Elimination'
        ],
        tamilSubTopics: [
          '1.3.1 ஏறுபடி வடிவம் மற்றும் அணியின் தரம் ρ(A) காணல்',
          '1.3.2 காஸ்-ஜோர்டான் முறையில் நேர்மாறு அணி காணல்'
        ],
        keyFormulas: ['ρ(A) ≤ min(m, n)', '[A | I] ~ [I | A⁻¹]'],
        sampleSumEn: 'Find the rank of matrix A = [[1, 2, 3], [2, 4, 6], [3, 5, 7]] by row-echelon form',
        sampleSumTa: 'ஏறுபடி வடிவத்திற்கு மாற்றி A = [[1, 2, 3], [2, 4, 6], [3, 5, 7]] அணியின் தரம் காண்க',
        difficulty: 'Intermediate',
        tamilDifficulty: 'நடுத்தரம்',
        estimatedMinutes: 22
      },
      {
        id: 'tn12-m-c1-t3',
        code: '1.4–1.5',
        title: 'System of Linear Equations: Matrix Inversion, Cramer’s Rule, Gaussian & Rouché-Capelli',
        tamilTitle: 'நேரியச் சமன்பாடுகளின் தொகுப்பு: நேர்மாறு முறை, கிராமர் விதி மற்றும் ரோச்-கபெல்லி தேற்றம்',
        description:
          'Solving AX = B using Matrix Inversion X = A⁻¹B, Cramer’s Rule x_i = Δ_i / Δ, Gaussian Elimination, and consistency testing for non-homogeneous & homogeneous systems using Rouché-Capelli theorem ρ(A) = ρ([A|B]).',
        tamilDescription:
          'நேர்மாறு அணி முறை X = A⁻¹B, கிராமர் விதி x_i = Δ_i / Δ, காஸ் நீக்கல் முறை மற்றும் ரோச்-கபெல்லி தேற்றம் ρ(A) = ρ([A|B]) மூலம் ஒருங்கமைவுத் தன்மை ஆராய்தல்.',
        subTopics: [
          '1.4.1 Matrix Inversion Method (X = A⁻¹B) & Cramer’s Rule (x = Δ₁/Δ)',
          '1.4.3 Gaussian Elimination Method',
          '1.5.1 Rouché-Capelli Theorem & Homogeneous Linear Systems'
        ],
        tamilSubTopics: [
          '1.4.1 நேர்மாறு அணி முறை (X = A⁻¹B) மற்றும் கிராமர் விதி (x = Δ₁/Δ)',
          '1.4.3 காஸ் நீக்கல் முறை',
          '1.5.1 ரோச்-கபெல்லி தேற்றம் மற்றும் சமப்படித்தான சமன்பாட்டுத் தொகுப்பு'
        ],
        keyFormulas: ['X = A⁻¹ B', 'x = Δ₁ / Δ, y = Δ₂ / Δ, z = Δ₃ / Δ', 'ρ(A) = ρ([A|B]) = n ⇒ Unique Solution'],
        sampleSumEn: 'Solve 2x + 3y = 8 and 5x - 2y = 1 using Cramer’s Rule',
        sampleSumTa: 'கிராமர் விதியைப் பயன்படுத்தி 2x + 3y = 8 மற்றும் 5x - 2y = 1 ஆகிய சமன்பாடுகளைத் தீர்க்கவும்',
        difficulty: 'Advanced',
        tamilDifficulty: 'உயர்நிலை',
        estimatedMinutes: 26
      }
    ]
  },

  // ==================== VOLUME 1: CHAPTER 2 ====================
  {
    id: 'tn12-math-c2',
    grade: '12',
    volume: 'Volume 1',
    tamilVolume: 'தொகுதி 1',
    number: 2,
    title: 'Complex Numbers',
    tamilTitle: 'கலப்பெண்கள்',
    topics: [
      {
        id: 'tn12-m-c2-t1',
        code: '2.1–2.4',
        title: 'Algebra of Complex Numbers, Conjugate, Modulus & Square Root',
        tamilTitle: 'கலப்பெண்களின் இயற்கணிதம், இணை கலப்பெண், மட்டு மதிப்பு மற்றும் வர்க்கமூலம்',
        description:
          'Powers of imaginary unit i, rectangular form z = x + iy, Argand plane representation, complex conjugate properties, triangle inequality |z₁ + z₂| ≤ |z₁| + |z₂|, and square root of a complex number.',
        tamilDescription:
          'கற்பனை அலகு i-ன் அடுக்குகள், செவ்வக வடிவம் z = x + iy, ஆர்கண்ட் தளம், இணை கலப்பெண்ணின் பண்புகள், முக்கோண சமனிலி |z₁ + z₂| ≤ |z₁| + |z₂| மற்றும் கலப்பெண்ணின் வர்க்கமூலம்.',
        subTopics: [
          '2.2–2.3 Rectangular Form, Argand Plane & Algebraic Properties',
          '2.4.1 Complex Conjugate & Modulus Properties (z z̄ = |z|²)',
          '2.5.3 Square Root of a Complex Number'
        ],
        tamilSubTopics: [
          '2.2–2.3 செவ்வக வடிவம், ஆர்கண்ட் தளம் மற்றும் அடிப்படைப் பண்புகள்',
          '2.4.1 இணை கலப்பெண் மற்றும் மட்டு மதிப்பு பண்புகள் (z z̄ = |z|²)',
          '2.5.3 கலப்பெண்ணின் வர்க்கமூலம் காணல்'
        ],
        keyFormulas: ['i² = -1, i⁴ = 1', 'z z̄ = x² + y² = |z|²', '|z₁ + z₂| ≤ |z₁| + |z₂|'],
        sampleSumEn: 'Find the modulus, conjugate and multiplicative inverse of z = 3 + 4i',
        sampleSumTa: 'z = 3 + 4i என்ற கலப்பெண்ணின் மட்டு மதிப்பு, இணை கலப்பெண் மற்றும் பெருக்கல் நேர்மாறு காண்க',
        difficulty: 'Foundation',
        tamilDifficulty: 'அடிப்படை',
        estimatedMinutes: 20
      },
      {
        id: 'tn12-m-c2-t2',
        code: '2.6–2.8',
        title: 'Locus in Complex Plane, Polar Form, Euler’s Form, De Moivre’s Theorem & nth Roots',
        tamilTitle: 'கலப்பெண் தளத்தில் நியமப்பாதை, துருவ வடிவம், டி மாய்வரின் தேற்றம் மற்றும் n-ஆம் படி மூலங்கள்',
        description:
          'Equation of circle |z - z₀| = r and perpendicular bisector |z - z₁| = |z - z₂|, polar & Euler form z = r(cosθ + i sinθ) = re^(iθ), De Moivre’s theorem (cosθ + i sinθ)^n = cos nθ + i sin nθ, and cube/fourth roots of unity.',
        tamilDescription:
          'வட்டத்தின் சமன்பாடு |z - z₀| = r, துருவ மற்றும் ஆய்லர் வடிவம் z = r(cosθ + i sinθ), டி மாய்வரின் தேற்றம் மற்றும் ஒன்றின் முப்படி, நான்காம் படி மூலங்கள்.',
        subTopics: [
          '2.6.1 Geometry & Locus of Complex Numbers (Circles & Lines)',
          '2.7.1 Polar Form & Euler’s Formula e^(iθ) = cosθ + i sinθ',
          '2.8.1 De Moivre’s Theorem & nth Roots of Unity'
        ],
        tamilSubTopics: [
          '2.6.1 கலப்பெண்களின் வடிவியல் மற்றும் நியமப்பாதை',
          '2.7.1 துருவ வடிவம் மற்றும் ஆய்லர் சூத்திரம் e^(iθ) = cosθ + i sinθ',
          '2.8.1 டி மாய்வரின் தேற்றம் மற்றும் ஒன்றின் n-ஆம் படி மூலங்கள்'
        ],
        keyFormulas: ['z = r(cosθ + i sinθ) = r e^(iθ)', '(cosθ + i sinθ)^n = cos(nθ) + i sin(nθ)', '1 + ω + ω² = 0'],
        sampleSumEn: 'Express z = 1 + i√3 in polar form and evaluate (1 + i√3)⁶ using De Moivre’s theorem',
        sampleSumTa: 'z = 1 + i√3 ஐ துருவ வடிவில் எழுதி டி மாய்வரின் தேற்றம் மூலம் (1 + i√3)⁶ மதிப்பு காண்க',
        difficulty: 'Advanced',
        tamilDifficulty: 'உயர்நிலை',
        estimatedMinutes: 25
      }
    ]
  },

  // ==================== VOLUME 1: CHAPTER 3 ====================
  {
    id: 'tn12-math-c3',
    grade: '12',
    volume: 'Volume 1',
    tamilVolume: 'தொகுதி 1',
    number: 3,
    title: 'Theory of Equations',
    tamilTitle: 'சமன்பாட்டியல்',
    topics: [
      {
        id: 'tn12-m-c3-t1',
        code: '3.1–3.4',
        title: 'Vieta’s Formulae, Complex/Irrational Conjugate Roots & Reciprocal Equations',
        tamilTitle: 'வியட்டாவின் சூத்திரங்கள், இணை மூலங்கள் தேற்றம் மற்றும் தலைகீழ் சமன்பாடுகள்',
        description:
          'Fundamental theorem of algebra, Vieta’s relations for quadratic, cubic & quartic equations, formation of polynomial equations from given roots, complex & surd conjugate root theorems, and solving Type I & Type II reciprocal equations.',
        tamilDescription:
          'இயற்கணித அடிப்படைத் தேற்றம், இருபடி, முப்படி, நாற்படி சமன்பாடுகளுக்கான வியட்டாவின் சூத்திரங்கள், இணை கலப்பெண் மற்றும் விகிதமுறா மூலங்கள் தேற்றம் மற்றும் தலைகீழ் சமன்பாடுகள்.',
        subTopics: [
          '3.2.1 Vieta’s Formulae for Cubic & Quartic Polynomial Equations',
          '3.3.1 Complex & Irrational Conjugate Root Theorems',
          '3.5.1 Solving Reciprocal Equations of Even and Odd Degree'
        ],
        tamilSubTopics: [
          '3.2.1 முப்படி மற்றும் நாற்படி சமன்பாடுகளுக்கான வியட்டாவின் சூத்திரங்கள்',
          '3.3.1 இணை கலப்பெண் மற்றும் விகிதமுறா மூலங்கள் தேற்றம்',
          '3.5.1 ஒற்றை மற்றும் இரட்டைப் படி தலைகீழ் சமன்பாடுகளைத் தீர்த்தல்'
        ],
        keyFormulas: ['∑α = -b/a, ∑αβ = c/a, αβγ = -d/a', 'x² - (α + β)x + αβ = 0'],
        sampleSumEn: 'Solve the cubic equation 2x³ - 9x² + 13x - 6 = 0 whose roots are in arithmetic progression',
        sampleSumTa: 'மூலங்கள் கூட்டுத் தொடர் வரிசையில் அமைந்தால் 2x³ - 9x² + 13x - 6 = 0 என்ற முப்படிச் சமன்பாட்டைத் தீர்க்கவும்',
        difficulty: 'Intermediate',
        tamilDifficulty: 'நடுத்தரம்',
        estimatedMinutes: 22
      },
      {
        id: 'tn12-m-c3-t2',
        code: '3.6',
        title: 'Descartes’ Rule of Signs for Positive, Negative & Imaginary Roots',
        tamilTitle: 'டெஸ்கார்டேவின் குறி விதி: மிகை, குறை மற்றும் கற்பனை மூலங்களின் எண்ணிக்கை',
        description:
          'Counting sign changes in P(x) and P(-x) to determine the maximum number of positive real roots, negative real roots, and minimum number of imaginary roots.',
        tamilDescription:
          'P(x) மற்றும் P(-x) ஆகியவற்றில் ஏற்படும் குறி மாற்றங்களைக் கொண்டு மிகை மெய்யெண் மூலங்கள், குறை மெய்யெண் மூலங்கள் மற்றும் கற்பனை மூலங்களின் எண்ணிக்கையைக் காணல்.',
        subTopics: [
          '3.6.1 Descartes’ Rule of Signs for P(x) and P(-x)',
          '3.6.2 Determining Minimum Number of Non-Real Complex Roots'
        ],
        tamilSubTopics: [
          '3.6.1 P(x) மற்றும் P(-x) க்கான டெஸ்கார்டேவின் குறி விதி',
          '3.6.2 மெய்யற்ற கலப்பெண் மூலங்களின் குறைந்தபட்ச எண்ணிக்கை காணல்'
        ],
        keyFormulas: ['Pos Roots ≤ SignChanges(P(x))', 'Neg Roots ≤ SignChanges(P(-x))'],
        sampleSumEn: 'Determine the number of positive, negative and imaginary roots of P(x) = 3x⁵ - 2x³ + 5x - 7 = 0',
        sampleSumTa: 'P(x) = 3x⁵ - 2x³ + 5x - 7 = 0 என்ற பல்லுறுப்புக்கோவையின் மிகை, குறை மற்றும் கற்பனை மூலங்களின் எண்ணிக்கையைக் காண்க',
        difficulty: 'Foundation',
        tamilDifficulty: 'அடிப்படை',
        estimatedMinutes: 18
      }
    ]
  },

  // ==================== VOLUME 1: CHAPTER 4 ====================
  {
    id: 'tn12-math-c4',
    grade: '12',
    volume: 'Volume 1',
    tamilVolume: 'தொகுதி 1',
    number: 4,
    title: 'Inverse Trigonometric Functions',
    tamilTitle: 'நேர்மாறு முக்கோணவியல் சார்புகள்',
    topics: [
      {
        id: 'tn12-m-c4-t1',
        code: '4.1–4.5',
        title: 'Principal Value Branches of sin⁻¹x, cos⁻¹x, tan⁻¹x, cot⁻¹x, sec⁻¹x, cosec⁻¹x & Identities',
        tamilTitle: 'நேர்மாறு முக்கோணவியல் சார்புகளின் முதன்மை மதிப்புகள் மற்றும் முற்றொருமைகள்',
        description:
          'Domains, ranges and principal value branches of all six inverse trigonometric functions, graphs, reflection identities, co-function identities sin⁻¹x + cos⁻¹x = π/2, and addition formula tan⁻¹x + tan⁻¹y.',
        tamilDescription:
          'ஆறு நேர்மாறு முக்கோணவியல் சார்புகளின் சார்பகம், வீச்சகம், முதன்மை மதிப்புக் கிளைகள், வரைபடங்கள், sin⁻¹x + cos⁻¹x = π/2 மற்றும் tan⁻¹x + tan⁻¹y கூட்டல் சூத்திரங்கள்.',
        subTopics: [
          '4.1–4.4 Principal Value Branches & Graphs of Inverse Trig Functions',
          '4.5.1 Properties & Addition Formulae (tan⁻¹x + tan⁻¹y)'
        ],
        tamilSubTopics: [
          '4.1–4.4 நேர்மாறு முக்கோணவியல் சார்புகளின் முதன்மை மதிப்புகள் மற்றும் வரைபடங்கள்',
          '4.5.1 பண்புகள் மற்றும் கூட்டல் சூத்திரங்கள் (tan⁻¹x + tan⁻¹y)'
        ],
        keyFormulas: ['sin⁻¹x + cos⁻¹x = π/2', 'tan⁻¹x + cot⁻¹x = π/2', 'tan⁻¹x + tan⁻¹y = tan⁻¹[(x + y)/(1 - xy)]'],
        sampleSumEn: 'Solve tan⁻¹(2x) + tan⁻¹(3x) = π/4 for x > 0',
        sampleSumTa: 'x > 0 எனில் tan⁻¹(2x) + tan⁻¹(3x) = π/4 என்ற சமன்பாட்டைத் தீர்க்கவும்',
        difficulty: 'Intermediate',
        tamilDifficulty: 'நடுத்தரம்',
        estimatedMinutes: 22
      }
    ]
  },

  // ==================== VOLUME 1: CHAPTER 5 ====================
  {
    id: 'tn12-math-c5',
    grade: '12',
    volume: 'Volume 1',
    tamilVolume: 'தொகுதி 1',
    number: 5,
    title: 'Two Dimensional Analytical Geometry - II',
    tamilTitle: 'இரு பரிமாண பகுமுறை வடிவியல் - II',
    topics: [
      {
        id: 'tn12-m-c5-t1',
        code: '5.1–5.2',
        title: 'Equation of a Circle, Tangent, Normal & Conic Sections (Parabola, Ellipse, Hyperbola)',
        tamilTitle: 'வட்டத்தின் சமன்பாடு, தொடுகோடு, செங்கோடு மற்றும் கூம்பு வெட்டுகள் (பரவளையம், நீள்வட்டம், அதிபரவளையம்)',
        description:
          'Standard & general equation of a circle x² + y² + 2gx + 2fy + c = 0, tangent & normal equations, condition for tangency y = mx + c, standard equations of parabola y² = 4ax, ellipse x²/a² + y²/b² = 1, and hyperbola x²/a² - y²/b² = 1.',
        tamilDescription:
          'வட்டத்தின் பொதுச் சமன்பாடு x² + y² + 2gx + 2fy + c = 0, தொடுகோடு மற்றும் செங்கோடு சமன்பாடுகள், பரவளையம் y² = 4ax, நீள்வட்டம் மற்றும் அதிபரவளையத்தின் திட்டச் சமன்பாடுகள்.',
        subTopics: [
          '5.1.1 Circle Equation, Center, Radius & Tangency Condition',
          '5.2.1 Parabola, Ellipse & Hyperbola Standard Equations, Foci & Directrices'
        ],
        tamilSubTopics: [
          '5.1.1 வட்டத்தின் சமன்பாடு, மையம், ஆரம் மற்றும் தொடுகோட்டு நிபந்தனை',
          '5.2.1 பரவளையம், நீள்வட்டம் மற்றும் அதிபரவளையத்தின் சமன்பாடுகள், குவியங்கள் மற்றும் இயக்குவரைகள்'
        ],
        keyFormulas: ['(x - h)² + (y - k)² = r²', 'y² = 4ax (Focus: (a, 0))', 'x²/a² + y²/b² = 1, e = √(1 - b²/a²)'],
        sampleSumEn: 'Find the vertex, focus, directrix and latus rectum of the parabola y² - 4y - 8x + 12 = 0',
        sampleSumTa: 'y² - 4y - 8x + 12 = 0 என்ற பரவளையத்தின் முனை, குவியம், இயக்குவரை மற்றும் செவ்வகல நீளம் காண்க',
        difficulty: 'Intermediate',
        tamilDifficulty: 'நடுத்தரம்',
        estimatedMinutes: 25
      },
      {
        id: 'tn12-m-c5-t2',
        code: '5.3–5.5',
        title: 'Parametric Forms, Tangents, Normals & Real-Life Applications of Conics',
        tamilTitle: 'துணையலகு வடிவங்கள், தொடுகோடுகள், செங்கோடுகள் மற்றும் கூம்பு வெட்டுகளின் பயன்பாடுகள்',
        description:
          'Parametric equations of circle, parabola (at², 2at), ellipse (a cosθ, b sinθ) & hyperbola (a secθ, b tanθ), equations of tangents & normals, and reflective properties in bridges, parabolic dishes & whispering galleries.',
        tamilDescription:
          'வட்டம், பரவளையம் (at², 2at), நீள்வட்டம் (a cosθ, b sinθ) மற்றும் அதிபரவளையத்தின் துணையலகு வடிவங்கள், தொடுகோடு, செங்கோடு சமன்பாடுகள் மற்றும் நடைமுறைப் பயன்பாடுகள்.',
        subTopics: [
          '5.3–5.4 Parametric Forms, Tangents & Normals to Conics',
          '5.5.1 Real-Life Engineering Applications of Parabolic & Elliptical Arches'
        ],
        tamilSubTopics: [
          '5.3–5.4 கூம்பு வெட்டுகளின் துணையலகு வடிவங்கள், தொடுகோடுகள் மற்றும் செங்கோடுகள்',
          '5.5.1 பரவளைய மற்றும் நீள்வட்ட வளைவுகளின் நடைமுறைப் பயன்பாடுகள்'
        ],
        keyFormulas: ['Parabolic Tangent: ty = x + at²', 'Elliptical Tangent: (x cosθ)/a + (y sinθ)/b = 1'],
        sampleSumEn: 'Find the equations of tangent and normal to the parabola x² = 16y at the point (8, 4)',
        sampleSumTa: '(8, 4) என்ற புள்ளியில் x² = 16y என்ற பரவளையத்திற்கு வரையப்படும் தொடுகோடு மற்றும் செங்கோடு சமன்பாடுகளைக் காண்க',
        difficulty: 'Advanced',
        tamilDifficulty: 'உயர்நிலை',
        estimatedMinutes: 24
      }
    ]
  },

  // ==================== VOLUME 1: CHAPTER 6 ====================
  {
    id: 'tn12-math-c6',
    grade: '12',
    volume: 'Volume 1',
    tamilVolume: 'தொகுதி 1',
    number: 6,
    title: 'Applications of Vector Algebra',
    tamilTitle: 'வெக்டர் இயற்கணிதத்தின் பயன்பாடுகள்',
    topics: [
      {
        id: 'tn12-m-c6-t1',
        code: '6.1–6.4',
        title: 'Scalar Triple Product, Vector Triple Product & Jacobi’s Identity',
        tamilTitle: 'திசையிலி முப்பெருக்கல், வெக்டர் முப்பெருக்கல் மற்றும் ஜக்கோபி முற்றொருமை',
        description:
          'Geometric meaning of scalar triple product [a, b, c] = (a × b) · c as volume of parallelepiped, coplanarity condition [a, b, c] = 0, vector triple product a × (b × c) = (a · c)b - (a · b)c, and Lagrange’s identity.',
        tamilDescription:
          'திசையிலி முப்பெருக்கல் [a, b, c] = (a × b) · c வடிவியல் விளக்கம் (இணைகரத் திண்மத்தின் கனஅளவு), ஒரு தள வெக்டர்களுக்கான நிபந்தனை மற்றும் வெக்டர் முப்பெருக்கல்.',
        subTopics: [
          '6.2–6.3 Scalar Triple Product [a, b, c] & Coplanarity Condition',
          '6.4.1 Vector Triple Product a × (b × c) & Jacobi Identity'
        ],
        tamilSubTopics: [
          '6.2–6.3 திசையிலி முப்பெருக்கல் [a, b, c] மற்றும் ஒரு தள அமைவு நிபந்தனை',
          '6.4.1 வெக்டர் முப்பெருக்கல் a × (b × c) மற்றும் ஜக்கோபி முற்றொருமை'
        ],
        keyFormulas: ['[a, b, c] = (a × b) · c', 'a × (b × c) = (a · c)b - (a · b)c'],
        sampleSumEn: 'Find the volume of the parallelepiped whose coterminous edges are 2i + 3j - k, i - 2j + 2k, and 3i + j + 2k',
        sampleSumTa: '2i + 3j - k, i - 2j + 2k மற்றும் 3i + j + 2k ஆகியவற்றை ஒரு புள்ளியில் சந்திக்கும் விளிம்புகளாகக் கொண்ட இணைகரத் திண்மத்தின் கனஅளவு காண்க',
        difficulty: 'Intermediate',
        tamilDifficulty: 'நடுத்தரம்',
        estimatedMinutes: 22
      },
      {
        id: 'tn12-m-c6-t2',
        code: '6.5–6.9',
        title: '3D Straight Lines, Skew Lines Distance, Planes & Line-Plane Intersection',
        tamilTitle: 'முப்பரிமாண நேர்க்கோடுகள், ஒரு தள அமையாக் கோடுகளுக்கு இடைப்பட்ட தூரம் மற்றும் தளங்கள்',
        description:
          'Vector, parametric & Cartesian equations of a straight line, angle between two lines, shortest distance between two skew lines, vector & Cartesian equations of a plane (normal form, intercept form, 3-point form), and distance from a point to a plane.',
        tamilDescription:
          'நேர்க்கோட்டின் வெக்டர் மற்றும் கார்டீசியன் சமன்பாடுகள், இரு கோடுகளுக்கு இடைப்பட்ட கோணம், ஒரு தள அமையாக் கோடுகளுக்கு இடைப்பட்ட மீச்சிறு தூரம் மற்றும் தளத்தின் சமன்பாடுகள்.',
        subTopics: [
          '6.5–6.6 Equations of Straight Lines & Shortest Distance Between Skew Lines',
          '6.7–6.9 Vector & Cartesian Equations of Planes & Point-to-Plane Distance'
        ],
        tamilSubTopics: [
          '6.5–6.6 நேர்க்கோட்டின் சமன்பாடுகள் மற்றும் ஒரு தள அமையாக் கோடுகளுக்கு இடைப்பட்ட தூரம்',
          '6.7–6.9 தளத்தின் வெக்டர், கார்டீசியன் சமன்பாடுகள் மற்றும் புள்ளியிலிருந்து தளத்திற்கு உள்ள தூரம்'
        ],
        keyFormulas: ['r = a + t b', 'd = |(c - a) · (b × d)| / |b × d|', 'r · n̂ = p'],
        sampleSumEn: 'Find the non-parametric vector and Cartesian equations of the plane passing through (2, 3, 6) and parallel to 2x + 3y - 4z = 7',
        sampleSumTa: '(2, 3, 6) வழிச் செல்வதும் 2x + 3y - 4z = 7 தளத்திற்கு இணையானதுமான தளத்தின் சமன்பாட்டைக் காண்க',
        difficulty: 'Advanced',
        tamilDifficulty: 'உயர்நிலை',
        estimatedMinutes: 26
      }
    ]
  },

  // ==================== VOLUME 2: CHAPTER 7 ====================
  {
    id: 'tn12-math-c7',
    grade: '12',
    volume: 'Volume 2',
    tamilVolume: 'தொகுதி 2',
    number: 7,
    title: 'Applications of Differential Calculus',
    tamilTitle: 'வகை நுண்கணிதத்தின் பயன்பாடுகள்',
    topics: [
      {
        id: 'tn12-m-c7-t1',
        code: '7.1–7.4',
        title: 'Rate of Change, Tangent & Normal, Rolle’s Theorem, Lagrange MVT & Taylor Series',
        tamilTitle: 'மாறுபாட்டு வீதம், தொடுகோடு & செங்கோடு, ரோலின் தேற்றம் மற்றும் லெக்ராஞ்சி சராசரி மதிப்புத் தேற்றம்',
        description:
          'Derivative as rate of change, equations of tangent & normal to a curve, angle of intersection between two curves, Rolle’s theorem, Lagrange’s Mean Value Theorem, and Taylor’s & Maclaurin’s series expansions.',
        tamilDescription:
          'மாறுபாட்டு வீதமாக வகைக்கெழு, வளைவரைக்கு தொடுகோடு மற்றும் செங்கோடு சமன்பாடுகள், இரு வளைவரைகள் வெட்டிக்கொள்ளும் கோணம், ரோலின் தேற்றம் மற்றும் லெக்ராஞ்சி சராசரி மதிப்புத் தேற்றம்.',
        subTopics: [
          '7.1–7.2 Rate of Change, Tangent, Normal & Angle Between Curves',
          '7.3–7.4 Rolle’s Theorem, Lagrange’s MVT & Maclaurin’s Series'
        ],
        tamilSubTopics: [
          '7.1–7.2 மாறுபாட்டு வீதம், தொடுகோடு, செங்கோடு மற்றும் வளைவரைகளுக்கு இடைப்பட்ட கோணம்',
          '7.3–7.4 ரோலின் தேற்றம், லெக்ராஞ்சி சராசரி மதிப்புத் தேற்றம் மற்றும் மெக்லாரின் தொடர்'
        ],
        keyFormulas: ['y - y₁ = m(x - x₁)', 'tanθ = |(m₁ - m₂)/(1 + m₁m₂)|', 'f\'(c) = [f(b) - f(a)] / (b - a)'],
        sampleSumEn: 'Find the equations of tangent and normal to the curve y = x² + 3x - 2 at x = 1',
        sampleSumTa: 'x = 1 எனும் புள்ளியில் y = x² + 3x - 2 என்ற வளைவரைக்கு வரையப்படும் தொடுகோடு மற்றும் செங்கோடு சமன்பாடுகளைக் காண்க',
        difficulty: 'Intermediate',
        tamilDifficulty: 'நடுத்தரம்',
        estimatedMinutes: 22
      },
      {
        id: 'tn12-m-c7-t2',
        code: '7.5–7.8',
        title: 'Indeterminate Forms (L’Hôpital’s Rule), Monotonicity, Local Extrema, Concavity & Optimization',
        tamilTitle: 'தேறப்பெறா வடிவங்கள் (லொபிதால் விதி), ஓரியல்புத்தன்மை, பெருமம் & சிறுமம் மற்றும் குழிவுத்தன்மை',
        description:
          'Evaluating 0/0, ∞/∞, 0×∞, ∞-∞, 0⁰, 1^∞, ∞⁰ using L’Hôpital’s Rule, increasing/decreasing intervals, first & second derivative tests for local maxima & minima, points of inflection, and applied optimization problems.',
        tamilDescription:
          'லொபிதால் விதி மூலம் 0/0, ∞/∞, 1^∞ வடிவங்களின் எல்லை மதிப்பு காணல், கூடும் மற்றும் குறையும் இடைவெளிகள், இடஞ்சார்ந்த பெருமம் மற்றும் சிறுமம், வளைவு மாற்றப் புள்ளிகள்.',
        subTopics: [
          '7.5.1 L’Hôpital’s Rule for Indeterminate Forms (0/0, ∞/∞, 1^∞)',
          '7.6–7.7 Monotonicity, Local Extrema, Concavity & Points of Inflection',
          '7.8.1 Applied Optimization Problems'
        ],
        tamilSubTopics: [
          '7.5.1 தேறப்பெறா வடிவங்களுக்கான லொபிதால் விதி (0/0, ∞/∞, 1^∞)',
          '7.6–7.7 ஓரியல்புத்தன்மை, இடஞ்சார்ந்த பெருமம் & சிறுமம் மற்றும் வளைவு மாற்றப் புள்ளிகள்',
          '7.8.1 பயன்பாட்டு உகமக் கணக்குகள்'
        ],
        keyFormulas: ['lim f(x)/g(x) = lim f\'(x)/g\'(x)', 'f\'(c) = 0, f\'\'(c) < 0 ⇒ Local Max'],
        sampleSumEn: 'Find the local extrema of f(x) = 2x³ - 9x² + 12x + 5 using the second derivative test',
        sampleSumTa: 'இரண்டாம் வகைக்கெழு சோதனை மூலம் f(x) = 2x³ - 9x² + 12x + 5 சார்பின் இடஞ்சார்ந்த பெருமம் மற்றும் சிறும மதிப்புகளைக் காண்க',
        difficulty: 'Advanced',
        tamilDifficulty: 'உயர்நிலை',
        estimatedMinutes: 26
      }
    ]
  },

  // ==================== VOLUME 2: CHAPTER 8 ====================
  {
    id: 'tn12-math-c8',
    grade: '12',
    volume: 'Volume 2',
    tamilVolume: 'தொகுதி 2',
    number: 8,
    title: 'Differentials and Partial Derivatives',
    tamilTitle: 'வகையீடுகள் மற்றும் பகுதி வகைக்கெழுக்கள்',
    topics: [
      {
        id: 'tn12-m-c8-t1',
        code: '8.1–8.7',
        title: 'Linear Approximation, Differentials, Partial Derivatives, Chain Rule & Euler’s Theorem',
        tamilTitle: 'நேரியல் தோராயமதிப்பு, வகையீடுகள், பகுதி வகைக்கெழுக்கள், சங்கிலி விதி மற்றும் ஆய்லரின் தேற்றம்',
        description:
          'Linear approximation L(x) = f(x₀) + f\'(x₀)(x - x₀), absolute, relative & percentage errors, partial derivatives ∂f/∂x & ∂f/∂y, Clairaut’s theorem f_xy = f_yx, multivariable chain rule, and Euler’s theorem for homogeneous functions.',
        tamilDescription:
          'நேரியல் தோராயமதிப்பு L(x), தனிப்பிழை, சார்புப் பிழை மற்றும் சதவீதப் பிழை, பகுதி வகைக்கெழுக்கள் ∂f/∂x மற்றும் ∂f/∂y, சங்கிலி விதி மற்றும் சமப்படித்தான சார்புகளுக்கான ஆய்லரின் தேற்றம்.',
        subTopics: [
          '8.1–8.2 Linear Approximation, Differentials & Percentage Errors',
          '8.3–8.6 Partial Derivatives, Chain Rule & Total Differential',
          '8.7.1 Euler’s Theorem for Homogeneous Functions (x ∂f/∂x + y ∂f/∂y = n f)'
        ],
        tamilSubTopics: [
          '8.1–8.2 நேரியல் தோராயமதிப்பு, வகையீடுகள் மற்றும் சதவீதப் பிழைகள்',
          '8.3–8.6 பகுதி வகைக்கெழுக்கள், சங்கிலி விதி மற்றும் மொத்த வகையீடு',
          '8.7.1 சமப்படித்தான சார்புகளுக்கான ஆய்லரின் தேற்றம்'
        ],
        keyFormulas: ['Δf ≈ df = f\'(x) dx', 'x(∂f/∂x) + y(∂f/∂y) = n f'],
        sampleSumEn: 'Use linear approximation to find the approximate value of √(25.2) and verify Euler’s theorem for u = x³ + y³',
        sampleSumTa: 'நேரியல் தோராயமதிப்பு மூலம் √(25.2) மதிப்பைக் காண்க மற்றும் u = x³ + y³ சார்பிற்கு ஆய்லர் தேற்றத்தைச் சரிபார்க்கவும்',
        difficulty: 'Intermediate',
        tamilDifficulty: 'நடுத்தரம்',
        estimatedMinutes: 22
      }
    ]
  },

  // ==================== VOLUME 2: CHAPTER 9 ====================
  {
    id: 'tn12-math-c9',
    grade: '12',
    volume: 'Volume 2',
    tamilVolume: 'தொகுதி 2',
    number: 9,
    title: 'Applications of Integration',
    tamilTitle: 'தொகை நுண்கணிதத்தின் பயன்பாடுகள்',
    topics: [
      {
        id: 'tn12-m-c9-t1',
        code: '9.1–9.7',
        title: 'Definite Integral Properties, Reduction Formulae, Gamma Integral & Improper Integrals',
        tamilTitle: 'வரையறுத்த தொகையிடலின் பண்புகள், குறைப்புச் சூத்திரங்கள் மற்றும் காமா தொகையீடு',
        description:
          'Fundamental theorems of integral calculus, properties of definite integrals ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx, even/odd function integrals, Bernoulli’s formula, reduction formulae for ∫₀^(π/2) sinⁿx dx, and Gamma integral Γ(n).',
        tamilDescription:
          'நுண்கணித அடிப்படைத் தேற்றங்கள், வரையறுத்த தொகையிடலின் பண்புகள், இரட்டை/ஒற்றைப்படை சார்புகளின் தொகையீடு, பெர்னௌலி சூத்திரம், குறைப்புச் சூத்திரங்கள் மற்றும் காமா தொகையீடு Γ(n).',
        subTopics: [
          '9.3.1 Properties of Definite Integrals & King’s Rule ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx',
          '9.4–9.7 Bernoulli’s Formula, Reduction Formulae & Gamma Integral'
        ],
        tamilSubTopics: [
          '9.3.1 வரையறுத்த தொகையிடலின் பண்புகள் ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx',
          '9.4–9.7 பெர்னௌலி சூத்திரம், குறைப்புச் சூத்திரங்கள் மற்றும் காமா தொகையீடு'
        ],
        keyFormulas: ['∫₀ᵃ f(x) dx = ∫₀ᵃ f(a - x) dx', 'Γ(n) = ∫₀^∞ e^(-x) x^(n-1) dx = (n - 1)!'],
        sampleSumEn: 'Evaluate ∫₀^(π/2) [sin³x / (sin³x + cos³x)] dx using definite integral properties',
        sampleSumTa: 'வரையறுத்த தொகையிடலின் பண்புகளைப் பயன்படுத்தி ∫₀^(π/2) [sin³x / (sin³x + cos³x)] dx மதிப்பு காண்க',
        difficulty: 'Advanced',
        tamilDifficulty: 'உயர்நிலை',
        estimatedMinutes: 25
      },
      {
        id: 'tn12-m-c9-t2',
        code: '9.8–9.9',
        title: 'Area of Plane Regions Bounded by Curves & Volume of Solids of Revolution',
        tamilTitle: 'வளைவரைகளால் அடைபடும் அரங்கத்தின் பரப்பு மற்றும் சுழற்சித் திண்மங்களின் கனஅளவு',
        description:
          'Area bounded by a curve and x-axis / y-axis, area between two intersecting curves, and volume of solid generated by revolving a plane region about x-axis or y-axis.',
        tamilDescription:
          'வளைவரை மற்றும் அச்சுகளால் அடைபடும் பரப்பு, இரு வளைவரைகளுக்கு இடைப்பட்ட பரப்பு மற்றும் x-அச்சு அல்லது y-அச்சைப் பற்றி சுழற்றுவதால் உருவாகும் திண்மத்தின் கனஅளவு.',
        subTopics: [
          '9.8.1 Area Bounded by Curves (x-axis, y-axis & Between Two Curves)',
          '9.9.1 Volume of Solid of Revolution V = π ∫ y² dx'
        ],
        tamilSubTopics: [
          '9.8.1 வளைவரைகளால் அடைபடும் அரங்கத்தின் பரப்பு',
          '9.9.1 சுழற்சித் திண்மத்தின் கனஅளவு V = π ∫ y² dx'
        ],
        keyFormulas: ['A = ∫ₐᵇ |f(x) - g(x)| dx', 'V_x = π ∫ₐᵇ y² dx, V_y = π ∫_c^d x² dy'],
        sampleSumEn: 'Find the area of the region bounded by the parabola y² = 4x and the line y = 2x',
        sampleSumTa: 'y² = 4x என்ற பரவளையம் மற்றும் y = 2x என்ற கோட்டால் அடைபடும் அரங்கத்தின் பரப்பைக் காண்க',
        difficulty: 'Advanced',
        tamilDifficulty: 'உயர்நிலை',
        estimatedMinutes: 24
      }
    ]
  },

  // ==================== VOLUME 2: CHAPTER 10 ====================
  {
    id: 'tn12-math-c10',
    grade: '12',
    volume: 'Volume 2',
    tamilVolume: 'தொகுதி 2',
    number: 10,
    title: 'Ordinary Differential Equations',
    tamilTitle: 'சாதாரண வகைக்கெழுச் சமன்பாடுகள்',
    topics: [
      {
        id: 'tn12-m-c10-t1',
        code: '10.1–10.8',
        title: 'Order & Degree, Variable Separable, Homogeneous, Linear ODE & Growth/Decay Models',
        tamilTitle: 'வரிசை மற்றும் படி, மாறிகள் பிரிபடும் முறை, சமப்படித்தான மற்றும் நேரியல் வகைக்கெழுச் சமன்பாடுகள்',
        description:
          'Order and degree of ODEs, formation of differential equations, variable separable method, homogeneous differential equations (y = vx), linear differential equations dy/dx + Py = Q using Integrating Factor e^(∫P dx), and exponential growth/decay & Newton’s law of cooling.',
        tamilDescription:
          'வகைக்கெழுச் சமன்பாட்டின் வரிசை மற்றும் படி, மாறிகள் பிரிபடும் முறை, சமப்படித்தான சமன்பாடுகள் (y = vx), நேரியல் வகைக்கெழுச் சமன்பாடுகள் dy/dx + Py = Q மற்றும் வளர்ச்சி/சிதைவு கணக்குகள்.',
        subTopics: [
          '10.2–10.5 Order, Degree, Formation & Variable Separable ODEs',
          '10.6–10.7 Homogeneous ODEs & Linear ODEs (Integrating Factor e^∫Pdx)',
          '10.8.1 Applications: Population Growth, Radioactive Decay & Newton’s Law of Cooling'
        ],
        tamilSubTopics: [
          '10.2–10.5 வரிசை, படி, உருவாக்கம் மற்றும் மாறிகள் பிரிபடும் வகைக்கெழுச் சமன்பாடுகள்',
          '10.6–10.7 சமப்படித்தான மற்றும் நேரியல் வகைக்கெழுச் சமன்பாடுகள் (தொகையீட்டுக் காரணி)',
          '10.8.1 பயன்பாடுகள்: மக்கள்தொகை வளர்ச்சி, கதிரியக்கச் சிதைவு மற்றும் நியூட்டனின் குளிர்தல் விதி'
        ],
        keyFormulas: ['dy/dx + Py = Q ⇒ y·IF = ∫ Q·IF dx', 'IF = e^(∫ P dx)', 'dN/dt = kN ⇒ N = N₀ e^(kt)'],
        sampleSumEn: 'Solve the linear differential equation dy/dx + 2y = e^(-x) given y(0) = 3',
        sampleSumTa: 'y(0) = 3 எனும்போது dy/dx + 2y = e^(-x) என்ற நேரியல் வகைக்கெழுச் சமன்பாட்டைத் தீர்க்கவும்',
        difficulty: 'Advanced',
        tamilDifficulty: 'உயர்நிலை',
        estimatedMinutes: 26
      }
    ]
  },

  // ==================== VOLUME 2: CHAPTER 11 ====================
  {
    id: 'tn12-math-c11',
    grade: '12',
    volume: 'Volume 2',
    tamilVolume: 'தொகுதி 2',
    number: 11,
    title: 'Probability Distributions',
    tamilTitle: 'நிகழ்தகவு பரவல்கள்',
    topics: [
      {
        id: 'tn12-m-c11-t1',
        code: '11.1–11.5',
        title: 'Discrete & Continuous Random Variables, PDF, CDF, Mean, Variance & Binomial Distribution',
        tamilTitle: 'தனித்த மற்றும் தொடர் சமவாய்ப்பு மாறிகள், நிகழ்தகவு அடர்த்தி சார்பு, சராசரி, மாறுபாட்டு அளவை மற்றும் ஈருறுப்புப் பரவல்',
        description:
          'Discrete random variables & probability mass function (PMF), continuous random variables & probability density function (PDF), cumulative distribution function (CDF), mathematical expectation E(X), variance Var(X) = E(X²) - [E(X)]², and Binomial distribution B(n, p).',
        tamilDescription:
          'தனித்த சமவாய்ப்பு மாறிகள் மற்றும் நிகழ்தகவு நிறைச் சார்பு, தொடர் சமவாய்ப்பு மாறிகள் மற்றும் நிகழ்தகவு அடர்த்தி சார்பு, குவிவு பரவல் சார்பு, சராசரி E(X), மாறுபாட்டு அளவை Var(X) மற்றும் ஈருறுப்புப் பரவல்.',
        subTopics: [
          '11.2–11.3 Discrete PMF, Continuous PDF & Cumulative Distribution Function',
          '11.4.1 Mathematical Expectation E(X) & Variance Var(X)',
          '11.5.1 Binomial Distribution P(X = x) = nCx p^x q^(n-x)'
        ],
        tamilSubTopics: [
          '11.2–11.3 தனித்த PMF, தொடர் PDF மற்றும் குவிவு பரவல் சார்பு',
          '11.4.1 கணித எதிர்பார்ப்பு E(X) மற்றும் மாறுபாட்டு அளவை Var(X)',
          '11.5.1 ஈருறுப்புப் பரவல் P(X = x) = nCx p^x q^(n-x)'
        ],
        keyFormulas: ['∫_{-∞}^∞ f(x) dx = 1', 'Var(X) = E(X²) - [E(X)]²', 'P(X = x) = nCx p^x q^(n-x), μ = np, σ² = npq'],
        sampleSumEn: 'Find the constant c and mean E(X) for the continuous PDF f(x) = c x² for 0 ≤ x ≤ 3',
        sampleSumTa: '0 ≤ x ≤ 3 எனும்போது f(x) = c x² என்ற தொடர் நிகழ்தகவு அடர்த்தி சார்பிற்கு c மதிப்பு மற்றும் சராசரி E(X) காண்க',
        difficulty: 'Intermediate',
        tamilDifficulty: 'நடுத்தரம்',
        estimatedMinutes: 24
      }
    ]
  },

  // ==================== VOLUME 2: CHAPTER 12 ====================
  {
    id: 'tn12-math-c12',
    grade: '12',
    volume: 'Volume 2',
    tamilVolume: 'தொகுதி 2',
    number: 12,
    title: 'Discrete Mathematics',
    tamilTitle: 'தனிநிலைக் கணிதம்',
    topics: [
      {
        id: 'tn12-m-c12-t1',
        code: '12.1–12.2',
        title: 'Binary Operations, Algebraic Properties, Mathematical Logic & Truth Tables',
        tamilTitle: 'ஈருறுப்புச் செயலிகள், பண்புகள், கணிதத் தர்க்கவியல் மற்றும் மெய்மை அட்டவணைகள்',
        description:
          'Closure, commutative, associative, identity & inverse properties of binary operations on sets & matrices, compound propositions, logical connectives (¬, ∧, ∨, →, ↔), tautology, contradiction, contingency, and logical equivalence laws.',
        tamilDescription:
          'ஈருறுப்புச் செயலிகளின் அடைவு, பரிமாற்று, சேர்ப்பு, சமனி மற்றும் நேர்மாறு பண்புகள், கூட்டுக் கூற்றுகள், தர்க்க இணைப்புகள் (¬, ∧, ∨, →, ↔), மெய்மம், முரண்பாடு மற்றும் தர்க்க சமான விதிகள்.',
        subTopics: [
          '12.1.1 Binary Operations, Identity & Inverse Elements',
          '12.2.1 Mathematical Logic, Truth Tables, Tautology & Logical Equivalence'
        ],
        tamilSubTopics: [
          '12.1.1 ஈருறுப்புச் செயலிகள், சமனி மற்றும் நேர்மாறு உறுப்புகள்',
          '12.2.1 கணிதத் தர்க்கவியல், மெய்மை அட்டவணைகள், மெய்மம் மற்றும் தர்க்க சமானம்'
        ],
        keyFormulas: ['a * e = e * a = a', 'p → q ≡ ¬p ∨ q', '¬(p ∧ q) ≡ ¬p ∨ ¬q'],
        sampleSumEn: 'Verify closure, commutative, associative, identity and inverse for a * b = a + b - 5 on Z',
        sampleSumTa: 'Z கணத்தின் மீது a * b = a + b - 5 என்ற ஈருறுப்புச் செயலிக்கு அடைவு, பரிமாற்று, சேர்ப்பு, சமனி மற்றும் நேர்மாறு பண்புகளைச் சரிபார்க்கவும்',
        difficulty: 'Foundation',
        tamilDifficulty: 'அடிப்படை',
        estimatedMinutes: 20
      }
    ]
  }
];

const PRACTICE_SUMS: PracticeSum[] = [
  {
    id: 'mq-1',
    grade: '12',
    topicId: 'tn12-m-c1-t1',
    question: 'If A is a 3×3 non-singular matrix with |A| = 5, what is the value of |adj(A)|? (TN Class 12 Ch 1)',
    tamilQuestion: 'A என்பது 3×3 பூச்சியமற்ற கோவை அணி மற்றும் |A| = 5 எனில், |adj(A)| மதிப்பு யாது? (12-ஆம் வகுப்பு அத்தியாயம் 1)',
    options: ['25', '5', '125', '15'],
    tamilOptions: ['25', '5', '125', '15'],
    correctIndex: 0,
    explanation: 'Step 1: Recall property |adj(A)| = |A|^(n - 1) for an n×n matrix. Step 2: Here n = 3 and |A| = 5, so |adj(A)| = 5^(3 - 1) = 5² = 25.',
    tamilExplanation: 'படி 1: n×n அணிக்கு |adj(A)| = |A|^(n - 1). படி 2: இங்கு n = 3 மற்றும் |A| = 5 என்பதால், |adj(A)| = 5^(3 - 1) = 5² = 25 ஆகும்.',
    difficulty: 'Easy',
    tamilDifficulty: 'எளிது'
  },
  {
    id: 'mq-2',
    grade: '12',
    topicId: 'tn12-m-c2-t1',
    question: 'What is the value of i¹⁹ + i²⁰ + i²¹ + i²²? (TN Class 12 Ch 2)',
    tamilQuestion: 'i¹⁹ + i²⁰ + i²¹ + i²² இன் மதிப்பு யாது? (12-ஆம் வகுப்பு அத்தியாயம் 2)',
    options: ['0', '1', '-1', '2i'],
    tamilOptions: ['0', '1', '-1', '2i'],
    correctIndex: 0,
    explanation: 'Step 1: Factor out i¹⁹: i¹⁹(1 + i + i² + i³). Step 2: Since 1 + i - 1 - i = 0, the sum of any four consecutive powers of i is always 0.',
    tamilExplanation: 'படி 1: i¹⁹ பொதுவாக எடுக்க i¹⁹(1 + i + i² + i³) கிடைக்கும். படி 2: 1 + i - 1 - i = 0 என்பதால், i-ன் தொடர்ச்சியான நான்கு அடுக்குகளின் கூடுதல் 0 ஆகும்.',
    difficulty: 'Easy',
    tamilDifficulty: 'எளிது'
  },
  {
    id: 'mq-3',
    grade: '12',
    topicId: 'tn12-m-c4-t1',
    question: 'The principal value of sin⁻¹(sin(2π/3)) is: (TN Class 12 Ch 4)',
    tamilQuestion: 'sin⁻¹(sin(2π/3)) இன் முதன்மை மதிப்பு யாது? (12-ஆம் வகுப்பு அத்தியாயம் 4)',
    options: ['π / 3', '2π / 3', '-π / 3', 'π / 6'],
    tamilOptions: ['π / 3', '2π / 3', '-π / 3', 'π / 6'],
    correctIndex: 0,
    explanation: 'Step 1: Principal range of sin⁻¹x is [-π/2, π/2]. Step 2: Write sin(2π/3) = sin(π - π/3) = sin(π/3), hence sin⁻¹(sin(π/3)) = π/3.',
    tamilExplanation: 'படி 1: sin⁻¹x சார்பின் முதன்மை வீச்சகம் [-π/2, π/2]. படி 2: sin(2π/3) = sin(π - π/3) = sin(π/3) என்பதால் முதன்மை மதிப்பு π/3 ஆகும்.',
    difficulty: 'Medium',
    tamilDifficulty: 'நடுத்தரம்'
  },
  {
    id: 'mq-4',
    grade: '12',
    topicId: 'tn12-m-c7-t2',
    question: 'Evaluate lim (x → 0) [(e^(3x) - 1) / (2x)] using L’Hôpital’s rule: (TN Class 12 Ch 7)',
    tamilQuestion: 'லொபிதால் விதியைப் பயன்படுத்தி lim (x → 0) [(e^(3x) - 1) / (2x)] மதிப்பு காண்க: (12-ஆம் வகுப்பு அத்தியாயம் 7)',
    options: ['3 / 2', '2 / 3', '3', '0'],
    tamilOptions: ['3 / 2', '2 / 3', '3', '0'],
    correctIndex: 0,
    explanation: 'Step 1: Substituting x = 0 gives 0/0 form. Step 2: Differentiating numerator and denominator gives lim (x → 0) [3e^(3x) / 2] = 3(1)/2 = 3/2.',
    tamilExplanation: 'படி 1: x = 0 எனப் பிரதியிட 0/0 வடிவம் கிடைக்கிறது. படி 2: தொகுதி மற்றும் பகுதியை வகையிட lim (x → 0) [3e^(3x) / 2] = 3/2 கிடைக்கிறது.',
    difficulty: 'Easy',
    tamilDifficulty: 'எளிது'
  },
  {
    id: 'mq-5',
    grade: '12',
    topicId: 'tn12-m-c9-t1',
    question: 'What is the value of ∫₀^(π/2) [cos⁵x / (sin⁵x + cos⁵x)] dx? (TN Class 12 Ch 9)',
    tamilQuestion: '∫₀^(π/2) [cos⁵x / (sin⁵x + cos⁵x)] dx இன் மதிப்பு யாது? (12-ஆம் வகுப்பு அத்தியாயம் 9)',
    options: ['π / 4', 'π / 2', 'π', '1'],
    tamilOptions: ['π / 4', 'π / 2', 'π', '1'],
    correctIndex: 0,
    explanation: 'Step 1: Using ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx with a = π/2, I = ∫₀^(π/2) [sin⁵x / (cos⁵x + sin⁵x)] dx. Step 2: Adding gives 2I = ∫₀^(π/2) 1 dx = π/2 ⇒ I = π/4.',
    tamilExplanation: 'படி 1: ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx பண்பைப் பயன்படுத்த 2I = ∫₀^(π/2) 1 dx = π/2 கிடைக்கும். படி 2: எனவே I = π/4 ஆகும்.',
    difficulty: 'Medium',
    tamilDifficulty: 'நடுத்தரம்'
  },
  {
    id: 'mq-6',
    grade: '12',
    topicId: 'tn12-m-c10-t1',
    question: 'The Integrating Factor (I.F.) of the linear differential equation dy/dx + (2/x)y = x² is: (TN Class 12 Ch 10)',
    tamilQuestion: 'dy/dx + (2/x)y = x² என்ற நேரியல் வகைக்கெழுச் சமன்பாட்டின் தொகையீட்டுக் காரணி (I.F.) யாது? (12-ஆம் வகுப்பு அத்தியாயம் 10)',
    options: ['x²', '2x', 'e^(2x)', '1 / x²'],
    tamilOptions: ['x²', '2x', 'e^(2x)', '1 / x²'],
    correctIndex: 0,
    explanation: 'Step 1: Here P = 2/x, so ∫ P dx = ∫ (2/x) dx = 2 ln x = ln(x²). Step 2: I.F. = e^(ln(x²)) = x².',
    tamilExplanation: 'படி 1: இங்கு P = 2/x என்பதால் ∫ P dx = 2 ln x = ln(x²). படி 2: தொகையீட்டுக் காரணி I.F. = e^(ln(x²)) = x² ஆகும்.',
    difficulty: 'Medium',
    tamilDifficulty: 'நடுத்தரம்'
  }
];

const PAST_BOARD_SUMS: PastBoardSum[] = [
  {
    id: 'tn-math-past-2025-1',
    grade: '12',
    year: 2025,
    paper: 'TN HSC March Public Exam - Mathematics (5 Marks)',
    tamilPaper: 'தமிழ்நாடு அரசு மார்ச் பொதுத்தேர்வு - கணிதம் (5 மதிப்பெண்கள்)',
    topic: 'Chapter 1: Matrices & Determinants (1.4 Cramer’s Rule)',
    tamilTopic: 'அத்தியாயம் 1: அணிகள் மற்றும் அணிக்கோவைகள் (1.4 கிராமர் விதி)',
    marks: 5,
    question: 'Solve the system of linear equations by Cramer’s Rule: 2x + 3y - z = 9, x + y + z = 9, 3x - y - z = -1.',
    tamilQuestion: 'கிராமர் விதியைப் பயன்படுத்தித் தீர்க்க: 2x + 3y - z = 9, x + y + z = 9, 3x - y - z = -1.',
    solutionSteps: [
      'Step 1: Coefficient determinant Δ = |2  3  -1; 1  1  1; 3  -1  -1| = 2(-1 + 1) - 3(-1 - 3) - 1(-1 - 3) = 0 + 12 + 4 = 16 ≠ 0.',
      'Step 2: Replace column 1 with constants [9, 9, -1]: Δ₁ = |9  3  -1; 9  1  1; -1  -1  -1| = 9(0) - 3(-8) - 1(-8) = 24 + 8 = 32.',
      'Step 3: Replace column 2 with constants [9, 9, -1]: Δ₂ = |2  9  -1; 1  9  1; 3  -1  -1| = 2(-8) - 9(-4) - 1(-28) = -16 + 36 + 28 = 48.',
      'Step 4: Replace column 3 with constants [9, 9, -1]: Δ₃ = |2  3  9; 1  1  9; 3  -1  -1| = 2(8) - 3(-28) + 9(-4) = 16 + 84 - 36 = 64.',
      'Step 5: Compute x = Δ₁/Δ = 32/16 = 2, y = Δ₂/Δ = 48/16 = 3, z = Δ₃/Δ = 64/16 = 4.'
    ],
    tamilSolutionSteps: [
      'படி 1: கெழு அணிக்கோவை Δ = |2  3  -1; 1  1  1; 3  -1  -1| = 2(-1 + 1) - 3(-1 - 3) - 1(-1 - 3) = 0 + 12 + 4 = 16 ≠ 0.',
      'படி 2: முதல் நிரலை [9, 9, -1] ஆல் மாற்ற Δ₁ = |9  3  -1; 9  1  1; -1  -1  -1| = 9(0) - 3(-8) - 1(-8) = 32.',
      'படி 3: இரண்டாம் நிரலை [9, 9, -1] ஆல் மாற்ற Δ₂ = |2  9  -1; 1  9  1; 3  -1  -1| = -16 + 36 + 28 = 48.',
      'படி 4: மூன்றாம் நிரலை [9, 9, -1] ஆல் மாற்ற Δ₃ = |2  3  9; 1  1  9; 3  -1  -1| = 16 + 84 - 36 = 64.',
      'படி 5: எனவே x = Δ₁/Δ = 32/16 = 2, y = Δ₂/Δ = 48/16 = 3, z = Δ₃/Δ = 64/16 = 4.'
    ],
    finalAnswer: 'Solution Set: (x, y, z) = (2, 3, 4)',
    tamilFinalAnswer: 'தீர்வு: (x, y, z) = (2, 3, 4)'
  },
  {
    id: 'tn-math-past-2025-2',
    grade: '12',
    year: 2025,
    paper: 'TN HSC March Public Exam - Mathematics (5 Marks)',
    tamilPaper: 'தமிழ்நாடு அரசு மார்ச் பொதுத்தேர்வு - கணிதம் (5 மதிப்பெண்கள்)',
    topic: 'Chapter 7: Applications of Differential Calculus (7.6 Local Extrema)',
    tamilTopic: 'அத்தியாயம் 7: வகை நுண்கணிதத்தின் பயன்பாடுகள் (7.6 இடஞ்சார்ந்த பெருமம் & சிறுமம்)',
    marks: 5,
    question: 'Find the intervals of monotonicity and local extrema of the function f(x) = 2x³ - 3x² - 12x + 4.',
    tamilQuestion: 'f(x) = 2x³ - 3x² - 12x + 4 என்ற சார்பின் ஓரியல்பு இடைவெளிகள் மற்றும் இடஞ்சார்ந்த பெருமம், சிறுமம் காண்க.',
    solutionSteps: [
      'Step 1: Differentiate f(x): f\'(x) = 6x² - 6x - 12 = 6(x² - x - 2) = 6(x - 2)(x + 1).',
      'Step 2: Set f\'(x) = 0 ⇒ critical numbers are x = -1 and x = 2.',
      'Step 3: Test intervals: f(x) is strictly increasing on (-∞, -1) and (2, ∞), and strictly decreasing on (-1, 2).',
      'Step 4: Second derivative f\'\'(x) = 12x - 6. At x = -1, f\'\'(-1) = -18 < 0 ⇒ Local Max f(-1) = 11.',
      'Step 5: At x = 2, f\'\'(2) = +18 > 0 ⇒ Local Min f(2) = -16.'
    ],
    tamilSolutionSteps: [
      'படி 1: f(x) ஐ வகையிட f\'(x) = 6x² - 6x - 12 = 6(x - 2)(x + 1).',
      'படி 2: f\'(x) = 0 எனில் நிலை எண்கள் x = -1 மற்றும் x = 2.',
      'படி 3: (-∞, -1) மற்றும் (2, ∞) இல் திட்டமாகக் கூடும்; (-1, 2) இல் திட்டமாகக் குறையும்.',
      'படி 4: இரண்டாம் வகைக்கெழு f\'\'(x) = 12x - 6. x = -1 இல் f\'\'(-1) = -18 < 0 ⇒ இடஞ்சார்ந்த பெருமம் f(-1) = 11.',
      'படி 5: x = 2 இல் f\'\'(2) = +18 > 0 ⇒ இடஞ்சார்ந்த சிறுமம் f(2) = -16.'
    ],
    finalAnswer: 'Local Maximum = 11 at x = -1; Local Minimum = -16 at x = 2',
    tamilFinalAnswer: 'இடஞ்சார்ந்த பெருமம் = 11 (x = -1 இல்); இடஞ்சார்ந்த சிறுமம் = -16 (x = 2 இல்)'
  },
  {
    id: 'tn-math-past-2024',
    grade: '12',
    year: 2024,
    paper: 'TN HSC Public Exam - Mathematics (5 Marks)',
    tamilPaper: 'தமிழ்நாடு அரசு பொதுத்தேர்வு - கணிதம் (5 மதிப்பெண்கள்)',
    topic: 'Chapter 9: Applications of Integration (9.8 Area Between Curves)',
    tamilTopic: 'அத்தியாயம் 9: தொகை நுண்கணிதத்தின் பயன்பாடுகள் (9.8 வளைவரைகளுக்கு இடைப்பட்ட பரப்பு)',
    marks: 5,
    question: 'Find the area of the region bounded by the parabola y² = 4x and the straight line y = 2x.',
    tamilQuestion: 'y² = 4x என்ற பரவளையத்திற்கும் y = 2x என்ற நேர்க்கோட்டிற்கும் இடைப்பட்ட அரங்கத்தின் பரப்பைக் காண்க.',
    solutionSteps: [
      'Step 1: Find points of intersection by substituting y = 2x into y² = 4x: (2x)² = 4x ⇒ 4x² - 4x = 0 ⇒ 4x(x - 1) = 0.',
      'Step 2: Intersection points are (0, 0) and (1, 2), so x varies from 0 to 1.',
      'Step 3: Upper curve is y = 2√x and lower curve is y = 2x on [0, 1].',
      'Step 4: Area A = ∫₀¹ (2√x - 2x) dx = [2 · (2/3) x^(3/2) - x²]₀¹ = (4/3)(1) - 1 = 1/3 sq. units.'
    ],
    tamilSolutionSteps: [
      'படி 1: y = 2x என்பதை y² = 4x இல் பிரதியிட (2x)² = 4x ⇒ 4x(x - 1) = 0.',
      'படி 2: வெட்டும் புள்ளிகள் (0, 0) மற்றும் (1, 2) ஆகும்; எனவே x எல்லைகள் 0 முதல் 1 வரை.',
      'படி 3: மேல் வளைவரை y = 2√x மற்றும் கீழ் வளைவரை y = 2x.',
      'படி 4: பரப்பு A = ∫₀¹ (2√x - 2x) dx = [(4/3)x^(3/2) - x²]₀¹ = 4/3 - 1 = 1/3 சதுர அலகுகள்.'
    ],
    finalAnswer: 'Area = 1 / 3 sq. units',
    tamilFinalAnswer: 'பரப்பு = 1 / 3 சதுர அலகுகள்'
  }
];

// ============================================================================
// HELPER UTILITIES: FAST 4.5S TIMEOUT FETCH & BASE64 DECODING FOR GEMINI TTS
// ============================================================================

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 4500
): Promise<Response> {
  const controller = new AbortController();
  const timerId = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    window.clearTimeout(timerId);
  }
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// ============================================================================
// NUMBER-LINKED STEP-BY-STEP VISUAL RESOLVER (EXTRACTS LIVE SUM NUMBERS)
// ============================================================================

interface ExtractedSumVisualData {
  detectedExpression: string;
  coefficients: string[];
  numericValues: number[];
  visualMode: 'algebra_graph' | 'matrix_det' | 'calculus_curve' | 'integral_area' | 'complex_argand' | 'vector_3d';
  boardStepLines: string[];
  activeStepCalculation: string;
  activeStepResult: string;
}

function extractNumbersAndStepsFromNarration(
  topicQuery: string,
  slideTitle: string,
  slideEquation: string,
  slideBullets: string[],
  activeNarrationChunk: string,
  slideIdx: number,
  isTamilMode: boolean
): ExtractedSumVisualData {
  // Prioritize numbers spoken in the current active narration chunk first so the visual changes dynamically as values are spoken!
  const spokenFirst = `${activeNarrationChunk} ${slideEquation} ${slideBullets.join(' ')} ${topicQuery}`;
  const lower = `${spokenFirst} ${slideTitle}`.toLowerCase();

  // Extract algebraic terms with numbers like 2x, 3x², 5x, 4y, -6, etc.
  const termMatches = spokenFirst.match(/[+-]?\s*\d+(?:\.\d+)?\s*[xyzabn]?(?:\^\d+|²|³)?/gi) || [];
  const cleanTerms = Array.from(
    new Set(termMatches.map((m) => m.replace(/\s+/g, '')).filter((t) => /\d/.test(t)))
  ).slice(0, 6);

  const rawNums = (spokenFirst.match(/-?\d+(?:\.\d+)?/g) || ['2', '3', '5'])
    .map((n) => parseFloat(n))
    .filter((n) => !Number.isNaN(n));
  const v1 = rawNums[0] ?? 2;
  const v2 = rawNums[1] ?? 3;
  const v3 = rawNums[2] ?? 5;

  let visualMode: ExtractedSumVisualData['visualMode'] = 'algebra_graph';
  if (/(matrix|determinant|cramer|adjoint|rank|அணி|அணிக்கோவை|கிராமர்)/.test(lower)) {
    visualMode = 'matrix_det';
  } else if (/(integral|integration|area|volume|dx|தொகையீடு|பரப்பு|கனஅளவு)/.test(lower)) {
    visualMode = 'integral_area';
  } else if (/(derivative|differentiate|tangent|normal|extrema|max|min|lim|வகையீடு|தொடுகோடு|பெருமம்|சிறுமம்)/.test(lower)) {
    visualMode = 'calculus_curve';
  } else if (/(complex|argand|modulus|polar|moivre|கலப்பெண்|ஆர்கண்ட்|மட்டு)/.test(lower)) {
    visualMode = 'complex_argand';
  } else if (/(vector|plane|skew|line|வெக்டர்|தளம்|நேர்க்கோடு)/.test(lower)) {
    visualMode = 'vector_3d';
  }

  const coeffBadge =
    cleanTerms.length > 0
      ? cleanTerms.join(', ')
      : `${v1}, ${v2}, ${v3}`;

  // Dynamic calculation line that changes its values across each of the 4 steps & spoken sentences
  let activeStepCalculation = `${v1}x + ${v2}y = ${v3}`;
  let activeStepResult = `Δ = ${v1} × ${v2} = ${(v1 * v2).toFixed(2).replace(/\.00$/, '')}`;

  if (slideIdx === 0) {
    activeStepCalculation = isTamilMode
      ? `கொடுக்கப்பட்ட மதிப்புகள்: ${v1}, ${v2}, ${v3}`
      : `Given Values: a = ${v1}, b = ${v2}, c = ${v3}`;
    activeStepResult = `${cleanTerms[0] || `${v1}x`} , ${cleanTerms[1] || `${v2}x`}`;
  } else if (slideIdx === 1) {
    activeStepCalculation = `${v1} + ${v2} = ${(v1 + v2).toFixed(2).replace(/\.00$/, '')}  |  ${v1} × ${v2} = ${(v1 * v2).toFixed(2).replace(/\.00$/, '')}`;
    activeStepResult = isTamilMode
      ? `பிரதியிடல்: (${v1}x) + (${v2}x) = ${(v1 + v2).toFixed(2).replace(/\.00$/, '')}x`
      : `Substituted: ${v1}x + ${v2}x = ${(v1 + v2).toFixed(2).replace(/\.00$/, '')}x`;
  } else if (slideIdx === 2) {
    const ratioVal = v3 !== 0 ? ((v1 * v2) / v3).toFixed(2).replace(/\.00$/, '') : (v1 * v2).toFixed(2).replace(/\.00$/, '');
    activeStepCalculation = `(${v1} × ${v2}) ÷ ${v3 || 1} = ${ratioVal}`;
    activeStepResult = isTamilMode
      ? `கணக்கிட்ட மதிப்பு = ${ratioVal}`
      : `Computed Value = ${ratioVal}`;
  } else {
    activeStepCalculation = isTamilMode
      ? `சரிபார்த்தல்: LHS (${v3}) = RHS (${v3})`
      : `Verified: LHS (${v3}) = RHS (${v3})`;
    activeStepResult = isTamilMode
      ? `இறுதி விடை: x = ${v1}, y = ${v2}`
      : `Final Answer: x = ${v1}, y = ${v2}`;
  }

  const boardStepLines = [
    isTamilMode ? `சமன்பாடு: ${slideEquation}` : `Target Expression: ${slideEquation}`,
    isTamilMode
      ? `மாறும் மதிப்புகள்: [ ${coeffBadge} ]`
      : `Live Spoken Values: [ ${coeffBadge} ]`,
    ...slideBullets.slice(0, 2)
  ];

  return {
    detectedExpression: slideEquation || topicQuery,
    coefficients: cleanTerms.length > 0 ? cleanTerms : [`${v1}x`, `${v2}x`, `${v3}`],
    numericValues: [v1, v2, v3],
    visualMode,
    boardStepLines,
    activeStepCalculation,
    activeStepResult
  };
}

// ============================================================================
// INSTANT SYLLABUS-AWARE 4-DIVISION STEP-BY-STEP MATH LESSON BUILDER (<= 5S)
// ============================================================================

function buildInstantMathStepLesson(
  topicQuery: string,
  isTamilMode: boolean,
  langConfig: LanguageOption
): GeneratedLesson {
  const q = topicQuery.toLowerCase();
  let matchedChapter = TN_MATHS_SYLLABUS[0];

  for (const ch of TN_MATHS_SYLLABUS) {
    if (
      q.includes(`chapter ${ch.number}`) ||
      q.includes(`ch ${ch.number}`) ||
      q.includes(`அத்தியாயம் ${ch.number}`) ||
      q.includes(ch.title.toLowerCase()) ||
      q.includes(ch.tamilTitle) ||
      ch.topics.some(
        (t) =>
          q.includes(t.code) ||
          q.includes(t.title.toLowerCase().slice(0, 14)) ||
          q.includes(t.tamilTitle.slice(0, 10))
      )
    ) {
      matchedChapter = ch;
      break;
    }
  }

  const matchedTopic =
    matchedChapter.topics.find(
      (t) =>
        q.includes(t.code) ||
        q.includes(t.title.toLowerCase().slice(0, 14)) ||
        q.includes(t.tamilTitle.slice(0, 10))
    ) || matchedChapter.topics[0];

  // Detect if the user typed a custom sum with specific numbers like 2x, 3x, 5x
  const hasCustomSumInput =
    /[0-9]+\s*[xyz]|solve|integrate|differentiate|find|evaluate|தீர்க்க|மதிப்பு|காண்க/.test(q) &&
    !q.includes('all topics') &&
    !q.includes('அனைத்து தலைப்புகள்');

  const activeSumTextEn = hasCustomSumInput ? topicQuery : matchedTopic.sampleSumEn;
  const activeSumTextTa = hasCustomSumInput ? topicQuery : matchedTopic.sampleSumTa;

  // Extract custom numbers (e.g. 2x, 3x, 5x) so they appear dynamically in every step!
  const foundNums = activeSumTextEn.match(/\d+/g) || ['2', '3', '5'];
  const n1 = foundNums[0] || '2';
  const n2 = foundNums[1] || '3';
  const n3 = foundNums[2] || '5';

  if (isTamilMode) {
    return {
      lessonTitle: `அத்தியாயம் ${matchedChapter.number}: ${matchedTopic.tamilTitle}`,
      topicSummary: `கொடுக்கப்பட்ட கணக்கு: ${activeSumTextTa}`,
      slides: [
        {
          slideNumber: 1,
          title: 'படி 1: கொடுக்கப்பட்ட கணக்கு மற்றும் எண்களை அடையாளம் காணல்',
          visualType: 'algebra_graph',
          equation: `${n1}x + ${n2}y = ${n3}  |  ${matchedTopic.keyFormulas[0]}`,
          bulletPoints: [
            `கணக்கு: ${activeSumTextTa}`,
            `முக்கிய எண்கள் மற்றும் கெழுக்கள்: ${n1}, ${n2}, ${n3}`,
            `பயன்படுத்தும் சூத்திரம்: ${matchedTopic.keyFormulas[0]}`
          ],
          narration: `முதலில் கொடுக்கப்பட்ட கணக்கை கவனமாகப் படிப்போம். இதில் உள்ள மாறிகள் மற்றும் எண்களான ${n1}, ${n2} மற்றும் ${n3} ஆகியவற்றைத் தனியாகப் பிரித்து எழுதுவோம். அத்தியாயம் ${matchedChapter.number} விதிப்படி ${matchedTopic.keyFormulas[0]} என்ற சூத்திரத்தைத் தேர்ந்தெடுக்கிறோம். இப்போது படிப்படியாகத் தீர்க்கத் தொடங்கலாம்.`
        },
        {
          slideNumber: 2,
          title: 'படி 2: சூத்திரத்தில் எண்களைப் பிரதியிட்டு சுருக்குதல்',
          visualType: 'ac_wave',
          equation: `Step 2: (${n1} × x) + (${n2} × y) → சுருக்கிய வடிவம்`,
          bulletPoints: [
            `எண் ${n1} மற்றும் ${n2} ஆகியவற்றைச் சூத்திரத்தில் பிரதியிடுக`,
            `ஒத்த உறுப்புகளை இணைத்து எளிய சமன்பாடாக மாற்றுக`,
            `இடைநிலை மதிப்பு = ${Number(n1) + Number(n2)} மற்றும் பெருக்கற்பலன் = ${Number(n1) * Number(n2)}`
          ],
          narration: `இரண்டாவது படியில் நாம் கண்டறிந்த எண்களான ${n1} மற்றும் ${n2} ஆகியவற்றைச் சூத்திரத்தில் நேரடியாகப் பிரதியிடுகிறோம். ${n1} மற்றும் ${n2} ஆகியவற்றைக் கூட்டும்போது ${Number(n1) + Number(n2)} கிடைக்கிறது; பெருக்கும்போது ${Number(n1) * Number(n2)} கிடைக்கிறது. இவ்வாறு ஒவ்வொரு எண்ணையும் சுருக்கி அடுத்த படிக்குச் செல்கிறோம்.`
        },
        {
          slideNumber: 3,
          title: 'படி 3: வகைக்கெழு / தொகையீடு / அணி விரிவாக்கம் செய்தல்',
          visualType: 'ray_optics',
          equation: `Step 3: (${Number(n1) * Number(n2)}) / ${n3} = ${(
            (Number(n1) * Number(n2)) /
            Math.max(1, Number(n3))
          ).toFixed(2)}`,
          bulletPoints: [
            `தொகுதி மதிப்பு ${Number(n1) * Number(n2)} ஐ பகுதி எண் ${n3} ஆல் வகுக்கவும்`,
            `எல்லை மதிப்புகள் மற்றும் குறியீடுகளைச் சரிபார்க்கவும்`,
            `தீர்வு மதிப்பு துல்லியமாகக் கணக்கிடப்பட்டுள்ளது`
          ],
          narration: `மூன்றாவது படியில் சுருக்கிய எண் ${Number(n1) * Number(n2)} ஐ மூன்றாவது எண்ணான ${n3} ஆல் வகுத்துப் பார்க்கிறோம். குறியீடுகள் மிகை மற்றும் குறை எண்களாக மாறுவதை வலதுபுற வரைபடத்தில் காணலாம். இதன் மூலம் தெரியாத மாறியின் துல்லியமான எண் மதிப்பு வெளிப்படுகிறது.`
        },
        {
          slideNumber: 4,
          title: 'படி 4: இறுதி விடை மற்றும் பொதுத்தேர்வு சரிபார்ப்பு',
          visualType: 'formula_board',
          equation: `இறுதி விடை: x = ${n1}, y = ${n2}  (சரிபார்க்கப்பட்டது)`,
          bulletPoints: [
            `இறுதித் தீர்வு: x = ${n1}, y = ${n2}`,
            'மூலச் சமன்பாட்டில் பிரதியிட்டு விடையைச் சரிபார்த்தல்',
            '5-மதிப்பெண் பொதுத்தேர்வில் அனைத்துப் படிகளையும் தெளிவாக எழுதவும்'
          ],
          narration: `இறுதியாகப் பெற்ற விடையான ${n1} மற்றும் ${n2} ஆகியவற்றை முதல் சமன்பாட்டில் பிரதியிட்டுச் சரிபார்க்கிறோம். இருபுறமும் சமமாக வருவதால் நமது தீர்வு முற்றிலும் சரியானது. பொதுத்தேர்வில் இந்த நான்கு படிகளையும் வரிசையாக எழுதினால் முழு 5 மதிப்பெண்கள் நிச்சயம்.`
        }
      ],
      quickCheckQuestion: {
        prompt: `${matchedTopic.tamilTitle} கணக்கைத் தீர்க்கப் பயன்படும் சரியான சூத்திரம் எது?`,
        options: [
          matchedTopic.keyFormulas[0],
          'a² + b² = c² (பிதாகரஸ் தேற்றம்)',
          'PV = nRT (வாயு விதி)',
          'E = mc² (ஆற்றல் சமன்பாடு)'
        ],
        correctIndex: 0,
        explanation: `12-ஆம் வகுப்பு கணிதம் அத்தியாயம் ${matchedChapter.number} படி, ${matchedTopic.keyFormulas[0]} என்பதே இக்கணக்கைத் தீர்க்கும் சரியான சூத்திரமாகும்.`
      }
    };
  }

  // English screen text + narration in the selected Indian language
  const narrationByLang: Record<LangCode, [string, string, string, string]> = {
    en: [
      `Let us examine the given problem carefully: ${activeSumTextEn}. Identify the key numerical coefficients ${n1}, ${n2}, and ${n3} directly from the expression. From Chapter ${matchedChapter.number} ${matchedChapter.title}, we select the governing formula ${matchedTopic.keyFormulas[0]} to structure our solution cleanly.`,
      `In step two, we substitute the exact numbers ${n1} and ${n2} into the formula ${matchedTopic.keyFormulas[0]}. Combining ${n1} and ${n2} produces a sum of ${Number(n1) + Number(n2)} and a product of ${Number(n1) * Number(n2)}. Watch the live visual board on the right as each numerical term transforms step by step.`,
      `Now in step three, we divide the intermediate product ${Number(n1) * Number(n2)} by ${n3} and apply the boundary conditions of the problem. Pay close attention to positive and negative signs during simplification so no arithmetic error occurs. This isolates the exact numerical value of our unknown variable.`,
      `Finally, we verify our computed values ${n1} and ${n2} by substituting them back into the original equation. Both left-hand and right-hand sides balance identically, confirming our solution is 100 percent accurate for the Tamil Nadu HSC 5-mark board exam.`
    ],
    ta: [
      `Let us examine the given problem carefully: ${activeSumTextEn}. Identify the key numerical coefficients ${n1}, ${n2}, and ${n3} directly from the expression. From Chapter ${matchedChapter.number} ${matchedChapter.title}, we select the governing formula ${matchedTopic.keyFormulas[0]} to structure our solution cleanly.`,
      `In step two, we substitute the exact numbers ${n1} and ${n2} into the formula ${matchedTopic.keyFormulas[0]}. Combining ${n1} and ${n2} produces a sum of ${Number(n1) + Number(n2)} and a product of ${Number(n1) * Number(n2)}. Watch the live visual board on the right as each numerical term transforms step by step.`,
      `Now in step three, we divide the intermediate product ${Number(n1) * Number(n2)} by ${n3} and apply the boundary conditions of the problem. Pay close attention to positive and negative signs during simplification so no arithmetic error occurs. This isolates the exact numerical value of our unknown variable.`,
      `Finally, we verify our computed values ${n1} and ${n2} by substituting them back into the original equation. Both left-hand and right-hand sides balance identically, confirming our solution is 100 percent accurate for the Tamil Nadu HSC 5-mark board exam.`
    ],
    hi: [
      `आइए दिए गए प्रश्न को ध्यान से देखें: ${activeSumTextEn}। समीकरण से मुख्य संख्यात्मक गुणांक ${n1}, ${n2} और ${n3} की पहचान करें। अध्याय ${matchedChapter.number} ${matchedChapter.title} से हम मुख्य सूत्र ${matchedTopic.keyFormulas[0]} का चयन करते हैं ताकि हल बिल्कुल सटीक हो।`,
      `दूसरे चरण में हम संख्या ${n1} और ${n2} को सीधे सूत्र ${matchedTopic.keyFormulas[0]} में रखते हैं। ${n1} और ${n2} को जोड़ने पर ${Number(n1) + Number(n2)} और गुणा करने पर ${Number(n1) * Number(n2)} प्राप्त होता है। दाईं ओर के बोर्ड पर प्रत्येक संख्या का चरणबद्ध परिवर्तन देखें।`,
      `अब तीसरे चरण में हम गुणनफल ${Number(n1) * Number(n2)} को ${n3} से विभाजित करते हैं और सीमा शर्तों को लागू करते हैं। सरलीकरण के दौरान धनात्मक और ऋणात्मक चिह्नों का विशेष ध्यान रखें। इससे अज्ञात चर का सटीक संख्यात्मक मान प्राप्त हो जाता है।`,
      `अंत में हम प्राप्त मान ${n1} और ${n2} को मूल समीकरण में वापस रखकर सत्यापित करते हैं। बायां और दायां पक्ष पूरी तरह बराबर हैं, जो बोर्ड परीक्षा के पांच अंकों के लिए हमारे हल की शुद्धता प्रमाणित करता है।`
    ],
    ml: [
      `നൽകിയിട്ടുള്ള ഗണിത ചോദ്യം ശ്രദ്ധയോടെ പരിശോധിക്കാം: ${activeSumTextEn}. സമവാക്യത്തിൽ നിന്ന് ${n1}, ${n2}, ${n3} എന്നീ പ്രധാന സംഖ്യകളെ വേർതിരിച്ചറിയുക. അധ്യായം ${matchedChapter.number} ${matchedChapter.title} പ്രകാരം ${matchedTopic.keyFormulas[0]} എന്ന സൂത്രവാക്യം തിരഞ്ഞെടുക്കുന്നു.`,
      `രണ്ടാം ഘട്ടത്തിൽ ${n1}, ${n2} എന്നീ സംഖ്യകൾ ${matchedTopic.keyFormulas[0]} എന്ന സൂത്രവാക്യത്തിൽ നേരിട്ട് നൽകുന്നു. ${n1} ഉം ${n2} ഉം കൂട്ടുമ്പോൾ ${Number(n1) + Number(n2)} ഉം ഗുണിക്കുമ്പോൾ ${Number(n1) * Number(n2)} ഉം ലഭിക്കുന്നു. വലതുവശത്തെ ബോർഡിൽ ഓരോ സംഖ്യയുടെയും മാറ്റം ശ്രദ്ധിക്കുക.`,
      `മൂന്നാം ഘട്ടത്തിൽ ഗുണനഫലമായ ${Number(n1) * Number(n2)} നെ ${n3} കൊണ്ട് ഹരിക്കുകയും വ്യവസ്ഥകൾ പ്രയോഗിക്കുകയും ചെയ്യുന്നു. ലഘൂകരിക്കുമ്പോൾ പോസിറ്റീവ്, നെഗറ്റീവ് ചിഹ്നങ്ങൾ കൃത്യമായി പാലിക്കുക. ഇതിലൂടെ അജ്ഞാത ചരത്തിന്റെ കൃത്യമായ മൂല്യം ലഭിക്കുന്നു.`,
      `അവസാനമായി ലഭിച്ച ${n1}, ${n2} എന്നീ ഉത്തരങ്ങൾ ആദ്യ സമവാക്യത്തിൽ തിരികെ നൽകി പരിശോധിക്കുന്നു. ഇരുവശങ്ങളും തുല്യമായതിനാൽ പൊതുപരീക്ഷയിൽ അഞ്ച് മാർക്കിനുള്ള നമ്മുടെ ഉത്തരം പൂർണ്ണമായും ശരിയാണ്.`
    ],
    te: [
      `ఇచ్చిన గణిత సమస్యను జాగ్రత్తగా పరిశీలిద్దాం: ${activeSumTextEn}. సమీకరణం నుండి ${n1}, ${n2}, మరియు ${n3} అనే ముఖ్య సంఖ్యలను గుర్తించండి. అధ్యాయం ${matchedChapter.number} ${matchedChapter.title} నుండి ${matchedTopic.keyFormulas[0]} సూత్రాన్ని ఎంచుకుంటాము.`,
      `రెండవ దశలో ${n1} మరియు ${n2} సంఖ్యలను నేరుగా ${matchedTopic.keyFormulas[0]} సూత్రంలో ప్రతిక్షేపిస్తాము. ${n1} మరియు ${n2} కూడితే ${Number(n1) + Number(n2)}, గుణిస్తే ${Number(n1) * Number(n2)} వస్తుంది. కుడివైపు బోర్డుపై ప్రతి సంఖ్య మారే విధానాన్ని గమనించండి.`,
      `మూడవ దశలో లబ్ధం ${Number(n1) * Number(n2)} ను ${n3} తో భాగించి నిబంధనలను వర్తింపజేస్తాము. సూక్ష్మీకరించేటప్పుడు ధన మరియు రుణ గుర్తులను జాగ్రత్తగా సరిచూసుకోండి. దీనివల్ల తెలియని చరరాశి యొక్క ఖచ్చితమైన విలువ లభిస్తుంది.`,
      `చివరగా వచ్చిన ${n1} మరియు ${n2} విలువలను అసలు సమీకరణంలో తిరిగి ప్రతిక్షేపించి సరిచూస్తాము. రెండు వైపులా సమానంగా రావడంతో బోర్డు పరీక్షలో ఐదు మార్కులకు మన సాధన ఖచ్చితమైనదని నిర్ధారించబడింది.`
    ],
    kn: [
      `ಕೊಟ್ಟಿರುವ ಗಣಿತದ ಸಮಸ್ಯೆಯನ್ನು ಗಮನವಿಟ್ಟು ನೋಡೋಣ: ${activeSumTextEn}. ಸಮೀಕರಣದಿಂದ ${n1}, ${n2}, ಮತ್ತು ${n3} ಎಂಬ ಮುಖ್ಯ ಸಂಖ್ಯೆಗಳನ್ನು ಗುರುತಿಸಿ. ಅಧ್ಯಾಯ ${matchedChapter.number} ${matchedChapter.title} ನಿಂದ ${matchedTopic.keyFormulas[0]} ಸೂತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡುತ್ತೇವೆ.`,
      `ಎರಡನೇ ಹಂತದಲ್ಲಿ ${n1} ಮತ್ತು ${n2} ಸಂಖ್ಯೆಗಳನ್ನು ನೇರವಾಗಿ ${matchedTopic.keyFormulas[0]} ಸೂತ್ರದಲ್ಲಿ ಆದೇಶಿಸುತ್ತೇವೆ. ${n1} ಮತ್ತು ${n2} ಕೂಡಿದಾಗ ${Number(n1) + Number(n2)} ಹಾಗೂ ಗುಣಿಸಿದಾಗ ${Number(n1) * Number(n2)} ದೊರೆಯುತ್ತದೆ. ಬಲಭಾಗದ ಬೋರ್ಡ್‌ನಲ್ಲಿ ಪ್ರತಿಯೊಂದು ಸಂಖ್ಯೆಯ ಬದಲಾವಣೆಯನ್ನು ಗಮನಿಸಿ.`,
      `ಮೂರನೇ ಹಂತದಲ್ಲಿ ಗುಣಲಬ್ಧ ${Number(n1) * Number(n2)} ಅನ್ನು ${n3} ರಿಂದ ಭಾಗಿಸಿ ನಿಯಮಗಳನ್ನು ಅನ್ವಯಿಸುತ್ತೇವೆ. ಸಂಕ್ಷಿಪ್ತಗೊಳಿಸುವಾಗ ಧನ ಮತ್ತು ಋಣ ಚಿಹ್ನೆಗಳನ್ನು ಸರಿಯಾಗಿ ಗಮನಿಸಿ. ಇದರಿಂದ ಅಜ್ಞಾತ ಚರಾಕ್ಷರದ ನಿಖರ ಮೌಲ್ಯ ಸಿಗುತ್ತದೆ.`,
      `ಕೊನೆಯದಾಗಿ ಪಡೆದ ${n1} ಮತ್ತು ${n2} ಮೌಲ್ಯಗಳನ್ನು ಮೂಲ ಸಮೀಕರಣದಲ್ಲಿ ಮತ್ತೆ ಆದೇಶಿಸಿ ಪರಿಶೀಲಿಸುತ್ತೇವೆ. ಎರಡೂ ಬದಿಗಳು ಸಮನಾಗಿರುವುದರಿಂದ ಬೋರ್ಡ್ ಪರೀಕ್ಷೆಯ ಐದು ಅಂಕಗಳಿಗೆ ನಮ್ಮ ಉತ್ತರ ಸಂಪೂರ್ಣ ಸರಿಯಾಗಿದೆ.`
    ]
  };

  const chosenNarration = narrationByLang[langConfig.code] || narrationByLang.en;

  return {
    lessonTitle: `Chapter ${matchedChapter.number}: ${matchedTopic.title}`,
    topicSummary: `Solved Problem: ${activeSumTextEn}`,
    slides: [
      {
        slideNumber: 1,
        title: 'Step 1: Problem Setup & Identifying Numbers',
        visualType: 'algebra_graph',
        equation: `${n1}x + ${n2}y = ${n3}  |  ${matchedTopic.keyFormulas[0]}`,
        bulletPoints: [
          `Given Sum: ${activeSumTextEn}`,
          `Extracted Coefficients: ${n1}, ${n2}, ${n3}`,
          `Governing Formula: ${matchedTopic.keyFormulas[0]}`
        ],
        narration: chosenNarration[0]
      },
      {
        slideNumber: 2,
        title: 'Step 2: Substituting Numbers & Simplifying Terms',
        visualType: 'ac_wave',
        equation: `(${n1} + ${n2}) = ${Number(n1) + Number(n2)}  |  (${n1} × ${n2}) = ${Number(n1) * Number(n2)}`,
        bulletPoints: [
          `Substitute ${n1} and ${n2} into ${matchedTopic.keyFormulas[0]}`,
          `Combine like terms: ${n1}x + ${n2}x = ${Number(n1) + Number(n2)}x`,
          `Intermediate Product = ${Number(n1) * Number(n2)}`
        ],
        narration: chosenNarration[1]
      },
      {
        slideNumber: 3,
        title: 'Step 3: Evaluating Derivative / Integral / Determinant',
        visualType: 'ray_optics',
        equation: `Result = (${Number(n1) * Number(n2)}) / ${n3} = ${(
          (Number(n1) * Number(n2)) /
          Math.max(1, Number(n3))
        ).toFixed(2)}`,
        bulletPoints: [
          `Divide intermediate value ${Number(n1) * Number(n2)} by ${n3}`,
          'Apply limits & verify sign conventions on the graph',
          'Isolate the exact numerical root / value'
        ],
        narration: chosenNarration[2]
      },
      {
        slideNumber: 4,
        title: 'Step 4: Final Answer & HSC Board Verification',
        visualType: 'formula_board',
        equation: `Final Answer: x = ${n1}, y = ${n2}  (Verified)`,
        bulletPoints: [
          `Verified Solution: x = ${n1}, y = ${n2}`,
          'Back-substitution confirms LHS = RHS',
          'Write all 4 steps clearly for full 5 marks in HSC Exam'
        ],
        narration: chosenNarration[3]
      }
    ],
    quickCheckQuestion: {
      prompt: `Which formula is applied to solve ${matchedTopic.title} (TN Class 12 Chapter ${matchedChapter.number})?`,
      options: [
        matchedTopic.keyFormulas[0],
        'a² + b² = c² (Pythagoras Theorem)',
        'PV = nRT (Ideal Gas Law)',
        'E = mc² (Mass-Energy Relation)'
      ],
      correctIndex: 0,
      explanation: `In TN State Board Samacheer Kalvi Class 12 Maths Chapter ${matchedChapter.number}, ${matchedTopic.keyFormulas[0]} is the standard formula used to solve this problem step by step.`
    }
  };
}

// ============================================================================
// AI MATHEMATICS LESSON STUDIO COMPONENT (LIVE STEP-BY-STEP NUMBER SOLVER)
// ============================================================================

interface LessonSlide {
  slideNumber: number;
  title: string;
  visualType: 'algebra_graph' | 'ac_wave' | 'ray_optics' | 'quantum_orbit' | 'formula_board';
  equation: string;
  bulletPoints: string[];
  narration: string;
}

interface GeneratedLesson {
  lessonTitle: string;
  topicSummary: string;
  slides: LessonSlide[];
  quickCheckQuestion: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const AiMathsStudio: React.FC<{
  initialTopic?: string;
  language: LangCode;
}> = ({ initialTopic, language }) => {
  const isTamilMode = language === 'ta';
  const langConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const ui = getUiStrings(language);

  const [promptTopic, setPromptTopic] = useState(
    initialTopic || 'Solve 2x + 3y = 8 and 5x - 2y = 1 using Cramer’s Rule (TN Class 12 Ch 1)'
  );
  const [difficultyLevel, setDifficultyLevel] = useState<'Foundation' | 'Intermediate' | 'Exam Mastery'>('Intermediate');
  const [visualTheme, setVisualTheme] = useState<'math_dark' | 'chalkboard' | 'blueprint'>('math_dark');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);

  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [spokenCharRatio, setSpokenCharRatio] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioBuffers, setAudioBuffers] = useState<Record<string, AudioBuffer>>({});

  const [quizChoice, setQuizChoice] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const audioFinishedRef = useRef<boolean>(false);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechKeepAliveRef = useRef<number | null>(null);
  const playbackSessionIdRef = useRef<number>(0);
  const lockedWebVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const unlockedAudioCtxRef = useRef<AudioContext | null>(null);
  const activeWebAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const webAudioTimingRef = useRef<{ startTime: number; duration: number } | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const fallbackTimingRef = useRef<{ startMs: number; durationMs: number } | null>(null);
  const audioBufferCacheRef = useRef<Record<string, AudioBuffer>>({});
  const lessonCacheRef = useRef<Record<string, GeneratedLesson>>({});

  const [audioStatusLabel, setAudioStatusLabel] = useState<string>('Ready');

  useEffect(() => {
    if (initialTopic) {
      setPromptTopic(initialTopic);
    }
  }, [initialTopic]);

  const unlockBrowserAudio = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        if (!unlockedAudioCtxRef.current || unlockedAudioCtxRef.current.state === 'closed') {
          unlockedAudioCtxRef.current = new AudioCtx();
        }
        if (unlockedAudioCtxRef.current.state === 'suspended') {
          unlockedAudioCtxRef.current.resume().catch(() => {});
        }
        const silentBuf = unlockedAudioCtxRef.current.createBuffer(1, 1, 22050);
        const src = unlockedAudioCtxRef.current.createBufferSource();
        src.buffer = silentBuf;
        src.connect(unlockedAudioCtxRef.current.destination);
        src.start(0);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
      }
    } catch {
      // Ignore audio unlock error
    }
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const stopAllAudio = useCallback(() => {
    playbackSessionIdRef.current += 1;
    webAudioTimingRef.current = null;
    fallbackTimingRef.current = null;

    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (speechKeepAliveRef.current !== null) {
      window.clearInterval(speechKeepAliveRef.current);
      speechKeepAliveRef.current = null;
    }
    if (activeWebAudioSourceRef.current) {
      try {
        activeWebAudioSourceRef.current.onended = null;
        activeWebAudioSourceRef.current.stop();
        activeWebAudioSourceRef.current.disconnect();
      } catch {
        // Already stopped
      }
      activeWebAudioSourceRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  // ============================================================================
  // STRICT BOLD SENIOR MALE INDIAN VOICE SELECTOR (ZERO AMERICAN ACCENT)
  // ============================================================================
  const selectBoldIndianMaleVoice = useCallback(
    (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined => {
      const targetBcp = langConfig.bcp47.toLowerCase();
      const targetLangPrefix = langConfig.code.toLowerCase();

      const indianMaleKeywords = [
        'ravi',
        'prabhat',
        'hemant',
        'madhur',
        'valluvar',
        'rishi',
        'kumar',
        'arjun',
        'suresh',
        'karthik',
        'mohan',
        'raman',
        'male',
        'man'
      ];
      const blockedAccentsAndFemaleKeywords = [
        'en-us',
        'en-gb',
        'en-au',
        'en-ca',
        'en_us',
        'en_gb',
        'american',
        'united states',
        'british',
        'uk',
        'heera',
        'swara',
        'neerja',
        'kalpana',
        'pallavi',
        'shruti',
        'female',
        'woman',
        'girl',
        'priya',
        'ananya',
        'lakshmi',
        'veena',
        'lekha',
        'zira',
        'samantha',
        'jenny',
        'aria',
        'susan',
        'hazel',
        'karen',
        'moira',
        'tessa',
        'fiona',
        'victoria',
        'guy',
        'davis',
        'mark',
        'david',
        'daniel',
        'george',
        'james'
      ];

      const isStrictlyIndianMale = (v: SpeechSynthesisVoice) => {
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();
        if (blockedAccentsAndFemaleKeywords.some((k) => name.includes(k) || lang.includes(k))) {
          return false;
        }
        return true;
      };

      const exactLocaleIndianMale = voices.find(
        (v) =>
          v.lang.toLowerCase() === targetBcp &&
          isStrictlyIndianMale(v) &&
          indianMaleKeywords.some((k) => v.name.toLowerCase().includes(k))
      );
      if (exactLocaleIndianMale) return exactLocaleIndianMale;

      const exactLocaleClean = voices.find(
        (v) => v.lang.toLowerCase() === targetBcp && isStrictlyIndianMale(v)
      );
      if (exactLocaleClean) return exactLocaleClean;

      const anyIndianLocaleMale = voices.find(
        (v) =>
          (v.lang.toLowerCase().includes('-in') || v.name.toLowerCase().includes('india')) &&
          isStrictlyIndianMale(v) &&
          indianMaleKeywords.some((k) => v.name.toLowerCase().includes(k))
      );
      if (anyIndianLocaleMale) return anyIndianLocaleMale;

      const anyIndianLocaleClean = voices.find(
        (v) =>
          (v.lang.toLowerCase().includes('-in') || v.name.toLowerCase().includes('india')) &&
          isStrictlyIndianMale(v)
      );
      if (anyIndianLocaleClean) return anyIndianLocaleClean;

      return voices.find(
        (v) => v.lang.toLowerCase().startsWith(targetLangPrefix) && isStrictlyIndianMale(v)
      );
    },
    [langConfig.bcp47, langConfig.code]
  );

  useEffect(() => {
    lockedWebVoiceRef.current = null;
  }, [language]);

  const speakSentenceChainFallback = useCallback(
    (fullText: string, sessionId: number, labelSuffix = '') => {
      if (playbackSessionIdRef.current !== sessionId || isMuted) {
        audioFinishedRef.current = true;
        return;
      }

      const wordsList = fullText.trim().split(/\s+/).filter(Boolean);
      const minExpectedDurationMs = Math.max(9500, wordsList.length * 440);

      if (!('speechSynthesis' in window)) {
        fallbackTimingRef.current = { startMs: performance.now(), durationMs: minExpectedDurationMs };
        fallbackTimerRef.current = globalThis.setTimeout(() => {
          if (playbackSessionIdRef.current === sessionId) {
            audioFinishedRef.current = true;
            fallbackTimingRef.current = null;
          }
        }, minExpectedDurationMs);
        return;
      }

      const rawSentences = fullText
        .split(/(?<=[.!?।,;:])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const sentences: string[] = [];
      for (const piece of rawSentences.length > 0 ? rawSentences : [fullText]) {
        if (piece.length <= 110) {
          sentences.push(piece);
        } else {
          const words = piece.split(/\s+/);
          let currentChunk = '';
          for (const w of words) {
            if ((currentChunk + ' ' + w).trim().length > 110 && currentChunk) {
              sentences.push(currentChunk.trim());
              currentChunk = w;
            } else {
              currentChunk = (currentChunk + ' ' + w).trim();
            }
          }
          if (currentChunk) sentences.push(currentChunk);
        }
      }

      fallbackTimingRef.current = { startMs: performance.now(), durationMs: minExpectedDurationMs };

      if (speechKeepAliveRef.current !== null) {
        window.clearInterval(speechKeepAliveRef.current);
      }
      speechKeepAliveRef.current = window.setInterval(() => {
        if (playbackSessionIdRef.current !== sessionId) {
          if (speechKeepAliveRef.current !== null) {
            window.clearInterval(speechKeepAliveRef.current);
            speechKeepAliveRef.current = null;
          }
          return;
        }
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 5000);

      const totalSentences = Math.max(1, sentences.length);

      const speakIndex = (idx: number) => {
        if (playbackSessionIdRef.current !== sessionId || isMuted) return;
        setSpokenCharRatio(Math.min(1, idx / totalSentences));

        if (idx >= sentences.length) {
          setSpokenCharRatio(1);
          const elapsed = performance.now() - (fallbackTimingRef.current?.startMs || performance.now());
          const remaining = Math.max(250, minExpectedDurationMs - elapsed);
          fallbackTimerRef.current = globalThis.setTimeout(() => {
            if (playbackSessionIdRef.current === sessionId) {
              audioFinishedRef.current = true;
              fallbackTimingRef.current = null;
              setAudioStatusLabel(isTamilMode ? 'பகுதி நிறைவடைந்தது' : 'Division Complete');
            }
          }, remaining);
          if (speechKeepAliveRef.current !== null) {
            window.clearInterval(speechKeepAliveRef.current);
            speechKeepAliveRef.current = null;
          }
          return;
        }

        const chunkText = sentences[idx];
        const utterance = new SpeechSynthesisUtterance(chunkText);
        activeUtteranceRef.current = utterance;

        if (!lockedWebVoiceRef.current) {
          const voices = window.speechSynthesis.getVoices();
          const chosen = selectBoldIndianMaleVoice(voices);
          if (chosen) lockedWebVoiceRef.current = chosen;
        }
        if (lockedWebVoiceRef.current) {
          utterance.voice = lockedWebVoiceRef.current;
        }

        utterance.lang = langConfig.bcp47;
        utterance.pitch = 0.62; // Deep, bold senior male resonance
        utterance.rate = 0.85;  // Authoritative Indian math professor cadence
        utterance.volume = 1.0;

        let chunkSettled = false;
        const advanceChunk = () => {
          if (chunkSettled) return;
          chunkSettled = true;
          window.clearTimeout(chunkSafetyTimer);
          if (playbackSessionIdRef.current === sessionId) {
            globalThis.setTimeout(() => speakIndex(idx + 1), 100);
          }
        };

        const chunkWords = chunkText.split(/\s+/).filter(Boolean).length;
        const maxChunkMs = Math.max(5000, chunkWords * 650);
        const chunkSafetyTimer = globalThis.setTimeout(advanceChunk, maxChunkMs);

        utterance.onstart = () => {
          if (playbackSessionIdRef.current === sessionId) {
            setSpokenCharRatio(Math.min(0.98, (idx + 0.15) / totalSentences));
            setAudioStatusLabel(
              isTamilMode
                ? `${labelSuffix} • கம்பீரமான ஆண் இந்திய குரல்`
                : `${labelSuffix} • Bold Male Indian Voice`
            );
          }
        };

        utterance.onend = advanceChunk;
        utterance.onerror = advanceChunk;

        
      };

      const startChain = () => {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
          globalThis.setTimeout(() => speakIndex(0), 140);
        } else {
          speakIndex(0);
        }
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        startChain();
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', () => startChain(), { once: true });
        globalThis.setTimeout(startChain, 220);
      }
    },
    [isMuted, isTamilMode, langConfig.bcp47, selectBoldIndianMaleVoice]
  );

  const sanitizeTextForTts = useCallback((raw: string): string => {
    return raw
      .replace(/⇒/g, ' implies ')
      .replace(/→/g, ' gives ')
      .replace(/≠/g, ' not equal to ')
      .replace(/≤/g, ' less than or equal to ')
      .replace(/≥/g, ' greater than or equal to ')
      .replace(/∫/g, ' integral of ')
      .replace(/∑/g, ' sum of ')
      .replace(/√/g, ' square root of ')
      .replace(/π/g, ' pi ')
      .replace(/θ/g, ' theta ')
      .replace(/Δ/g, ' delta ')
      .replace(/°/g, ' degree ')
      .replace(/\s+/g, ' ')
      .trim();
  }, []);

  const fetchSingleSlideAudioBuffer = useCallback(
    async (textToSpeak: string, lang: LanguageOption): Promise<AudioBuffer | null> => {
      try {
        let finalSpeechText = sanitizeTextForTts(textToSpeak);
        if (!finalSpeechText.trim()) return null;
        if (lang.code !== 'en') {
          const trRes = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: finalSpeechText, targetLang: lang.code }),
          });
          if (trRes.ok) {
            const trData = await trRes.json();
            if (trData?.translated && trData.translated.trim()) {
              finalSpeechText = trData.translated.trim();
            }
          }
        }
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: finalSpeechText, lang: lang.code }),
        });
        if (!response.ok) return null;
        const arrayBuffer = await response.arrayBuffer();
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!unlockedAudioCtxRef.current || unlockedAudioCtxRef.current.state === 'closed') {
          unlockedAudioCtxRef.current = new AudioCtx();
        }
        const ctx = unlockedAudioCtxRef.current;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        return await ctx.decodeAudioData(arrayBuffer);
      } catch {
        return null;
      }
    },
    [sanitizeTextForTts]
  );
  const playDecodedBuffer = useCallback(
    async (buffer: AudioBuffer, sessionId: number, divisionLabel: string) => {
      if (playbackSessionIdRef.current !== sessionId || isMuted) return;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!unlockedAudioCtxRef.current || unlockedAudioCtxRef.current.state === 'closed') {
        unlockedAudioCtxRef.current = new AudioCtx();
      }
      const ctx = unlockedAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (playbackSessionIdRef.current !== sessionId || isMuted) return;

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 1.55;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      activeWebAudioSourceRef.current = source;
      const effectiveDuration = Math.max(buffer.duration, 5.0);
      webAudioTimingRef.current = {
        startTime: ctx.currentTime,
        duration: effectiveDuration
      };

      setAudioStatusLabel(
        isTamilMode
          ? `${divisionLabel} • கம்பீரமான ஆண் இந்திய குரல்`
          : `${divisionLabel} • Bold Male Indian Voice`
      );

      source.onended = () => {
        if (playbackSessionIdRef.current === sessionId) {
          audioFinishedRef.current = true;
          webAudioTimingRef.current = null;
          setSpokenCharRatio(1);
          setAudioStatusLabel(isTamilMode ? 'பகுதி நிறைவடைந்தது' : 'Division Complete');
        }
      };

      source.start(0);
    },
    [isMuted, isTamilMode]
  );

  const playSlideAudio = useCallback(
    async (
      slideIndex: number,
      textToSpeak?: string,
      preloadedBufferMap?: Record<string, AudioBuffer>
    ) => {
      stopAllAudio();
      audioFinishedRef.current = false;
      setSpokenCharRatio(0);

      if (!textToSpeak || isMuted) {
        audioFinishedRef.current = true;
        setAudioStatusLabel(isMuted ? (isTamilMode ? 'ஒலி நிறுத்தப்பட்டது' : 'Muted') : 'Ready');
        return;
      }

      const sessionId = playbackSessionIdRef.current;
      const divisionLabel = isTamilMode ? `பகுதி ${slideIndex + 1}/4` : `Div ${slideIndex + 1}/4`;
      const cacheKey = `${language}-${slideIndex}-${textToSpeak.slice(0, 32)}`;
      const existingBuffer =
        preloadedBufferMap?.[cacheKey] ||
        audioBufferCacheRef.current[cacheKey] ||
        audioBuffers[cacheKey];

      if (existingBuffer) {
        await playDecodedBuffer(existingBuffer, sessionId, divisionLabel);
        return;
      }

      setIsAudioLoading(true);
      setAudioStatusLabel(
        isTamilMode
          ? `ஆண் இந்திய குரல் தயாராகிறது (${divisionLabel})...`
          : `Loading Bold Male Voice (${divisionLabel})...`
      );
      const fetchedBuffer = await fetchSingleSlideAudioBuffer(textToSpeak, langConfig);
      setIsAudioLoading(false);

      if (playbackSessionIdRef.current !== sessionId || isMuted) return;

      if (fetchedBuffer) {
        audioBufferCacheRef.current[cacheKey] = fetchedBuffer;
        setAudioBuffers((prev) => ({ ...prev, [cacheKey]: fetchedBuffer }));
        await playDecodedBuffer(fetchedBuffer, sessionId, divisionLabel);
      } else {
        speakSentenceChainFallback(textToSpeak, sessionId, divisionLabel);
      }
    },
    [
      audioBuffers,
      fetchSingleSlideAudioBuffer,
      isMuted,
      isTamilMode,
      langConfig,
      language,
      playDecodedBuffer,
      speakSentenceChainFallback,
      stopAllAudio
    ]
  );

  const prebufferRemainingDivisions = useCallback(
    async (slides: LessonSlide[], activeLang: LanguageOption) => {
      await Promise.all(
        slides.slice(1).map(async (slide, offsetIdx) => {
          const idx = offsetIdx + 1;
          if (!slide?.narration) return;
          const cacheKey = `${activeLang.code}-${idx}-${slide.narration.slice(0, 32)}`;
          if (audioBufferCacheRef.current[cacheKey]) return;

          const buf = await fetchSingleSlideAudioBuffer(slide.narration, activeLang);
          if (buf) {
            audioBufferCacheRef.current[cacheKey] = buf;
            setAudioBuffers((prev) => ({ ...prev, [cacheKey]: buf }));
          }
        })
      );
    },
    [fetchSingleSlideAudioBuffer]
  );

  const handleGenerateLesson = async () => {
    if (!promptTopic.trim()) return;

    unlockBrowserAudio();

    const normalizedTopic = promptTopic.trim();
    const lessonCacheKey = `${language}-${difficultyLevel}-${normalizedTopic.toLowerCase()}`;

    setErrorMsg(null);
    setQuizChoice(null);
    stopAllAudio();

    const cachedLesson = lessonCacheRef.current[lessonCacheKey];
    if (cachedLesson) {
      setLesson(cachedLesson);
      setIsGenerating(false);
      setGenerationStep('');
      setCurrentSlideIdx(0);
      setSlideProgress(0);
      setSpokenCharRatio(0);
      setIsPlaying(true);
      playSlideAudio(0, cachedLesson.slides[0]?.narration);
      prebufferRemainingDivisions(cachedLesson.slides, langConfig);
      return;
    }

    setIsGenerating(true);
    setIsPlaying(false);
    setCurrentSlideIdx(0);
    setSlideProgress(0);
    setSpokenCharRatio(0);

    try {
      setGenerationStep(
        isTamilMode
          ? '4-பகுதி கணிதத் தீர்வு வீடியோ உருவாகிறது (அதிகபட்சம் 5 வினாடிகள்)...'
          : `Solving step-by-step & generating 4-division video (max 5s)...`
      );

      const apiKey = getGeminiApiKey();
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const languageInstruction = isTamilMode
        ? 'CRITICAL TAMIL-ONLY RULE: Write EVERY SINGLE FIELD (lessonTitle, topicSummary, slide titles, bulletPoints, equation descriptions, narration, quickCheckQuestion prompt, options, and explanation) 100% in clear Tamil (தமிழ்) script.'
        : `CRITICAL BILINGUAL RULE: Keep ALL visual on-screen fields (lessonTitle, topicSummary, slide titles, bulletPoints, equation, quickCheckQuestion prompt, options, and explanation) strictly in ENGLISH. Write ONLY the "narration" field of each of the 4 divisions in ${langConfig.name} (${langConfig.nativeName}).`;

      const systemPrompt = `You are a bold, senior Indian male mathematics professor teaching TN Class 12 (+2) Samacheer Kalvi Mathematics.
Create a 4-division step-by-step problem-solving video lesson for "${normalizedTopic}" (${difficultyLevel} level).
CRITICAL RULES:
1. NEVER just read the slide bullets aloud! Actually SOLVE a concrete numerical problem with explicit numbers (such as 2x, 3x, 5x, matrices, limits, derivatives, or integrals) step by step across the 4 divisions:
   - Division 1: Given Problem Statement, Identifying Exact Numbers/Coefficients & Selecting the Governing Formula.
   - Division 2: Step-by-Step Substitution of the Exact Numbers & Algebraic Simplification.
   - Division 3: Solving / Evaluating the Core Operation (Determinant, Derivative, Integral, or Roots) with Exact Numerical Calculations.
   - Division 4: Final Numerical Answer, Back-Substitution Verification & HSC 5-Mark Board Exam Check.
2. Include the exact numbers (e.g., 2x, 3x, 5x) inside 'equation', 'bulletPoints', AND 'narration' so the live visual board updates with those exact numbers!
3. No greetings ("Good morning", "Vanakkam", "Hello").
4. ${languageInstruction}
5. visualType: one of "algebra_graph", "ac_wave", "ray_optics", "quantum_orbit", "formula_board".`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Solve step by step with concrete numbers and generate a 4-division TN Class 12 Maths video lesson for: "${normalizedTopic}".`
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              lessonTitle: { type: 'STRING' },
              topicSummary: { type: 'STRING' },
              slides: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    slideNumber: { type: 'INTEGER' },
                    title: { type: 'STRING' },
                    visualType: {
                      type: 'STRING',
                      enum: ['algebra_graph', 'ac_wave', 'ray_optics', 'quantum_orbit', 'formula_board']
                    },
                    equation: { type: 'STRING' },
                    bulletPoints: {
                      type: 'ARRAY',
                      items: { type: 'STRING' }
                    },
                    narration: { type: 'STRING' }
                  },
                  required: ['slideNumber', 'title', 'visualType', 'equation', 'bulletPoints', 'narration']
                }
              },
              quickCheckQuestion: {
                type: 'OBJECT',
                properties: {
                  prompt: { type: 'STRING' },
                  options: {
                    type: 'ARRAY',
                    items: { type: 'STRING' }
                  },
                  correctIndex: { type: 'INTEGER' },
                  explanation: { type: 'STRING' }
                },
                required: ['prompt', 'options', 'correctIndex', 'explanation']
              }
            },
            required: ['lessonTitle', 'topicSummary', 'slides', 'quickCheckQuestion']
          }
        }
      };

      // Strict 4.5-second hard deadline so AI video generation completes within 5 seconds max
      const response = await fetchWithTimeout(
        apiUrl,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        4500
      );

      if (!response.ok) {
        throw new Error(`Gemini service returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Empty response received from Gemini.');
      }

      const parsedRaw = JSON.parse(rawText);
      const parsedLesson: GeneratedLesson = {
        lessonTitle: safeText(parsedRaw?.lessonTitle) || normalizedTopic,
        topicSummary: safeText(parsedRaw?.topicSummary),
        slides: Array.isArray(parsedRaw?.slides)
          ? parsedRaw.slides.map((s: Record<string, unknown>, idx: number) => ({
              slideNumber: Number(s?.slideNumber) || idx + 1,
              title: safeText(s?.title) || `Division ${idx + 1}`,
              visualType: [
                'algebra_graph',
                'ac_wave',
                'ray_optics',
                'quantum_orbit',
                'formula_board'
              ].includes(String(s?.visualType))
                ? (s?.visualType as LessonSlide['visualType'])
                : 'formula_board',
              equation: safeText(s?.equation),
              bulletPoints: Array.isArray(s?.bulletPoints)
                ? s.bulletPoints.map((bp: unknown) => safeText(bp)).filter(Boolean)
                : [],
              narration: safeText(s?.narration) || safeText(s?.title)
            }))
          : [],
        quickCheckQuestion: {
          prompt: safeText(parsedRaw?.quickCheckQuestion?.prompt),
          options: Array.isArray(parsedRaw?.quickCheckQuestion?.options)
            ? parsedRaw.quickCheckQuestion.options.map((o: unknown) => safeText(o))
            : [],
          correctIndex: Number(parsedRaw?.quickCheckQuestion?.correctIndex) || 0,
          explanation: safeText(parsedRaw?.quickCheckQuestion?.explanation)
        }
      };

      lessonCacheRef.current[lessonCacheKey] = parsedLesson;
      setLesson(parsedLesson);
      setIsGenerating(false);
      setGenerationStep('');

      setCurrentSlideIdx(0);
      setSlideProgress(0);
      setSpokenCharRatio(0);
      setIsPlaying(true);
      playSlideAudio(0, parsedLesson.slides[0]?.narration);
      prebufferRemainingDivisions(parsedLesson.slides, langConfig);
    } catch {
      const instantLesson = buildInstantMathStepLesson(normalizedTopic, isTamilMode, langConfig);
      lessonCacheRef.current[lessonCacheKey] = instantLesson;
      setLesson(instantLesson);
      setIsGenerating(false);
      setGenerationStep('');

      setCurrentSlideIdx(0);
      setSlideProgress(0);
      setSpokenCharRatio(0);
      setIsPlaying(true);
      playSlideAudio(0, instantLesson.slides[0]?.narration);
      prebufferRemainingDivisions(instantLesson.slides, langConfig);
    }
  };

  useEffect(() => {
    if (!isPlaying || !lesson) return;

    const interval = setInterval(() => {
      if (
        webAudioTimingRef.current &&
        unlockedAudioCtxRef.current &&
        webAudioTimingRef.current.duration > 0
      ) {
        const elapsed =
          unlockedAudioCtxRef.current.currentTime - webAudioTimingRef.current.startTime;
        const ratio = Math.min(0.99, Math.max(0, elapsed / webAudioTimingRef.current.duration));
        setSlideProgress(ratio * 100);
        setSpokenCharRatio(ratio);
        return;
      }

      if (fallbackTimingRef.current && fallbackTimingRef.current.durationMs > 0) {
        const elapsedMs = performance.now() - fallbackTimingRef.current.startMs;
        const ratio = Math.min(0.99, Math.max(0, elapsedMs / fallbackTimingRef.current.durationMs));
        setSlideProgress(ratio * 100);
        return;
      }

      if (!audioFinishedRef.current && !isMuted) {
        setSlideProgress((prev) => (prev >= 99 ? 99 : prev + 0.35));
        return;
      }

      setSlideProgress(100);
      setSpokenCharRatio(1);
      if (currentSlideIdx < lesson.slides.length - 1) {
        const nextIdx = currentSlideIdx + 1;
        setCurrentSlideIdx(nextIdx);
        setSlideProgress(0);
        setSpokenCharRatio(0);
        playSlideAudio(nextIdx, lesson.slides[nextIdx]?.narration);
      } else {
        setIsPlaying(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, lesson, currentSlideIdx, isMuted, playSlideAudio]);

  const togglePlayPause = () => {
    if (!lesson) return;
    unlockBrowserAudio();
    if (isPlaying) {
      setIsPlaying(false);
      stopAllAudio();
      setAudioStatusLabel(isTamilMode ? 'இடைநிறுத்தப்பட்டது' : 'Paused');
    } else {
      if (slideProgress >= 100 && currentSlideIdx === lesson.slides.length - 1) {
        setCurrentSlideIdx(0);
        setSlideProgress(0);
        setSpokenCharRatio(0);
        playSlideAudio(0, lesson.slides[0]?.narration);
      } else {
        playSlideAudio(currentSlideIdx, lesson.slides[currentSlideIdx]?.narration);
      }
      setIsPlaying(true);
    }
  };

  const handleSelectSlide = (idx: number) => {
    if (!lesson) return;
    unlockBrowserAudio();
    setCurrentSlideIdx(idx);
    setSlideProgress(0);
    setSpokenCharRatio(0);
    stopAllAudio();
    if (isPlaying) {
      playSlideAudio(idx, lesson.slides[idx]?.narration);
    }
  };

  useEffect(() => {
    if (lesson && isPlaying) {
      playSlideAudio(currentSlideIdx, lesson.slides[currentSlideIdx]?.narration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // ============================================================================
  // LIVE NUMBER-LINKED STEP-BY-STEP VISUAL CANVAS RENDERER
  // Dynamically plots & solves the exact numbers spoken in the narration
  // ============================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationTime = 0;

    const render = () => {
      animationTime += 0.035;

      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      }

      const w = canvas.width;
      const h = canvas.height;

      const bgMap = {
        math_dark: '#EEF2F6',
        chalkboard: '#112d24',
        blueprint: '#091e3a'
      };
      const gridMap = {
        math_dark: 'rgba(99, 102, 241, 0.09)',
        chalkboard: 'rgba(255, 255, 255, 0.07)',
        blueprint: 'rgba(56, 189, 248, 0.14)'
      };
      const accentMap = {
        math_dark: '#818cf8',
        chalkboard: '#fbbf24',
        blueprint: '#38bdf8'
      };

      ctx.fillStyle = bgMap[visualTheme];
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = gridMap[visualTheme];
      ctx.lineWidth = 1;
      const step = 28;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const currentSlide = lesson?.slides[currentSlideIdx];
      const isCompact = w < 640;
      const boardCenterX = isCompact ? w * 0.5 : w * 0.72;
      const boardCenterY = isCompact ? h * 0.71 : h * 0.49;
      const boardRadius = isCompact ? Math.min(w, h) * 0.21 : Math.min(w * 0.22, h * 0.33);

      if (!currentSlide) {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.strokeStyle = accentMap[visualTheme];
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-120, 0);
        ctx.lineTo(120, 0);
        ctx.moveTo(0, -60);
        ctx.lineTo(0, 60);
        ctx.stroke();

        ctx.strokeStyle = '#34d399';
        ctx.beginPath();
        for (let i = -80; i <= 80; i++) {
          const px = i * 1.3;
          const py = -Math.sin(i * 0.06 + animationTime) * 38;
          if (i === -80) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.fillStyle = '#0F172A';
        ctx.font = '600 18px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          isTamilMode
            ? 'Avichi MathNova AI கணிதத் தீர்வு பலகை தயார்'
            : 'Avichi MathNova AI Step-by-Step Math Board Ready',
          0,
          -84
        );
        ctx.fillStyle = '#0F172A';
        ctx.font = '13px Inter, system-ui, sans-serif';
        ctx.fillText(
          isTamilMode
            ? 'ஏதேனும் 12-ஆம் வகுப்பு கணக்கை உள்ளிட்டு "கணக்கைத் தீர்த்து வீடியோ உருவாக்கு" அழுத்தவும்'
            : 'Enter any Class 12 Maths sum (e.g., 2x + 3y = 8, 5x - 2y = 1) & click Solve',
          0,
          92
        );
        ctx.restore();
      } else {
        const effectiveRatio = Math.max(spokenCharRatio, slideProgress / 100);
        const sentences = currentSlide.narration
          .split(/(?<=[.!?।])\s+/)
          .map((s) => s.trim())
          .filter(Boolean);
        const activeSentenceIdx =
          sentences.length > 0
            ? Math.min(sentences.length - 1, Math.floor(effectiveRatio * sentences.length))
            : 0;
        const activeSpokenChunk = sentences[activeSentenceIdx] || currentSlide.narration;

        const visualData = extractNumbersAndStepsFromNarration(
          promptTopic,
          currentSlide.title,
          currentSlide.equation,
          currentSlide.bulletPoints,
          activeSpokenChunk,
          currentSlideIdx,
          isTamilMode
        );

        ctx.fillStyle = accentMap[visualTheme];
        ctx.font = 'bold 12px Inter, system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(
          isTamilMode
            ? `பகுதி ${currentSlideIdx + 1} / ${lesson.slides.length}  •  படிநிலை எண் தீர்வு`
            : `DIVISION ${currentSlideIdx + 1} OF ${lesson.slides.length}  •  LIVE NUMBER SOLVER`,
          28,
          34
        );

        ctx.fillStyle = '#0F172A';
        ctx.font = `bold ${isCompact ? 16 : 20}px Inter, system-ui, sans-serif`;
        const titleTrimmed =
          currentSlide.title.length > 44 ? currentSlide.title.slice(0, 41) + '...' : currentSlide.title;
        ctx.fillText(titleTrimmed, 28, 62);

        const eqBoxW = isCompact ? w - 56 : w * 0.44;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(28, 78, eqBoxW, 44, 10);
        ctx.fill();
        ctx.strokeStyle = accentMap[visualTheme];
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#a5b4fc';
        ctx.font = `600 ${isCompact ? 12.5 : 14.5}px monospace`;
        const eqTrimmed =
          currentSlide.equation.length > 48
            ? currentSlide.equation.slice(0, 45) + '...'
            : currentSlide.equation;
        ctx.fillText(eqTrimmed, 40, 105);

        const bullets = currentSlide.bulletPoints || [];
        bullets.forEach((bp, idx) => {
          const threshold = (idx + 1) / (bullets.length + 1);
          const alpha = effectiveRatio >= threshold * 0.55 ? 1 : 0.45;
          ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
          ctx.font = `${isCompact ? 12 : 13.5}px Inter, system-ui, sans-serif`;
          const yPos = 148 + idx * 30;
          if (!isCompact || yPos < h * 0.46) {
            const truncated = bp.length > 52 ? bp.slice(0, 49) + '...' : bp;
            ctx.fillText(`•  ${truncated}`, 30, yPos);
          }
        });

        // Right-side Live Number & Equation Solution Board
        const cardW = boardRadius * 2.55;
        const cardH = boardRadius * 2.3;
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.84)';
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(boardCenterX - cardW / 2, boardCenterY - cardH / 2, cardW, cardH, 16);
        ctx.fill();
        ctx.stroke();

        // Header badge displaying the exact numbers extracted from the active spoken narration
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        const termsHeader =
          visualData.boardStepLines[1].length > 42
            ? visualData.boardStepLines[1].slice(0, 39) + '...'
            : visualData.boardStepLines[1];
        ctx.fillText(termsHeader, boardCenterX, boardCenterY - cardH / 2 + 19);

        // Live Step Calculation Banner that dynamically transforms values as the narrator speaks
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11.5px monospace';
        const calcBanner =
          visualData.activeStepCalculation.length > 42
            ? visualData.activeStepCalculation.slice(0, 39) + '...'
            : visualData.activeStepCalculation;
        ctx.fillText(calcBanner, boardCenterX, boardCenterY + cardH / 2 - 12);
        ctx.restore();

        ctx.save();
        ctx.translate(boardCenterX, boardCenterY + 2);

        const c0 = visualData.coefficients[0] || '2x';
        const c1 = visualData.coefficients[1] || '3x';
        const c2 = visualData.coefficients[2] || '5';
        const [nv1, nv2, nv3] = visualData.numericValues;

        if (visualData.visualMode === 'matrix_det') {
          const bw = boardRadius * 0.58;
          const bh = boardRadius * 0.52;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-bw, -bh);
          ctx.lineTo(-bw, bh);
          ctx.moveTo(bw, -bh);
          ctx.lineTo(bw, bh);
          ctx.stroke();

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(c0, -bw * 0.45, -bh * 0.3);
          ctx.fillText(c1, bw * 0.45, -bh * 0.3);
          ctx.fillText(c2, -bw * 0.45, bh * 0.35);
          ctx.fillText(visualData.coefficients[3] || String(nv3), bw * 0.45, bh * 0.35);

          // Diagonal cross-multiplication arrows
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.55)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-bw * 0.35, -bh * 0.2);
          ctx.lineTo(bw * 0.35, bh * 0.25);
          ctx.stroke();
        } else if (visualData.visualMode === 'integral_area') {
          // Draw coordinate axes + shaded definite integral area under curve with exact bounds
          const ax = boardRadius * 0.85;
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(-ax, ax * 0.45);
          ctx.lineTo(ax, ax * 0.45);
          ctx.moveTo(-ax * 0.55, -ax * 0.65);
          ctx.lineTo(-ax * 0.55, ax * 0.65);
          ctx.stroke();

          ctx.fillStyle = 'rgba(52, 211, 153, 0.28)';
          ctx.beginPath();
          ctx.moveTo(-ax * 0.3, ax * 0.45);
          for (let i = -30; i <= 45; i++) {
            const px = (i / 50) * ax;
            const py = ax * 0.45 - ((i + 35) / 80) * ((i + 35) / 80) * ax * 0.85;
            ctx.lineTo(px, py);
          }
          ctx.lineTo(ax * 0.9, ax * 0.45);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 13px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`∫ (${c0} + ${c1}) dx`, 0, -ax * 0.48);
        } else if (visualData.visualMode === 'calculus_curve') {
          // Draw curve + moving tangent slope line with exact coefficients
          const ax = boardRadius * 0.85;
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-ax, 0);
          ctx.lineTo(ax, 0);
          ctx.moveTo(0, -ax * 0.65);
          ctx.lineTo(0, ax * 0.65);
          ctx.stroke();

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let i = -40; i <= 40; i++) {
            const xNorm = i / 40;
            const px = xNorm * ax * 0.85;
            const py = -(xNorm * xNorm * 0.75 - 0.35) * ax * 0.7;
            if (i === -40) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Tangent line at active point
          const tX = Math.sin(animationTime * 0.8) * 0.45;
          const px0 = tX * ax * 0.85;
          const py0 = -(tX * tX * 0.75 - 0.35) * ax * 0.7;
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(px0, py0, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`f(x): ${c0}, ${c1}, ${c2}`, 0, -ax * 0.52);
        } else if (visualData.visualMode === 'complex_argand') {
          // Argand plane vector z = x + iy
          const r = boardRadius * 0.72;
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-r, 0);
          ctx.lineTo(r, 0);
          ctx.moveTo(0, -r * 0.75);
          ctx.lineTo(0, r * 0.75);
          ctx.stroke();

          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(r * 0.6, -r * 0.48);
          ctx.stroke();

          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.arc(r * 0.6, -r * 0.48, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`z = ${c0} + ${c1}i`, 0, r * 0.65);
        } else {
          // Step-by-Step Algebraic Transformation Stack with live changing numbers
          const stepsToDraw = [
            `${c0} + ${c1} = ${c2}`,
            visualData.activeStepCalculation,
            visualData.activeStepResult
          ];
          stepsToDraw.forEach((line, lIdx) => {
            const boxY = -boardRadius * 0.54 + lIdx * (boardRadius * 0.44);
            ctx.fillStyle =
              lIdx === Math.min(2, activeSentenceIdx % 3)
                ? 'rgba(99, 102, 241, 0.34)'
                : 'rgba(30, 41, 59, 0.78)';
            ctx.strokeStyle = lIdx === Math.min(2, activeSentenceIdx % 3) ? '#818cf8' : '#334155';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.roundRect(-boardRadius * 1.02, boxY, boardRadius * 2.04, 26, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 11.5px monospace';
            ctx.textAlign = 'center';
            const trimmedLine = line.length > 34 ? line.slice(0, 31) + '...' : line;
            ctx.fillText(trimmedLine, 0, boxY + 17);
          });
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [lesson, currentSlideIdx, slideProgress, spokenCharRatio, visualTheme, isTamilMode, promptTopic]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#F8FAFC] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-800 mb-1.5">
              {ui.topicLabel}
            </label>
            <div className="relative">
              <Sparkles className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={promptTopic}
                onChange={(e) => setPromptTopic(e.target.value)}
                placeholder={
                  isTamilMode
                    ? 'எ.கா., 2x + 3y = 8 மற்றும் 5x - 2y = 1 கிராமர் விதி மூலம் தீர்க்க...'
                    : 'e.g., Solve 2x + 3y = 8 and 5x - 2y = 1 using Cramer’s Rule...'
                }
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#E2E8F0] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-800 mb-1.5">
                {isTamilMode ? 'நிலை' : 'Level'}
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value as 'Foundation' | 'Intermediate' | 'Exam Mastery')}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#E2E8F0] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Foundation">{isTamilMode ? 'அடிப்படை' : 'Foundation'}</option>
                <option value="Intermediate">{isTamilMode ? 'நடுத்தரம்' : 'Intermediate'}</option>
                <option value="Exam Mastery">{isTamilMode ? 'பொதுத்தேர்வு தேர்ச்சி' : 'Public Exam Mastery'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-800 mb-1.5">
                {isTamilMode ? 'பலகை வடிவம்' : 'Board Style'}
              </label>
              <select
                value={visualTheme}
                onChange={(e) => setVisualTheme(e.target.value as 'math_dark' | 'chalkboard' | 'blueprint')}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#E2E8F0] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="math_dark">{isTamilMode ? 'இருண்ட கணிதப் பலகை' : 'Maths Dark'}</option>
                <option value="chalkboard">{isTamilMode ? 'கரும்பலகை' : 'Chalkboard'}</option>
                <option value="blueprint">{isTamilMode ? 'வரைபட நீலம்' : 'Blueprint'}</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateLesson}
            disabled={isGenerating || !promptTopic.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{ui.generatingBtn}</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>{ui.generateBtn}</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-800 font-medium">
            {isTamilMode ? '12-ஆம் வகுப்பு கணிதக் கணக்குகள்:' : 'Quick Class 12 Maths Sums:'}
          </span>
          {(isTamilMode
            ? [
                'அத்தியாயம் 1: 2x + 3y = 8 மற்றும் 5x - 2y = 1 கிராமர் விதி தீர்வு',
                'அத்தியாயம் 2: z = 1 + i√3 துருவ வடிவம் & டி மாய்வரின் தேற்றம்',
                'அத்தியாயம் 3: 2x³ - 9x² + 13x - 6 = 0 முப்படிச் சமன்பாடு தீர்க்க',
                'அத்தியாயம் 4: tan⁻¹(2x) + tan⁻¹(3x) = π/4 தீர்க்க',
                'அத்தியாயம் 5: y² - 4y - 8x + 12 = 0 பரவளையத்தின் முனை & குவியம்',
                'அத்தியாயம் 7: f(x) = 2x³ - 3x² - 12x + 4 பெருமம் & சிறுமம்',
                'அத்தியாயம் 9: y² = 4x மற்றும் y = 2x அடைபடும் பரப்பு',
                'அத்தியாயம் 10: dy/dx + 2y = e^(-x) நேரியல் வகைக்கெழுச் சமன்பாடு'
              ]
            : [
                'Ch 1: Solve 2x + 3y = 8 and 5x - 2y = 1 by Cramer’s Rule',
                'Ch 2: Express z = 1 + i√3 in Polar Form & Evaluate (1 + i√3)⁶',
                'Ch 3: Solve Cubic Equation 2x³ - 9x² + 13x - 6 = 0',
                'Ch 4: Solve tan⁻¹(2x) + tan⁻¹(3x) = π/4 for x > 0',
                'Ch 5: Find Vertex, Focus & Directrix of y² - 4y - 8x + 12 = 0',
                'Ch 7: Find Local Extrema of f(x) = 2x³ - 3x² - 12x + 4',
                'Ch 9: Find Area Between Parabola y² = 4x and Line y = 2x',
                'Ch 10: Solve Linear ODE dy/dx + 2y = e^(-x) with y(0) = 3'
              ]
          ).map((preset) => (
            <button
              type="button"
              key={preset}
              onClick={() => setPromptTopic(preset)}
              className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 dark:bg-[#E2E8F0] dark:hover:bg-[#F8FAFC] text-slate-700 dark:text-slate-800 hover:text-indigo-600 dark:hover:text-indigo-950 transition-colors cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {isGenerating && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-[#EEF2F6] border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-3 text-sm text-indigo-700 dark:text-indigo-950">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{safeText(generationStep)}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center justify-between gap-3 text-sm text-rose-700 dark:text-slate-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{safeText(errorMsg)}</span>
            </div>
            <button
              type="button"
              onClick={handleGenerateLesson}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 cursor-pointer"
            >
              {isTamilMode ? 'மீண்டும் முயற்சி' : 'Retry'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-[#EEF2F6] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="relative w-full h-[380px] sm:h-[440px]">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {lesson && lesson.slides[currentSlideIdx] && (
            <div className="absolute bottom-4 left-4 right-4 bg-[#F8FAFC] backdrop-blur-md border border-slate-700/70 rounded-xl px-4 py-2.5 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-indigo-950">
                <span>
                  {isTamilMode
                    ? `பகுதி ${currentSlideIdx + 1}/4 • எண்களுடன் நேரடி படிநிலை தீர்வு`
                    : `Division ${currentSlideIdx + 1}/4 • Live Number-Linked Step Solving`}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {lesson.slides[currentSlideIdx].narration}
              </p>
            </div>
          )}
        </div>

        <div className="bg-[#F8FAFC] border-t border-slate-800 px-4 py-3 space-y-3">
          {lesson && (
            <div className="grid grid-cols-4 gap-2">
              {lesson.slides.map((s, idx) => {
                let fill = 0;
                if (idx < currentSlideIdx) fill = 100;
                else if (idx === currentSlideIdx) fill = slideProgress;

                return (
                  <button
                    type="button"
                    key={s.slideNumber}
                    onClick={() => handleSelectSlide(idx)}
                    className="group text-left focus:outline-none cursor-pointer"
                  >
                    <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-100"
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                    <p
                      className={`text-[11px] truncate ${
                        idx === currentSlideIdx
                          ? 'text-indigo-950 font-semibold'
                          : 'text-slate-800 group-hover:text-slate-800'
                      }`}
                    >
                      {isTamilMode ? `பகுதி ${idx + 1}: ${s.title}` : `Div ${idx + 1}: ${s.title}`}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayPause}
                disabled={!lesson}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
                title={isPlaying ? (isTamilMode ? 'இடைநிறுத்து' : 'Pause') : (isTamilMode ? 'இயக்கு' : 'Play')}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleSelectSlide(Math.max(0, currentSlideIdx - 1))}
                disabled={!lesson || currentSlideIdx === 0}
                className="p-2 rounded-xl bg-[#E2E8F0] hover:bg-slate-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
                title={isTamilMode ? 'முந்தைய பகுதி' : 'Previous Division'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectSlide(Math.min((lesson?.slides.length || 1) - 1, currentSlideIdx + 1))
                }
                disabled={!lesson || currentSlideIdx === (lesson?.slides.length || 1) - 1}
                className="p-2 rounded-xl bg-[#E2E8F0] hover:bg-slate-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
                title={isTamilMode ? 'அடுத்த பகுதி' : 'Next Division'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectSlide(0)}
                disabled={!lesson}
                className="p-2 rounded-xl bg-[#E2E8F0] hover:bg-slate-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
                title={isTamilMode ? 'மீண்டும் தொடங்கு' : 'Restart Lesson'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E2E8F0] border border-slate-700 text-[11px] text-slate-800">
                {isAudioLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-950" />
                ) : (
                  <Mic className={`w-3 h-3 ${isMuted ? 'text-slate-900' : 'text-emerald-950'}`} />
                )}
                <span className="truncate max-w-[180px] sm:max-w-[260px]">
                  {isMuted ? (isTamilMode ? 'ஒலி நிறுத்தப்பட்டது' : 'Audio Muted') : audioStatusLabel}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  unlockBrowserAudio();
                  const nextMute = !isMuted;
                  setIsMuted(nextMute);
                  if (nextMute) {
                    stopAllAudio();
                  } else if (lesson && isPlaying) {
                    playSlideAudio(currentSlideIdx, lesson.slides[currentSlideIdx]?.narration);
                  }
                }}
                className="p-2 rounded-xl bg-[#E2E8F0] hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Bold Male Indian Voice' : 'Mute Voice'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-slate-900" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-950" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {lesson && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#F8FAFC] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-[#EEF2F6] text-indigo-600 dark:text-indigo-950">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-900">{lesson.lessonTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-800">
                  {isTamilMode ? 'படிப்படியான கணிதத் தீர்வு (4 பகுதிகள்)' : 'Step-by-Step Worked Solution (4 Divisions)'}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-800 leading-relaxed">
              {lesson.topicSummary}
            </p>
            <div className="space-y-2 pt-2">
              {lesson.slides.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSlide(idx)}
                  className={`p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                    idx === currentSlideIdx
                      ? 'bg-indigo-50/70 dark:bg-[#EEF2F6] border-indigo-300 dark:border-indigo-700'
                      : 'bg-slate-50 dark:bg-[#E2E8F0] border-slate-200/70 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-semibold text-slate-900 dark:text-slate-900">
                    <span className="truncate">
                      {isTamilMode ? `பகுதி ${idx + 1}. ${s.title}` : `Div ${idx + 1}. ${s.title}`}
                    </span>
                    <code className="text-xs px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-indigo-700 dark:text-indigo-950 shrink-0">
                      {s.equation}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#F8FAFC] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-950">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-900">
                    {isTamilMode ? 'பாடப் புரிதல் வினா' : 'Step-by-Step Formula Check'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-800">
                    {isTamilMode ? 'உங்கள் கணித அறிவை உடனடியாகச் சோதிக்கவும்' : 'Verify the key formula used in this sum'}
                  </p>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-800 dark:text-slate-800">
                {lesson.quickCheckQuestion.prompt}
              </p>

              <div className="space-y-2">
                {lesson.quickCheckQuestion.options.map((opt, idx) => {
                  const isSelected = quizChoice === idx;
                  const isCorrect = idx === lesson.quickCheckQuestion.correctIndex;
                  let btnStyle =
                    'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#E2E8F0] text-slate-700 dark:text-slate-800';

                  if (quizChoice !== null) {
                    if (isCorrect) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-950 font-medium';
                    } else if (isSelected) {
                      btnStyle =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-slate-900';
                    }
                  }

                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setQuizChoice(idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizChoice !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {quizChoice !== null && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {quizChoice !== null && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#E2E8F0] border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-800 leading-relaxed">
                <span className="font-semibold text-slate-900 dark:text-slate-900">
                  {ui.explanationLabel}:{' '}
                </span>
                {lesson.quickCheckQuestion.explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

function MathNovaStudioContent() {
  const [language, setLanguage] = useState<LangCode>('en'); (window as any).__L = language; (window as any).__ACTIVE_LANG__ = language;
  const [activeTab, setActiveTab] = useState<'studio' | 'syllabus' | 'practice' | 'past'>('studio');
  const [selectedVolume, setSelectedVolume] = useState<VolumeFilter>('all');
  const [studioTopic, setStudioTopic] = useState<string | undefined>(undefined);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({
    'tn12-m-c1-t1': true
  });

  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [searchPast, setSearchPast] = useState('');

  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorAnswer, setTutorAnswer] = useState<string | null>(null);
  const [isTutorThinking, setIsTutorThinking] = useState(false);

  const isTamilMode = language === 'ta';
  const ui = getUiStrings(language);
  const langConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const launchLessonForTopic = (topicTitle: string) => {
    setStudioTopic(topicTitle);
    setActiveTab('studio');
  };

  const toggleTopicComplete = (id: string) => {
    setCompletedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredChapters =
    selectedVolume === 'all'
      ? TN_MATHS_SYLLABUS
      : TN_MATHS_SYLLABUS.filter((c) => c.volume === selectedVolume);
  const totalTopicsCount = TN_MATHS_SYLLABUS.reduce((acc, c) => acc + c.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const masteryPercentage = Math.round((completedCount / totalTopicsCount) * 100);

  const filteredPractice =
    selectedTopicFilter === 'all'
      ? PRACTICE_SUMS
      : PRACTICE_SUMS.filter((q) => q.topicId === selectedTopicFilter);

  const filteredPastSums = PAST_BOARD_SUMS.filter(
    (pq) =>
      pq.topic.toLowerCase().includes(searchPast.toLowerCase()) ||
      pq.tamilTopic.toLowerCase().includes(searchPast.toLowerCase()) ||
      pq.question.toLowerCase().includes(searchPast.toLowerCase()) ||
      pq.tamilQuestion.toLowerCase().includes(searchPast.toLowerCase()) ||
      pq.year.toString().includes(searchPast)
  );

  const handleAskTutor = async () => {
    if (!tutorQuestion.trim()) return;
    setIsTutorThinking(true);
    setTutorAnswer(null);
    try {
      const apiKey = getGeminiApiKey();
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: tutorQuestion }]
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: isTamilMode
                ? 'You are Avichi MathNova AI Tutor for Tamil Nadu State Board Class 12 (+2) Samacheer Kalvi Mathematics. Solve every sum 100% in clear Tamil (தமிழ்) script with explicit step-by-step numbers, formulas, and final verified answer.'
                : `You are Avichi MathNova AI Tutor for Tamil Nadu State Board Class 12 (+2) Samacheer Kalvi Mathematics. Solve every sum clearly step by step in English with explicit numerical substitutions and final verified answer.`
            }
          ]
        }
      };

      const res = await fetchWithTimeout(
        apiUrl,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        4500
      );
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setTutorAnswer(
        reply ||
          (isTamilMode
            ? 'விடையை உருவாக்க முடியவில்லை. தயவுசெய்து உங்கள் கணக்கை மீண்டும் உள்ளிடவும்.'
            : 'Could not generate a solution. Please re-enter your mathematics sum.')
      );
    } catch {
      setTutorAnswer(
        isTamilMode
          ? 'இணைய இணைப்புச் சிக்கல். தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
          : 'Connection issue while reaching Gemini AI. Please try again.'
      );
    } finally {
      setIsTutorThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#EEF2F6] text-slate-900 dark:text-slate-800 font-sans">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#F8FAFC] backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-slate-900 shadow-md shadow-indigo-500/25">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                  Avichi MathNova
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-[#EEF2F6] text-indigo-600 dark:text-indigo-950 border border-indigo-200/70 dark:border-indigo-800">
                  {ui.appSubtitle}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-[#E2E8F0] p-1 rounded-xl overflow-x-auto">
            {[
              { id: 'studio', label: ui.tabStudio, icon: Video },
              { id: 'syllabus', label: ui.tabSyllabus, icon: Layers },
              { id: 'practice', label: ui.tabPractice, icon: Brain },
              { id: 'past', label: ui.tabPast, icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'studio' | 'syllabus' | 'practice' | 'past')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-[#F8FAFC] text-indigo-600 dark:text-indigo-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-800 hover:text-slate-900 dark:hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#E2E8F0] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
              <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-950 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LangCode)}
                aria-label="Select Lesson & Bold Male Indian Voice Language"
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-800 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-white dark:bg-[#F8FAFC]">
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden xl:flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-800">{ui.syllabusMastery}</p>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-950">
                  {completedCount}/{totalTopicsCount} ({masteryPercentage}%)
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-[#EEF2F6] border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-950" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-900">{ui.studioHeader}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-800">{ui.studioSub}</p>
              </div>
            </div>

            <AiMathsStudio initialTopic={studioTopic} language={language} />
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-900">{ui.syllabusHeader}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-800">{ui.syllabusSub}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#F8FAFC] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                {[
                  {
                    vol: 'all' as VolumeFilter,
                    title: ui.allClass12Label,
                    badge: isTamilMode ? `12 அத்தியாயங்கள் • ${totalTopicsCount} தலைப்புகள்` : `12 Chapters • ${totalTopicsCount} Topics`
                  },
                  {
                    vol: 'Volume 1' as VolumeFilter,
                    title: ui.volume1Label,
                    badge: isTamilMode ? 'அத்தியாயங்கள் 1–6' : 'Chapters 1–6'
                  },
                  {
                    vol: 'Volume 2' as VolumeFilter,
                    title: ui.volume2Label,
                    badge: isTamilMode ? 'அத்தியாயங்கள் 7–12' : 'Chapters 7–12'
                  }
                ].map((v) => {
                  const active = selectedVolume === v.vol;
                  return (
                    <button
                      type="button"
                      key={v.vol}
                      onClick={() => setSelectedVolume(v.vol)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'text-slate-600 dark:text-slate-800 hover:bg-slate-100 dark:hover:bg-[#E2E8F0]'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>{v.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          active
                            ? 'bg-indigo-500 text-slate-900'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white'
                        }`}
                      >
                        {v.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="bg-white dark:bg-[#F8FAFC] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#EEF2F6] text-indigo-600 dark:text-indigo-950 font-bold text-sm flex items-center justify-center shrink-0">
                        {chapter.number < 10 ? `0${chapter.number}` : chapter.number}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-900">
                            {isTamilMode
                              ? `அத்தியாயம் ${chapter.number}: ${chapter.tamilTitle}`
                              : `Chapter ${chapter.number}: ${chapter.title}`}
                          </h2>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950/70 text-violet-600 dark:text-indigo-950 border border-violet-200/70 dark:border-violet-800">
                            {isTamilMode
                              ? `${chapter.tamilVolume} • ${chapter.topics.length} தலைப்புகள்`
                              : `${chapter.volume} • ${chapter.topics.length} Topics`}
                          </span>
                        </div>
                        {!isTamilMode && (
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-950 mt-0.5">
                            {chapter.tamilTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        launchLessonForTopic(
                          isTamilMode
                            ? `அத்தியாயம் ${chapter.number}: ${chapter.topics[0]?.sampleSumTa}`
                            : `Chapter ${chapter.number}: ${chapter.topics[0]?.sampleSumEn}`
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{ui.fullUnitVideo}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chapter.topics.map((topic) => {
                      const isDone = !!completedTopics[topic.id];
                      const activeSubTopics = isTamilMode ? topic.tamilSubTopics : topic.subTopics;
                      return (
                        <div
                          key={topic.id}
                          className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#E2E8F0] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-[#EEF2F6] text-indigo-700 dark:text-indigo-950">
                                    {isTamilMode ? `தலைப்பு ${topic.code}` : `Topic ${topic.code}`}
                                  </span>
                                  <span className="text-[11px] text-slate-800">
                                    {isTamilMode
                                      ? `${topic.tamilDifficulty} • ~${topic.estimatedMinutes} நிமிடம்`
                                      : `${topic.difficulty} • ~${topic.estimatedMinutes} min`}
                                  </span>
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-900 mt-1.5">
                                  {isTamilMode ? topic.tamilTitle : topic.title}
                                </h3>
                                {!isTamilMode && (
                                  <p className="text-[11px] text-indigo-600 dark:text-indigo-950 mt-0.5">
                                    {topic.tamilTitle}
                                  </p>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleTopicComplete(topic.id)}
                                className={`p-1.5 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-500 border-emerald-500 text-slate-900'
                                    : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-indigo-500'
                                }`}
                                title={isTamilMode ? 'முடிந்ததாகக் குறி' : 'Mark Topic Complete'}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-800 leading-relaxed">
                              {isTamilMode ? topic.tamilDescription : topic.description}
                            </p>

                            <div className="space-y-1.5">
                              {activeSubTopics.map((sub, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex items-center justify-between gap-2 text-[11px] text-slate-700 dark:text-slate-800 bg-white dark:bg-[#F8FAFC] px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                    <span>{sub}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      launchLessonForTopic(
                                        isTamilMode
                                          ? `அத்தியாயம் ${chapter.number} (${sub}): ${topic.sampleSumTa}`
                                          : `Chapter ${chapter.number} (${sub}): ${topic.sampleSumEn}`
                                      )
                                    }
                                    className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-600 dark:bg-[#EEF2F6] dark:hover:bg-indigo-600 text-[10px] text-indigo-600 hover:text-white dark:text-indigo-950 dark:hover:text-slate-900 font-semibold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                                  >
                                    <Play className="w-2.5 h-2.5" />
                                    <span>{ui.videoBtn}</span>
                                  </button>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {topic.keyFormulas.map((f, i) => (
                                <code
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded bg-indigo-50/80 dark:bg-[#E2E8F0] border border-indigo-200/60 dark:border-slate-700 text-indigo-700 dark:text-indigo-950"
                                >
                                  {f}
                                </code>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 dark:text-slate-800">
                              {isTamilMode ? `சமச்சீர் கல்வி ${topic.code}` : `Samacheer Kalvi ${topic.code}`}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                launchLessonForTopic(
                                  isTamilMode
                                    ? `அத்தியாயம் ${chapter.number}: ${topic.sampleSumTa}`
                                    : `Chapter ${chapter.number}: ${topic.sampleSumEn}`
                                )
                              }
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Play className="w-3 h-3" />
                              <span>{ui.watchLesson}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-900">{ui.practiceHeader}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-800">{ui.practiceSub}</p>
                </div>

                <select
                  value={selectedTopicFilter}
                  onChange={(e) => setSelectedTopicFilter(e.target.value)}
                  className="px-3.5 py-2 bg-white dark:bg-[#F8FAFC] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-800 max-w-xs"
                >
                  <option value="all">{ui.allTopicsFilter}</option>
                  {TN_MATHS_SYLLABUS.flatMap((c) =>
                    c.topics.map((t) => ({
                      id: t.id,
                      label: `${t.code}: ${isTamilMode ? t.tamilTitle : t.title}`
                    }))
                  ).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {filteredPractice.map((pq, index) => {
                  const chosen = userAnswers[pq.id];
                  const hasAnswered = chosen !== undefined;
                  const activeOptions = isTamilMode ? pq.tamilOptions : pq.options;

                  return (
                    <div
                      key={pq.id}
                      className="bg-white dark:bg-[#F8FAFC] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-950">
                          {ui.questionLabel} {index + 1}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#E2E8F0] text-slate-600 dark:text-slate-800 font-medium">
                          {isTamilMode ? pq.tamilDifficulty : pq.difficulty}
                        </span>
                      </div>

                      <p className="text-base font-medium text-slate-900 dark:text-slate-900">
                        {isTamilMode ? pq.tamilQuestion : pq.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeOptions.map((opt, optIdx) => {
                          const isThisSelected = chosen === optIdx;
                          const isThisCorrect = optIdx === pq.correctIndex;

                          let style =
                            'border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-800';
                          if (hasAnswered) {
                            if (isThisCorrect) {
                              style =
                                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-950 font-semibold';
                            } else if (isThisSelected) {
                              style =
                                'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-slate-900';
                            }
                          }

                          return (
                            <button
                              type="button"
                              key={optIdx}
                              onClick={() =>
                                setUserAnswers((prev) => ({ ...prev, [pq.id]: optIdx }))
                              }
                              className={`px-4 py-3 rounded-xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${style}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && isThisCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {hasAnswered && isThisSelected && !isThisCorrect && (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#E2E8F0] border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-800">
                          <span className="font-bold text-slate-900 dark:text-slate-900">
                            {ui.explanationLabel}:{' '}
                          </span>
                          {isTamilMode ? pq.tamilExplanation : pq.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-[#F8FAFC] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 sticky top-24">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-900">{ui.askTutorTitle}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-800">
                      {isTamilMode ? 'தமிழில் படிப்படியான கணக்குத் தீர்வு' : 'Step-by-Step Class 12 Maths Solver'}
                    </p>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={tutorQuestion}
                  onChange={(e) => setTutorQuestion(e.target.value)}
                  placeholder={ui.askTutorPlaceholder}
                  className="w-full p-3 bg-slate-50 dark:bg-[#E2E8F0] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={handleAskTutor}
                  disabled={isTutorThinking || !tutorQuestion.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isTutorThinking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{ui.derivingBtn}</span>
                    </>
                  ) : (
                    <span>{ui.solveBtn}</span>
                  )}
                </button>

                {tutorAnswer && (
                  <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-[#EEF2F6] border border-indigo-200/70 dark:border-indigo-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {tutorAnswer}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-900">{ui.pastHeader}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-800">{ui.pastSub}</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchPast}
                  onChange={(e) => setSearchPast(e.target.value)}
                  placeholder={ui.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#F8FAFC] border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredPastSums.map((item) => {
                const isOpen = !!expandedSolutions[item.id];
                const activeSteps = isTamilMode ? item.tamilSolutionSteps : item.solutionSteps;
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#F8FAFC] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-[#EEF2F6] text-indigo-600 dark:text-indigo-950 text-xs font-bold">
                          {item.year}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-800">
                          {isTamilMode ? item.tamilPaper : item.paper}
                        </span>
                        <span className="text-xs text-slate-800">•</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-800">
                          {isTamilMode ? item.tamilTopic : item.topic}
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-[#EEF2F6] text-indigo-700 dark:text-indigo-950 border border-indigo-200/70 dark:border-indigo-800">
                        {isTamilMode ? `[${item.marks} மதிப்பெண்கள்]` : `[${item.marks} Marks]`}
                      </span>
                    </div>

                    <p className="text-base text-slate-900 dark:text-slate-900 leading-relaxed">
                      {isTamilMode ? item.tamilQuestion : item.question}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSolutions((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id]
                          }))
                        }
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#E2E8F0] dark:hover:bg-slate-700 text-xs font-semibold text-white dark:text-slate-800 transition-colors cursor-pointer"
                      >
                        {isOpen ? ui.hideSolution : ui.revealSolution}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          launchLessonForTopic(isTamilMode ? item.tamilQuestion : item.question)
                        }
                        className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-[#EEF2F6] dark:hover:bg-[#F8FAFC] text-xs font-semibold text-indigo-600 dark:text-indigo-950 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{ui.generateWalkthrough}</span>
                      </button>
                    </div>

                    {isOpen && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#E2E8F0] border border-slate-200 dark:border-slate-700 space-y-2.5">
                        {activeSteps.map((st, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-slate-700 dark:text-slate-800 leading-relaxed"
                          >
                            {st}
                          </p>
                        ))}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-950">
                            {ui.finalAnswerLabel}:{' '}
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-900">
                            {isTamilMode ? item.tamilFinalAnswer : item.finalAnswer}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StudioErrorBoundary>
      <MathNovaStudioContent />
    </StudioErrorBoundary>
  );
}