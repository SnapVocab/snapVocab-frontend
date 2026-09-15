import { TopicDTO } from '@/lib/topic-eav';

export interface ITopicRepository {
  getTopicsByCollection(collectionId: number): Promise<TopicDTO[]>;
  getTopicById(topicId: number): Promise<TopicDTO | null>;
  createTopic(data: {
    collectionId: number;
    name: string;
    translation?: string;
    description?: string;
  }): Promise<TopicDTO>;
  setActiveTemplate(topicId: number, templateId: number): Promise<void>;
  forkSchema(topicId: number): Promise<void>;
}

// ==========================================
// MOCK DATA STORE (Client Fallback)
// ==========================================
interface MockTopicRecord extends TopicDTO {
  collectionId: number;
  wordCount?: number;
  progress?: number;
}

const MOCK_TOPICS: MockTopicRecord[] = [
  {
    id: 101,
    collectionId: 1,
    name: 'Airport & Flight Operations',
    translation: 'Sân bay & Chuyến bay',
    description: 'Từ vựng sân bay, làm thủ tục check-in, an ninh và lên tàu bay',
    activeTemplateId: 1,
    activeTemplateName: 'Thẻ Chuẩn',
    activeTemplateCode: 'STANDARD',
    wordCount: 72,
    progress: 60,
  },
  {
    id: 102,
    collectionId: 1,
    name: 'Hotel & Accommodation',
    translation: 'Khách sạn & Lưu trú',
    description: 'Thuật ngữ đặt phòng, dịch vụ phòng và giải quyết khiếu nại',
    activeTemplateId: 1,
    activeTemplateName: 'Thẻ Chuẩn',
    activeTemplateCode: 'STANDARD',
    wordCount: 25,
    progress: 20,
  },
  {
    id: 103,
    collectionId: 1,
    name: 'Restaurant & Dining',
    translation: 'Nhà hàng & Gọi món',
    description: 'Mẫu câu và từ vựng khi gọi món, hỏi hóa đơn tại nhà hàng',
    activeTemplateId: 1,
    activeTemplateName: 'Thẻ Chuẩn',
    activeTemplateCode: 'STANDARD',
    wordCount: 20,
    progress: 80,
  },
  {
    id: 201,
    collectionId: 2,
    name: 'Job Interview Essentials',
    translation: 'Phỏng vấn xin việc',
    description: 'Từ vựng trả lời phỏng vấn và giới thiệu kinh nghiệm',
    activeTemplateId: 1,
    activeTemplateName: 'Thẻ Chuẩn',
    activeTemplateCode: 'STANDARD',
    wordCount: 30,
    progress: 10,
  },
  {
    id: 202,
    collectionId: 2,
    name: 'Meetings & Presentations',
    translation: 'Họp và Thuyết trình',
    description: 'Cụm từ báo cáo tiến độ và thảo luận dự án',
    activeTemplateId: 1,
    activeTemplateName: 'Thẻ Chuẩn',
    activeTemplateCode: 'STANDARD',
    wordCount: 25,
    progress: 0,
  },
];

class TopicRepository implements ITopicRepository {
  private topics: MockTopicRecord[] = [...MOCK_TOPICS];
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || '';

  async getTopicsByCollection(collectionId: number): Promise<TopicDTO[]> {
    if (this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api/collections/${collectionId}/topics`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`[TopicRepository] API getTopicsByCollection failed for collection ${collectionId}:`, err);
      }
    }

    return this.topics
      .filter(t => t.collectionId === collectionId)
      .map(t => ({ ...t }));
  }

  async getTopicById(topicId: number): Promise<TopicDTO | null> {
    if (this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api/topics/${topicId}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`[TopicRepository] API getTopicById ${topicId} failed:`, err);
      }
    }

    const found = this.topics.find(t => t.id === topicId);
    return found ? { ...found } : null;
  }

  async createTopic(data: {
    collectionId: number;
    name: string;
    translation?: string;
    description?: string;
  }): Promise<TopicDTO> {
    if (this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api/topics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collectionId: data.collectionId,
            name: data.name.trim(),
            translation: data.translation?.trim(),
            description: data.description?.trim(),
          }),
        });
        if (res.ok) {
          const created: TopicDTO = await res.json();
          this.topics.unshift({ ...created, collectionId: data.collectionId });
          return created;
        }
      } catch (err) {
        console.warn('[TopicRepository] API createTopic failed, using local mock fallback:', err);
      }
    }

    // Local fallback
    const newTopic: MockTopicRecord = {
      id: Date.now(),
      collectionId: data.collectionId,
      name: data.name.trim(),
      translation: data.translation?.trim(),
      description: data.description?.trim(),
      activeTemplateId: 1,
      activeTemplateName: 'Thẻ Chuẩn',
      activeTemplateCode: 'STANDARD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: 0,
      progress: 0,
    };

    this.topics.unshift(newTopic);
    return newTopic;
  }

  async setActiveTemplate(topicId: number, templateId: number): Promise<void> {
    if (this.baseUrl) {
      try {
        await fetch(`${this.baseUrl}/api/topics/${topicId}/active-template/${templateId}`, {
          method: 'PUT',
        });
      } catch (err) {
        console.warn(`[TopicRepository] API setActiveTemplate ${templateId} for topic ${topicId} failed:`, err);
      }
    }

    const topic = this.topics.find(t => t.id === topicId);
    if (topic) {
      topic.activeTemplateId = templateId;
    }
  }

  async forkSchema(topicId: number): Promise<void> {
    if (this.baseUrl) {
      try {
        await fetch(`${this.baseUrl}/api/topics/${topicId}/schema/fork`, {
          method: 'POST',
        });
      } catch (err) {
        console.warn(`[TopicRepository] API forkSchema for topic ${topicId} failed:`, err);
      }
    }
  }
}

export const topicRepository = new TopicRepository();
