import { CollectionDTO, CollectionType } from '@/lib/topic-eav';

export interface CollectionSummaryUI {
  id: number;
  name: string;
  translation?: string;
  type: CollectionType;
  topicCount: number;
  wordCount: number;
  progress: number;
  ownerId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICollectionRepository {
  getCollections(type?: CollectionType): Promise<CollectionSummaryUI[]>;
  getCollectionById(id: number): Promise<CollectionSummaryUI | null>;
  createCollection(data: { name: string; translation?: string }): Promise<CollectionSummaryUI>;
  updateCollection(id: number, data: { name: string; translation?: string }): Promise<CollectionSummaryUI | null>;
  deleteCollection(id: number): Promise<boolean>;
}

// ==========================================
// MOCK DATA STORE (Client Fallback)
// ==========================================
const MOCK_COLLECTIONS: CollectionSummaryUI[] = [
  {
    id: 1,
    name: 'Travel & Exploration',
    translation: 'Du lịch & Khám phá',
    type: 'SYSTEM',
    topicCount: 3,
    wordCount: 117,
    progress: 45,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Business & Communication',
    translation: 'Công việc & Giao tiếp',
    type: 'SYSTEM',
    topicCount: 2,
    wordCount: 55,
    progress: 15,
    createdAt: '2026-08-05T00:00:00Z',
  },
  {
    id: 3,
    name: 'Academic & IELTS',
    translation: 'Học thuật & IELTS',
    type: 'SYSTEM',
    topicCount: 1,
    wordCount: 28,
    progress: 5,
    createdAt: '2026-08-10T00:00:00Z',
  },
  {
    id: 4,
    name: 'Daily Life Vocabulary',
    translation: 'Từ vựng đời sống thường ngày',
    type: 'USER',
    topicCount: 2,
    wordCount: 42,
    progress: 60,
    ownerId: 101,
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'Technology & AI Basics',
    translation: 'Công nghệ & Trí tuệ nhân tạo',
    type: 'USER',
    topicCount: 1,
    wordCount: 15,
    progress: 0,
    ownerId: 101,
    createdAt: '2026-09-10T00:00:00Z',
  },
];

class CollectionRepository implements ICollectionRepository {
  private items: CollectionSummaryUI[] = [...MOCK_COLLECTIONS];
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || '';

  async getCollections(type?: CollectionType): Promise<CollectionSummaryUI[]> {
    if (this.baseUrl) {
      try {
        const url = type 
          ? `${this.baseUrl}/api/collections?type=${type}`
          : `${this.baseUrl}/api/collections`;
        const res = await fetch(url);
        if (res.ok) {
          const dtos: CollectionDTO[] = await res.json();
          return dtos.map(dto => this.adaptDtoToUI(dto));
        }
      } catch (err) {
        console.warn('[CollectionRepository] API fetch failed, falling back to mock:', err);
      }
    }

    // Mock fallback
    if (type) {
      return this.items.filter(c => c.type === type);
    }
    return [...this.items];
  }

  async getCollectionById(id: number): Promise<CollectionSummaryUI | null> {
    if (this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api/collections/${id}`);
        if (res.ok) {
          const dto: CollectionDTO = await res.json();
          return this.adaptDtoToUI(dto);
        }
      } catch (err) {
        console.warn(`[CollectionRepository] API get ${id} failed, using mock fallback:`, err);
      }
    }

    const found = this.items.find(c => c.id === id);
    return found ? { ...found } : null;
  }

  async createCollection(data: { name: string; translation?: string }): Promise<CollectionSummaryUI> {
    if (this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api/collections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name.trim(),
            translation: data.translation?.trim(),
            type: 'USER',
          }),
        });
        if (res.ok) {
          const created: CollectionDTO = await res.json();
          const uiItem = this.adaptDtoToUI(created);
          this.items.unshift(uiItem);
          return uiItem;
        }
      } catch (err) {
        console.warn('[CollectionRepository] API create collection failed, falling back to local mock:', err);
      }
    }

    // Local state fallback
    const newCollection: CollectionSummaryUI = {
      id: Date.now(),
      name: data.name.trim(),
      translation: data.translation?.trim() || undefined,
      type: 'USER',
      topicCount: 0,
      wordCount: 0,
      progress: 0,
      ownerId: 101,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.items.unshift(newCollection);
    return newCollection;
  }

  async updateCollection(id: number, data: { name: string; translation?: string }): Promise<CollectionSummaryUI | null> {
    if (this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api/collections/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name.trim(),
            translation: data.translation?.trim(),
          }),
        });
        if (res.ok) {
          const updated: CollectionDTO = await res.json();
          const uiItem = this.adaptDtoToUI(updated);
          const idx = this.items.findIndex(c => c.id === id);
          if (idx !== -1) this.items[idx] = uiItem;
          return uiItem;
        }
      } catch (err) {
        console.warn(`[CollectionRepository] API update ${id} failed, falling back to local:`, err);
      }
    }

    const idx = this.items.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.items[idx] = {
      ...this.items[idx],
      name: data.name.trim(),
      translation: data.translation?.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    return this.items[idx];
  }

  async deleteCollection(id: number): Promise<boolean> {
    if (this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api/collections/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          this.items = this.items.filter(c => c.id !== id);
          return true;
        }
      } catch (err) {
        console.warn(`[CollectionRepository] API delete ${id} failed, falling back to local:`, err);
      }
    }

    this.items = this.items.filter(c => c.id !== id);
    return true;
  }

  private adaptDtoToUI(dto: CollectionDTO): CollectionSummaryUI {
    const existing = this.items.find(item => item.id === dto.id);
    return {
      id: dto.id,
      name: dto.name,
      translation: dto.translation,
      type: dto.type,
      ownerId: dto.ownerId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      topicCount: existing ? existing.topicCount : 0,
      wordCount: existing ? existing.wordCount : 0,
      progress: existing ? existing.progress : 0,
    };
  }
}

export const collectionRepository = new CollectionRepository();
