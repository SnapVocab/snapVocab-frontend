import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Modal, 
  ActivityIndicator, 
  ScrollView, 
  Image, 
  Platform, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  CameraIcon,
  ImageIcon,
  XIcon,
  CrownIcon,
  AlertTriangleIcon,
  CheckIcon,
  Trash2Icon,
  SparklesIcon,
  UserIcon,
  AtSignIcon,
  MailIcon,
  FileTextIcon
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { cn } from '@/lib/utils';
import { useProfileState, getProfileInitials } from '@/lib/profileState';
import { useEconomyState } from '@/lib/economyState';

export default function EditProfileScreen() {
  const [profile, profileStore] = useProfileState();
  const [economy] = useEconomyState();

  // Equipped frame from user's inventory
  const equippedFrame = economy.inventory.find(
    item => item.category === 'frame' && item.state === 'equipped'
  );

  // Form states
  const [displayName, setDisplayName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUri, setAvatarUri] = useState<string | null>(profile.avatarUri);

  // Focus & UI States
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedBio, setIsFocusedBio] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync initial state if profile changes externally
  useEffect(() => {
    setDisplayName(profile.name);
    setBio(profile.bio || '');
    setAvatarUri(profile.avatarUri);
  }, [profile.name, profile.bio, profile.avatarUri]);

  // Validation
  const trimmedName = displayName.trim();
  const isFormValid = trimmedName.length >= 2;
  const hasUnsavedChanges = 
    trimmedName !== profile.name ||
    bio.trim() !== (profile.bio || '') ||
    avatarUri !== profile.avatarUri;

  // Handlers
  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowDiscardAlert(true);
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    if (!isFormValid || isSaving) return;

    setUploadError(null);
    setIsSaving(true);

    // Save changes into profile store
    profileStore.updateProfile({
      name: trimmedName,
      bio: bio.trim(),
      avatarUri: avatarUri
    });

    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 400);
  };

  // Image Picker Logic
  const handlePickFromGallery = async () => {
    setShowAvatarPicker(false);
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền truy cập thư viện ảnh để chọn ảnh đại diện.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // 5MB validation
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          setUploadError('Dung lượng ảnh vượt quá 5 MB. Vui lòng chọn ảnh nhỏ hơn.');
          return;
        }

        setAvatarUri(asset.uri);
        setUploadError(null);
      }
    } catch (err) {
      console.warn('Error picking image from library:', err);
      setUploadError('Không thể mở thư viện ảnh. Vui lòng thử lại.');
    }
  };

  const handleTakePhoto = async () => {
    setShowAvatarPicker(false);
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền truy cập máy ảnh để chụp ảnh đại diện.');
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // 5MB validation
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          setUploadError('Dung lượng ảnh vượt quá 5 MB. Vui lòng chọn ảnh nhỏ hơn.');
          return;
        }

        setAvatarUri(asset.uri);
        setUploadError(null);
      }
    } catch (err) {
      console.warn('Error taking photo:', err);
      setUploadError('Không thể khởi động máy ảnh. Vui lòng thử lại.');
    }
  };

  const handleRemoveAvatar = () => {
    setShowAvatarPicker(false);
    setAvatarUri(null);
    setUploadError(null);
  };

  // Avatar initials fallback
  const initials = getProfileInitials(trimmedName);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      
      {/* ========================================== */}
      {/* 1. TOP APP BAR (Responsive Centered) */}
      {/* ========================================== */}
      <View className="bg-white border-b border-neutral-100 shadow-sm shadow-black/[0.02] z-10">
        <View className="max-w-xl w-full mx-auto px-4 py-3 flex-row items-center justify-between">
          <Pressable 
            onPress={handleBack} 
            className="w-10 h-10 rounded-full items-center justify-center -ml-1 active:bg-neutral-100 transition-all"
            accessibilityLabel="Quay lại"
          >
            <ArrowLeftIcon size={22} className="text-mascot-navy" />
          </Pressable>
          
          <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito tracking-tight">
            Chỉnh sửa hồ sơ
          </Text>
          
          {/* Symmetrical spacer */}
          <View className="w-10 h-10" />
        </View>
      </View>

      {/* ========================================== */}
      {/* 2. SCROLLABLE FORM CONTENT */}
      {/* ========================================== */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-xl p-4 sm:p-6 flex-1 justify-between">
          
          <View className="gap-5">
            {/* CARD: AVATAR SECTION */}
            <View className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm shadow-black/5 items-center">
              <View className="relative mb-3.5 items-center justify-center">
                {/* Equipped Frame or Regular Ring */}
                <View className={cn(
                  "w-28 h-28 rounded-full items-center justify-center p-1.5 border-2",
                  equippedFrame 
                    ? "border-warning-400 bg-warning-50/50 shadow-md shadow-warning-500/20" 
                    : "border-primary-400 bg-primary-50/50"
                )}>
                  {/* Inner Avatar Bubble */}
                  <View className="w-full h-full bg-primary-500 rounded-full items-center justify-center shadow-inner overflow-hidden">
                    {avatarUri ? (
                      <Image 
                        source={{ uri: avatarUri }} 
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="font-extrabold text-[36px] text-white font-nunito tracking-wide">
                        {initials}
                      </Text>
                    )}
                  </View>
                </View>
                
                {/* Crown / Frame Badge */}
                {equippedFrame && (
                  <View className="absolute -bottom-1 -right-1 bg-reward-500 rounded-full p-1.5 border-2 border-white shadow-sm">
                    <CrownIcon size={14} className="text-mascot-navy" fill="#1B1B3A" />
                  </View>
                )}

                {/* Equipped Frame Name Pill */}
                {equippedFrame && (
                  <View className="absolute -top-3 bg-mascot-navy px-3 py-0.5 rounded-full border border-white shadow-sm">
                    <Text className="font-bold text-[10px] text-white font-inter">
                      {equippedFrame.name}
                    </Text>
                  </View>
                )}

                {/* Change Avatar Button Overlay */}
                <Pressable 
                  onPress={() => setShowAvatarPicker(true)}
                  className="absolute -bottom-1 left-0 bg-mascot-navy rounded-full shadow-md p-2 border-2 border-white active:scale-95 transition-all"
                  accessibilityLabel="Đổi ảnh đại diện"
                >
                  <CameraIcon size={16} className="text-white" />
                </Pressable>
              </View>
              
              <View className="flex-row items-center gap-3 mt-1">
                <Pressable 
                  onPress={() => setShowAvatarPicker(true)}
                  className="px-3 py-1.5 rounded-full bg-primary-50 active:bg-primary-100 transition-all flex-row items-center gap-1.5"
                >
                  <SparklesIcon size={14} className="text-primary-600" />
                  <Text className="font-bold text-[13px] text-primary-600 font-inter">
                    Đổi ảnh đại diện
                  </Text>
                </Pressable>

                {avatarUri && (
                  <Pressable 
                    onPress={handleRemoveAvatar}
                    className="px-3 py-1.5 rounded-full bg-neutral-100 active:bg-neutral-200 transition-all flex-row items-center gap-1"
                  >
                    <Trash2Icon size={13} className="text-neutral-600" />
                    <Text className="font-semibold text-[12px] text-neutral-600 font-inter">
                      Gỡ ảnh
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Validation Error Banner for Avatar */}
              {uploadError && (
                <View className="mt-3.5 bg-danger-50 px-3.5 py-2 rounded-xl border border-danger-100 flex-row items-center gap-2 w-full">
                  <AlertTriangleIcon size={16} className="text-danger-500 flex-shrink-0" />
                  <Text className="font-medium text-[12px] text-danger-700 font-inter flex-1">
                    {uploadError}
                  </Text>
                </View>
              )}
            </View>

            {/* CARD: PROFILE FIELDS FORM */}
            <View className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm shadow-black/5 gap-4">
              
              {/* Field 1: Display Name */}
              <View>
                <View className="flex-row items-center justify-between mb-1.5 ml-1">
                  <Text className="font-bold text-[13px] text-neutral-700 font-inter flex-row items-center">
                    Tên hiển thị <Text className="text-danger-500">*</Text>
                  </Text>
                  <Text className="font-medium text-[11px] text-neutral-400 font-inter">
                    {displayName.length}/30
                  </Text>
                </View>

                <View className={cn(
                  "w-full h-13 bg-neutral-50 rounded-2xl border-2 px-3.5 flex-row items-center transition-all",
                  isFocusedName 
                    ? "border-primary-500 bg-white shadow-sm shadow-primary-500/10" 
                    : "border-neutral-200"
                )}>
                  <UserIcon size={18} className={cn("mr-2.5", isFocusedName ? "text-primary-500" : "text-neutral-400")} />
                  <TextInput 
                    value={displayName}
                    onChangeText={(text) => {
                      if (text.length <= 30) setDisplayName(text);
                    }}
                    onFocus={() => setIsFocusedName(true)}
                    onBlur={() => setIsFocusedName(false)}
                    className="font-bold text-[15px] text-mascot-navy font-inter flex-1 h-full py-2"
                    placeholder="Nhập tên hiển thị của bạn"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                  />
                  {trimmedName.length >= 2 && (
                    <View className="w-5 h-5 rounded-full bg-success-50 items-center justify-center">
                      <CheckIcon size={12} className="text-success-600" />
                    </View>
                  )}
                </View>

                {!isFormValid && (
                  <Text className="font-medium text-[12px] text-danger-500 font-inter mt-1.5 ml-1">
                    Tên hiển thị cần tối thiểu 2 ký tự.
                  </Text>
                )}
              </View>

              {/* Field 2: Bio / Study Goal */}
              <View>
                <View className="flex-row items-center justify-between mb-1.5 ml-1">
                  <Text className="font-bold text-[13px] text-neutral-700 font-inter">
                    Tiểu sử / Mục tiêu học tập
                  </Text>
                  <Text className="font-medium text-[11px] text-neutral-400 font-inter">
                    {bio.length}/100
                  </Text>
                </View>

                <View className={cn(
                  "w-full bg-neutral-50 rounded-2xl border-2 p-3 transition-all",
                  isFocusedBio 
                    ? "border-primary-500 bg-white shadow-sm shadow-primary-500/10" 
                    : "border-neutral-200"
                )}>
                  <TextInput 
                    value={bio}
                    onChangeText={(text) => {
                      if (text.length <= 100) setBio(text);
                    }}
                    onFocus={() => setIsFocusedBio(true)}
                    onBlur={() => setIsFocusedBio(false)}
                    className="font-medium text-[14px] text-mascot-navy font-inter min-h-[64px] text-top leading-5"
                    placeholder="Chia sẻ mục tiêu học từ vựng mỗi ngày..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              {/* Divider */}
              <View className="h-px bg-neutral-100 my-1" />

              {/* Field 3: Account Info (Read-only) */}
              <View className="gap-3">
                <Text className="font-bold text-[12px] text-neutral-400 uppercase tracking-wider font-nunito ml-1">
                  Thông tin tài khoản liên kết
                </Text>

                {/* Username */}
                <View className="bg-neutral-50/80 rounded-2xl border border-neutral-200/80 px-3.5 py-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2.5">
                    <AtSignIcon size={16} className="text-neutral-400" />
                    <View>
                      <Text className="font-medium text-[11px] text-neutral-400 font-inter">Tên người dùng</Text>
                      <Text className="font-bold text-[13px] text-mascot-navy font-inter">{profile.username}</Text>
                    </View>
                  </View>
                  <View className="bg-neutral-200/70 px-2 py-0.5 rounded-md">
                    <Text className="font-semibold text-[10px] text-neutral-500 font-inter">Cố định</Text>
                  </View>
                </View>

                {/* Email */}
                <View className="bg-neutral-50/80 rounded-2xl border border-neutral-200/80 px-3.5 py-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2.5">
                    <MailIcon size={16} className="text-neutral-400" />
                    <View>
                      <Text className="font-medium text-[11px] text-neutral-400 font-inter">Email tài khoản</Text>
                      <Text className="font-bold text-[13px] text-mascot-navy font-inter">{profile.email}</Text>
                    </View>
                  </View>
                  <View className="bg-success-50 px-2 py-0.5 rounded-md border border-success-200/60 flex-row items-center gap-1">
                    <CheckIcon size={10} className="text-success-600" />
                    <Text className="font-bold text-[10px] text-success-700 font-inter">Đã xác thực</Text>
                  </View>
                </View>
              </View>

            </View>
          </View>

          {/* ========================================== */}
          {/* 3. BOTTOM ACTIONS (3D CTA) */}
          {/* ========================================== */}
          <View className="gap-3 pt-8 pb-4">
            <Pressable 
              onPress={handleSave}
              disabled={!isFormValid || !hasUnsavedChanges || isSaving}
              className={cn(
                "w-full h-14 rounded-2xl items-center justify-center transition-all",
                isFormValid && hasUnsavedChanges && !isSaving 
                  ? "bg-primary-500 border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px] shadow-sm shadow-primary-500/30" 
                  : "bg-neutral-200 border-b-[4px] border-neutral-300 opacity-80"
              )}
            >
              {isSaving ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text className="font-extrabold text-[15px] text-white font-nunito uppercase tracking-wider">
                    Đang lưu...
                  </Text>
                </View>
              ) : (
                <Text className={cn(
                  "font-extrabold text-[15px] uppercase font-nunito tracking-wide",
                  isFormValid && hasUnsavedChanges ? "text-white" : "text-neutral-500"
                )}>
                  Lưu thay đổi
                </Text>
              )}
            </Pressable>

            <Pressable 
              onPress={handleBack}
              disabled={isSaving}
              className="w-full h-12 rounded-2xl items-center justify-center active:bg-neutral-100 transition-all"
            >
              <Text className="font-bold text-[14px] text-neutral-500 font-inter">
                Hủy bỏ
              </Text>
            </Pressable>
          </View>

        </View>
      </ScrollView>

      {/* ========================================== */}
      {/* 4. AVATAR PICKER BOTTOM SHEET */}
      {/* ========================================== */}
      <Modal
        visible={showAvatarPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Pressable className="absolute inset-0" onPress={() => setShowAvatarPicker(false)} />
          
          <View className="bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl max-w-xl w-full mx-auto">
            <View className="w-12 h-1.5 bg-neutral-200 rounded-full mb-6 self-center" />
            
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-1.5 text-center">
              Chọn ảnh đại diện
            </Text>
            <Text className="font-medium text-[13px] text-neutral-400 font-inter mb-6 text-center">
              Dung lượng tối đa 5 MB · Hỗ trợ JPG, PNG
            </Text>
            
            <View className="gap-3">
              <Pressable 
                onPress={handleTakePhoto}
                className="w-full h-16 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex-row items-center px-5 active:bg-primary-50 active:border-primary-300 transition-all"
              >
                <View className="w-10 h-10 rounded-xl bg-primary-100 items-center justify-center mr-4">
                  <CameraIcon size={20} className="text-primary-600" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-[15px] text-mascot-navy font-inter">Chụp ảnh mới</Text>
                  <Text className="font-medium text-[12px] text-neutral-400 font-inter">Mở máy ảnh thiết bị</Text>
                </View>
              </Pressable>

              <Pressable 
                onPress={handlePickFromGallery}
                className="w-full h-16 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex-row items-center px-5 active:bg-primary-50 active:border-primary-300 transition-all"
              >
                <View className="w-10 h-10 rounded-xl bg-info-100 items-center justify-center mr-4">
                  <ImageIcon size={20} className="text-info-600" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-[15px] text-mascot-navy font-inter">Chọn từ thư viện ảnh</Text>
                  <Text className="font-medium text-[12px] text-neutral-400 font-inter">Tải ảnh có sẵn trên thiết bị</Text>
                </View>
              </Pressable>

              {avatarUri && (
                <Pressable 
                  onPress={handleRemoveAvatar}
                  className="w-full h-14 bg-danger-50 rounded-2xl border border-danger-200/60 flex-row items-center px-5 active:bg-danger-100 transition-all"
                >
                  <Trash2Icon size={18} className="text-danger-500 mr-4" />
                  <Text className="font-bold text-[14px] text-danger-600 font-inter">
                    Gỡ ảnh đại diện hiện tại
                  </Text>
                </Pressable>
              )}

              <Pressable 
                onPress={() => setShowAvatarPicker(false)}
                className="w-full h-12 rounded-xl items-center justify-center mt-2 active:bg-neutral-100 transition-all"
              >
                <Text className="font-bold text-[14px] text-neutral-500 font-inter">Đóng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* 5. DISCARD CHANGES ALERT MODAL */}
      {/* ========================================== */}
      <Modal
        visible={showDiscardAlert}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDiscardAlert(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-[340px] shadow-2xl items-center">
            <View className="w-16 h-16 bg-danger-50 rounded-full items-center justify-center mb-4">
              <AlertTriangleIcon size={32} className="text-danger-500" />
            </View>
            
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">
              Rời khỏi mà không lưu?
            </Text>
            <Text className="font-medium text-[13px] text-neutral-500 font-inter text-center mb-6 leading-5">
              Bạn có một số thay đổi chưa được lưu. Nếu rời đi bây giờ, các thay đổi này sẽ bị hủy.
            </Text>

            <View className="w-full gap-2.5">
              <Pressable 
                onPress={() => {
                  setShowDiscardAlert(false);
                  router.back();
                }}
                className="w-full h-12 bg-danger-500 rounded-xl items-center justify-center active:bg-danger-600 shadow-sm transition-all"
              >
                <Text className="font-bold text-[14px] text-white font-inter">
                  Hủy các thay đổi
                </Text>
              </Pressable>
              
              <Pressable 
                onPress={() => setShowDiscardAlert(false)}
                className="w-full h-12 bg-neutral-100 rounded-xl items-center justify-center active:bg-neutral-200 transition-all"
              >
                <Text className="font-bold text-[14px] text-neutral-700 font-inter">
                  Tiếp tục chỉnh sửa
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
