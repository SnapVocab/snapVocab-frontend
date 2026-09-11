import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { CheckIcon, SparklesIcon } from 'lucide-react-native';
import { Coin3D } from '@/components/snapvocab';
import { cn } from '@/lib/utils';

export interface ShopItemType {
  id: string;
  name: string;
  description: string;
  category: 'booster' | 'frame' | 'special';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  isConsumable: boolean;
  isOwned: boolean;
  quantityOwned?: number;
  imageSource: any;
  bgColorClass: string;
  badgeLabel?: string;
}

interface ShopItemCardProps {
  item: ShopItemType;
  onPress: (item: ShopItemType) => void;
  canAfford: boolean;
}

export function ShopItemCard({ item, onPress, canAfford }: ShopItemCardProps) {
  const isOneTimeOwned = !item.isConsumable && item.isOwned;

  return (
    <View className="w-[48%] bg-white rounded-[26px] border-2 border-b-4 border-neutral-200/90 mb-4 overflow-hidden flex-col justify-between shadow-sm">
      {/* 1. Artwork Area (Fixed 112px height with contained image) */}
      <View className={cn("h-28 items-center justify-center p-2 relative overflow-hidden", item.bgColorClass)}>
        {/* Badge: Special / Discount / Hot */}
        {item.badgeLabel && (
          <View className="absolute top-2 left-2 bg-rose-500 px-2 py-0.5 rounded-full z-10 shadow-sm">
            <Text className="text-[10px] font-extrabold text-white font-nunito uppercase tracking-wide">
              {item.badgeLabel}
            </Text>
          </View>
        )}

        {/* Badge: Quantity Owned for Consumables */}
        {item.isConsumable && (item.quantityOwned ?? 0) > 0 && (
          <View className="absolute top-2 right-2 bg-mascot-navy px-2 py-0.5 rounded-full z-10 shadow-sm">
            <Text className="text-[10px] font-extrabold text-white font-nunito">
              x{item.quantityOwned}
            </Text>
          </View>
        )}

        {/* Contained Image to Prevent Any Web Overflow */}
        <View style={{ width: 80, height: 80 }} className="items-center justify-center">
          <Image 
            source={item.imageSource} 
            style={{ width: 76, height: 76 }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* 2. Info Area */}
      <View className="p-3 bg-white flex-1 justify-between">
        <View>
          <Text className="text-[10px] font-extrabold text-neutral-400 font-nunito uppercase tracking-wider mb-0.5">
            {item.categoryLabel}
          </Text>
          <Text 
            className="font-extrabold text-[15px] text-mascot-navy font-nunito mb-1 leading-snug" 
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text 
            className="font-semibold text-[11.5px] text-neutral-600 font-nunito mb-3 leading-relaxed" 
            numberOfLines={2}
            style={{ minHeight: 30 }}
          >
            {item.description}
          </Text>
        </View>

        {/* 3. Action Button (Tactile 3D) */}
        {isOneTimeOwned ? (
          <View className="h-10 bg-neutral-100 rounded-xl flex-row items-center justify-center gap-1.5 border-b-2 border-neutral-200">
            <CheckIcon size={16} color="#757793" />
            <Text className="font-extrabold text-[12px] text-neutral-400 font-nunito uppercase tracking-wide">
              ĐÃ SỞ HỮU
            </Text>
          </View>
        ) : (
          <Pressable 
            onPress={() => onPress(item)}
            className={cn(
              "h-10 rounded-xl flex-row items-center justify-center border-b-[3px] transition-all",
              canAfford 
                ? "bg-primary-500 border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[1px]" 
                : "bg-amber-100/90 border-amber-300 active:bg-amber-200/90 active:translate-y-[2px] active:border-b-[1px]"
            )}
          >
            <Coin3D size="xs" style={{ marginRight: 4 }} />
            <Text className={cn(
              "font-extrabold text-[14px] font-nunito tabular-nums tracking-wide",
              canAfford ? "text-white" : "text-amber-900"
            )}>
              {item.price}
            </Text>
            
            {item.originalPrice && (
              <Text className="text-[11px] text-neutral-300 line-through font-nunito ml-1.5 tabular-nums">
                {item.originalPrice}
              </Text>
            )}

            {!canAfford && (
              <Text className="font-extrabold text-[10px] text-amber-700 font-nunito ml-1.5 uppercase bg-amber-200/70 px-1.5 py-0.5 rounded">
                Thiếu
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
