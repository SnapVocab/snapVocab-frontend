import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeftIcon,
  CameraIcon,
  ImageIcon,
  XIcon,
  CrownIcon,
  AlertTriangleIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';

// ==========================================
// MOCK DATA
// ==========================================
const INITIAL_NAME = 'Alex Nguyen';
const MOCK_HAS_FRAME = true; // Avatar frame equipped

export default function EditProfileScreen() {
  const [displayName, setDisplayName] = useState(INITIAL_NAME);
  const [isFocused, setIsFocused] = useState(false);
  
  // Modals & Mock States
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock Toggles for Testing
  const [mockIsHeavyImage, setMockIsHeavyImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const hasUnsavedChanges = displayName !== INITIAL_NAME;
  const isFormValid = displayName.trim().length > 0;

  // Handlers
  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowDiscardAlert(true);
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    if (!isFormValid) return;

    if (mockIsHeavyImage) {
      setUploadError("Image must be 5 MB or smaller.");
      return;
    }

    setUploadError(null);
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 2000);
  };

  const selectImage = (source: 'camera' | 'gallery') => {
    // Mock image selection
    setShowAvatarPicker(false);
    
    // Nếu bạn muốn test lỗi, hãy set mockIsHeavyImage = true ở đâu đó, 
    // ví dụ cứ chọn Camera là giả lập file nặng:
    if (source === 'camera') {
      setMockIsHeavyImage(true);
    } else {
      setMockIsHeavyImage(false);
      setUploadError(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      
      {/* 1. HEADER */}
      <View className="px-4 py-3 border-b border-neutral-100 flex-row items-center justify-between z-10">
        <Pressable onPress={handleBack} className="w-10 h-10 items-center justify-center -ml-2">
          <ArrowLeftIcon size={24} className="text-mascot-navy" />
        </Pressable>
        <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito">Edit Profile</Text>
        <View className="w-10 h-10" />
      </View>

      <View className="flex-1 p-6">
        
        {/* 2. AVATAR SECTION */}
        <View className="items-center mb-10 mt-4">
          <View className="relative mb-4">
            {/* Avatar Frame */}
            {MOCK_HAS_FRAME && (
              <View className="absolute -inset-2 bg-gradient-to-tr from-warning-300 via-warning-400 to-warning-500 rounded-full items-center justify-center shadow-md shadow-warning-500/30">
                <View className="w-[120px] h-[120px] bg-white rounded-full" />
              </View>
            )}
            
            {/* Avatar Body */}
            <View className={cn(
              "w-28 h-28 bg-primary-100 rounded-full items-center justify-center overflow-hidden border-2",
              MOCK_HAS_FRAME ? "border-white" : "border-primary-200"
            )}>
              <Text className="font-extrabold text-[40px] text-primary-600 font-nunito">
                {displayName.substring(0,2).toUpperCase() || 'AL'}
              </Text>
            </View>
            
            {/* Crown Icon */}
            {MOCK_HAS_FRAME && (
              <View className="absolute -bottom-2 -right-2 bg-warning-100 rounded-full shadow-sm p-1.5 border border-warning-200">
                <CrownIcon size={18} className="text-warning-600" />
              </View>
            )}

            {/* Change Avatar Button Overlay */}
            <Pressable 
              onPress={() => setShowAvatarPicker(true)}
              className="absolute -bottom-2 left-0 bg-mascot-navy rounded-full shadow-sm p-2 border-2 border-white"
            >
              <CameraIcon size={16} className="text-white" />
            </Pressable>
          </View>
          
          <Pressable onPress={() => setShowAvatarPicker(true)}>
            <Text className="font-bold text-[14px] text-primary-600 font-inter mt-3">Change Avatar</Text>
          </Pressable>

          {/* Validation Error for Avatar */}
          {uploadError && (
            <View className="mt-3 bg-error-50 px-3 py-1.5 rounded-lg border border-error-100 flex-row items-center gap-1.5">
              <AlertTriangleIcon size={14} className="text-error-500" />
              <Text className="font-bold text-[12px] text-error-600 font-inter">{uploadError}</Text>
            </View>
          )}
        </View>

        {/* 3. DISPLAY NAME INPUT */}
        <View className="mb-auto">
          <Text className="font-bold text-[14px] text-neutral-600 font-inter mb-2 ml-1">Display Name</Text>
          <View className={cn(
            "w-full h-14 bg-neutral-50 rounded-2xl border-2 px-4 justify-center transition-all",
            isFocused ? "border-primary-400 bg-white shadow-sm shadow-primary-500/10" : "border-neutral-200"
          )}>
            <TextInput 
              value={displayName}
              onChangeText={setDisplayName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="font-bold text-[16px] text-mascot-navy font-inter w-full h-full"
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {!isFormValid && (
            <Text className="font-medium text-[12px] text-error-500 font-inter mt-2 ml-1">
              Please enter a valid display name.
            </Text>
          )}
        </View>

        {/* 4. ACTIONS */}
        <View className="gap-3 pt-6">
          <Pressable 
            onPress={handleSave}
            disabled={!isFormValid || isSaving}
            className={cn(
              "w-full h-14 rounded-2xl items-center justify-center transition-all",
              isFormValid && !isSaving 
                ? "bg-primary-500 border-b-[4px] border-primary-700 active:bg-primary-600 active:translate-y-[2px] active:border-b-[2px]" 
                : "bg-neutral-200"
            )}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-extrabold text-[16px] text-white uppercase font-nunito tracking-wide">
                Save Changes
              </Text>
            )}
          </Pressable>

          <Pressable 
            onPress={handleBack}
            disabled={isSaving}
            className="w-full h-14 rounded-2xl items-center justify-center active:bg-neutral-50"
          >
            <Text className="font-bold text-[15px] text-neutral-500 font-inter">Cancel</Text>
          </Pressable>
        </View>

      </View>

      {/* ========================================== */}
      {/* MODALS */}
      {/* ========================================== */}

      {/* AVATAR PICKER BOTTOM SHEET */}
      <Modal
        visible={showAvatarPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <View className="flex-1 bg-black/40 justify-end">
          <Pressable className="absolute inset-0" onPress={() => setShowAvatarPicker(false)} />
          
          <View className="bg-white rounded-t-[32px] p-6 pb-10 shadow-xl">
            <View className="w-12 h-1.5 bg-neutral-200 rounded-full mb-6 self-center" />
            
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-6 text-center">
              Choose Avatar
            </Text>
            
            <View className="gap-3">
              <Pressable 
                onPress={() => selectImage('camera')}
                className="w-full h-16 bg-neutral-50 rounded-2xl border border-neutral-200 flex-row items-center px-5 active:bg-neutral-100"
              >
                <CameraIcon size={24} className="text-primary-500 mr-4" />
                <View className="flex-1">
                  <Text className="font-bold text-[16px] text-mascot-navy font-inter">Camera</Text>
                  <Text className="font-medium text-[12px] text-neutral-400 font-inter">Take a new photo (Simulate Error)</Text>
                </View>
              </Pressable>

              <Pressable 
                onPress={() => selectImage('gallery')}
                className="w-full h-16 bg-neutral-50 rounded-2xl border border-neutral-200 flex-row items-center px-5 active:bg-neutral-100"
              >
                <ImageIcon size={24} className="text-success-500 mr-4" />
                <View className="flex-1">
                  <Text className="font-bold text-[16px] text-mascot-navy font-inter">Gallery</Text>
                  <Text className="font-medium text-[12px] text-neutral-400 font-inter">Choose from photos (Simulate Success)</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* DISCARD CHANGES ALERT */}
      <Modal
        visible={showDiscardAlert}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/40 items-center justify-center p-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-[340px] shadow-xl items-center">
            <View className="w-16 h-16 bg-error-50 rounded-full items-center justify-center mb-4">
              <AlertTriangleIcon size={32} className="text-error-500" />
            </View>
            
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-2 text-center">
              Discard changes?
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-8">
              You have unsaved changes. Are you sure you want to discard them?
            </Text>

            <View className="w-full gap-3">
              <Pressable 
                onPress={() => {
                  setShowDiscardAlert(false);
                  router.back();
                }}
                className="w-full h-12 bg-error-500 rounded-xl items-center justify-center active:bg-error-600"
              >
                <Text className="font-bold text-[15px] text-white font-inter">Discard</Text>
              </Pressable>
              
              <Pressable 
                onPress={() => setShowDiscardAlert(false)}
                className="w-full h-12 bg-neutral-100 rounded-xl items-center justify-center active:bg-neutral-200"
              >
                <Text className="font-bold text-[15px] text-neutral-600 font-inter">Keep Editing</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
