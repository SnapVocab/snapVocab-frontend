import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { 
  XIcon, 
  ZapIcon, 
  ZapOffIcon, 
  ImageIcon, 
  ScanIcon,
  WifiOffIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { router } from 'expo-router';

// ==========================================
// TEST STATES
// 'idle': Normal camera view
// 'noPermission': Permission denied state
// 'processing': AI is analyzing the image
// 'exhausted': 0 scans remaining
// 'offline': No internet
// ==========================================
type MockState = 'idle' | 'noPermission' | 'processing' | 'exhausted' | 'offline';
const TEST_STATE: MockState = 'idle';

const MOCK_SCANS_LEFT: number = 3;

export default function CameraScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isProcessing, setIsProcessing] = useState(TEST_STATE === 'processing');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Forced mock states
  const isExhausted = TEST_STATE === 'exhausted' || MOCK_SCANS_LEFT === 0;
  const isOffline = TEST_STATE === 'offline';
  const hasNoPermission = TEST_STATE === 'noPermission' || (permission && !permission.granted);

  const handleCapture = () => {
    if (isExhausted || isOffline) return;
    
    // Simulate capture
    setCapturedImage('mock_image_uri');
    setIsProcessing(true);
    
    // Chuyển sang màn hình kết quả sau khi "xử lý" xong
    setTimeout(() => {
      router.push('/result');
      
      // Reset state sau khi đã trigger chuyển trang để tránh giật hình
      setTimeout(() => {
        setIsProcessing(false);
        setCapturedImage(null);
      }, 500);
    }, 3000);
  };

  const handleGallery = async () => {
    if (isExhausted || isOffline) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const handleClose = () => {
    router.back();
  };

  // ==========================================
  // STATE: NO PERMISSION
  // ==========================================
  if (hasNoPermission) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-900 justify-center items-center px-6">
        <View className="bg-white rounded-[24px] p-6 items-center w-full max-w-[340px] shadow-sm shadow-black/10">
          <Snapy pose="kham_pha" animation="bounce" className="w-28 h-28 mb-4" />
          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center leading-tight">Sử dụng Camera để khám phá từ mới</Text>
          <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-6 text-center leading-relaxed">
            Cho phép SnapVocab truy cập Camera để nhận diện vật thể xung quanh bạn.
          </Text>
          <Pressable 
            onPress={requestPermission}
            className="w-full h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]  flex-row items-center justify-center mb-3"
          >
            <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">CHO PHÉP CAMERA</Text>
          </Pressable>
          <Pressable onPress={handleClose} className="w-full h-12 bg-white rounded-xl border-2 border-neutral-100 active:bg-neutral-50 active:translate-y-[1px]  flex-row items-center justify-center">
            <Text className="text-neutral-500 font-bold text-[14px] font-inter">Đóng</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // STATE: OFFLINE
  // ==========================================
  if (isOffline) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-900 justify-center items-center px-6">
        <View className="bg-white rounded-[24px] p-6 items-center w-full max-w-[340px]">
          <View className="w-16 h-16 bg-neutral-100 rounded-full items-center justify-center mb-4">
             <WifiOffIcon size={28} className="text-neutral-400" />
          </View>
          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center leading-tight">Bạn đang ngoại tuyến</Text>
          <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-6 text-center leading-relaxed">
            Cần có kết nối Internet để nhận diện từ vựng. Vui lòng kết nối và thử lại.
          </Text>
          <Pressable onPress={handleClose} className="w-full h-12 bg-neutral-100 rounded-xl active:bg-neutral-200 flex-row items-center justify-center">
            <Text className="text-mascot-navy font-bold text-[15px] uppercase font-nunito tracking-[0.04em]">ĐÓNG</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // NORMAL / PROCESSING / EXHAUSTED STATES
  // ==========================================
  return (
    <View className="flex-1 bg-black">
      {/* CAMERA PREVIEW */}
      <View style={StyleSheet.absoluteFill}>
        {capturedImage ? (
          <View className="flex-1 bg-neutral-800" /> // Placeholder for frozen image
        ) : (
          <CameraView 
            style={StyleSheet.absoluteFill} 
            facing="back" 
            enableTorch={flash === 'on'}
          />
        )}
      </View>

      {/* OVERLAY: TRANSLUCENT GRADIENTS (Simulated via SafeAreaView and opacity) */}
      <View style={StyleSheet.absoluteFill} className="bg-black/10 pointer-events-none" />

      {/* TOP CONTROLS */}
      <SafeAreaView edges={['top']} className="px-4 pt-4 flex-row justify-between items-center z-10">
        <Pressable onPress={handleClose} className="w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-md">
          <XIcon size={20} className="text-white" />
        </Pressable>

        {!isProcessing ? (
          <View className="bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md flex-row items-center gap-1.5">
            <ScanIcon size={14} className={isExhausted ? "text-danger-400" : "text-white"} />
            <Text className={cn(
              "font-inter font-medium text-[13px]",
              isExhausted ? "text-danger-400" : "text-white"
            )}>
              {MOCK_SCANS_LEFT} lượt
            </Text>
          </View>
        ) : null}

        {!isProcessing ? (
          <Pressable 
            onPress={() => setFlash(f => f === 'off' ? 'on' : 'off')}
            className="w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-md"
          >
            {flash === 'on' ? (
              <ZapIcon size={20} className="text-reward-400" />
            ) : (
              <ZapOffIcon size={20} className="text-white" />
            )}
          </Pressable>
        ) : null}
        
        {isProcessing ? <View className="w-10" /> : null}
      </SafeAreaView>

      {/* CENTER VIEWFINDER (Hidden when processing or exhausted) */}
      {!isProcessing && !isExhausted && (
        <View className="flex-1 items-center justify-center pointer-events-none">
          <View className="w-[280px] h-[280px] border-[2px] border-white/40 rounded-[32px] justify-center items-center">
            {/* Subtle corner markers could go here */}
          </View>
          <View className="bg-black/60 px-4 py-2 rounded-full mt-6 backdrop-blur-md">
            <Text className="text-white font-inter text-[13px] font-medium text-center shadow-black">
              Chụp rõ vật thể để nhận diện từ vựng
            </Text>
          </View>
        </View>
      )}

      {/* STATE: EXHAUSTED */}
      {isExhausted && !isProcessing && (
        <View className="flex-1 items-center justify-center px-6 z-20">
          <View className="bg-white rounded-[24px] p-6 items-center w-full shadow-lg shadow-black/20">
            <Snapy pose="suy_nghi" animation="idle" className="w-24 h-24 mb-3" />
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-1 text-center">Hết lượt Scan</Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-5 text-center leading-relaxed">
              Bạn đã sử dụng hết lượt scan hôm nay. Lượt scan sẽ được làm mới vào <Text className="font-bold">00:00 ngày mai</Text>.
            </Text>
            <Pressable onPress={handleClose} className="w-full h-12 bg-primary-500 rounded-xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]  flex-row items-center justify-center">
              <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">HỌC TỪ ĐÃ LƯU</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* STATE: PROCESSING */}
      {isProcessing && (
        <View className="flex-1 items-center justify-center px-6 z-20">
          <Snapy pose="loading" animation="float" className="w-36 h-36 mb-4" />
          <View className="bg-black/70 px-6 py-4 rounded-3xl backdrop-blur-md items-center shadow-lg shadow-black/20">
            <Text className="font-extrabold text-[18px] text-white font-nunito mb-1 text-center">
              Mắt thần đang nhìn...
            </Text>
            <Text className="font-medium text-[14px] text-white/80 font-inter text-center">
              Đợi chút nhé!
            </Text>
          </View>
        </View>
      )}

      {/* BOTTOM CONTROLS */}
      <SafeAreaView edges={['bottom']} className="pb-8 pt-4 px-8 flex-row justify-between items-center z-10">
        {!isProcessing && !isExhausted ? (
          <>
            {/* GALLERY BUTTON */}
            <Pressable 
              onPress={handleGallery}
              className="w-14 h-14 bg-black/40 rounded-full items-center justify-center backdrop-blur-md active:bg-black/60 "
            >
              <ImageIcon size={24} className="text-white" />
            </Pressable>

            {/* CAPTURE BUTTON */}
            <Pressable 
              onPress={handleCapture}
              className="w-20 h-20 bg-white/30 rounded-full items-center justify-center p-1.5 active:scale-95 "
            >
              <View className="flex-1 w-full bg-white rounded-full shadow-lg shadow-black/20" />
            </Pressable>
            
            {/* SPACER TO BALANCE FLEX */}
            <View className="w-14 h-14" />
          </>
        ) : isProcessing ? (
          <View className="flex-1 items-center">
            <Pressable 
              onPress={() => setIsProcessing(false)}
              className="bg-black/40 px-8 py-3 rounded-full backdrop-blur-md active:bg-black/60 "
            >
              <Text className="text-white font-bold text-[14px] font-inter uppercase tracking-widest">HỦY</Text>
            </Pressable>
          </View>
        ) : null}
      </SafeAreaView>

    </View>
  );
}
