import { TemplateDTO } from '@/lib/topic-eav';

export interface ITemplateRepository {
  getTemplateById(templateId: number): Promise<TemplateDTO | null>;
  getTemplatesBySchema(schemaId: number): Promise<TemplateDTO[]>;
  updateTemplate(templateId: number, template: TemplateDTO): Promise<TemplateDTO>;
}

// ==========================================
// MOCK TEMPLATES STORE (Khớp database seed backend)
// ==========================================
const MOCK_TEMPLATES: TemplateDTO[] = [
  {
    id: 1,
    schemaId: 1,
    code: 'STANDARD',
    name: 'Thẻ Chuẩn',
    isDefault: true,
    elements: [
      {
        id: 101,
        position: 0,
        type: 'FIELD',
        field: {
          id: 201,
          schemaAttributeId: 1,
          attributeName: 'word',
          semanticRole: 'TARGET_WORD',
          fieldLabel: 'Từ vựng',
          hideIfEmpty: false,
          audioAction: true,
          fontSize: 24,
          alignment: 'CENTER',
          color: '#111827',
        },
      },
      {
        id: 102,
        position: 1,
        type: 'FIELD',
        field: {
          id: 202,
          schemaAttributeId: 2,
          attributeName: 'ipa',
          semanticRole: 'TARGET_WORD',
          fieldLabel: 'Phiên âm',
          hideIfEmpty: true,
          audioAction: true,
          fontSize: 16,
          alignment: 'CENTER',
          color: '#6B7280',
        },
      },
      {
        id: 103,
        position: 2,
        type: 'SECTION_BREAK',
      },
      {
        id: 104,
        position: 3,
        type: 'FIELD',
        field: {
          id: 203,
          schemaAttributeId: 3,
          attributeName: 'meaning',
          semanticRole: 'DEFINITION',
          fieldLabel: 'Giải nghĩa',
          hideIfEmpty: false,
          audioAction: false,
          fontSize: 20,
          alignment: 'LEFT',
          color: '#1F2937',
        },
      },
      {
        id: 105,
        position: 4,
        type: 'FIELD',
        field: {
          id: 204,
          schemaAttributeId: 4,
          attributeName: 'translation',
          semanticRole: 'NATIVE_TRANSLATION',
          fieldLabel: 'Nghĩa tiếng Việt',
          hideIfEmpty: false,
          audioAction: false,
          fontSize: 18,
          alignment: 'LEFT',
          color: '#374151',
        },
      },
      {
        id: 106,
        position: 5,
        type: 'FIELD',
        field: {
          id: 205,
          schemaAttributeId: 5,
          attributeName: 'example',
          semanticRole: 'EXAMPLE_SENTENCE',
          fieldLabel: 'Ví dụ',
          hideIfEmpty: true,
          audioAction: false,
          fontSize: 15,
          alignment: 'LEFT',
          color: '#4B5563',
        },
      },
    ],
  },
  {
    id: 2,
    schemaId: 1,
    code: 'LISTENING',
    name: 'Luyện Nghe',
    isDefault: false,
    elements: [
      {
        id: 111,
        position: 0,
        type: 'FIELD',
        field: {
          id: 211,
          schemaAttributeId: 6,
          attributeName: 'audio',
          semanticRole: 'AUDIO',
          fieldLabel: 'Phát âm',
          hideIfEmpty: false,
          audioAction: true,
          fontSize: 22,
          alignment: 'CENTER',
          color: '#3525CD',
        },
      },
      {
        id: 112,
        position: 1,
        type: 'SECTION_BREAK',
      },
      {
        id: 113,
        position: 2,
        type: 'FIELD',
        field: {
          id: 212,
          schemaAttributeId: 1,
          attributeName: 'word',
          semanticRole: 'TARGET_WORD',
          fieldLabel: 'Từ vựng',
          hideIfEmpty: false,
          audioAction: false,
          fontSize: 22,
          alignment: 'CENTER',
          color: '#111827',
        },
      },
      {
        id: 114,
        position: 3,
        type: 'FIELD',
        field: {
          id: 213,
          schemaAttributeId: 4,
          attributeName: 'translation',
          semanticRole: 'NATIVE_TRANSLATION',
          fieldLabel: 'Bản dịch',
          hideIfEmpty: false,
          audioAction: false,
          fontSize: 18,
          alignment: 'LEFT',
          color: '#374151',
        },
      },
    ],
  },
  {
    id: 3,
    schemaId: 1,
    code: 'REVERSE',
    name: 'Đảo Chiều (Đoán Từ)',
    isDefault: false,
    elements: [
      {
        id: 121,
        position: 0,
        type: 'FIELD',
        field: {
          id: 221,
          schemaAttributeId: 4,
          attributeName: 'translation',
          semanticRole: 'NATIVE_TRANSLATION',
          fieldLabel: 'Nghĩa tiếng Việt',
          hideIfEmpty: false,
          audioAction: false,
          fontSize: 22,
          alignment: 'CENTER',
          color: '#111827',
        },
      },
      {
        id: 122,
        position: 1,
        type: 'SECTION_BREAK',
      },
      {
        id: 123,
        position: 2,
        type: 'FIELD',
        field: {
          id: 222,
          schemaAttributeId: 1,
          attributeName: 'word',
          semanticRole: 'TARGET_WORD',
          fieldLabel: 'Từ vựng tiếng Anh',
          hideIfEmpty: false,
          audioAction: true,
          fontSize: 24,
          alignment: 'CENTER',
          color: '#3525CD',
        },
      },
    ],
  },
];

class TemplateRepository implements ITemplateRepository {
  private templates: TemplateDTO[] = [...MOCK_TEMPLATES];
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || '';

  async getTemplateById(templateId: number): Promise<TemplateDTO | null> {
    if (this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api/templates/${templateId}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`[TemplateRepository] API getTemplateById ${templateId} failed:`, err);
      }
    }

    const found = this.templates.find(t => t.id === templateId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  async getTemplatesBySchema(schemaId: number): Promise<TemplateDTO[]> {
    if (this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api/schemas/${schemaId}/templates`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`[TemplateRepository] API getTemplatesBySchema ${schemaId} failed:`, err);
      }
    }

    return this.templates
      .filter(t => t.schemaId === schemaId)
      .map(t => JSON.parse(JSON.stringify(t)));
  }

  async updateTemplate(templateId: number, template: TemplateDTO): Promise<TemplateDTO> {
    if (this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/api/templates/${templateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`[TemplateRepository] API updateTemplate ${templateId} failed, fallback to local state:`, err);
      }
    }

    const index = this.templates.findIndex(t => t.id === templateId);
    if (index !== -1) {
      this.templates[index] = { ...template, id: templateId, updatedAt: new Date().toISOString() };
      return this.templates[index];
    }

    this.templates.push(template);
    return template;
  }
}

export const templateRepository = new TemplateRepository();
