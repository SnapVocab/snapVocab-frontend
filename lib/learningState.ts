/**
 * learningState.ts - Learning Hub Data Layer & State Resolver
 * 
 * Hợp đồng dữ liệu khớp với Database Schema:
 * - users, topics, topic_items, fsrs_records, UserDailyMission
 * Backend endpoint tổng hợp: GET /api/v1/learning-hub/summary
 */

export type SourceTag = 'SCAN' | 'DICT' | 'TOPIC' | 'MANUAL';

export interface HubVocabItem {
  id: string;
  word: string;
  meaning: string;
  ipa?: string;
  imageUrl?: string;
  sourceTag: SourceTag;
  savedAt?: string;
}

export interface ActiveSessionInfo {
  topicId: string;
  topicName: string;
  collectionName: string;
  level: string;
  lessonNumber: number;
  lessonTitle: string;
  progress: number;
  total: number;
  coverImageUrl?: string;
  lastStudiedAt: string;
}

export interface LearningHubSummaryResponse {
  dailyGoal: {
    target: number;
    learned: number;
    xpReward: number;
    isCompleted: boolean;
  };
  fsrsOverview: {
    dueCount: number;
    retentionRate: number;
    criticalCount: number;
    masteredCount: number;
  };
  activeSession: ActiveSessionInfo | null;
  previewDueItems: HubVocabItem[];
  recentSavedWords: HubVocabItem[];
  studyModes: {
    flashcardsCount: number;
    quizCount: number;
    collectionsCount: number;
    savedVocabCount: number;
  };
}

export type HubState = 'newUser' | 'hasDue' | 'inProgress' | 'hasNewWords' | 'completed';

/**
 * State Resolver: Xác định trạng thái chính của Learning Hub theo thứ tự ưu tiên
 * 1. Chưa có từ (newUser) -> 2. Có thẻ đến hạn (hasDue) -> 3. Có bài học dở (inProgress) -> 4. Có từ mới lưu (hasNewWords) -> 5. Hoàn thành (completed)
 */
export function determineHubState(summary: LearningHubSummaryResponse): HubState {
  // 1. Người dùng mới: Chưa có bất kỳ từ nào được lưu hoặc học
  if (
    summary.recentSavedWords.length === 0 &&
    summary.fsrsOverview.dueCount === 0 &&
    summary.studyModes.savedVocabCount === 0
  ) {
    return 'newUser';
  }

  // 2. Có thẻ đến hạn ôn tập FSRS (Ưu tiên cao nhất để chống quên)
  if (summary.fsrsOverview.dueCount > 0) {
    return 'hasDue';
  }

  // 3. Có phiên/bài học đang dở dang
  if (summary.activeSession && summary.activeSession.progress < summary.activeSession.total) {
    return 'inProgress';
  }

  // 4. Có từ vựng mới được lưu nhưng chưa học
  if (summary.recentSavedWords.length > 0) {
    return 'hasNewWords';
  }

  // 5. Đã hoàn thành mọi mục tiêu trong ngày
  return 'completed';
}

// =======================================================
// MOCK DATA CHUẨN ĐỒNG BỘ VỚI DB SCHEMA & ASSETS THỰC TẾ
// =======================================================

export const MOCK_SUMMARY_HAS_DUE: LearningHubSummaryResponse = {
  dailyGoal: {
    target: 25,
    learned: 18,
    xpReward: 30,
    isCompleted: false,
  },
  fsrsOverview: {
    dueCount: 12,
    retentionRate: 88,
    criticalCount: 4,
    masteredCount: 80,
  },
  activeSession: {
    topicId: 't4',
    topicName: 'Business English',
    collectionName: 'Công việc & Giao tiếp',
    level: 'B1 · Trung Cấp',
    lessonNumber: 4,
    lessonTitle: 'Đàm phán & Thương thảo',
    progress: 18,
    total: 25,
    lastStudiedAt: '20 phút trước',
  },
  previewDueItems: [
    {
      id: 'w1',
      word: 'boarding pass',
      meaning: 'thẻ lên máy bay',
      ipa: '/ˈbɔːrdɪŋ pæs/',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop&q=80',
      sourceTag: 'TOPIC',
    },
    {
      id: 'w2',
      word: 'luggage',
      meaning: 'hành lý',
      ipa: '/ˈlʌɡɪdʒ/',
      imageUrl: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=300&auto=format&fit=crop&q=80',
      sourceTag: 'SCAN',
    },
    {
      id: 'w3',
      word: 'departure',
      meaning: 'sự khởi hành',
      ipa: '/dɪˈpɑːrtʃər/',
      imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=300&auto=format&fit=crop&q=80',
      sourceTag: 'DICT',
    },
  ],
  recentSavedWords: [
    {
      id: 'rw1',
      word: 'headphone',
      meaning: 'tai nghe chụp tai',
      ipa: '/ˈhedfoʊn/',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
      sourceTag: 'SCAN',
      savedAt: '1 giờ trước',
    },
    {
      id: 'rw2',
      word: 'coffee cup',
      meaning: 'tách cà phê',
      ipa: '/ˈkɔːfi kʌp/',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
      sourceTag: 'SCAN',
      savedAt: 'Hôm nay',
    },
    {
      id: 'rw3',
      word: 'keyboard',
      meaning: 'bàn phím máy tính',
      ipa: '/ˈkiːbɔːrd/',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80',
      sourceTag: 'SCAN',
      savedAt: 'Hôm qua',
    },
    {
      id: 'rw4',
      word: 'agenda',
      meaning: 'chương trình nghị sự',
      ipa: '/əˈdʒendə/',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&auto=format&fit=crop&q=80',
      sourceTag: 'DICT',
      savedAt: '2 ngày trước',
    },
  ],
  studyModes: {
    flashcardsCount: 12,
    quizCount: 5,
    collectionsCount: 12,
    savedVocabCount: 248,
  },
};

export const MOCK_SUMMARY_NEW_USER: LearningHubSummaryResponse = {
  dailyGoal: {
    target: 10,
    learned: 0,
    xpReward: 30,
    isCompleted: false,
  },
  fsrsOverview: {
    dueCount: 0,
    retentionRate: 100,
    criticalCount: 0,
    masteredCount: 0,
  },
  activeSession: null,
  previewDueItems: [],
  recentSavedWords: [],
  studyModes: {
    flashcardsCount: 0,
    quizCount: 0,
    collectionsCount: 12,
    savedVocabCount: 0,
  },
};

export const MOCK_SUMMARY_IN_PROGRESS: LearningHubSummaryResponse = {
  ...MOCK_SUMMARY_HAS_DUE,
  fsrsOverview: {
    dueCount: 0,
    retentionRate: 92,
    criticalCount: 0,
    masteredCount: 80,
  },
  previewDueItems: [],
};

export const MOCK_SUMMARY_COMPLETED: LearningHubSummaryResponse = {
  ...MOCK_SUMMARY_HAS_DUE,
  dailyGoal: {
    target: 25,
    learned: 25,
    xpReward: 30,
    isCompleted: true,
  },
  fsrsOverview: {
    dueCount: 0,
    retentionRate: 95,
    criticalCount: 0,
    masteredCount: 92,
  },
  activeSession: null,
  previewDueItems: [],
};
