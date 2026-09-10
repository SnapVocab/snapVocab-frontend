import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable, Image, ActivityIndicator } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
import { XIcon, PackageIcon, ShoppingBagIcon, SparklesIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import { Coin3D } from '@/components/snapvocab';
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
  const scaleValue = useSharedValue(0.85);
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    if (visible && !purchaseSuccess) {
      scaleValue.value = withSpring(1, { damping: 14, stiffness: 120 });
      opacityValue.value = withTiming(1, { duration: 200 });
    } else if (purchaseSuccess) {
      scaleValue.value = withSequence(
        withTiming(1.05, { duration: 150 }),
        withSpring(1, { damping: 12 })
      );
    } else {
      scaleValue.value = 0.85;
      opacityValue.value = 0;
    }
  }, [visible, purchaseSuccess]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value
  }));

  if (!item) return null;

  const remainingCoins = Math.max(0, userCoins - item.price);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 items-center justify-center p-5">
        <Animated.View 
          style={[
            animatedStyle, 
            { 
              backgroundColor: '#FFFFFF',
              borderRadius: 36,
              borderWidth: 2,
              borderColor: '#E2E8F0',
              borderBottomWidth: 6,
              borderBottomColor: '#CBD5E1',
              maxWidth: 350,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.25)'
            } as any
          ]}
          className="p-6 relative items-center"
        >
          {purchaseSuccess ? (
            /* ================= SUCCESS STATE ================= */
            <View className="items-center py-2 w-full">
              {/* Confetti Animation */}
              <View className="absolute w-full h-full -top-12 items-center pointer-events-none opacity-85 z-0">
                <LottieView
                  autoPlay
                  loop={false}
                  style={{ width: 270, height: 270 }}
                  source={require('../../assets/animations/confetti.json')} 
                />
              </View>

              {/* Snapy Celebrating Mascot */}
              <View 
                style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: '#FEF3C7', borderWidth: 2, borderColor: '#FDE68A' }}
                className="mb-2 items-center justify-center z-10 shadow-sm"
              >
                <Image 
                  source={require('../../assets/images/mascot/actions/snapy-an-mung-trimmed.png')}
                  style={{ width: 78, height: 78 }}
                  resizeMode="contain"
                />
              </View>

              <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-1 text-center z-10">
                Mở khóa thành công!
              </Text>
              <Text className="font-medium text-[13px] text-neutral-500 font-inter text-center mb-5 leading-relaxed z-10 px-3">
                Đã gửi <Text className="font-bold text-mascot-navy">{item.name}</Text> vào kho đồ cá nhân của bạn.
              </Text>

              {/* Action CTAs */}
              <View className="w-full gap-2.5 z-10">
                <Pressable 
                  onPress={() => {
                    onClose();
                    router.push('/profile/inventory' as any);
                  }}
                  style={{
                    borderRadius: 18,
                    borderBottomWidth: 4,
                    borderBottomColor: '#15803D'
                  }}
                  className="w-full h-12 bg-primary-500 items-center justify-center flex-row gap-2 active:translate-y-[2px] active:border-b-[2px]"
                >
                  <PackageIcon size={18} color="white" />
                  <Text className="font-extrabold text-[14px] text-white font-nunito uppercase tracking-wide">
                    Đến Kho đồ trang bị
                  </Text>
                </Pressable>

                <Pressable 
                  onPress={onClose}
                  style={{ borderRadius: 16 }}
                  className="w-full h-11 bg-neutral-100 items-center justify-center active:bg-neutral-200 flex-row gap-2"
                >
                  <ShoppingBagIcon size={16} color="#757793" />
                  <Text className="font-bold text-[14px] text-neutral-600 font-inter">
                    Tiếp tục dạo Shop
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            /* ================= CONFIRMATION STATE ================= */
            <View className="items-center w-full pt-1">
              {/* Header Pill */}
              <View 
                style={{ borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' }}
                className="px-3.5 py-1 mb-3.5 flex-row items-center gap-1.5"
              >
                <SparklesIcon size={13} color="#FF8A00" />
                <Text className="font-extrabold text-[12px] text-mascot-navy font-nunito uppercase tracking-wider">
                  Xác nhận mở khóa
                </Text>
              </View>

              {/* Artwork Box with Soft Rounded Contour */}
              <View className="items-center mb-4">
                <View 
                  style={{ 
                    width: 96, 
                    height: 96, 
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.08)'
                  } as any}
                  className={cn(
                    "items-center justify-center mb-2.5",
                    item.bgColorClass
                  )}
                >
                  <Image 
                    source={item.imageSource}
                    style={{ width: 72, height: 72 }}
                    resizeMode="contain"
                  />
                </View>

                <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito text-center mb-0.5">
                  {item.name}
                </Text>
                <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase tracking-wider">
                  {item.categoryLabel}
                </Text>
              </View>

              {/* Calculation Breakdown Card */}
              <View 
                style={{ 
                  borderRadius: 22, 
                  backgroundColor: '#F8FAFC',
                  borderWidth: 1.5,
                  borderColor: '#E2E8F0'
                }}
                className="w-full p-4 mb-5"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-medium text-[13px] text-neutral-500 font-inter">Giá vật phẩm:</Text>
                  <View className="flex-row items-center gap-1.5">
                    <Coin3D size="xs" />
                    <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito tabular-nums">
                      {item.price}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-medium text-[13px] text-neutral-500 font-inter">Số dư hiện tại:</Text>
                  <View className="flex-row items-center gap-1.5">
                    <Coin3D size="xs" />
                    <Text className="font-extrabold text-[15px] text-reward-600 font-nunito tabular-nums">
                      {userCoins.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View className="w-full h-[1px] bg-neutral-200/80 my-1.5" />

                <View className="flex-row items-center justify-between">
                  <Text className="font-bold text-[13px] text-neutral-600 font-inter">Còn lại sau khi mua:</Text>
                  <View className="flex-row items-center gap-1.5">
                    <Coin3D size="xs" />
                    <Text className="font-extrabold text-[16px] text-emerald-600 font-nunito tabular-nums">
                      {remainingCoins.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Purchase Buttons */}
              <View className="w-full gap-2.5">
                <Pressable 
                  onPress={onConfirm}
                  disabled={isPurchasing}
                  style={{
                    borderRadius: 18,
                    borderBottomWidth: 4,
                    borderBottomColor: '#15803D'
                  }}
                  className={cn(
                    "w-full h-12 items-center justify-center flex-row gap-2 transition-all",
                    isPurchasing 
                      ? "bg-primary-400 opacity-90" 
                      : "bg-primary-500 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]"
                  )}
                >
                  {isPurchasing ? (
                    <>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text className="font-extrabold text-[14px] text-white font-nunito uppercase tracking-wide">
                        Đang mở khóa...
                      </Text>
                    </>
                  ) : (
                    <Text className="font-extrabold text-[15px] text-white font-nunito uppercase tracking-wide">
                      MUA NGAY ({item.price} XU)
                    </Text>
                  )}
                </Pressable>

                <Pressable 
                  onPress={onClose}
                  disabled={isPurchasing}
                  style={{ borderRadius: 16 }}
                  className="w-full h-10 items-center justify-center active:bg-neutral-100"
                >
                  <Text className="font-bold text-[14px] text-neutral-400 font-inter">Hủy bỏ</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Top-right X button */}
          {!isPurchasing && !purchaseSuccess && (
            <Pressable 
              onPress={onClose}
              style={{ borderRadius: 20 }}
              className="absolute top-4 right-4 w-8 h-8 bg-neutral-100 items-center justify-center active:bg-neutral-200"
            >
              <XIcon size={16} color="#757793" />
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
