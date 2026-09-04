import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withSequence,
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import { CheckIcon, XIcon, CoinsIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { ShopItemType } from './ShopItemCard';
import LottieView from 'lottie-react-native';

interface PurchaseSuccessModalProps {
  visible: boolean;
  item: ShopItemType | null;
  onClose: () => void;
  onConfirm: () => void;
  isPurchasing: boolean;
  purchaseSuccess: boolean;
  userCoins: number;
}

export function PurchaseSuccessModal({
  visible,
  item,
  onClose,
  onConfirm,
  isPurchasing,
  purchaseSuccess,
  userCoins
}: PurchaseSuccessModalProps) {
  
  const scaleValue = useSharedValue(0.8);
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    if (visible && !purchaseSuccess) {
      scaleValue.value = withSpring(1, { damping: 15 });
      opacityValue.value = withTiming(1, { duration: 300 });
    } else if (purchaseSuccess) {
      // Success animation sequence
      scaleValue.value = withSequence(
        withTiming(1.1, { duration: 150 }),
        withSpring(1, { damping: 10 })
      );
    } else {
      scaleValue.value = 0.8;
      opacityValue.value = 0;
    }
  }, [visible, purchaseSuccess]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
      opacity: opacityValue.value
    };
  });

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        <Animated.View 
          style={animatedStyle}
          className="bg-white rounded-[32px] p-6 w-full max-w-[340px] shadow-xl overflow-hidden"
        >
          {purchaseSuccess ? (
            <View className="items-center py-4">
              {/* Lottie Animation Placeholder */}
              <View className="absolute w-full h-full -top-10 items-center pointer-events-none opacity-50">
                 <LottieView
                    autoPlay
                    loop={false}
                    style={{ width: 250, height: 250 }}
                    source={require('../../assets/animations/confetti.json')} 
                 />
              </View>

              <View className="w-20 h-20 bg-success-50 rounded-full items-center justify-center mb-6 border border-success-200 z-10">
                <CheckIcon size={40} className="text-success-500" />
              </View>
              <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-2 text-center z-10">
                Giao dịch thành công!
              </Text>
              <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center leading-relaxed z-10">
                Đã thêm {item.name} vào kho đồ của bạn.
              </Text>
            </View>
          ) : (
            <View className="items-center pt-2">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-6">Xác nhận giao dịch</Text>
              
              <View className="items-center mb-6">
                <View className={cn(
                  "w-24 h-24 rounded-3xl items-center justify-center mb-4",
                  item.bgColorClass
                )}>
                  <Animated.Image 
                    source={item.imageSource}
                    className="w-20 h-20"
                    resizeMode="contain"
                  />
                </View>
                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito text-center mb-1">
                  {item.name}
                </Text>
                <Text className="font-bold text-[13px] text-neutral-400 font-inter uppercase">
                  {item.category}
                </Text>
              </View>

              <View className="w-full bg-[#F7F8FA] rounded-2xl p-4 mb-6 border border-neutral-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-bold text-[14px] text-neutral-500 font-inter">Giá vật phẩm:</Text>
                  <View className="flex-row items-center gap-1.5">
                    <CoinsIcon size={16} fill="#FFC42E" className="text-reward-600" />
                    <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito tabular-nums">
                      {item.price}
                    </Text>
                  </View>
                </View>
                <View className="w-full h-[1px] bg-neutral-200 my-2" />
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="font-bold text-[14px] text-neutral-500 font-inter">Số dư của bạn:</Text>
                  <View className="flex-row items-center gap-1.5">
                    <CoinsIcon size={16} fill="#FFC42E" className="text-reward-600" />
                    <Text className="font-extrabold text-[16px] text-reward-600 font-nunito tabular-nums">
                      {userCoins.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="w-full gap-3">
                <Pressable 
                  onPress={onConfirm}
                  disabled={isPurchasing}
                  className={cn(
                    "w-full h-14 rounded-2xl border-b-[4px] items-center justify-center",
                    isPurchasing ? "bg-primary-300 border-primary-400" : "bg-primary-500 border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]"
                  )}
                >
                  <Text className="font-extrabold text-[16px] text-white font-nunito uppercase tracking-wide">
                    {isPurchasing ? 'ĐANG XỬ LÝ...' : 'MUA NGAY'}
                  </Text>
                </Pressable>
                
                <Pressable 
                  onPress={onClose}
                  disabled={isPurchasing}
                  className="w-full h-12 bg-neutral-100 rounded-xl items-center justify-center active:bg-neutral-200 mt-1"
                >
                  <Text className="font-bold text-[15px] text-neutral-600 font-inter">Hủy bỏ</Text>
                </Pressable>
              </View>
            </View>
          )}

          {!isPurchasing && !purchaseSuccess && (
            <Pressable 
              onPress={onClose}
              className="absolute top-4 right-4 p-2"
            >
              <XIcon size={20} className="text-neutral-400" />
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
