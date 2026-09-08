import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  CoinsIcon,
  StarIcon,
  TrophyIcon,
  TargetIcon,
  ShoppingCartIcon,
  ZapIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// MOCK DATA
// ==========================================
type TransactionType = 'earn' | 'spend';
type TransactionSource = 'mission' | 'streak' | 'achievement' | 'shop_booster' | 'shop_cosmetic';

interface Transaction {
  id: string;
  type: TransactionType;
  source: TransactionSource;
  title: string;
  subtitle: string;
  amount: number;
  time: string;
}

const WALLET_DATA = {
  coins: 2450,
  xp: 2450,
  level: 12,
  xpMax: 3000,
  // Change to true to see Empty State
  isEmpty: false,
  transactions: [
    {
      id: 'tx1',
      type: 'earn',
      source: 'mission',
      title: 'Thưởng nhiệm vụ',
      subtitle: 'Hoàn thành nhiệm vụ ngày',
      amount: 50,
      time: '2 giờ trước'
    },
    {
      id: 'tx2',
      type: 'spend',
      source: 'shop_booster',
      title: 'Thẻ X2 Kinh Nghiệm',
      subtitle: 'Mua từ Cửa hàng',
      amount: 250,
      time: 'Hôm qua'
    },
    {
      id: 'tx3',
      type: 'earn',
      source: 'streak',
      title: 'Thưởng chuỗi 10 ngày',
      subtitle: 'Duy trì học tập',
      amount: 100,
      time: 'Hôm qua'
    },
    {
      id: 'tx4',
      type: 'spend',
      source: 'shop_cosmetic',
      title: 'Mũ ảo thuật gia',
      subtitle: 'Trang bị cho Snapy',
      amount: 500,
      time: '3 ngày trước'
    },
    {
      id: 'tx5',
      type: 'earn',
      source: 'achievement',
      title: 'Huy hiệu "Chăm Chỉ"',
      subtitle: 'Phần thưởng thành tựu',
      amount: 200,
      time: 'Tuần trước'
    }
  ] as Transaction[]
};

// ==========================================
// HELPERS
// ==========================================
const getSourceIcon = (source: TransactionSource, type: TransactionType) => {
  switch (source) {
    case 'mission': return <TargetIcon size={20} className="text-reward-600" />;
    case 'streak': return <ZapIcon size={20} className="text-mascot-500" fill="#FF8A00" />;
    case 'achievement': return <TrophyIcon size={20} className="text-warning-500" />;
    case 'shop_booster': 
    case 'shop_cosmetic': 
      return <ShoppingCartIcon size={20} className="text-neutral-500" />;
    default:
      return <CoinsIcon size={20} className="text-neutral-500" />;
  }
};

export default function WalletScreen() {
  
  const renderTransaction = (tx: Transaction) => {
    const isEarn = tx.type === 'earn';
    
    return (
      <View 
        key={tx.id}
        className="flex-row items-center p-4 border-b border-neutral-50 bg-white"
      >
        {/* Icon */}
        <View className={cn(
          "w-12 h-12 rounded-2xl items-center justify-center mr-4 border",
          isEarn ? "bg-reward-50 border-reward-100" : "bg-neutral-50 border-neutral-100"
        )}>
          {getSourceIcon(tx.source, tx.type)}
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="font-bold text-[15px] text-mascot-navy font-inter mb-0.5">
            {tx.title}
          </Text>
          <Text className="font-medium text-[13px] text-neutral-500 font-inter">
            {tx.subtitle}
          </Text>
          <Text className="font-medium text-[12px] text-neutral-400 font-inter mt-1">
            {tx.time}
          </Text>
        </View>

        {/* Amount */}
        <View className="items-end ml-2">
          <Text className={cn(
            "font-extrabold text-[16px] font-nunito tabular-nums",
            isEarn ? "text-success-600" : "text-neutral-600"
          )}>
            {isEarn ? '+' : '-'}{tx.amount}
          </Text>
          <Text className="font-bold text-[11px] text-neutral-400 font-inter uppercase mt-0.5">
            Coins
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="px-4 py-3 border-b border-neutral-100 bg-white flex-row items-center justify-between z-10">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 active:bg-neutral-100 rounded-full">
          <ArrowLeftIcon size={24} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Ví tiền</Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* ========================================= */}
        {/* 2. COIN BALANCE CARD (Focal Point) */}
        {/* ========================================= */}
        <View className="bg-white rounded-[32px] p-6 border-2 border-reward-200 border-b-[6px] shadow-sm shadow-reward-500/10 items-center justify-center mb-6">
          <Text className="font-extrabold text-[13px] text-neutral-400 font-nunito uppercase tracking-widest mb-3">
            SỐ DƯ HIỆN TẠI
          </Text>
          
          <View className="flex-row items-center justify-center gap-3">
            <CoinsIcon size={48} fill="#FFC42E" className="text-reward-600" />
            <Text className="font-extrabold text-[56px] text-mascot-navy font-nunito tabular-nums leading-tight">
              {WALLET_DATA.coins.toLocaleString()}
            </Text>
          </View>
          <Text className="font-bold text-[16px] text-reward-600 font-inter mt-1 uppercase tracking-wider">
            Coins
          </Text>
        </View>

        {/* ========================================= */}
        {/* 3. XP SUMMARY CARD */}
        {/* ========================================= */}
        <View className="bg-primary-50 rounded-[24px] p-5 border border-primary-200 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <StarIcon size={20} fill="#3B82F6" className="text-primary-600" />
              <Text className="font-extrabold text-[15px] text-primary-800 font-inter">Kinh nghiệm</Text>
            </View>
            <View className="bg-white px-3 py-1 rounded-lg border border-primary-100">
              <Text className="font-extrabold text-[13px] text-primary-600 font-nunito uppercase">
                Level {WALLET_DATA.level}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-3 bg-white rounded-full overflow-hidden border border-primary-100">
              <View 
                className="h-full bg-primary-500 rounded-full" 
                style={{ width: `${(WALLET_DATA.xp / WALLET_DATA.xpMax) * 100}%` }}
              />
            </View>
            <Text className="font-extrabold text-[14px] text-primary-800 font-nunito tabular-nums">
              {WALLET_DATA.xp.toLocaleString()} / {WALLET_DATA.xpMax.toLocaleString()} XP
            </Text>
          </View>
        </View>

        {/* ========================================= */}
        {/* 4. TRANSACTION HISTORY */}
        {/* ========================================= */}
        <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito uppercase tracking-widest mb-4 ml-1">
          Lịch sử giao dịch
        </Text>

        {WALLET_DATA.isEmpty ? (
          /* EMPTY STATE */
          <View className="bg-white rounded-3xl p-8 border border-neutral-100 items-center justify-center">
            <Snapy pose="suy_nghi" animation="idle" className="w-24 h-24 mb-4 opacity-80" />
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-2">
              Chưa có giao dịch nào
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center px-4">
              Hãy hoàn thành nhiệm vụ để kiếm thêm Coin nhé!
            </Text>
          </View>
        ) : (
          /* TRANSACTION LIST */
          <View className="bg-white rounded-[24px] border border-neutral-100 shadow-sm shadow-black/5 overflow-hidden">
            {WALLET_DATA.transactions.map(renderTransaction)}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
