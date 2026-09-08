import React from 'react';
import { View, Text, Pressable, Image, ImageSourcePropType } from 'react-native';
import { CheckIcon } from 'lucide-react-native';
import { Coin3D } from '@/components/snapvocab';
import { cn } from '@/lib/utils';

export interface ShopItemType {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isOwned: boolean;
  imageSource: ImageSourcePropType;
  bgColorClass: string;
  borderColorClass: string;
}

interface ShopItemCardProps {
  item: ShopItemType;
  onPress: (item: ShopItemType) => void;
  canAfford: boolean;
}

export function ShopItemCard({ item, onPress, canAfford }: ShopItemCardProps) {
  return (
    <View className="w-[48%] bg-white rounded-[24px] border border-neutral-100 shadow-sm shadow-black/5 overflow-hidden mb-4">
      {/* Artwork Area */}
      <View className={cn("h-36 items-center justify-center p-4", item.bgColorClass)}>
        <Image 
          source={item.imageSource} 
          className="w-24 h-24"
          resizeMode="contain"
        />
      </View>

      {/* Info Area */}
      <View className="p-3">
        <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito mb-1" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="font-medium text-[11px] text-neutral-500 font-inter mb-4 line-clamp-2 min-h-[32px]" numberOfLines={2}>
          {item.description}
        </Text>

        {/* Action Area */}
        {item.isOwned ? (
          <View className="h-10 bg-neutral-100 rounded-xl flex-row items-center justify-center gap-1.5 border-b-[2px] border-neutral-200">
            <CheckIcon size={16} className="text-neutral-500" />
            <Text className="font-extrabold text-[13px] text-neutral-500 font-nunito uppercase tracking-wide">
              Đã sở hữu
            </Text>
          </View>
        ) : (
          <Pressable 
            onPress={() => onPress(item)}
            disabled={!canAfford}
            className={cn(
              "h-10 rounded-xl flex-row items-center justify-center border-b-[3px]",
              canAfford 
                ? "bg-primary-500 border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[1px]" 
                : "bg-neutral-100 border-neutral-200 opacity-80"
            )}
          >
            {canAfford ? (
              <>
                <Coin3D size="xs" style={{ marginRight: 4 }} />
                <Text className="font-extrabold text-[14px] text-white font-nunito tabular-nums tracking-wide">
                  {item.price}
                </Text>
              </>
            ) : (
              <Text className="font-extrabold text-[12px] text-neutral-400 font-nunito uppercase tracking-wide px-2 text-center leading-tight">
                Thiếu Coin
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
