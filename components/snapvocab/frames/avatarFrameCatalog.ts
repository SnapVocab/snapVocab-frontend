export type AvatarFrameRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AvatarFrameDefinition {
  id: string;
  name: string;
  englishName: string;
  slogan: string;
  description: string;
  rarity: AvatarFrameRarity;
  rarityLabel: string;
  price: number;
  currency: 'coins' | 'gems';
  tag?: string;
  glowColor: string;
  accentColor: string;
  bgBadgeClass: string;
  pngSource: any;
  webpSource: any;
}

export const AVATAR_FRAME_CATALOG: Record<string, AvatarFrameDefinition> = {
  frame_bronze_learner: {
    id: 'frame_bronze_learner',
    name: 'Khung Đồng Mở Lối',
    englishName: 'Bronze Learner',
    slogan: 'Every journey starts somewhere',
    description: 'Vòng gỗ khắc tinh xảo điểm xuyết ngôi sao đồng, dây leo xanh tươi cùng cuốn sách mở khởi đầu hành trình tri thức.',
    rarity: 'common',
    rarityLabel: 'Khởi đầu',
    price: 350,
    currency: 'coins',
    tag: 'BẮT ĐẦU',
    glowColor: 'rgba(212, 143, 56, 0.45)',
    accentColor: '#D48F38',
    bgBadgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    pngSource: require('../../../assets/images/frames/frame_bronze_learner.png'),
    webpSource: require('../../../assets/images/frames/frame_bronze_learner_anim.webp'),
  },
  frame_silver_scholar: {
    id: 'frame_silver_scholar',
    name: 'Học Giả Bạc',
    englishName: 'Silver Scholar',
    slogan: 'Curiosity never stops',
    description: 'Khung bạch kim sáng chói đính các tinh thể đá quý sapphire lam ngọc và cuộn thư cổ của những học giả kiên trì.',
    rarity: 'rare',
    rarityLabel: 'Hiếm',
    price: 600,
    currency: 'coins',
    tag: 'TRÍ TUỆ',
    glowColor: 'rgba(100, 180, 255, 0.5)',
    accentColor: '#38BDF8',
    bgBadgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    pngSource: require('../../../assets/images/frames/frame_silver_scholar.png'),
    webpSource: require('../../../assets/images/frames/frame_silver_scholar_anim.webp'),
  },
  frame_golden_wordsmith: {
    id: 'frame_golden_wordsmith',
    name: 'Bậc Thầy Hoàng Kim',
    englishName: 'Golden Wordsmith',
    slogan: 'Words build a brighter you',
    description: 'Vương miện hoàng gia vàng rực rỡ, đôi cánh vinh quang và dải lụa nhung đỏ dành cho những bậc thầy làm chủ kho từ vựng.',
    rarity: 'epic',
    rarityLabel: 'Sử thi',
    price: 950,
    currency: 'coins',
    tag: 'QUÝ PHÁI',
    glowColor: 'rgba(255, 200, 40, 0.6)',
    accentColor: '#EAB308',
    bgBadgeClass: 'bg-yellow-50 text-yellow-800 border-yellow-300',
    pngSource: require('../../../assets/images/frames/frame_golden_wordsmith.png'),
    webpSource: require('../../../assets/images/frames/frame_golden_wordsmith_anim.webp'),
  },
  frame_fire_streak: {
    id: 'frame_fire_streak',
    name: 'Ngọn Lửa Bất Diệt',
    englishName: 'Fire Streak',
    slogan: 'Keep the streak alive!',
    description: 'Ngọn lửa rực cháy nhiệt huyết giữ vững chuỗi Streak mỗi ngày, cùng biểu cảm nháy mắt tinh nghịch của linh vật Snapy.',
    rarity: 'epic',
    rarityLabel: 'Streak Hot',
    price: 850,
    currency: 'coins',
    tag: 'HOT STREAK',
    glowColor: 'rgba(255, 100, 20, 0.65)',
    accentColor: '#F97316',
    bgBadgeClass: 'bg-orange-50 text-orange-700 border-orange-300',
    pngSource: require('../../../assets/images/frames/frame_fire_streak.png'),
    webpSource: require('../../../assets/images/frames/frame_fire_streak_anim.webp'),
  },
  frame_nature_explorer: {
    id: 'frame_nature_explorer',
    name: 'Nhà Khám Phá Tự Nhiên',
    englishName: 'Nature Explorer',
    slogan: 'Discover words everywhere',
    description: 'Dây leo sinh động ôm ấp cành cây non, tán lá xanh mướt và những bông hoa trắng thuần khiết vươn mình trong sớm mai.',
    rarity: 'rare',
    rarityLabel: 'Hiếm',
    price: 550,
    currency: 'coins',
    tag: 'TƯƠI MÁT',
    glowColor: 'rgba(88, 204, 2, 0.55)',
    accentColor: '#58CC02',
    bgBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pngSource: require('../../../assets/images/frames/frame_nature_explorer.png'),
    webpSource: require('../../../assets/images/frames/frame_nature_explorer_anim.webp'),
  },
  frame_night_owl: {
    id: 'frame_night_owl',
    name: 'Cú Đêm Chăm Học',
    englishName: 'Night Owl',
    slogan: 'Good words, late nights',
    description: 'Bầu trời đêm huyền ảo lấp lánh muôn vì sao, trăng lưỡi liềm dát vàng và bé Snapy say giấc nồng trên đám mây êm ái.',
    rarity: 'epic',
    rarityLabel: 'Sử thi',
    price: 880,
    currency: 'coins',
    tag: 'DẠ QUANG',
    glowColor: 'rgba(147, 51, 234, 0.6)',
    accentColor: '#9333EA',
    bgBadgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    pngSource: require('../../../assets/images/frames/frame_night_owl.png'),
    webpSource: require('../../../assets/images/frames/frame_night_owl_anim.webp'),
  },
  frame_ocean_voyager: {
    id: 'frame_ocean_voyager',
    name: 'Nhà Du Hành Đại Dương',
    englishName: 'Ocean Voyager',
    slogan: 'Explore a wider world',
    description: 'Những con sóng xanh biếc cuộn trào bọt nước mát lạnh cùng chiếc thuyền buồm kiên cường vượt đại dương tri thức.',
    rarity: 'epic',
    rarityLabel: 'Sử thi',
    price: 800,
    currency: 'coins',
    tag: 'PHIÊU LƯU',
    glowColor: 'rgba(147, 51, 234, 0.6)',
    accentColor: '#0EA5E9',
    bgBadgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    pngSource: require('../../../assets/images/frames/frame_ocean_voyager.png'),
    webpSource: require('../../../assets/images/frames/frame_ocean_voyager_anim.webp'),
  },
  frame_space_dreamer: {
    id: 'frame_space_dreamer',
    name: 'Giấc Mơ Vũ Trụ',
    englishName: 'Space Dreamer',
    slogan: 'Higher words, brighter future',
    description: 'Dải ngân hà sâu thẳm tím biếc, phi thuyền tên lửa đang phóng lên không gian cùng vành đai hành tinh rực rỡ.',
    rarity: 'epic',
    rarityLabel: 'Sử thi',
    price: 1100,
    currency: 'coins',
    tag: 'KHÁM PHÁ',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    accentColor: '#A855F7',
    bgBadgeClass: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    pngSource: require('../../../assets/images/frames/frame_space_dreamer.png'),
    webpSource: require('../../../assets/images/frames/frame_space_dreamer_anim.webp'),
  },
  frame_cherry_blossom: {
    id: 'frame_cherry_blossom',
    name: 'Hoa Anh Đào Mùa Xuân',
    englishName: 'Cherry Blossom',
    slogan: 'Small progress, big change',
    description: 'Cành hoa sakura mùa xuân dịu dàng, những cánh hoa hồng phấn bung nở mang lại cảm giác bình yên và thanh thoát.',
    rarity: 'rare',
    rarityLabel: 'Giới hạn',
    price: 700,
    currency: 'coins',
    tag: 'GIỚI HẠN',
    glowColor: 'rgba(244, 114, 182, 0.55)',
    accentColor: '#F472B6',
    bgBadgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
    pngSource: require('../../../assets/images/frames/frame_cherry_blossom.png'),
    webpSource: require('../../../assets/images/frames/frame_cherry_blossom_anim.webp'),
  },
  frame_legendary: {
    id: 'frame_legendary',
    name: 'Huyền Thoại Bất Hủ',
    englishName: 'Legendary',
    slogan: 'A lifetime of learning',
    description: 'Khung tối thượng biểu tượng của sự thành tựu: đôi cánh hoàng kim thần thánh bao bọc tinh thể kim cương pha lê xanh vĩnh cửu.',
    rarity: 'legendary',
    rarityLabel: 'Huyền thoại',
    price: 1500,
    currency: 'coins',
    tag: 'HUYỀN THOẠI',
    glowColor: 'rgba(56, 189, 248, 0.75)',
    accentColor: '#38BDF8',
    bgBadgeClass: 'bg-amber-100 text-amber-900 border-amber-400',
    pngSource: require('../../../assets/images/frames/frame_legendary.png'),
    webpSource: require('../../../assets/images/frames/frame_legendary_anim.webp'),
  },
};

export const AVATAR_FRAME_LIST: AvatarFrameDefinition[] = Object.values(AVATAR_FRAME_CATALOG);

export function getAvatarFrame(frameId?: string | null): AvatarFrameDefinition | undefined {
  if (!frameId) return undefined;
  return AVATAR_FRAME_CATALOG[frameId];
}
