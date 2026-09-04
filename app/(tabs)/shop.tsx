import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { CoinsIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { ShopItemCard, ShopItemType } from '@/components/shop/ShopItemCard';
import { PurchaseSuccessModal } from '@/components/shop/PurchaseSuccessModal';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
interface ShopSection {
  title: string;
  data: ShopItemType[];
}

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'Hỗ trợ học tập', label: 'Hỗ trợ' },
  { id: 'Năng lượng & Thời gian', label: 'Năng lượng' },
  { id: 'Đặc biệt', label: 'Đặc biệt' },
];

const INITIAL_COINS = 2450;

const SHOP_DATA: ShopSection[] = [
  {
    title: 'Hỗ trợ học tập',
    data: [
      {
        id: 'item_xp_booster',
        name: 'Nhân Đôi KN',
        description: 'Nhân đôi kinh nghiệm nhận được trong 15 phút tới.',
        category: 'Booster',
        price: 250,
        isOwned: false,
        imageSource: require('../../assets/images/shop/icon1.jpg'),
        bgColorClass: 'bg-yellow-100',
        borderColorClass: 'border-yellow-200'
      },
      {
        id: 'item_magnet',
        name: 'Nam Châm Xu',
        description: 'Tự động thu hút toàn bộ xu trong bài học.',
        category: 'Booster',
        price: 300,
        isOwned: false,
        imageSource: require('../../assets/images/shop/icon2.jpg'),
        bgColorClass: 'bg-red-100',
        borderColorClass: 'border-red-200'
      },
      {
        id: 'item_refresh_ticket',
        name: 'Vé Đổi Mới',
        description: 'Tạo lại bộ câu hỏi nếu bạn gặp khó khăn.',
        category: 'Token',
        price: 100,
        isOwned: false,
        imageSource: require('../../assets/images/shop/icon6.jpg'),
        bgColorClass: 'bg-blue-100',
        borderColorClass: 'border-blue-200'
      },
      {
        id: 'item_hint_token',
        name: 'Gợi Ý Từ Vựng',
        description: 'Mở khóa 3 lần gợi ý trong các bài kiểm tra khó.',
        category: 'Token',
        price: 150,
        isOwned: false,
        imageSource: require('../../assets/images/shop/icon7.jpg'),
        bgColorClass: 'bg-purple-100',
        borderColorClass: 'border-purple-200'
      }
    ]
  },
  {
    title: 'Năng lượng & Thời gian',
    data: [
      {
        id: 'item_streak_freeze',
        name: 'Bảo Hiểm Chuỗi',
        description: 'Bảo vệ chuỗi học tập của bạn nếu bạn quên học một ngày.',
        category: 'Booster',
        price: 400,
        isOwned: false,
        imageSource: require('../../assets/images/shop/icon5.jpg'),
        bgColorClass: 'bg-sky-100',
        borderColorClass: 'border-sky-200'
      },
      {
        id: 'item_heart_refill',
        name: 'Hồi Phục Tim',
        description: 'Làm đầy lập tức số tim của bạn để tiếp tục học.',
        category: 'Recovery',
        price: 350,
        isOwned: false,
        imageSource: require('../../assets/images/shop/icon9.jpg'),
        bgColorClass: 'bg-rose-100',
        borderColorClass: 'border-rose-200'
      },
      {
        id: 'item_timer_boost',
        name: 'Thêm Thời Gian',
        description: 'Cộng thêm 60 giây vào bài kiểm tra tính giờ.',
        category: 'Booster',
        price: 200,
        isOwned: false,
        imageSource: require('../../assets/images/shop/icon8.jpg'),
        bgColorClass: 'bg-orange-100',
        borderColorClass: 'border-orange-200'
      }
    ]
  },
  {
    title: 'Đặc biệt',
    data: [
      {
        id: 'item_amulet',
        name: 'Huy Chương Sao',
        description: 'Tăng 50% tỉ lệ xuất hiện câu hỏi dễ trong 24h.',
        category: 'Special',
        price: 800,
        isOwned: false,
        imageSource: require('../../assets/images/shop/icon3.jpg'),
        bgColorClass: 'bg-emerald-100',
        borderColorClass: 'border-emerald-200'
      },
      {
        id: 'item_trophy',
        name: 'Cúp Vàng Thử Thách',
        description: 'Mở khóa chế độ thử thách vô hạn cuối tuần.',
        category: 'Special',
        price: 1500,
        isOwned: false,
        imageSource: require('../../assets/images/shop/icon4.jpg'),
        bgColorClass: 'bg-amber-100',
        borderColorClass: 'border-amber-200'
      }
    ]
  }
];

export default function ShopScreen() {
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [sections, setSections] = useState<ShopSection[]>(SHOP_DATA);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const filteredSections = sections.filter(section => 
    activeCategory === 'all' ? true : section.title === activeCategory
  );
  
  // Purchase Modal State
  const [selectedItem, setSelectedItem] = useState<ShopItemType | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleBuyPress = (item: ShopItemType) => {
    if (item.isOwned || coins < item.price) return;
    setSelectedItem(item);
    setPurchaseSuccess(false);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;
    setIsPurchasing(true);
    
    // Simulate API Call
    setTimeout(() => {
      setCoins(prev => prev - selectedItem.price);
      
      // Update item ownership
      setSections(prevSections => 
        prevSections.map(section => ({
          ...section,
          data: section.data.map(item => 
            item.id === selectedItem.id ? { ...item, isOwned: true } : item
          )
        }))
      );

      setIsPurchasing(false);
      setPurchaseSuccess(true);
      
      // Auto close success modal after 2.5s
      setTimeout(() => {
        setSelectedItem(null);
      }, 2500);
    }, 1200);
  };

  // ==========================================
  // RENDER MAIN SCREEN
  // ==========================================
  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <SafeAreaView className="bg-white" />
      {/* 1. HEADER */}
      <View className="px-4 py-3 border-b border-neutral-100 bg-white flex-row items-center justify-between z-10 shadow-sm shadow-black/5">
        <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito flex-1">Cửa hàng</Text>
        
        {/* Coin Balance Pill */}
        <Pressable 
          onPress={() => router.push('/profile/wallet' as any)} 
          className="bg-reward-50 border border-reward-200 px-3 py-1.5 rounded-full flex-row items-center gap-1.5 active:bg-reward-100"
        >
          <CoinsIcon size={18} fill="#FFC42E" className="text-reward-600" />
          <Text className="font-extrabold text-[15px] text-reward-700 font-nunito tabular-nums">
            {coins.toLocaleString()}
          </Text>
        </Pressable>
      </View>

      {/* 2. CATEGORIES */}
      <View className="bg-white border-b border-neutral-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3" contentContainerStyle={{ gap: 8 }}>
          {CATEGORIES.map(cat => (
            <Pressable 
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              className={cn(
                "px-5 py-2 rounded-full border-2 ",
                activeCategory === cat.id 
                  ? "bg-primary-50 border-primary-500" 
                  : "bg-white border-neutral-200"
              )}
            >
              <Text className={cn(
                "font-bold text-[14px] font-inter",
                activeCategory === cat.id ? "text-primary-700" : "text-neutral-500"
              )}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* 3. ITEM SECTIONS */}
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredSections.map((section, index) => (
          <View key={index} className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">
                {section.title}
              </Text>
            </View>
            
            <View className="flex-row flex-wrap justify-between">
              {section.data.map((item) => (
                <ShopItemCard 
                  key={item.id}
                  item={item}
                  canAfford={coins >= item.price}
                  onPress={handleBuyPress}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 3. PURCHASE MODAL */}
      <PurchaseSuccessModal 
        visible={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onConfirm={confirmPurchase}
        isPurchasing={isPurchasing}
        purchaseSuccess={purchaseSuccess}
        userCoins={coins}
      />
    </View>
  );
}
