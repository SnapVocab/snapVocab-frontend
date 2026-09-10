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
import { useEconomyState, Transaction, TransactionSource, TransactionType } from '@/lib/economyState';

// ==========================================
// MOCK PROFILE LEVEL
// ==========================================
const WALLET_PROFILE = {
  xp: 2450,
  level: 12,
  xpMax: 3000,
};

// ==========================================
// HELPERS
// ==========================================
const getSourceIcon = (source: TransactionSource, type: TransactionType) => {
  switch (source) {
    case 'mission': return <TargetIcon size={20} color="#EAB308" />;
    case 'streak': return <ZapIcon size={20} color="#FF8A00" fill="#FF8A00" />;
    case 'achievement': return <TrophyIcon size={20} color="#F59E0B" />;
    case 'shop_booster': 
    case 'shop_cosmetic': 
      return <ShoppingCartIcon size={20} color="#757793" />;
    default:
      return <CoinsIcon size={20} color="#757793" />;
  }
};

export default function WalletScreen() {
  const [economy] = useEconomyState();
  
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
      <View className="px-4 py-3 border-b border-neutral-100 bg-white flex-row items-center justify-between z-10 shadow-sm shadow-black/5">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 active:bg-neutral-100 rounded-full">
          <ArrowLeftIcon size={24} color="#1B1B3A" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Ví của bạn</Text>
        <Pressable 
          onPress={() => router.push('/(tabs)/shop' as any)}
          className="bg-reward-50 px-3 py-1 rounded-full border border-reward-200 active:scale-95"
        >
          <Text className="text-[12px] font-extrabold text-reward-700 font-nunito">Shop</Text>
        </Pressable>
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
            <CoinsIcon size={48} fill="#FFC42E" color="#B37F00" />
            <Text className="font-extrabold text-[52px] text-mascot-navy font-nunito tabular-nums leading-tight">
              {economy.coins.toLocaleString()}
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
              <StarIcon size={20} fill="#3B82F6" color="#2563EB" />
              <Text className="font-extrabold text-[15px] text-primary-800 font-inter">Kinh nghiệm</Text>
            </View>
            <View className="bg-white px-3 py-1 rounded-lg border border-primary-100">
              <Text className="font-extrabold text-[13px] text-primary-600 font-nunito uppercase">
                Level {WALLET_PROFILE.level}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-3 bg-white rounded-full overflow-hidden border border-primary-100">
              <View 
                className="h-full bg-primary-500 rounded-full" 
                style={{ width: `${(WALLET_PROFILE.xp / WALLET_PROFILE.xpMax) * 100}%` }}
              />
            </View>
            <Text className="font-extrabold text-[14px] text-primary-800 font-nunito tabular-nums">
              {WALLET_PROFILE.xp.toLocaleString()} / {WALLET_PROFILE.xpMax.toLocaleString()} XP
            </Text>
          </View>
        </View>

        {/* ========================================= */}
        {/* 4. TRANSACTION HISTORY */}
        {/* ========================================= */}
        <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito uppercase tracking-widest mb-4 ml-1">
          Lịch sử giao dịch
        </Text>

        {economy.transactions.length === 0 ? (
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
            {economy.transactions.map(renderTransaction)}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
