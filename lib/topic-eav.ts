/**
 * ============================================================================
 * EAV (Entity-Attribute-Value) Mock Contract & Dynamic Repository
 * ============================================================================
 * Chuẩn hóa 100% theo DTO backend Spring Boot (TopicService.java):
 * - TopicItemData unwrapped root-level groups (do backend dùng @JsonAnyGetter)
 * - topicItemId: number (Long)
 * - TopicSchemaData gồm TopicGroupSchemaDTO[] & TopicAttributeSchemaDTO[]
 * - Phân tách TopicPresentation và TopicItemsResponse
 * - Hỗ trợ ánh xạ Template qua attributeId hoặc path
 * ============================================================================
 */

// ==========================================
// 1. PRIMITIVES & TYPE GUARDS
// ==========================================
export type EavPrimitive = string | number | boolean | null;
export type EavGroupInstance = Record<string, EavPrimitive>;
export type EavGroupValue = EavGroupInstance | EavGroupInstance[];

export type TopicAttributeDataType = 'TEXT' | 'AUDIO' | 'IMAGE' | string;

export function isGroupInstance(val: unknown): val is EavGroupInstance {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export function isGroupInstanceArray(val: unknown): val is EavGroupInstance[] {
  return Array.isArray(val) && (val.length === 0 || typeof val[0] === 'object');
}

// ==========================================
// 2. SCHEMA DEFINITIONS (Khớp Backend DTO)
// ==========================================
export type DataType = 'TEXT' | 'AUDIO' | 'IMAGE' | 'NUMBER' | 'BOOLEAN' | 'DATE';

export type SemanticRole =
  | 'TARGET_WORD'
  | 'DEFINITION'
  | 'NATIVE_TRANSLATION'
  | 'EXAMPLE_SENTENCE'
  | 'AUDIO'
  | 'IMAGE';

export type TemplateElementType = 'FIELD' | 'SECTION_BREAK' | 'COLUMN_BREAK';
export type Alignment = 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFY';
export type CollectionType = 'SYSTEM' | 'USER';

export interface TemplateFieldDTO {
  id?: number;
  schemaAttributeId: number;
  attributeName?: string;
  semanticRole?: SemanticRole;
  fieldLabel?: string;
  hideIfEmpty: boolean;
  audioAction: boolean;
  required?: boolean;
  fontSize?: number;
  alignment?: Alignment;
  color?: string;
}

export interface TemplateElementDTO {
  id?: number;
  position: number;
  type: TemplateElementType;
  field?: TemplateFieldDTO;
}

export interface TemplateDTO {
  id: number;
  schemaId: number;
  code?: string;
  name: string;
  isDefault: boolean;
  elements: TemplateElementDTO[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionDTO {
  id: number;
  name: string;
  translation?: string;
  type: CollectionType;
  ownerId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicDTO {
  id: number;
  name: string;
  translation?: string;
  description?: string;
  parentId?: number;
  descriptionTranslation?: string;
  activeTemplateId?: number;
  activeTemplateName?: string;
  activeTemplateCode?: string;
  createdAt?: string;
  updatedAt?: string;
  children?: TopicDTO[];
}

export interface TopicAttributeSchemaDTO {
  attributeId: number;
  name: string;
  label: string;
  dataType: TopicAttributeDataType;
  required: boolean;
  position: number;
}

export interface TopicGroupSchemaDTO {
  groupId: number;
  name: string;
  label: string;
  multiple: boolean;
  position: number;
  attributes: TopicAttributeSchemaDTO[];
}

export interface TopicSchemaData {
  groups: TopicGroupSchemaDTO[];
}

// ==========================================
// 3. TOPIC ITEM DATA (Unwrapped Groups)
// ==========================================
export type TopicItemData = {
  topicItemId: number;
  createdAt?: string;
} & Record<string, EavGroupValue | number | string | undefined>;

// ==========================================
// 4. TEMPLATE MAPPING CONTRACT
// ==========================================
export interface TemplateFieldReference {
  attributeId?: number;
  path?: string; // e.g. "main.word", "main.audio"
}

export interface CardTemplateMapping {
  name: string;
  dictionaryLookupAttr?: TemplateFieldReference | string;
  front: {
    primaryAttr: TemplateFieldReference | string;
    secondaryAttr?: TemplateFieldReference | string;
    badgeAttr?: TemplateFieldReference | string;
    audioAttr?: TemplateFieldReference | string;
    imageAttr?: TemplateFieldReference | string;
    hintAttr?: TemplateFieldReference | string;
  };
  back: {
    primaryAttr: TemplateFieldReference | string;
    secondaryAttr?: TemplateFieldReference | string;
    badgeAttr?: TemplateFieldReference | string;
    audioAttr?: TemplateFieldReference | string;
    imageAttr?: TemplateFieldReference | string;
    exampleGroup?: string;
    exampleAttr?: TemplateFieldReference | string;
    exampleTranslationAttr?: TemplateFieldReference | string;
    hintAttr?: TemplateFieldReference | string;
  };
}

// ==========================================
// 5. RESPONSE & PRESENTATION STRUCTURES
// ==========================================
export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
  pages: number;
}

export interface TopicItemsResponse {
  data: TopicItemData[];
  meta: PaginationMeta;
  schema: TopicSchemaData;
}

export interface TopicPresentation {
  id: string;
  title: string;
  emoji: string;
  description: string;
  progress: number;
  contentTypeSummary: string;
  totalWords: number;
  defaultTemplate: CardTemplateMapping;
}

export interface MockTopicBundle {
  topic: TopicPresentation;
  response: TopicItemsResponse;
}

// ==========================================
// 6. HELPER FUNCTIONS
// ==========================================

/**
 * Tìm kiếm thông tin định nghĩa thuộc tính dựa vào attributeId hoặc path
 */
export function findAttributeByReference(
  schema: TopicSchemaData,
  ref: TemplateFieldReference | string | undefined
): { groupName: string; attr: TopicAttributeSchemaDTO } | undefined {
  if (!ref || !schema?.groups) return undefined;

  const targetId = typeof ref === 'object' ? ref.attributeId : undefined;
  const targetPath = typeof ref === 'string' ? ref : ref.path;

  // 1. Ưu tiên attributeId
  if (typeof targetId === 'number') {
    for (const group of schema.groups) {
      const found = group.attributes.find(a => a.attributeId === targetId);
      if (found) {
        return { groupName: group.name, attr: found };
      }
    }
  }

  // 2. Fallback path (e.g. "main.word" hoặc "word")
  if (targetPath) {
    const parts = targetPath.split('.');
    if (parts.length === 2) {
      const [groupName, attrName] = parts;
      const group = schema.groups.find(g => g.name === groupName);
      if (group) {
        const found = group.attributes.find(a => a.name === attrName);
        if (found) return { groupName: group.name, attr: found };
      }
    } else if (parts.length === 1) {
      const attrName = parts[0];
      for (const group of schema.groups) {
        const found = group.attributes.find(a => a.name === attrName);
        if (found) return { groupName: group.name, attr: found };
      }
    }
  }

  return undefined;
}

/**
 * Đọc giá trị thuộc tính an toàn từ TopicItemData
 * Ưu tiên tra cứu qua attributeId trong schema, sau đó fallback sang path
 */
export function resolveAttributeValue(
  item: TopicItemData,
  ref: TemplateFieldReference | string | undefined,
  schema?: TopicSchemaData
): EavPrimitive | undefined {
  if (!item || !ref) return undefined;

  // 1. Thử tra cứu qua schema nếu có
  if (schema) {
    const meta = findAttributeByReference(schema, ref);
    if (meta) {
      const groupVal = item[meta.groupName];
      if (isGroupInstance(groupVal)) {
        return groupVal[meta.attr.name] ?? undefined;
      }
    }
  }

  // 2. Fallback trực tiếp qua path
  const targetPath = typeof ref === 'string' ? ref : ref.path;
  if (targetPath) {
    const parts = targetPath.split('.');
    if (parts.length === 2) {
      const [groupName, attrName] = parts;
      const groupVal = item[groupName];
      if (isGroupInstance(groupVal)) {
        return groupVal[attrName] ?? undefined;
      }
    } else if (parts.length === 1) {
      // Tìm trong tất cả các nhóm đơn
      for (const key of Object.keys(item)) {
        if (key === 'topicItemId' || key === 'createdAt') continue;
        const groupVal = item[key];
        if (isGroupInstance(groupVal) && parts[0] in groupVal) {
          return groupVal[parts[0]] ?? undefined;
        }
      }
    }
  }

  return undefined;
}

/**
 * Lấy danh sách instances của một nhóm lặp (multiple: true)
 */
export function resolveGroupInstances(
  item: TopicItemData,
  groupName: string
): EavGroupInstance[] {
  if (!item) return [];
  const val = item[groupName];
  if (isGroupInstanceArray(val)) {
    return val;
  }
  if (isGroupInstance(val)) {
    return [val];
  }
  return [];
}

// ==========================================
// 7. MOCK DATA STORE (Đa dạng Schema EAV)
// ==========================================

// --- TOPIC 1: AIRPORT VOCABULARY (Từ vựng + Nhóm câu ví dụ) ---
const AIRPORT_VOCABULARY_BUNDLE: MockTopicBundle = {
  topic: {
    id: 'airport-vocabulary',
    title: 'Sân bay (Thủ tục & Check-in)',
    emoji: '✈️',
    description: 'Trọn bộ từ vựng thiết yếu nhất cho mọi thủ tục tại sân bay quốc tế.',
    progress: 42,
    totalWords: 72,
    contentTypeSummary: '72 mục · Từ vựng · Audio · Ví dụ',
    defaultTemplate: {
      name: 'Vocabulary Flashcard',
      dictionaryLookupAttr: 'main.word',
      front: {
        primaryAttr: { attributeId: 101, path: 'main.word' },
        secondaryAttr: { attributeId: 102, path: 'main.ipa' },
        badgeAttr: { attributeId: 104, path: 'main.partOfSpeech' },
        audioAttr: { attributeId: 105, path: 'main.audio' },
      },
      back: {
        primaryAttr: { attributeId: 103, path: 'main.meaning' },
        secondaryAttr: { attributeId: 102, path: 'main.ipa' },
        badgeAttr: { attributeId: 104, path: 'main.partOfSpeech' },
        imageAttr: { attributeId: 106, path: 'main.image' },
        audioAttr: { attributeId: 105, path: 'main.audio' },
        exampleGroup: 'examples',
        exampleAttr: { attributeId: 107, path: 'examples.sentence' },
        exampleTranslationAttr: { attributeId: 108, path: 'examples.translation' },
      },
    },
  },
  response: {
    meta: { page: 0, size: 20, total: 72, pages: 4 },
    schema: {
      groups: [
        {
          groupId: 1,
          name: 'main',
          label: 'Thông tin chính',
          multiple: false,
          position: 1,
          attributes: [
            { attributeId: 101, name: 'word', label: 'Từ vựng', dataType: 'TEXT', required: true, position: 1 },
            { attributeId: 102, name: 'ipa', label: 'Phiên âm', dataType: 'TEXT', required: false, position: 2 },
            { attributeId: 103, name: 'meaning', label: 'Định nghĩa', dataType: 'TEXT', required: true, position: 3 },
            { attributeId: 104, name: 'partOfSpeech', label: 'Từ loại', dataType: 'TEXT', required: false, position: 4 },
            { attributeId: 105, name: 'audio', label: 'Phát âm chuẩn', dataType: 'AUDIO', required: false, position: 5 },
            { attributeId: 106, name: 'image', label: 'Hình ảnh', dataType: 'IMAGE', required: false, position: 6 },
          ],
        },
        {
          groupId: 2,
          name: 'examples',
          label: 'Câu ví dụ thực tế',
          multiple: true,
          position: 2,
          attributes: [
            { attributeId: 107, name: 'sentence', label: 'Câu ví dụ (Anh)', dataType: 'TEXT', required: true, position: 1 },
            { attributeId: 108, name: 'translation', label: 'Bản dịch (Việt)', dataType: 'TEXT', required: false, position: 2 },
          ],
        },
      ],
    },
    data: [
      {
        topicItemId: 1001,
        main: {
          word: 'boarding pass',
          ipa: '/ˈbɔːrdɪŋ pæs/',
          meaning: 'thẻ lên máy bay',
          partOfSpeech: 'noun',
          audio: 'mock://audio/boarding-pass.mp3',
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
        },
        examples: [
          {
            sentence: 'Please present your boarding pass and passport at the gate.',
            translation: 'Vui lòng xuất trình thẻ lên máy bay và hộ chiếu tại cổng.',
          },
          {
            sentence: 'You can print your boarding pass at the self-service kiosk.',
            translation: 'Bạn có thể in thẻ lên máy bay tại quầy tự phục vụ.',
          },
        ],
      },
      {
        topicItemId: 1002,
        main: {
          word: 'terminal',
          ipa: '/ˈtɜːrmɪnəl/',
          meaning: 'nhà ga sân bay',
          partOfSpeech: 'noun',
          audio: 'mock://audio/terminal.mp3',
          image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80',
        },
        examples: [
          {
            sentence: 'International flights depart from Terminal 2.',
            translation: 'Các chuyến bay quốc tế khởi hành từ Nhà ga số 2.',
          },
          {
            sentence: 'A free shuttle bus connects all three terminals.',
            translation: 'Xe buýt trung chuyển miễn phí kết nối cả ba nhà ga.',
          },
        ],
      },
      {
        topicItemId: 1003,
        main: {
          word: 'luggage',
          ipa: '/ˈlʌɡɪdʒ/',
          meaning: 'hành lý',
          partOfSpeech: 'noun',
          audio: 'mock://audio/luggage.mp3',
          image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=600&auto=format&fit=crop&q=80',
        },
        examples: [
          {
            sentence: 'You can collect your luggage at baggage claim carousel 4.',
            translation: 'Bạn có thể nhận hành lý tại băng chuyền số 4 khu nhận hành lý.',
          },
        ],
      },
      {
        topicItemId: 1004,
        main: {
          word: 'customs',
          ipa: '/ˈkʌstəmz/',
          meaning: 'hải quan',
          partOfSpeech: 'noun',
          audio: 'mock://audio/customs.mp3',
          image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=600&auto=format&fit=crop&q=80',
        },
        examples: [
          {
            sentence: 'He had to declare his luxury goods at customs.',
            translation: 'Anh ấy phải khai báo các món hàng xa xỉ tại quầy hải quan.',
          },
        ],
      },
      {
        topicItemId: 1005,
        main: {
          word: 'departure',
          ipa: '/dɪˈpɑːrtʃər/',
          meaning: 'chuyến bay khởi hành',
          partOfSpeech: 'noun',
          audio: 'mock://audio/departure.mp3',
          image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80',
        },
        examples: [
          {
            sentence: 'Check the flight departure board for schedule changes.',
            translation: 'Hãy kiểm tra bảng thông tin chuyến bay để cập nhật lịch trình.',
          },
        ],
      },
      {
        topicItemId: 1006,
        main: {
          word: 'carousel',
          ipa: '/ˌkær.əˈsel/',
          meaning: 'băng chuyền hành lý',
          partOfSpeech: 'noun',
          audio: 'mock://audio/carousel.mp3',
          image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&auto=format&fit=crop&q=80',
        },
        examples: [
          {
            sentence: 'Bags for flight VN123 are arriving at carousel 3.',
            translation: 'Hành lý chuyến bay VN123 đang ra tại băng chuyền 3.',
          },
        ],
      },
    ],
  },
};

// --- TOPIC 2: RESTAURANT DIALOGUE (Hội thoại + Luyện nghe + Transcript) ---
const RESTAURANT_DIALOGUE_BUNDLE: MockTopicBundle = {
  topic: {
    id: 'restaurant-dialogue',
    title: 'Hội thoại nhà hàng',
    emoji: '🍽️',
    description: 'Các tình huống giao tiếp, gọi món và thanh toán phổ biến khi đi ăn nhà hàng.',
    progress: 20,
    totalWords: 20,
    contentTypeSummary: '20 bài · Luyện nghe · Transcript',
    defaultTemplate: {
      name: 'Dialogue Listening Card',
      // Không có dictionaryLookupAttr vì là mẫu câu / hội thoại
      front: {
        primaryAttr: { attributeId: 201, path: 'main.phrase' },
        secondaryAttr: { attributeId: 203, path: 'main.role' },
        badgeAttr: { attributeId: 203, path: 'main.role' },
        audioAttr: { attributeId: 204, path: 'main.audio' },
      },
      back: {
        primaryAttr: { attributeId: 202, path: 'main.meaning' },
        secondaryAttr: { attributeId: 205, path: 'main.tip' },
        audioAttr: { attributeId: 204, path: 'main.audio' },
        exampleGroup: 'dialogue_lines',
        exampleAttr: { attributeId: 207, path: 'dialogue_lines.line' },
        exampleTranslationAttr: { attributeId: 208, path: 'dialogue_lines.translation' },
      },
    },
  },
  response: {
    meta: { page: 0, size: 20, total: 20, pages: 1 },
    schema: {
      groups: [
        {
          groupId: 20,
          name: 'main',
          label: 'Thông tin mẫu câu',
          multiple: false,
          position: 1,
          attributes: [
            { attributeId: 201, name: 'phrase', label: 'Mẫu câu giao tiếp', dataType: 'TEXT', required: true, position: 1 },
            { attributeId: 202, name: 'meaning', label: 'Nghĩa ngữ cảnh', dataType: 'TEXT', required: true, position: 2 },
            { attributeId: 203, name: 'role', label: 'Đối tượng nói', dataType: 'TEXT', required: false, position: 3 },
            { attributeId: 204, name: 'audio', label: 'Băng ghi âm', dataType: 'AUDIO', required: false, position: 4 },
            { attributeId: 205, name: 'tip', label: 'Mẹo văn hóa / Lưu ý', dataType: 'TEXT', required: false, position: 5 },
          ],
        },
        {
          groupId: 21,
          name: 'dialogue_lines',
          label: 'Đoạn hội thoại mẫu (Transcript)',
          multiple: true,
          position: 2,
          attributes: [
            { attributeId: 206, name: 'speaker', label: 'Người thoại', dataType: 'TEXT', required: true, position: 1 },
            { attributeId: 207, name: 'line', label: 'Lời thoại (Anh)', dataType: 'TEXT', required: true, position: 2 },
            { attributeId: 208, name: 'translation', label: 'Dịch nghĩa (Việt)', dataType: 'TEXT', required: false, position: 3 },
          ],
        },
      ],
    },
    data: [
      {
        topicItemId: 2001,
        main: {
          phrase: 'Could we get the bill, please?',
          meaning: 'Cho chúng tôi xin hóa đơn thanh toán được không?',
          role: 'Thực khách (Customer)',
          audio: 'mock://audio/could-we-get-the-bill.mp3',
          tip: 'Ở Mỹ thường dùng "check", ở Anh thường dùng "bill".',
        },
        dialogue_lines: [
          {
            speaker: 'Customer',
            line: 'Excuse me, could we get the bill, please?',
            translation: 'Xin lỗi, cho chúng tôi xin hóa đơn được không?',
          },
          {
            speaker: 'Waiter',
            line: 'Certainly! Will you be paying with card or cash today?',
            translation: 'Dạ được ngay ạ! Hôm nay anh chị thanh toán thẻ hay tiền mặt?',
          },
          {
            speaker: 'Customer',
            line: 'Card, please. Can we add a tip on the machine?',
            translation: 'Thẻ nhé. Chúng tôi có thể quẹt kèm tiền boa trên máy được không?',
          },
        ],
      },
      {
        topicItemId: 2002,
        main: {
          phrase: 'Do you have any vegetarian options?',
          meaning: 'Nhà hàng có các món ăn chay không?',
          role: 'Thực khách (Customer)',
          audio: 'mock://audio/vegetarian-options.mp3',
          tip: 'Hỏi trước khi gọi món để bồi bàn tư vấn phần rau củ riêng.',
        },
        dialogue_lines: [
          {
            speaker: 'Customer',
            line: 'We love the menu, but do you have any vegetarian options?',
            translation: 'Thực đơn rất ngon, nhưng nhà hàng có món chay nào không?',
          },
          {
            speaker: 'Waiter',
            line: 'Yes, page four lists all our plant-based dishes.',
            translation: 'Dạ có, trang số bốn liệt kê tất cả các món thuần chay của quán.',
          },
        ],
      },
      {
        topicItemId: 2003,
        main: {
          phrase: 'Table for two, please.',
          meaning: 'Vui lòng cho tôi bàn hai người.',
          role: 'Đón tiếp (Reception)',
          audio: 'mock://audio/table-for-two.mp3',
          tip: 'Nói ngay khi vừa bước vào quầy lễ tân nhà hàng.',
        },
        dialogue_lines: [
          {
            speaker: 'Customer',
            line: 'Hi, good evening. Table for two, please.',
            translation: 'Chào buổi tối. Cho chúng tôi bàn hai người nhé.',
          },
          {
            speaker: 'Host',
            line: 'Right this way, by the window.',
            translation: 'Mời anh chị đi lối này, bàn cạnh cửa sổ ạ.',
          },
        ],
      },
    ],
  },
};

// --- TOPIC 3: AIRPORT SIGNS (Biển báo sân bay + Hình ảnh trực quan) ---
const AIRPORT_SIGNS_BUNDLE: MockTopicBundle = {
  topic: {
    id: 'airport-signs',
    title: 'Biển báo sân bay',
    emoji: '🚸',
    description: 'Học nhận diện các biển chỉ dẫn an toàn, cổng ra vào và ký hiệu quốc tế.',
    progress: 80,
    totalWords: 25,
    contentTypeSummary: '25 mục · Biển báo · Hình ảnh · Audio',
    defaultTemplate: {
      name: 'Visual Signs Card',
      // Không có dictionaryLookupAttr
      front: {
        primaryAttr: { attributeId: 303, path: 'main.image' },
        secondaryAttr: { attributeId: 304, path: 'main.warning_level' },
        badgeAttr: { attributeId: 304, path: 'main.warning_level' },
        audioAttr: { attributeId: 305, path: 'main.audio' },
      },
      back: {
        primaryAttr: { attributeId: 301, path: 'main.sign_name' },
        secondaryAttr: { attributeId: 302, path: 'main.meaning' },
        audioAttr: { attributeId: 305, path: 'main.audio' },
        exampleGroup: 'locations',
        exampleAttr: { attributeId: 306, path: 'locations.place' },
        exampleTranslationAttr: { attributeId: 307, path: 'locations.instruction' },
      },
    },
  },
  response: {
    meta: { page: 0, size: 20, total: 25, pages: 2 },
    schema: {
      groups: [
        {
          groupId: 30,
          name: 'main',
          label: 'Thông tin biển báo',
          multiple: false,
          position: 1,
          attributes: [
            { attributeId: 301, name: 'sign_name', label: 'Tên biển báo', dataType: 'TEXT', required: true, position: 1 },
            { attributeId: 302, name: 'meaning', label: 'Ý nghĩa quy định', dataType: 'TEXT', required: true, position: 2 },
            { attributeId: 303, name: 'image', label: 'Hình ảnh biển báo', dataType: 'IMAGE', required: true, position: 3 },
            { attributeId: 304, name: 'warning_level', label: 'Mức độ cảnh báo', dataType: 'TEXT', required: false, position: 4 },
            { attributeId: 305, name: 'audio', label: 'Phát âm tên biển', dataType: 'AUDIO', required: false, position: 5 },
          ],
        },
        {
          groupId: 31,
          name: 'locations',
          label: 'Vị trí & Hướng dẫn hành động',
          multiple: true,
          position: 2,
          attributes: [
            { attributeId: 306, name: 'place', label: 'Vị trí thường thấy', dataType: 'TEXT', required: true, position: 1 },
            { attributeId: 307, name: 'instruction', label: 'Hành động cần làm', dataType: 'TEXT', required: true, position: 2 },
          ],
        },
      ],
    },
    data: [
      {
        topicItemId: 3001,
        main: {
          sign_name: 'Emergency Exit',
          meaning: 'Lối thoát hiểm khẩn cấp trong trường hợp sự cố.',
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80',
          warning_level: 'Khẩn cấp (High)',
          audio: 'mock://audio/emergency-exit.mp3',
        },
        locations: [
          {
            place: 'Dọc hành lang cổng chờ và thân máy bay',
            instruction: 'Giữ bình tĩnh, di chuyển theo hướng mũi tên xanh khi có còi báo động.',
          },
          {
            place: 'Khu vực cầu thang thoát hiểm tầng 2',
            instruction: 'Không sử dụng thang máy khi có chuông báo cháy.',
          },
        ],
      },
      {
        topicItemId: 3002,
        main: {
          sign_name: 'No Liquids Beyond This Point',
          meaning: 'Không mang chất lỏng vượt quá 100ml qua cửa an ninh.',
          image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=600&auto=format&fit=crop&q=80',
          warning_level: 'Bắt buộc (Mandatory)',
          audio: 'mock://audio/no-liquids.mp3',
        },
        locations: [
          {
            place: 'Ngay trước hàng rào soi chiếu an ninh',
            instruction: 'Uống hết hoặc bỏ chai nước vào thùng rác quy định trước khi vào làn.',
          },
        ],
      },
      {
        topicItemId: 3003,
        main: {
          sign_name: 'Baggage Reclaim Area',
          meaning: 'Khu vực nhận lại hành lý ký gửi sau chuyến bay.',
          image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=600&auto=format&fit=crop&q=80',
          warning_level: 'Chỉ dẫn (Information)',
          audio: 'mock://audio/baggage-reclaim.mp3',
        },
        locations: [
          {
            place: 'Tầng 1 sảnh đến sau cửa hải quan',
            instruction: 'Tìm số chuyến bay trên bảng điện tử để đến đúng băng chuyền.',
          },
        ],
      },
    ],
  },
};

// ==========================================
// 8. BUNDLE REGISTRY & ALIAS MAP
// ==========================================
const BUNDLE_MAP: Record<string, MockTopicBundle> = {
  'airport-vocabulary': AIRPORT_VOCABULARY_BUNDLE,
  'restaurant-dialogue': RESTAURANT_DIALOGUE_BUNDLE,
  'airport-signs': AIRPORT_SIGNS_BUNDLE,
  // Alias tương thích ngược cho id cũ
  't1': AIRPORT_VOCABULARY_BUNDLE,
  't1_1': AIRPORT_VOCABULARY_BUNDLE,
  't1_2': AIRPORT_VOCABULARY_BUNDLE,
  't1_3': AIRPORT_VOCABULARY_BUNDLE,
  't2': RESTAURANT_DIALOGUE_BUNDLE,
  't3': AIRPORT_SIGNS_BUNDLE,
};

/**
 * Lấy MockTopicBundle theo topicId (hỗ trợ cả id mới và id cũ)
 */
export function getMockTopicBundle(topicId: string): MockTopicBundle {
  if (BUNDLE_MAP[topicId]) {
    return BUNDLE_MAP[topicId];
  }

  // Fallback an toàn nếu id chưa có
  return {
    topic: {
      id: topicId,
      title: `Chủ đề #${topicId}`,
      emoji: '📖',
      description: 'Chủ đề đang được đồng bộ dữ liệu EAV.',
      progress: 0,
      totalWords: 10,
      contentTypeSummary: '10 mục · Dữ liệu động',
      defaultTemplate: AIRPORT_VOCABULARY_BUNDLE.topic.defaultTemplate,
    },
    response: {
      meta: { page: 0, size: 10, total: 10, pages: 1 },
      schema: AIRPORT_VOCABULARY_BUNDLE.response.schema,
      data: AIRPORT_VOCABULARY_BUNDLE.response.data.slice(0, 3),
    },
  };
}

/**
 * Lấy danh sách tóm tắt TopicPresentation
 */
export function getAllMockTopicPresentations(): TopicPresentation[] {
  return [
    AIRPORT_VOCABULARY_BUNDLE.topic,
    RESTAURANT_DIALOGUE_BUNDLE.topic,
    AIRPORT_SIGNS_BUNDLE.topic,
  ];
}
