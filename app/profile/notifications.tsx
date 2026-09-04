import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  ClockIcon,
  TrophyIcon,
  TargetIcon,
  InfoIcon,
  CheckIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
type NotificationType = 'srs' | 'badge' | 'mission' | 'system';

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  target?: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'srs',
    title: 'Đã đến giờ ôn tập!',
    body: 'Bạn có 12 thẻ từ vựng đang chờ được ôn tập.',
    time: 'Vừa xong',
    isRead: false,
    target: '/study/srs-review'
  },
  {
    id: 'n2',
    type: 'badge',
    title: 'Huy hiệu mới đã mở khoá!',
    body: 'Bạn vừa nhận được huy hiệu "Nhà Khám Phá". Xem ngay!',
    time: '5 phút trước',
    isRead: false,
    target: '/(tabs)/achievements'
  },
  {
    id: 'n3',
    type: 'mission',
    title: 'Nhiệm vụ hoàn thành!',
    body: 'Bạn đã hoàn thành mục tiêu học 20 từ. Nhận thưởng ngay!',
    time: '2 giờ trước',
    isRead: true,
    target: '/(tabs)/missions'
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Cập nhật hệ thống',
    body: 'SnapVocab vừa được cập nhật thêm nhiều tính năng mới thú vị.',
    time: 'Hôm qua',
    isRead: true
  }
];

// Helper to get styling by type
const getTypeConfig = (type: NotificationType) => {
  switch (type) {
    case 'srs':
      return { icon: ClockIcon, color: 'bg-primary-100 text-primary-600 border-primary-200' };
    case 'badge':
      return { icon: TrophyIcon, color: 'bg-warning-100 text-warning-600 border-warning-200' };
    case 'mission':
      return { icon: TargetIcon, color: 'bg-success-100 text-success-600 border-success-200' };
    case 'system':
      return { icon: InfoIcon, color: 'bg-neutral-100 text-neutral-600 border-neutral-200' };
  }
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handlers
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationPress = (notif: AppNotification) => {
    // Mark as read
    if (!notif.isRead) {
      setNotifications(prev => 
        prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n)
      );
    }
    // Navigate if target exists
    if (notif.target) {
      // Small timeout to let UI update before navigating
      setTimeout(() => {
        router.push(notif.target as any);
      }, 100);
    }
  };

  const renderNotification = (notif: AppNotification) => {
    const config = getTypeConfig(notif.type);
    const Icon = config.icon;

    return (
      <Pressable 
        key={notif.id}
        onPress={() => handleNotificationPress(notif)}
        className={cn(
          "flex-row p-4 border-b border-neutral-50 active:bg-neutral-50 transition-all",
          notif.isRead ? "opacity-75" : "bg-primary-50/30"
        )}
      >
        {/* Unread Indicator */}
        <View className="w-3 pt-2 mr-1 items-center">
          {!notif.isRead && (
            <View className="w-2 h-2 rounded-full bg-primary-500" />
          )}
        </View>

        {/* Icon */}
        <View className={cn(
          "w-12 h-12 rounded-full items-center justify-center border mr-4",
          config.color.split(' ')[0],
          config.color.split(' ')[2]
        )}>
          <Icon size={20} className={config.color.split(' ')[1]} />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-1">
            <Text 
              className={cn(
                "flex-1 text-[15px] font-nunito pr-2 leading-tight",
                notif.isRead ? "font-bold text-mascot-navy" : "font-extrabold text-primary-950"
              )}
            >
              {notif.title}
            </Text>
            <Text className="font-medium text-[12px] text-neutral-400 font-inter mt-0.5 whitespace-nowrap">
              {notif.time}
            </Text>
          </View>
          <Text 
            className={cn(
              "text-[14px] font-inter leading-relaxed",
              notif.isRead ? "font-medium text-neutral-500" : "font-bold text-neutral-600"
            )}
            numberOfLines={2}
          >
            {notif.body}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="px-4 py-3 border-b border-neutral-100 flex-row items-center justify-between z-10 bg-white shadow-sm shadow-black/5">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 active:bg-neutral-100 rounded-full">
          <ArrowLeftIcon size={24} className="text-mascot-navy" />
        </Pressable>
        
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">
          Thông báo {unreadCount > 0 && <Text className="text-primary-500">({unreadCount})</Text>}
        </Text>
        
        <View className="w-10 h-10 items-center justify-center -mr-2">
          {unreadCount > 0 ? (
            <Pressable 
              onPress={handleMarkAllRead}
              className="w-10 h-10 items-center justify-center active:bg-neutral-100 rounded-full"
            >
              <CheckIcon size={22} className="text-primary-500" />
            </Pressable>
          ) : (
            <View className="w-10 h-10" />
          )}
        </View>
      </View>

      {/* 2. CONTENT */}
      {notifications.length > 0 ? (
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {notifications.map(renderNotification)}
        </ScrollView>
      ) : (
        /* 3. EMPTY STATE */
        <View className="flex-1 items-center justify-center p-6 bg-[#F7F8FA]">
          <View className="w-24 h-24 bg-neutral-100 rounded-full items-center justify-center mb-6">
            <Snapy pose="curious" className="w-16 h-16 opacity-50" />
          </View>
          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">
            Chưa có thông báo nào
          </Text>
          <Text className="font-medium text-[15px] text-neutral-500 font-inter text-center max-w-[280px]">
            Bạn sẽ thấy các cập nhật hệ thống và lời nhắc học tập ở đây.
          </Text>
        </View>
      )}

    </SafeAreaView>
  );
}
