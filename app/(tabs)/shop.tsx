import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { 
  PackageIcon, 
  SparklesIcon, 
  ClockIcon, 
  FlameIcon,
  TagIcon 
} from 'lucide-react-native';
import { Coin3D } from '@/components/snapvocab';
import { cn } from '@/lib/utils';
import { ShopItemCard, ShopItemType } from '@/components/shop/ShopItemCard';
import { PurchaseSuccessModal } from '@/components/shop/PurchaseSuccessModal';
import { OutOfCoinModal } from '@/components/shop/OutOfCoinModal';
import { AvatarFrameShowcaseModal } from '@/components/shop/AvatarFrameShowcaseModal';
import { useEconomyState } from '@/lib/economyState';

// ==========================================
// CATEGORIES & CATALOG DEFINITION
// ==========================================
const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'booster', label: 'Thẻ bổ trợ' },
  { id: 'frame', label: 'Khung Avatar' },
  { id: 'special', label: 'Đặc biệt' },
];

const RAW_SHOP_ITEMS: Omit<ShopItemType, 'isOwned' | 'quantityOwned'>[] = [
  // --- 1. BOOSTER & CONSUMABLES ---
  {
    id: 'item_xp_booster',
    name: 'Nhân Đôi KN',
    description: 'Nhân đôi điểm kinh nghiệm trong 15 phút ôn tập tiếp theo.',
    category: 'booster',
    categoryLabel: 'Bổ trợ',
    price: 250,
    isConsumable: true,
    imageSource: require('../../assets/images/shop/icon1_clean.png'),
    bgColorClass: 'bg-amber-50',
    badgeLabel: 'HOT'
  },
  {
    id: 'item_streak_freeze',
    name: 'Bảo Hiểm Chuỗi',
    description: 'Bảo vệ chuỗi Streak học tập nếu bạn lỡ quên học 1 ngày.',
    category: 'booster',
    categoryLabel: 'Bảo vệ',
    price: 400,
    isConsumable: true,
    imageSource: require('../../assets/images/shop/icon5_clean.png'),
    bgColorClass: 'bg-sky-50',
    badgeLabel: 'CẦN THIẾT'
  },
  {
    id: 'item_heart_refill',
    name: 'Hồi Phục Tim',
    description: 'Làm đầy 5 tim ngay lập tức để tiếp tục các bài kiểm tra.',
    category: 'booster',
    categoryLabel: 'Hồi phục',
    price: 350,
    isConsumable: true,
    imageSource: require('../../assets/images/shop/icon9_clean.png'),
    bgColorClass: 'bg-rose-50'
  },
  {
    id: 'item_magnet',
    name: 'Nam Châm Xu',
    description: 'Tự động thu hút toàn bộ xu thưởng trong bài học thực hành.',
    category: 'booster',
    categoryLabel: 'Bổ trợ',
    price: 300,
    isConsumable: true,
    imageSource: require('../../assets/images/shop/icon2_clean.png'),
    bgColorClass: 'bg-red-50'
  },
  {
    id: 'item_refresh_ticket',
    name: 'Vé Đổi Mới',
    description: 'Tạo mới hoàn toàn bộ câu hỏi ôn tập khi gặp chủ đề khó.',
    category: 'booster',
    categoryLabel: 'Token',
    price: 100,
    isConsumable: true,
    imageSource: require('../../assets/images/shop/icon6_clean.png'),
    bgColorClass: 'bg-blue-50'
  },
  {
    id: 'item_hint_token',
    name: 'Gợi Ý Từ Vựng',
    description: 'Mở khóa 3 lượt gợi ý từ ngữ trong các bài thi thử TOEIC.',
    category: 'booster',
    categoryLabel: 'Token',
    price: 150,
    isConsumable: true,
    imageSource: require('../../assets/images/shop/icon7_clean.png'),
    bgColorClass: 'bg-purple-50'
  },
  {
    id: 'item_timer_boost',
    name: 'Thêm Thời Gian',
    description: 'Cộng thêm 60 giây vào bài kiểm tra tính giờ phản xạ.',
    category: 'booster',
    categoryLabel: 'Bổ trợ',
    price: 200,
    isConsumable: true,
    imageSource: require('../../assets/images/shop/icon8_clean.png'),
    bgColorClass: 'bg-orange-50'
  },

  // --- 2. OFFICIAL AVATAR FRAMES (SHOP ITEM SERIES) ---
  {
    id: 'frame_bronze_learner',
    name: 'Khung Đồng Mở Lối',
    description: 'Every journey starts somewhere. Vòng gỗ khắc tinh xảo, lá non và cuốn sách mở.',
    category: 'frame',
    categoryLabel: 'Khung Avatar',
    price: 350,
    isConsumable: false,
    imageSource: require('../../assets/images/frames/frame_bronze_learner_anim.webp'),
    bgColorClass: 'bg-amber-50',
    badgeLabel: 'BẮT ĐẦU'
  },
  {
    id: 'frame_silver_scholar',
    name: 'Học Giả Bạc',
    description: 'Curiosity never stops. Khung bạch kim đính sapphire lam ngọc và cuộn thư cổ.',
    category: 'frame',
    categoryLabel: 'Khung Avatar',
    price: 600,
    isConsumable: false,
    imageSource: require('../../assets/images/frames/frame_silver_scholar_anim.webp'),
    bgColorClass: 'bg-sky-50'
  },
  {
    id: 'frame_golden_wordsmith',
    name: 'Bậc Thầy Hoàng Kim',
    description: 'Words build a brighter you. Vương miện hoàng gia, cánh thiên thần và dải lụa nhung đỏ.',
    category: 'frame',
    categoryLabel: 'Khung Avatar',
    price: 950,
    isConsumable: false,
    imageSource: require('../../assets/images/frames/frame_golden_wordsmith_anim.webp'),
    bgColorClass: 'bg-yellow-50',
    badgeLabel: 'SỬ THI'
  },
  {
    id: 'frame_fire_streak',
    name: 'Ngọn Lửa Bất Diệt',
    description: 'Keep the streak alive! Ngọn lửa nhiệt huyết giữ vững chuỗi học tập cùng Snapy nháy mắt.',
    category: 'frame',
    categoryLabel: 'Khung Avatar',
    price: 850,
    isConsumable: false,
    imageSource: require('../../assets/images/frames/frame_fire_streak_anim.webp'),
    bgColorClass: 'bg-orange-50',
    badgeLabel: 'HOT STREAK'
  },
  {
    id: 'frame_nature_explorer',
    name: 'Nhà Khám Phá Tự Nhiên',
    description: 'Discover words everywhere. Dây leo sinh động ôm ấp cành cây non và hoa lài trắng.',
    category: 'frame',
    categoryLabel: 'Khung Avatar',
    price: 550,
    isConsumable: false,
    imageSource: require('../../assets/images/frames/frame_nature_explorer_anim.webp'),
    bgColorClass: 'bg-emerald-50'
  },
  {
    id: 'frame_night_owl',
    name: 'Cú Đêm Chăm Học',
    description: 'Good words, late nights. Bầu trời đêm huyền ảo, trăng dát vàng và bé Snapy ngủ say.',
    category: 'frame',
    categoryLabel: 'Khung Avatar',
    price: 880,
    isConsumable: false,
    imageSource: require('../../assets/images/frames/frame_night_owl_anim.webp'),
    bgColorClass: 'bg-purple-50',
    badgeLabel: 'DẠ QUANG'
  },
  {
    id: 'frame_ocean_voyager',
    name: 'Nhà Du Hành Đại Dương',
    description: 'Explore a wider world. Lớp sóng biển cuộn trào bọt trắng cùng thuyền buồm vượt đại dương.',
    category: 'frame',
    categoryLabel: 'Khung Avatar',
    price: 800,
    isConsumable: false,
    imageSource: require('../../assets/images/frames/frame_ocean_voyager_anim.webp'),
    bgColorClass: 'bg-cyan-50'
  },
  {
    id: 'frame_space_dreamer',
    name: 'Giấc Mơ Vũ Trụ',
    description: 'Higher words, brighter future. Dải ngân hà tím huyền ảo, phi thuyền tên lửa và vành đai sao Thổ.',
    category: 'frame',
    categoryLabel: 'Khung Avatar',
    price: 1100,
    isConsumable: false,
    imageSource: require('../../assets/images/frames/frame_space_dreamer_anim.webp'),
    bgColorClass: 'bg-fuchsia-50',
    badgeLabel: 'KHÁM PHÁ'
  },
  {
    id: 'frame_cherry_blossom',
    name: 'Hoa Anh Đào Mùa Xuân',
    description: 'Small progress, big change. Cành sakura mùa xuân thanh thoát, cánh hoa hồng phấn bay lượn.',
    category: 'frame',
    categoryLabel: 'Khung Avatar',
    price: 700,
    isConsumable: false,
    imageSource: require('../../assets/images/frames/frame_cherry_blossom_anim.webp'),
    bgColorClass: 'bg-pink-50',
    badgeLabel: 'GIỚI HẠN'
  },
  {
    id: 'frame_legendary',
    name: 'Huyền Thoại Bất Hủ',
    description: 'A lifetime of learning. Đôi cánh hoàng kim vương giả bao bọc tinh thể kim cương lam ngọc.',
    category: 'frame',
    categoryLabel: 'Khung Avatar',
    price: 1500,
    isConsumable: false,
    imageSource: require('../../assets/images/frames/frame_legendary_anim.webp'),
    bgColorClass: 'bg-amber-100',
    badgeLabel: 'HUYỀN THOẠI'
  },

  // --- 3. SPECIAL & THEMES ---
  {
    id: 'item_amulet',
    name: 'Huy Chương Sao',
    description: 'Tăng 50% tỉ lệ xuất hiện câu hỏi thưởng Coin trong 24 giờ.',
    category: 'special',
    categoryLabel: 'Đặc biệt',
    price: 800,
    isConsumable: false,
    imageSource: require('../../assets/images/shop/icon3_clean.png'),
    bgColorClass: 'bg-emerald-50'
  },
  {
    id: 'item_trophy',
    name: 'Cúp Vàng Thử Thách',
    description: 'Mở khóa phòng đấu trường thử thách từ vựng vô hạn cuối tuần.',
    category: 'special',
    categoryLabel: 'Đặc biệt',
    price: 1500,
    isConsumable: false,
    imageSource: require('../../assets/images/shop/icon4_clean.png'),
    bgColorClass: 'bg-amber-50',
    badgeLabel: 'HUYỀN THOẠI'
  },
  {
    id: 'item_theme_neon',
    name: 'Giao Diện Dạ Quang',
    description: 'Bộ giao diện Night Glow tương phản cao bảo vệ mắt.',
    category: 'special',
    categoryLabel: 'Giao diện',
    price: 1200,
    isConsumable: false,
    imageSource: require('../../assets/images/shop/badge10_clean.png'),
    bgColorClass: 'bg-cyan-50'
  }
];

export default function ShopScreen() {
  const [economy, economyStore] = useEconomyState();
  const [activeCategory, setActiveCategory] = useState('all');

  // Modal States
  const [selectedItem, setSelectedItem] = useState<ShopItemType | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [outOfCoinItem, setOutOfCoinItem] = useState<ShopItemType | null>(null);
  const [showFrameShowcase, setShowFrameShowcase] = useState(false);

  // Synchronize item status with shared inventory
  const enrichedItems: ShopItemType[] = RAW_SHOP_ITEMS.map(rawItem => {
    const isOwned = economyStore.isItemOwned(rawItem.id);
    const quantityOwned = economyStore.getItemQuantity(rawItem.id);
    return {
      ...rawItem,
      isOwned,
      quantityOwned: rawItem.isConsumable ? quantityOwned : undefined
    };
  });

  // Filter items
  const displayedItems = enrichedItems.filter(item => 
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  // Handle Buy Trigger
  const handleItemPress = (item: ShopItemType) => {
    // If one-time item and already owned, do nothing
    if (!item.isConsumable && item.isOwned) return;

    if (economy.coins < item.price) {
      // Trigger friendly OutOfCoin Modal
      setOutOfCoinItem(item);
    } else {
      // Trigger Purchase Confirmation Modal
      setSelectedItem(item);
      setPurchaseSuccess(false);
    }
  };

  // Confirm Purchase Execution
  const confirmPurchase = () => {
    if (!selectedItem) return;
    setIsPurchasing(true);

    setTimeout(() => {
      const res = economyStore.purchaseItem({
        id: selectedItem.id,
        name: selectedItem.name,
        category: selectedItem.category,
        categoryName: selectedItem.categoryLabel,
        price: selectedItem.price,
        isConsumable: selectedItem.isConsumable,
        imageSource: selectedItem.imageSource
      });

      setIsPurchasing(false);
      if (res.success) {
        setPurchaseSuccess(true);
      }
    }, 900);
  };

  // Daily Deal Special item: Streak Freeze discounted from 400 -> 300
  const dailyDealItem = enrichedItems.find(i => i.id === 'item_streak_freeze')!;

  return (
    <View className="flex-1 bg-[#F8F9FD]">
      <SafeAreaView edges={['top']} className="bg-white" />

      {/* ==========================================
          1. HEADER (SHOP & SHORTCUTS)
          ========================================== */}
      <View className="px-5 py-3 border-b border-neutral-200/80 bg-white flex-row items-center justify-between z-10 shadow-sm shadow-black/5">
        <View className="flex-row items-center gap-2">
          <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito">
            Cửa hàng
          </Text>
          <View className="bg-mascot-50 px-2 py-0.5 rounded-full border border-mascot-200 flex-row items-center gap-1">
            <SparklesIcon size={12} color="#FF8A00" />
            <Text className="text-[11px] font-extrabold text-mascot-600 font-nunito">
              Vật phẩm
            </Text>
          </View>
        </View>

        {/* Action Pills */}
        <View className="flex-row items-center gap-2">
          {/* Inventory Shortcut Pill */}
          <Pressable 
            onPress={() => router.push('/profile/inventory' as any)}
            className="bg-neutral-100 border border-neutral-200/80 px-2.5 py-1.5 rounded-full flex-row items-center gap-1 active:scale-95 transition-all"
          >
            <PackageIcon size={14} color="#4A4C68" />
            <Text className="font-bold text-[12px] text-mascot-navy font-nunito">
              Kho đồ
            </Text>
          </Pressable>

          {/* Coin Balance Pill */}
          <Pressable 
            onPress={() => router.push('/profile/wallet' as any)} 
            className="bg-reward-50 border border-reward-200 px-3 py-1.5 rounded-full flex-row items-center gap-1.5 active:scale-95 transition-all"
          >
            <Coin3D size="xs" />
            <Text className="font-extrabold text-[14px] text-reward-700 font-nunito tabular-nums">
              {economy.coins.toLocaleString()}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ==========================================
          2. CATEGORY PILLS BAR
          ========================================== */}
      <View className="bg-white border-b border-neutral-200/80">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="px-5 py-2.5" 
          contentContainerStyle={{ gap: 8 }}
        >
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <Pressable 
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full border transition-all active:scale-95",
                  isActive 
                    ? "bg-primary-500 border-primary-600 shadow-sm" 
                    : "bg-[#F7F8FA] border-neutral-200/80"
                )}
              >
                <Text className={cn(
                  "font-bold text-[13px] font-nunito",
                  isActive ? "text-white font-extrabold" : "text-neutral-500"
                )}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ==========================================
          3. MAIN CONTENT SCROLLVIEW
          ========================================== */}
      <ScrollView 
        contentContainerStyle={{ padding: 18, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO BANNER: DAILY DEAL */}
        {activeCategory === 'all' && (
          <View 
            className="mb-6 rounded-[28px] p-4 border-2 border-b-4 border-amber-600 relative overflow-hidden shadow-md shadow-amber-900/15"
            style={{ backgroundColor: '#FF8A00' }}
          >
            {/* SVG Gradient Background */}
            <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
              <Defs>
                <LinearGradient id="heroBannerGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#F59E0B" />
                  <Stop offset="100%" stopColor="#EA580C" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#heroBannerGrad)" rx={26} />
            </Svg>

            {/* Background Decorative Circles */}
            <View className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
            <View className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
            
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-full">
                <TagIcon size={12} color="#FFFFFF" />
                <Text className="text-[11px] font-extrabold text-white font-nunito uppercase tracking-wide">
                  Ưu đãi chớp nhoáng • Giảm 25%
                </Text>
              </View>

              <View className="flex-row items-center gap-1 bg-black/20 px-2.5 py-1 rounded-full">
                <ClockIcon size={11} color="#FFFFFF" />
                <Text className="text-[11px] font-extrabold text-white font-nunito tabular-nums">
                  07:42:15
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              {/* Text info */}
              <View className="flex-1 pr-3">
                <Text className="font-extrabold text-[20px] text-white font-nunito leading-tight mb-1">
                  Bảo Hiểm Chuỗi
                </Text>
                <Text className="font-bold text-[13px] text-amber-50 font-nunito mb-3.5 leading-snug">
                  Đừng để mất công sức học tập! Tích trữ ngay để giữ chuỗi ngày của bạn.
                </Text>

                <Pressable
                  onPress={() => handleItemPress(dailyDealItem)}
                  className="bg-white self-start px-4 py-2 rounded-xl border-b-[3px] border-amber-300 active:translate-y-[1px] active:border-b-[1px] flex-row items-center gap-1.5 shadow-sm"
                >
                  <Coin3D size="xs" />
                  <Text className="font-extrabold text-[14px] text-mascot-navy font-nunito tabular-nums">
                    300
                  </Text>
                  <Text className="text-[12px] text-neutral-400 line-through font-nunito tabular-nums">
                    400
                  </Text>
                  <Text className="text-[11px] font-extrabold text-mascot-600 font-nunito ml-1">
                    MUA NGAY
                  </Text>
                </Pressable>
              </View>

              {/* Snapy mascot artwork */}
              <View className="w-20 h-20 items-center justify-center">
                <Image 
                  source={require('../../assets/images/mascot/actions/snapy-nhay-len-trimmed.png')}
                  style={{ width: 80, height: 80 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}

        {/* AVATAR FRAMES SHOWCASE BANNER */}
        {(activeCategory === 'all' || activeCategory === 'frame') && (
          <Pressable
            onPress={() => setShowFrameShowcase(true)}
            className="mb-5 rounded-[26px] p-4 border-2 border-b-4 border-purple-500 bg-purple-900 overflow-hidden relative shadow-md active:scale-[0.99] transition-all"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <View className="bg-amber-400 px-2 py-0.5 rounded-full">
                    <Text className="text-[10px] font-extrabold text-mascot-navy">MỚI</Text>
                  </View>
                  <Text className="text-amber-300 font-bold text-[12px] font-nunito uppercase tracking-wide">
                    Avatar Frames Series
                  </Text>
                </View>
                <Text className="text-white font-extrabold text-[17px] font-nunito leading-tight mb-1">
                  Phòng Thử 10 Khung Hoạt Ảnh
                </Text>
                <Text className="text-purple-200 font-medium text-[12px] font-inter">
                  Xem thử các hiệu ứng động lồng trực tiếp với bé Snapy & avatar của bạn!
                </Text>
              </View>
              <View className="bg-white/10 px-3.5 py-2.5 rounded-2xl border border-white/20 items-center justify-center">
                <SparklesIcon size={22} color="#FDE047" />
                <Text className="text-white font-extrabold text-[11px] font-nunito mt-1">THỬ NGAY</Text>
              </View>
            </View>
          </Pressable>
        )}

        {/* SECTION HEADER */}
        <View className="flex-row items-center justify-between mb-3.5 px-1">
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
            {activeCategory === 'all' 
              ? 'Tất cả vật phẩm' 
              : CATEGORIES.find(c => c.id === activeCategory)?.label}
          </Text>
          <Text className="font-bold text-[12px] text-neutral-400 font-nunito">
            {displayedItems.length} món đồ
          </Text>
        </View>

        {/* ITEM GRID */}
        <View className="flex-row flex-wrap justify-between">
          {displayedItems.map((item) => (
            <ShopItemCard 
              key={item.id}
              item={item}
              canAfford={economy.coins >= item.price}
              onPress={handleItemPress}
            />
          ))}
        </View>
      </ScrollView>

      {/* ==========================================
          4. INTERACTION MODALS
          ========================================== */}
      {/* 4.1. Purchase Confirmation & Success Modal */}
      <PurchaseSuccessModal 
        visible={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onConfirm={confirmPurchase}
        isPurchasing={isPurchasing}
        purchaseSuccess={purchaseSuccess}
        userCoins={economy.coins}
      />

      {/* 4.2. Friendly Out-of-Coin Guidance Modal */}
      <OutOfCoinModal 
        visible={!!outOfCoinItem}
        item={outOfCoinItem}
        userCoins={economy.coins}
        onClose={() => setOutOfCoinItem(null)}
      />

      {/* 4.3. Interactive Avatar Frame Showcase Modal */}
      <AvatarFrameShowcaseModal
        visible={showFrameShowcase}
        onClose={() => setShowFrameShowcase(false)}
        equippedFrameId={economy.inventory.find(i => i.category === 'frame' && i.state === 'equipped')?.frameId || null}
        onEquip={(fId) => {
          economyStore.equipFrame(fId);
        }}
      />
    </View>
  );
}
