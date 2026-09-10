import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Image, 
  Animated, 
  Easing, 
  Platform,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { 
  XIcon, 
  ZapIcon, 
  ZapOffIcon, 
  ImageIcon, 
  ScanIcon, 
  WifiOffIcon,
  SwitchCameraIcon,
  SparklesIcon,
  InfoIcon
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
const MAX_DAILY_SCANS: number = 5;

// Sample demo image for web or demo testing
const SAMPLE_DEMO_IMAGE = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80';

export default function CameraScanScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isProcessing, setIsProcessing] = useState(TEST_STATE === 'processing');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showShutterFlash, setShowShutterFlash] = useState(false);
  const [showQuotaInfo, setShowQuotaInfo] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Laser scan line animation
  const laserAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Forced mock states
  const isExhausted = TEST_STATE === 'exhausted' || MOCK_SCANS_LEFT === 0;
  const isOffline = TEST_STATE === 'offline';
  const hasNoPermission = !demoMode && (TEST_STATE === 'noPermission' || (permission && !permission.granted));

  // Laser beam loop
  useEffect(() => {
    const laserLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 240,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    laserLoop.start();
    pulseLoop.start();

    return () => {
      laserLoop.stop();
      pulseLoop.stop();
    };
  }, [laserAnim, pulseAnim]);

  // Flash shutter effect and proceed
  const triggerCaptureAnimation = (targetUri?: string) => {
    setShowShutterFlash(true);
    setTimeout(() => {
      setShowShutterFlash(false);
      setIsProcessing(true);

      const finalUri = targetUri || SAMPLE_DEMO_IMAGE;
      setCapturedImage(finalUri);

      // Chuyển sang màn hình kết quả sau khi "xử lý" xong
      setTimeout(() => {
        router.push({
          pathname: '/result',
          params: { imageUri: encodeURIComponent(finalUri) }
        });

        setTimeout(() => {
          setIsProcessing(false);
          setCapturedImage(null);
        }, 500);
      }, 2500);
    }, 150);
  };

  const handleCapture = () => {
    if (isExhausted || isOffline) return;
    triggerCaptureAnimation(SAMPLE_DEMO_IMAGE);
  };

  // Chọn ảnh thực tế từ Thư viện thiết bị
  const handleGallery = async () => {
    if (isExhausted || isOffline) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        triggerCaptureAnimation(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Lỗi chọn ảnh từ thư viện:', err);
      // Fallback demo image if picker is unsupported on environment
      triggerCaptureAnimation(SAMPLE_DEMO_IMAGE);
    }
  };

  const handleFlipCamera = () => {
    setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const handleClose = () => {
    // Điều hướng an toàn về trang chủ tabs
    router.replace('/(tabs)');
  };

  // ==========================================
  // STATE: NO PERMISSION (Có fallback test mượt mà)
  // ==========================================
  if (hasNoPermission) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-900 justify-center items-center px-6">
        <View className="bg-white rounded-[32px] p-6 items-center w-full max-w-[360px] shadow-2xl shadow-black/20 border-b-[6px] border-neutral-200">
          <View className="w-28 h-28 items-center justify-center mb-2">
            <Snapy pose="kham_pha" animation="bounce" className="w-28 h-28" />
          </View>
          
          <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-2 text-center leading-tight">
            Khám phá từ mới cùng Camera AI
          </Text>
          
          <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-6 text-center leading-relaxed">
            Cho phép SnapVocab truy cập Camera để nhận diện trực tiếp các vật thể xung quanh bạn.
          </Text>

          {/* Button 1: Cấp quyền Camera */}
          <Pressable 
            onPress={requestPermission}
            className="w-full h-12 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] flex-row items-center justify-center mb-3 transition-all"
          >
            <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">
              CHO PHÉP CAMERA
            </Text>
          </Pressable>

          {/* Button 2: Hoặc chọn ảnh từ Thư viện */}
          <Pressable 
            onPress={handleGallery}
            className="w-full h-12 bg-info-50 rounded-2xl border border-info-200 active:bg-info-100 flex-row items-center justify-center gap-2 mb-3 transition-all"
          >
            <ImageIcon size={18} color="#0284c7" />
            <Text className="text-info-700 font-bold text-[14px] font-nunito">
              Chọn ảnh từ Thư viện
            </Text>
          </Pressable>

          {/* Button 3: Thử nghiệm giao diện Demo Kính ngắm */}
          <Pressable 
            onPress={() => setDemoMode(true)}
            className="w-full h-11 bg-neutral-100 rounded-xl active:bg-neutral-200 flex-row items-center justify-center gap-1.5 mb-3"
          >
            <SparklesIcon size={16} color="#FF8A00" />
            <Text className="text-neutral-700 font-bold text-[13px] font-inter">
              Thử nghiệm Kính ngắm AI (Demo)
            </Text>
          </Pressable>

          {/* Button 4: Đóng */}
          <Pressable 
            onPress={handleClose} 
            className="w-full h-10 items-center justify-center"
          >
            <Text className="text-neutral-400 font-bold text-[14px] font-inter">
              Quay lại Trang chủ
            </Text>
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
        <View className="bg-white rounded-[32px] p-6 items-center w-full max-w-[340px] shadow-2xl border-b-[6px] border-neutral-200">
          <View className="w-16 h-16 bg-neutral-100 rounded-full items-center justify-center mb-4">
             <WifiOffIcon size={28} color="#9597ad" />
          </View>
          <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center leading-tight">
            Bạn đang ngoại tuyến
          </Text>
          <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-6 text-center leading-relaxed">
            Cần có kết nối Internet để nhận diện từ vựng. Vui lòng kết nối và thử lại.
          </Text>
          <Pressable 
            onPress={handleClose} 
            className="w-full h-12 bg-neutral-100 rounded-xl active:bg-neutral-200 flex-row items-center justify-center border-b-[3px] border-neutral-300"
          >
            <Text className="text-mascot-navy font-bold text-[15px] uppercase font-nunito tracking-[0.04em]">
              QUAY LẠI TRANG CHỦ
            </Text>
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
      {/* SHUTTER FLASH OVERLAY */}
      {showShutterFlash && (
        <View 
          style={StyleSheet.absoluteFill} 
          className="bg-white z-50 pointer-events-none opacity-80" 
        />
      )}

      {/* CAMERA PREVIEW */}
      <View style={StyleSheet.absoluteFill}>
        {capturedImage ? (
          <Image 
            source={{ uri: capturedImage }} 
            style={StyleSheet.absoluteFill} 
            resizeMode="cover" 
          />
        ) : demoMode ? (
          // Simulated Camera Preview for Demo / Web
          <Image 
            source={{ uri: SAMPLE_DEMO_IMAGE }} 
            style={StyleSheet.absoluteFill} 
            resizeMode="cover" 
          />
        ) : (
          <CameraView 
            style={StyleSheet.absoluteFill} 
            facing={facing} 
            enableTorch={flash === 'on'}
          />
        )}
      </View>

      {/* OVERLAY: TRANSLUCENT VIGNETTE GRADIENTS */}
      <View style={StyleSheet.absoluteFill} className="bg-black/35 pointer-events-none" />

      {/* TOP CONTROLS */}
      <View 
        style={{ paddingTop: Math.max(insets.top, 16) }} 
        className="px-5 pb-3 flex-row justify-between items-center z-20 shrink-0"
      >
        {/* Close Button */}
        <Pressable 
          onPress={handleClose} 
          className="w-11 h-11 bg-black/50 rounded-full items-center justify-center backdrop-blur-md active:scale-95 border border-white/20 shrink-0"
          style={{ width: 44, height: 44, borderRadius: 22 }}
        >
          <XIcon size={20} color="#FFFFFF" />
        </Pressable>

        {/* Scan Quota Badge with Info Popover */}
        {!isProcessing && (
          <Pressable 
            onPress={() => setShowQuotaInfo(true)}
            className="bg-black/50 px-4 py-2 rounded-full backdrop-blur-md flex-row items-center gap-2 border border-white/20 active:bg-black/70"
          >
            <ScanIcon size={15} color={isExhausted ? "#f87171" : "#58CC02"} />
            <Text className={cn(
              "font-nunito font-extrabold text-[13px] tracking-wide",
              isExhausted ? "text-danger-400" : "text-white"
            )}>
              {MOCK_SCANS_LEFT}/{MAX_DAILY_SCANS} lượt
            </Text>
            <InfoIcon size={12} color="rgba(255, 255, 255, 0.6)" className="ml-0.5" />
          </Pressable>
        )}

        {/* Right Tools: Flash & Flip Camera */}
        {!isProcessing ? (
          <View className="flex-row items-center gap-2.5">
            {/* Flash Toggle */}
            <Pressable 
              onPress={() => setFlash(f => (f === 'off' ? 'on' : 'off'))}
              className="w-11 h-11 bg-black/50 rounded-full items-center justify-center backdrop-blur-md active:scale-95 border border-white/20 shrink-0"
              style={{ width: 44, height: 44, borderRadius: 22 }}
            >
              {flash === 'on' ? (
                <ZapIcon size={20} color="#fbbf24" />
              ) : (
                <ZapOffIcon size={20} color="#FFFFFF" />
              )}
            </Pressable>

            {/* Flip Camera Toggle */}
            <Pressable 
              onPress={handleFlipCamera}
              className="w-11 h-11 bg-black/50 rounded-full items-center justify-center backdrop-blur-md active:scale-95 border border-white/20 shrink-0"
              style={{ width: 44, height: 44, borderRadius: 22 }}
            >
              <SwitchCameraIcon size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {/* CENTER VIEWFINDER: AI TARGET RETICLE & LASER SCAN */}
      {!isProcessing && !isExhausted && (
        <View className="flex-1 items-center justify-center pointer-events-none px-6">
          <View className="w-[280px] h-[280px] relative justify-center items-center">
            {/* Corner 1: Top-Left */}
            <View 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 38,
                height: 38,
                borderTopWidth: 4,
                borderLeftWidth: 4,
                borderTopLeftRadius: 20,
                borderColor: '#58CC02',
              }} 
            />

            {/* Corner 2: Top-Right */}
            <View 
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 38,
                height: 38,
                borderTopWidth: 4,
                borderRightWidth: 4,
                borderTopRightRadius: 20,
                borderColor: '#58CC02',
              }} 
            />

            {/* Corner 3: Bottom-Left */}
            <View 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: 38,
                height: 38,
                borderBottomWidth: 4,
                borderLeftWidth: 4,
                borderBottomLeftRadius: 20,
                borderColor: '#58CC02',
              }} 
            />

            {/* Corner 4: Bottom-Right */}
            <View 
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 38,
                height: 38,
                borderBottomWidth: 4,
                borderRightWidth: 4,
                borderBottomRightRadius: 20,
                borderColor: '#58CC02',
              }} 
            />

            {/* Subtle Center Reticle Pulse */}
            <Animated.View 
              style={{
                transform: [{ scale: pulseAnim }],
                width: 48,
                height: 48,
                borderRadius: 24,
                borderWidth: 1.5,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(88, 204, 2, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View className="w-2 h-2 rounded-full bg-primary-400 shadow-sm" />
            </Animated.View>

            {/* Animated Laser Scanning Line */}
            <Animated.View 
              style={{
                position: 'absolute',
                left: 8,
                right: 8,
                top: 10,
                height: 3,
                transform: [{ translateY: laserAnim }],
                backgroundColor: '#58CC02',
                borderRadius: 2,
                boxShadow: '0 0 12px #58CC02, 0 0 20px #58CC02',
              }} 
            />
          </View>

          {/* User Guidance Banner */}
          <View className="bg-black/60 px-5 py-2.5 rounded-full mt-7 backdrop-blur-md border border-white/10 flex-row items-center gap-2">
            <SparklesIcon size={15} color="#fbbf24" />
            <Text className="text-white font-inter text-[13px] font-semibold text-center">
              Chụp rõ vật thể để AI nhận diện từ vựng
            </Text>
          </View>
        </View>
      )}

      {/* STATE: EXHAUSTED MODAL */}
      {isExhausted && !isProcessing && (
        <View className="flex-1 items-center justify-center px-6 z-20">
          <View className="bg-white rounded-[32px] p-6 items-center w-full max-w-[340px] shadow-2xl border-b-[6px] border-neutral-200">
            <Snapy pose="suy_nghi" animation="idle" className="w-24 h-24 mb-3" />
            <Text className="font-extrabold text-[22px] text-mascot-navy font-nunito mb-1 text-center">
              Hết lượt Scan hôm nay
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter mb-6 text-center leading-relaxed">
              Bạn đã dùng hết 5/5 lượt hôm nay. Lượt scan sẽ được làm mới vào <Text className="font-bold text-mascot-navy">00:00 ngày mai</Text>.
            </Text>
            <Pressable 
              onPress={() => router.replace('/(tabs)/learn')} 
              className="w-full h-12 bg-primary-500 rounded-2xl border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] flex-row items-center justify-center transition-all mb-2"
            >
              <Text className="text-white font-extrabold text-[15px] uppercase font-nunito tracking-[0.04em]">
                ÔN TẬP TỪ ĐÃ LƯU
              </Text>
            </Pressable>
            <Pressable 
              onPress={handleClose} 
              className="w-full h-10 items-center justify-center"
            >
              <Text className="text-neutral-400 font-bold text-[14px] font-inter">Đóng</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* STATE: AI PROCESSING OVERLAY */}
      {isProcessing && (
        <View className="flex-1 items-center justify-center px-6 z-30">
          <Snapy pose="loading" animation="float" className="w-36 h-36 mb-5" />
          <View className="bg-black/75 px-7 py-5 rounded-[28px] backdrop-blur-md items-center shadow-2xl border border-white/15 max-w-[320px]">
            <Text className="font-extrabold text-[20px] text-white font-nunito mb-1 text-center">
              Mắt thần đang nhìn...
            </Text>
            <Text className="font-medium text-[14px] text-white/80 font-inter text-center mb-3">
              Florence-2 đang phân tích vật thể, đợi chút nhé!
            </Text>
            {/* Animated Loading Dots */}
            <View className="flex-row items-center gap-1.5 py-1">
              <View className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-pulse" />
              <View className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-pulse" style={{ animationDelay: '200ms' }} />
              <View className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-pulse" style={{ animationDelay: '400ms' }} />
            </View>
          </View>
        </View>
      )}

      {/* BOTTOM CONTROLS (Tự do, không bị Tab Bar đè lên) */}
      <View 
        style={{ 
          paddingBottom: Math.max(insets.bottom, 24),
          paddingTop: 16,
          minHeight: 104,
        }} 
        className="w-full px-8 flex-row justify-between items-center z-20 shrink-0"
      >
        {!isProcessing && !isExhausted ? (
          <>
            {/* GALLERY PICKER BUTTON */}
            <Pressable 
              onPress={handleGallery}
              className="w-14 h-14 bg-black/50 rounded-full items-center justify-center backdrop-blur-md active:scale-95 border border-white/20 shrink-0"
              style={{ width: 56, height: 56, borderRadius: 28 }}
            >
              <ImageIcon size={24} color="#FFFFFF" />
            </Pressable>

            {/* TACTILE 3D SHUTTER BUTTON */}
            <Pressable 
              onPress={handleCapture}
              className="w-20 h-20 bg-white/20 rounded-full items-center justify-center p-1.5 active:scale-90 transition-transform shrink-0"
              style={{ width: 80, height: 80, borderRadius: 40 }}
            >
              <View 
                className="w-full h-full bg-white rounded-full border-b-[5px] border-neutral-300 shadow-xl shadow-black/40 items-center justify-center"
                style={{ width: 68, height: 68, borderRadius: 34 }}
              >
                <View 
                  className="w-12 h-12 rounded-full border-2 border-primary-500/30 bg-primary-500/10"
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                />
              </View>
            </Pressable>
            
            {/* DEMO SAMPLE / QUICK TEST BUTTON */}
            <Pressable 
              onPress={() => triggerCaptureAnimation(SAMPLE_DEMO_IMAGE)}
              className="w-14 h-14 bg-black/50 rounded-full items-center justify-center backdrop-blur-md active:scale-95 border border-white/20 shrink-0"
              style={{ width: 56, height: 56, borderRadius: 28 }}
            >
              <SparklesIcon size={22} color="#fbbf24" />
            </Pressable>
          </>
        ) : isProcessing ? (
          <View className="flex-1 items-center">
            <Pressable 
              onPress={() => setIsProcessing(false)}
              className="bg-white/20 px-8 py-3 rounded-full backdrop-blur-md active:bg-white/30 border border-white/20"
            >
              <Text className="text-white font-extrabold text-[14px] font-nunito uppercase tracking-wider">
                HỦY QUÉT
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* QUOTA INFO MODAL */}
      <Modal
        visible={showQuotaInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuotaInfo(false)}
      >
        <Pressable 
          onPress={() => setShowQuotaInfo(false)}
          className="flex-1 bg-black/60 justify-center items-center px-6"
        >
          <View className="bg-white rounded-[32px] p-6 w-full max-w-[320px] items-center border-b-[6px] border-neutral-200">
            <View className="w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center mb-3">
              <ScanIcon size={24} color="#58CC02" />
            </View>
            <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1 text-center">
              Lượt Scan hàng ngày
            </Text>
            <Text className="font-medium text-[13px] text-neutral-500 font-inter text-center mb-4 leading-relaxed">
              Bạn đang có <Text className="font-bold text-primary-600">{MOCK_SCANS_LEFT}/{MAX_DAILY_SCANS} lượt</Text>. Mỗi ngày bạn được cấp 5 lượt scan AI miễn phí, làm mới vào <Text className="font-bold text-mascot-navy">00:00</Text>.
            </Text>
            <Pressable 
              onPress={() => setShowQuotaInfo(false)}
              className="w-full h-11 bg-primary-500 rounded-xl border-b-[3px] border-primary-700 active:bg-primary-600 flex-row items-center justify-center"
            >
              <Text className="text-white font-bold text-[14px] font-nunito uppercase">Đã hiểu</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

    </View>
  );
}
