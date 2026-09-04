import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  PaletteIcon,
  CrownIcon,
  ZapIcon,
  CheckIcon,
  ClockIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
type ItemCategory = 'all' | 'frame' | 'theme' | 'booster';
type ItemState = 'equipped' | 'inactive' | 'expired';

interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  categoryName: string;
  state: ItemState;
  quantity?: number;
  expiry?: string;
  artworkIcon: any;
  artworkColor: string;
}

const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: 'i1',
    name: 'Khung Học Giả',
    category: 'frame',
    categoryName: 'Avatar Frame',
    state: 'equipped',
    artworkIcon: CrownIcon,
    artworkColor: 'text-info-500 bg-info-50 border-info-200'
  },
  {
    id: 'i2',
    name: 'Khung Cú Đêm',
    category: 'frame',
    categoryName: 'Avatar Frame',
    state: 'inactive',
    artworkIcon: CrownIcon,
    artworkColor: 'text-mascot-navy bg-mascot-50 border-mascot-200'
  },
  {
    id: 'i3',
    name: 'Thẻ X2 Kinh Nghiệm',
    category: 'booster',
    categoryName: 'Booster',
    state: 'inactive',
    quantity: 3,
    artworkIcon: ZapIcon,
    artworkColor: 'text-warning-500 bg-warning-50 border-warning-200'
  },
  {
    id: 'i4',
    name: 'Bảo Vệ Chuỗi',
    category: 'booster',
    categoryName: 'Booster',
    state: 'expired',
    expiry: 'Hết hạn hôm qua',
    artworkIcon: ZapIcon,
    artworkColor: 'text-neutral-400 bg-neutral-100 border-neutral-200'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'frame', label: 'Khung Avatar' },
  { id: 'theme', label: 'Giao diện' },
  { id: 'booster', label: 'Thẻ bổ trợ' },
];

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [activeCategory, setActiveCategory] = useState<ItemCategory>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter items
  const filteredItems = items.filter(item => 
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleToggleState = (targetItem: InventoryItem) => {
    if (targetItem.state === 'expired' || processingId) return;

    setProcessingId(targetItem.id);

    // Simulate API Delay
    setTimeout(() => {
      setItems(prev => prev.map(item => {
        // Exclusivity rule: If equipping a frame, unequip other frames
        if (targetItem.state === 'inactive' && targetItem.category === 'frame' && item.category === 'frame' && item.id !== targetItem.id) {
          return { ...item, state: 'inactive' };
        }
        
        if (item.id === targetItem.id) {
          // Toggle state
          return { ...item, state: item.state === 'equipped' ? 'inactive' : 'equipped' };
        }
        
        return item;
      }));
      setProcessingId(null);
    }, 800);
  };

  const getButtonLabel = (category: ItemCategory, isEquipped: boolean) => {
    if (isEquipped) return 'THÁO RA';
    if (category === 'booster') return 'SỬ DỤNG';
    return 'TRANG BỊ';
  };

  // ==========================================
  // RENDER ITEM CARD
  // ==========================================
  const renderItemCard = (item: InventoryItem) => {
    const isEquipped = item.state === 'equipped';
    const isExpired = item.state === 'expired';
    const isProcessing = processingId === item.id;
    const Icon = item.artworkIcon;

    return (
      <View 
        key={item.id} 
        className={cn(
          "w-[48%] bg-white rounded-[24px] border shadow-sm overflow-hidden mb-4 transition-all",
          isEquipped ? "border-primary-400 shadow-primary-500/20" : "border-neutral-100 shadow-black/5",
          isExpired && "opacity-80"
        )}
      >
        {/* Artwork Area */}
        <View className={cn(
          "h-32 items-center justify-center p-4 relative",
          isEquipped ? "bg-primary-50" : "bg-[#F7F8FA]"
        )}>
          {/* Quantity Badge */}
          {item.quantity && !isExpired && (
            <View className="absolute top-2 right-2 bg-mascot-navy px-2 py-0.5 rounded-full z-10">
              <Text className="font-extrabold text-[12px] text-white font-nunito tabular-nums">×{item.quantity}</Text>
            </View>
          )}

          {/* Icon */}
          <View className={cn(
            "w-16 h-16 rounded-2xl items-center justify-center border-2 shadow-sm",
            item.artworkColor.split(' ').slice(1).join(' ')
          )}>
            <Icon size={32} className={item.artworkColor.split(' ')[0]} />
          </View>
        </View>

        {/* Info Area */}
        <View className="p-3">
          <Text 
            className={cn(
              "font-extrabold text-[15px] font-nunito mb-1",
              isExpired ? "text-neutral-500" : "text-mascot-navy"
            )} 
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-wider mb-2">
            {item.categoryName}
          </Text>

          {/* Equipped Status Indicator */}
          {isEquipped ? (
            <View className="flex-row items-center gap-1.5 mb-2">
              <CheckIcon size={14} className="text-primary-500" />
              <Text className="font-extrabold text-[12px] text-primary-500 font-inter">Đang dùng</Text>
            </View>
          ) : isExpired ? (
            <View className="flex-row items-center gap-1.5 mb-2">
              <ClockIcon size={14} className="text-danger-500" />
              <Text className="font-bold text-[11px] text-danger-500 font-inter">{item.expiry}</Text>
            </View>
          ) : (
            <View className="h-[22px] mb-2" /> // Spacer to align buttons
          )}

          {/* Action Area */}
          <Pressable 
            onPress={() => handleToggleState(item)}
            disabled={isExpired || processingId !== null}
            className={cn(
              "h-10 rounded-xl flex-row items-center justify-center transition-all",
              isProcessing && "opacity-70",
              isExpired 
                ? "bg-neutral-100 border-neutral-200" 
                : isEquipped 
                  ? "bg-neutral-100 border-neutral-200 active:bg-neutral-200"
                  : "bg-primary-500 border-b-[3px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[1px]"
            )}
          >
            {isProcessing ? (
              <ActivityIndicator color={isEquipped ? '#9CA3AF' : 'white'} size="small" />
            ) : isExpired ? (
              <Text className="font-extrabold text-[13px] text-neutral-400 font-nunito uppercase tracking-wide">
                HẾT HẠN
              </Text>
            ) : (
              <Text className={cn(
                "font-extrabold text-[13px] font-nunito uppercase tracking-wide",
                isEquipped ? "text-neutral-500" : "text-white"
              )}>
                {getButtonLabel(item.category, isEquipped)}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  // ==========================================
  // RENDER MAIN SCREEN
  // ==========================================
  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="px-4 py-3 border-b border-neutral-100 bg-white flex-row items-center justify-between z-10 shadow-sm shadow-black/5">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 active:bg-neutral-100 rounded-full">
          <ArrowLeftIcon size={24} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Kho đồ</Text>
        <View className="w-10 h-10" />
      </View>

      {/* 2. CATEGORIES */}
      <View className="bg-white border-b border-neutral-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3" contentContainerStyle={{ gap: 8 }}>
          {CATEGORIES.map(cat => (
            <Pressable 
              key={cat.id}
              onPress={() => setActiveCategory(cat.id as ItemCategory)}
              className={cn(
                "px-5 py-2 rounded-full border-2 transition-all",
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

      {/* 3. ITEM GRID */}
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View className="items-center justify-center py-20 opacity-70">
            <Snapy pose="curious" className="w-24 h-24 mb-4" />
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">Kho đồ trống!</Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter">Bạn chưa sở hữu vật phẩm nào.</Text>
            
            <Pressable 
              onPress={() => router.push('/shop' as any)}
              className="mt-6 bg-primary-100 px-6 py-3 rounded-xl active:bg-primary-200"
            >
              <Text className="font-bold text-[15px] text-primary-700 font-inter">Đến Cửa Hàng</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View className="flex-row flex-wrap justify-between">
              {filteredItems.map(renderItemCard)}
            </View>

            {filteredItems.length === 0 && (
              <View className="items-center justify-center py-20 opacity-60">
                <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-1">Không tìm thấy!</Text>
                <Text className="font-medium text-[14px] text-neutral-500 font-inter">Không có vật phẩm nào ở danh mục này.</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}
