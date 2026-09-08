import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  LockIcon,
  FingerprintIcon,
  BellIcon,
  MoonIcon,
  TargetIcon,
  ClockIcon,
  GlobeIcon,
  PaletteIcon,
  LogOutIcon,
  ChevronRightIcon,
  XIcon,
  CheckIcon,
  LayersIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';

// ==========================================
// MOCK DATA & COMPONENTS
// ==========================================
const APP_VERSION = '1.0.0 (Build 42)';

const LANGUAGES = [
  { id: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'ja', name: '日本語', flag: '🇯🇵' },
];

export default function SettingsScreen() {
  // Toggle States
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  
  // Setting Values
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [quietHours, setQuietHours] = useState('22:00 - 07:00');
  const [srsReminder, setSrsReminder] = useState('20:00');
  const [dailyGoal, setDailyGoal] = useState('20 từ / ngày');

  // Modal States
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showTimeMockSheet, setShowTimeMockSheet] = useState(false);

  // Common UI components
  const renderSectionHeader = (title: string) => (
    <Text className="font-extrabold text-[15px] text-mascot-navy font-nunito uppercase tracking-widest mb-3 ml-2 mt-6">
      {title}
    </Text>
  );

  const renderRow = (
    icon: React.ReactNode, 
    title: string, 
    value?: string | React.ReactNode, 
    onPress?: () => void,
    isLast: boolean = false,
    textColor: string = "text-mascot-navy"
  ) => (
    <Pressable 
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        "flex-row items-center p-4",
        !isLast && "border-b border-neutral-50",
        onPress && "active:bg-neutral-50"
      )}
    >
      <View className="w-8 items-center justify-center mr-3">
        {icon}
      </View>
      <Text className={cn("flex-1 font-bold text-[16px] font-inter", textColor)}>
        {title}
      </Text>
      
      <View className="flex-row items-center gap-2">
        {typeof value === 'string' ? (
          <Text className="font-medium text-[14px] text-neutral-500 font-inter">{value}</Text>
        ) : (
          value
        )}
        {onPress && <ChevronRightIcon size={18} className="text-neutral-400" />}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="px-4 py-3 border-b border-neutral-100 bg-white flex-row items-center justify-between z-10">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 active:bg-neutral-100 rounded-full">
          <ArrowLeftIcon size={24} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Cài đặt</Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* ========================================= */}
        {/* ACCOUNT SECTION */}
        {/* ========================================= */}
        {renderSectionHeader('Tài khoản')}
        <View className="bg-white rounded-3xl border border-neutral-100 shadow-sm shadow-black/5 overflow-hidden">
          {renderRow(
            <LockIcon size={22} className="text-neutral-500" />,
            "Đổi mật khẩu",
            undefined,
            () => {} // Mock open change password
          )}
          {renderRow(
            <FingerprintIcon size={22} className="text-neutral-500" />,
            "Đăng nhập sinh trắc học",
            <Switch 
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={'#FFFFFF'}
            />,
            undefined,
            true
          )}
        </View>

        {/* ========================================= */}
        {/* NOTIFICATIONS SECTION */}
        {/* ========================================= */}
        {renderSectionHeader('Thông báo')}
        <View className="bg-white rounded-3xl border border-neutral-100 shadow-sm shadow-black/5 overflow-hidden">
          {renderRow(
            <BellIcon size={22} className="text-neutral-500" />,
            "Thông báo đẩy",
            <Switch 
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={'#FFFFFF'}
            />
          )}
          {renderRow(
            <MoonIcon size={22} className="text-neutral-500" />,
            "Giờ yên tĩnh",
            pushEnabled ? quietHours : "Tắt",
            pushEnabled ? () => setShowTimeMockSheet(true) : undefined,
            true,
            pushEnabled ? "text-mascot-navy" : "text-neutral-400"
          )}
        </View>

        {/* ========================================= */}
        {/* LEARNING SECTION */}
        {/* ========================================= */}
        {renderSectionHeader('Học tập')}
        <View className="bg-white rounded-3xl border border-neutral-100 shadow-sm shadow-black/5 overflow-hidden">
          {renderRow(
            <TargetIcon size={22} className="text-neutral-500" />,
            "Mục tiêu hằng ngày",
            dailyGoal,
            () => {} 
          )}
          {renderRow(
            <ClockIcon size={22} className="text-neutral-500" />,
            "Nhắc nhở học SRS",
            srsReminder,
            () => setShowTimeMockSheet(true)
          )}
          {renderRow(
            <LayersIcon size={22} className="text-neutral-500" />,
            "Card template của tôi",
            undefined,
            () => router.push({ pathname: '/templates' as any, params: { mode: 'MANAGE' } }),
            true
          )}
        </View>

        {/* ========================================= */}
        {/* APP SECTION */}
        {/* ========================================= */}
        {renderSectionHeader('Ứng dụng')}
        <View className="bg-white rounded-3xl border border-neutral-100 shadow-sm shadow-black/5 overflow-hidden">
          {renderRow(
            <GlobeIcon size={22} className="text-neutral-500" />,
            "Ngôn ngữ",
            language.name,
            () => setShowLanguageSheet(true)
          )}
          {renderRow(
            <PaletteIcon size={22} className="text-neutral-500" />,
            "Giao diện",
            "Mặc định",
            undefined, // Disabled theme selection for MVP as per prompt
            true
          )}
        </View>

        {/* ========================================= */}
        {/* LOGOUT & VERSION */}
        {/* ========================================= */}
        <View className="mt-8 bg-white rounded-3xl border border-error-100 shadow-sm shadow-black/5 overflow-hidden">
          <Pressable 
            onPress={() => setShowLogoutAlert(true)}
            className="flex-row items-center justify-center p-4 active:bg-error-50"
          >
            <LogOutIcon size={20} className="text-error-500 mr-2" />
            <Text className="font-extrabold text-[16px] text-error-600 font-inter">Đăng xuất</Text>
          </Pressable>
        </View>

        <View className="items-center mt-6">
          <Snapy pose="main" animation="idle" className="w-12 h-12 opacity-60 mb-2" />
          <Text className="font-bold text-[14px] text-neutral-400 font-nunito">SnapVocab</Text>
          <Text className="font-medium text-[12px] text-neutral-400 font-inter">Version {APP_VERSION}</Text>
        </View>

      </ScrollView>

      {/* ========================================== */}
      {/* MODALS */}
      {/* ========================================== */}

      {/* LOGOUT ALERT */}
      <Modal
        visible={showLogoutAlert}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/40 items-center justify-center p-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-[340px] shadow-xl items-center">
            <View className="w-16 h-16 bg-error-50 rounded-full items-center justify-center mb-4 border border-error-100">
              <LogOutIcon size={28} className="text-error-500" />
            </View>
            
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">
              Đăng xuất?
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-8">
              Bạn có chắc chắn muốn đăng xuất khỏi SnapVocab không?
            </Text>

            <View className="w-full gap-3">
              <Pressable 
                onPress={() => {
                  setShowLogoutAlert(false);
                  // Mock logout logic: navigate to auth screen or root
                  router.push('/');
                }}
                className="w-full h-12 bg-error-500 rounded-xl items-center justify-center active:bg-error-600 border-b-[3px] border-error-700"
              >
                <Text className="font-extrabold text-[15px] text-white font-nunito uppercase tracking-wide">Đăng xuất</Text>
              </Pressable>
              
              <Pressable 
                onPress={() => setShowLogoutAlert(false)}
                className="w-full h-12 bg-neutral-100 rounded-xl items-center justify-center active:bg-neutral-200"
              >
                <Text className="font-bold text-[15px] text-neutral-600 font-inter">Hủy</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* LANGUAGE SELECTOR BOTTOM SHEET */}
      <Modal
        visible={showLanguageSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageSheet(false)}
      >
        <View className="flex-1 bg-black/40 justify-end">
          <Pressable className="absolute inset-0" onPress={() => setShowLanguageSheet(false)} />
          
          <View className="bg-white rounded-t-[32px] p-6 pb-10 shadow-xl">
            <View className="w-12 h-1.5 bg-neutral-200 rounded-full mb-6 self-center" />
            
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito">Chọn Ngôn ngữ</Text>
              <Pressable onPress={() => setShowLanguageSheet(false)} className="p-2 -mr-2">
                <XIcon size={20} className="text-neutral-400" />
              </Pressable>
            </View>
            
            <View className="gap-2">
              {LANGUAGES.map((lang) => (
                <Pressable 
                  key={lang.id}
                  onPress={() => {
                    setLanguage(lang);
                    setShowLanguageSheet(false);
                  }}
                  className={cn(
                    "w-full h-16 rounded-2xl flex-row items-center px-4 border-2 active:opacity-70",
                    language.id === lang.id 
                      ? "bg-primary-50 border-primary-400" 
                      : "bg-white border-neutral-100"
                  )}
                >
                  <Text className="text-[24px] mr-3">{lang.flag}</Text>
                  <Text className={cn(
                    "flex-1 font-bold text-[16px] font-inter",
                    language.id === lang.id ? "text-primary-700" : "text-mascot-navy"
                  )}>
                    {lang.name}
                  </Text>
                  {language.id === lang.id && (
                    <CheckIcon size={20} className="text-primary-500" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* MOCK TIME PICKER BOTTOM SHEET */}
      <Modal
        visible={showTimeMockSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeMockSheet(false)}
      >
        <View className="flex-1 bg-black/40 justify-end">
          <Pressable className="absolute inset-0" onPress={() => setShowTimeMockSheet(false)} />
          <View className="bg-white rounded-t-[32px] p-6 pb-10 shadow-xl items-center">
            <View className="w-12 h-1.5 bg-neutral-200 rounded-full mb-6" />
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2">Chọn Giờ</Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-8 text-center px-4">
              (Giả lập Native Time Picker Component. Trong thực tế sẽ dùng bộ chọn giờ của iOS/Android)
            </Text>
            <Pressable 
              onPress={() => setShowTimeMockSheet(false)}
              className="w-full h-14 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 items-center justify-center"
            >
              <Text className="font-extrabold text-[16px] text-white font-nunito uppercase tracking-wide">Xác nhận</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
