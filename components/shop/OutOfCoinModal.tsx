import React from 'react';
import { View, Text, Modal, Pressable, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { XIcon, TargetIcon, BookOpenIcon, SparklesIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import { Coin3D } from '@/components/snapvocab';
import { ShopItemType } from './ShopItemCard';

interface OutOfCoinModalProps {
  visible: boolean;
  item: ShopItemType | null;
  userCoins: number;
  onClose: () => void;
}

export function OutOfCoinModal({
  visible,
  item,
  userCoins,
  onClose
}: OutOfCoinModalProps) {
  const scaleValue = useSharedValue(0.85);
  const opacityValue = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scaleValue.value = withSpring(1, { damping: 14, stiffness: 120 });
      opacityValue.value = withTiming(1, { duration: 200 });
    } else {
      scaleValue.value = 0.85;
      opacityValue.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value
  }));

  if (!item) return null;

  const missingCoins = Math.max(0, item.price - userCoins);

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
              borderColor: '#FED7AA',
              borderBottomWidth: 6,
              borderBottomColor: '#FDBA74',
              maxWidth: 350,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.25)'
            } as any
          ]}
          className="p-6 items-center relative"
        >
          {/* Close button */}
          <Pressable 
            onPress={onClose}
            style={{ borderRadius: 20 }}
            className="absolute top-4 right-4 w-8 h-8 bg-neutral-100 items-center justify-center active:bg-neutral-200 z-10"
          >
            <XIcon size={16} color="#757793" />
          </Pressable>

          {/* Snapy Mascot in soft circular badge */}
          <View 
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: '#FFF7ED',
              borderWidth: 2,
              borderColor: '#FFEDD5',
              boxShadow: '0 6px 12px -2px rgba(255, 138, 0, 0.12)'
            } as any}
            className="mb-3 items-center justify-center"
          >
            <Image 
              source={require('../../assets/images/snapy-curious.png')}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          </View>

          {/* Title & Description */}
          <Text className="font-extrabold text-[21px] text-mascot-navy font-nunito text-center mb-1">
            Chưa đủ Coin rồi!
          </Text>
          <Text className="font-medium text-[13px] text-neutral-500 font-inter text-center mb-4 leading-relaxed px-2">
            Bạn cần tích lũy thêm Coin để mở khóa <Text className="font-bold text-mascot-navy">{item.name}</Text> nhé.
          </Text>

          {/* Coin Deficit Summary Pill */}
          <View 
            style={{
              borderRadius: 22,
              backgroundColor: '#FFFBEB',
              borderWidth: 1.5,
              borderColor: '#FDE68A'
            }}
            className="w-full p-3.5 mb-5"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-bold text-[13px] text-amber-900 font-inter">Giá món đồ:</Text>
              <View className="flex-row items-center gap-1">
                <Coin3D size="xs" />
                <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito tabular-nums">
                  {item.price}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-medium text-[13px] text-neutral-600 font-inter">Hiện có:</Text>
              <View className="flex-row items-center gap-1">
                <Coin3D size="xs" />
                <Text className="font-extrabold text-[15px] text-neutral-700 font-nunito tabular-nums">
                  {userCoins.toLocaleString()}
                </Text>
              </View>
            </View>

            <View className="h-[1px] bg-amber-200/70 my-1.5" />

            <View className="flex-row items-center justify-between">
              <Text className="font-extrabold text-[13px] text-amber-800 font-inter">Cần thêm:</Text>
              <View className="flex-row items-center gap-1">
                <Coin3D size="xs" />
                <Text className="font-extrabold text-[16px] text-mascot-500 font-nunito tabular-nums">
                  +{missingCoins.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Action CTAs */}
          <View className="w-full gap-2.5">
            <Pressable 
              onPress={() => {
                onClose();
                router.push('/(tabs)/missions' as any);
              }}
              style={{
                borderRadius: 18,
                borderBottomWidth: 4,
                borderBottomColor: '#CA8A04'
              }}
              className="w-full h-12 bg-reward-500 items-center justify-center flex-row gap-2 active:translate-y-[2px] active:border-b-[2px]"
            >
              <TargetIcon size={18} color="white" />
              <Text className="font-extrabold text-[14px] text-white font-nunito uppercase tracking-wide">
                Làm nhiệm vụ kiếm Coin
              </Text>
            </Pressable>

            <Pressable 
              onPress={() => {
                onClose();
                router.push('/(tabs)/learn' as any);
              }}
              style={{
                borderRadius: 18,
                borderBottomWidth: 4,
                borderBottomColor: '#15803D'
              }}
              className="w-full h-12 bg-primary-500 items-center justify-center flex-row gap-2 active:translate-y-[2px] active:border-b-[2px]"
            >
              <BookOpenIcon size={18} color="white" />
              <Text className="font-extrabold text-[14px] text-white font-nunito uppercase tracking-wide">
                Học bài mới (+Coin)
              </Text>
            </Pressable>

            <Pressable 
              onPress={onClose}
              style={{ borderRadius: 16 }}
              className="w-full h-10 items-center justify-center active:bg-neutral-100"
            >
              <Text className="font-bold text-[14px] text-neutral-400 font-inter">
                Để sau
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
