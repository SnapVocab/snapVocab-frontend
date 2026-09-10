export interface MeaningGroup {
  pos: 'verb' | 'noun' | 'adjective' | 'adverb' | 'preposition' | string;
  definitions: string[];
}

export interface WordEntry {
  id: string;
  word: string;
  ipa: string;
  hasAudio: boolean;
  audioUrl?: string;
  fromCamera?: boolean;
  imageCropUrl?: string;
  meanings: MeaningGroup[];
  example: {
    en: string;
    vi: string;
  };
  synonyms: string[];
  antonyms: string[];
  related: string[];
  isSaved?: boolean;
  deckName?: string;
}

export interface DeckItem {
  id: string;
  name: string;
  count: number;
  color: string;
}

export const AVAILABLE_DECKS: DeckItem[] = [
  { id: 'deck-1', name: 'Tiếng Anh cơ bản', count: 42, color: 'bg-primary-500' },
  { id: 'deck-2', name: 'TOEIC 600+ Cốt Lõi', count: 128, color: 'bg-mascot-navy' },
  { id: 'deck-3', name: 'Giao Tiếp Hàng Ngày', count: 65, color: 'bg-amber-500' },
  { id: 'deck-4', name: 'Từ Vựng Công Nghệ', count: 34, color: 'bg-info-500' },
];

export const DICTIONARY_STORE: Record<string, WordEntry> = {
  abandon: {
    id: 'abandon',
    word: 'abandon',
    ipa: '/əˈbændən/',
    hasAudio: true,
    fromCamera: true,
    imageCropUrl: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?q=80&w=400&auto=format&fit=crop',
    meanings: [
      {
        pos: 'verb',
        definitions: ['từ bỏ, bỏ rơi', 'ruồng bỏ ai đó khi đang gặp khó khăn']
      },
      {
        pos: 'noun',
        definitions: ['sự phóng túng, sự buông thả không kiềm chế']
      }
    ],
    example: {
      en: 'She decided to abandon the project due to a lack of funding.',
      vi: 'Cô ấy quyết định từ bỏ dự án do thiếu kinh phí.'
    },
    synonyms: ['leave', 'desert', 'forsake', 'discard'],
    antonyms: ['keep', 'maintain', 'retain'],
    related: ['abandoned', 'abandonment'],
    isSaved: true,
    deckName: 'Tiếng Anh cơ bản'
  },
  abandoned: {
    id: 'abandoned',
    word: 'abandoned',
    ipa: '/əˈbændənd/',
    hasAudio: true,
    fromCamera: false,
    meanings: [
      {
        pos: 'adjective',
        definitions: ['bị bỏ rơi, bị ruồng bỏ', 'bỏ hoang (nhà cửa, công trình)']
      }
    ],
    example: {
      en: 'They found an abandoned kitten in the garden.',
      vi: 'Họ tìm thấy một chú mèo con bị bỏ rơi trong vườn.'
    },
    synonyms: ['deserted', 'neglected', 'vacant'],
    antonyms: ['inhabited', 'occupied', 'cherished'],
    related: ['abandon', 'abandonment'],
    isSaved: false,
    deckName: 'Tiếng Anh cơ bản'
  },
  apple: {
    id: 'apple',
    word: 'apple',
    ipa: '/ˈæp.əl/',
    hasAudio: true,
    fromCamera: true,
    imageCropUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400&auto=format&fit=crop',
    meanings: [
      {
        pos: 'noun',
        definitions: ['quả táo (loại trái cây tròn, vỏ đỏ hoặc xanh)', 'cây táo']
      }
    ],
    example: {
      en: 'An apple a day keeps the doctor away.',
      vi: 'Mỗi ngày một quả táo sẽ không cần đến bác sĩ.'
    },
    synonyms: ['fruit', 'pome'],
    antonyms: [],
    related: ['applesauce', 'apple pie'],
    isSaved: false,
    deckName: 'Tiếng Anh cơ bản'
  },
  curious: {
    id: 'curious',
    word: 'curious',
    ipa: '/ˈkjʊə.ri.əs/',
    hasAudio: true,
    fromCamera: false,
    meanings: [
      {
        pos: 'adjective',
        definitions: ['tò mò, hiếu kỳ', 'kỳ lạ, khác thường gây tò mò']
      }
    ],
    example: {
      en: 'Snapy is very curious about learning new English words.',
      vi: 'Snapy rất tò mò về việc học các từ vựng tiếng Anh mới.'
    },
    synonyms: ['inquisitive', 'interested', 'prying'],
    antonyms: ['indifferent', 'uninterested'],
    related: ['curiosity', 'curiously'],
    isSaved: false,
    deckName: 'Tiếng Anh cơ bản'
  },
  resilient: {
    id: 'resilient',
    word: 'resilient',
    ipa: '/rɪˈzɪl.jənt/',
    hasAudio: true,
    fromCamera: false,
    meanings: [
      {
        pos: 'adjective',
        definitions: ['kiên cường, có khả năng phục hồi nhanh sau khó khăn', 'đàn hồi, co giãn tốt']
      }
    ],
    example: {
      en: 'Learners must be resilient when preparing for the TOEIC exam.',
      vi: 'Người học phải kiên cường khi chuẩn bị cho kỳ thi TOEIC.'
    },
    synonyms: ['tough', 'adaptable', 'buoyant', 'strong'],
    antonyms: ['vulnerable', 'fragile', 'weak'],
    related: ['resilience', 'resiliency'],
    isSaved: true,
    deckName: 'TOEIC 600+ Cốt Lõi'
  },
  opportunity: {
    id: 'opportunity',
    word: 'opportunity',
    ipa: '/ˌɒp.əˈtʃuː.nə.ti/',
    hasAudio: true,
    fromCamera: false,
    meanings: [
      {
        pos: 'noun',
        definitions: ['cơ hội, thời cơ thuận lợi', 'dịp may để làm gì đó']
      }
    ],
    example: {
      en: 'This internship is a great opportunity to gain real experience.',
      vi: 'Kỳ thực tập này là một cơ hội tuyệt vời để tích lũy kinh nghiệm thực tế.'
    },
    synonyms: ['chance', 'opening', 'occasion'],
    antonyms: ['disadvantage', 'misfortune'],
    related: ['opportunistic', 'opportunism'],
    isSaved: false,
    deckName: 'TOEIC 600+ Cốt Lõi'
  }
};

export function getWordEntry(idOrWord: string): WordEntry {
  const normalized = (idOrWord || '').toLowerCase().trim();
  if (DICTIONARY_STORE[normalized]) {
    return DICTIONARY_STORE[normalized];
  }
  
  // Fallback dynamic entry for any unknown word searched
  return {
    id: normalized || 'word',
    word: idOrWord || 'Word',
    ipa: '/wɜːd/',
    hasAudio: true,
    fromCamera: false,
    meanings: [
      {
        pos: 'noun',
        definitions: [`từ vựng, ý nghĩa của "${idOrWord}"`]
      }
    ],
    example: {
      en: `Practice using "${idOrWord}" in daily communication.`,
      vi: `Hãy luyện tập sử dụng "${idOrWord}" trong giao tiếp hàng ngày.`
    },
    synonyms: [],
    antonyms: [],
    related: [],
    isSaved: false,
    deckName: 'Tiếng Anh cơ bản'
  };
}
