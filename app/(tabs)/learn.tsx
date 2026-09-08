import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  WifiOffIcon,
  PlayIcon,
  BookMarkedIcon,
  LayersIcon,
  BrainCircuitIcon,
  LibraryIcon,
  RepeatIcon,
  ArrowRightIcon,
  SparklesIcon,
  TrendingUpIcon,
  ChevronRightIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy } from '@/components/Snapy';
import { XPOrb3D, MasteredBadge3D } from '@/components/snapvocab';
import { router } from 'expo-router';

// ==========================================
// THIẾT LẬP TRẠNG THÁI KIỂM THỬ (MOCK STATE)
// Các giá trị: 'default' | 'newUser' | 'offline' | 'error'
// ==========================================
type MockState = 'default' | 'newUser' | 'offline' | 'error';
const TEST_STATE: MockState = 'default';

// DỮ LIỆU MẪU CHUẨN HÓA CHO LEARNING HUB
const MOCK_DATA = {
  dailyGoal: {
    learned: 18,
    target: 25,
    xpReward: 30,
  },
  srs: {
    due: 12,
    retentionRate: 88, // 88% độ bền trí nhớ dài hạn
    critical: 4, // 4 từ khó cần củng cố gấp
    mastered: 80, // 80 từ vựng đã thuộc lòng
  },
  currentCourse: {
    deckId: 'business-english',
    deckName: 'Business English',
    level: 'B1 · Trung Cấp',
    lesson: 4,
    lessonTitle: 'Đàm phán & Thương thảo',
    progress: 18,
    total: 25,
    lastStudied: '20 phút trước',
  },
  modes: {
    flashcards: 18,
    quiz: 5,
    collections: 12,
    vocab: 248,
    mastered: 80,
  },
};

export default function LearnHub() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [localData, setLocalData] = useState(MOCK_DATA);
  const data = localData.modes ? localData : MOCK_DATA;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setLocalData({
        ...MOCK_DATA,
        srs: {
          ...MOCK_DATA.srs,
          due: Math.floor(Math.random() * 20),
        },
      });
      setRefreshing(false);
    }, 1200);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#FAFAFA]">
        <View className="px-5 py-8 flex-col gap-6">
          <View className="w-48 h-8 bg-neutral-200/60 rounded-lg animate-pulse" />
          <View className="w-full h-48 bg-neutral-200/60 rounded-2xl animate-pulse" />
          <View className="w-full h-40 bg-neutral-200/60 rounded-2xl animate-pulse" />
          <View className="w-full h-32 bg-neutral-200/60 rounded-2xl animate-pulse" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      {/* BANNER TRẠNG THÁI OFFLINE */}
      {TEST_STATE === 'offline' && (
        <View className="bg-neutral-800 flex-row items-center justify-center py-2.5 px-4 gap-2 z-20">
          <WifiOffIcon size={15} className="text-white" />
          <Text className="text-white text-[13px] font-bold font-inter">
            Đang ngoại tuyến — Sử dụng dữ liệu bộ nhớ đệm
          </Text>
        </View>
      )}

      {/* BANNER TRẠNG THÁI LỖI */}
      {TEST_STATE === 'error' && (
        <View className="bg-danger-50 flex-row items-center justify-center py-2.5 px-4 gap-2 z-20 border-b border-danger-200">
          <AlertCircleIcon size={15} className="text-danger-600" />
          <Text className="text-danger-600 text-[13px] font-bold font-inter">
            Lỗi kết nối. Không thể đồng bộ tiến độ học mới nhất.
          </Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#58CC02" />}
      >
        {/* ==========================================
            SECTION 01: MOTIVATIONAL HEADER & DAILY TARGET
            ========================================== */}
        <View className="px-5 pt-4 pb-2">
          {/* Header Row với Snapy Mascot */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1 min-w-0 pr-3">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Text className="text-[12px] font-extrabold text-neutral-400 uppercase tracking-widest font-nunito">
                  LEARNING HUB
                </Text>
                <View className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                <Text className="text-[11px] font-bold text-primary-600 uppercase tracking-wider font-nunito">
                  CHÍNH KHÓA
                </Text>
              </View>
              <Text className="text-[24px] font-extrabold text-mascot-navy font-nunito leading-tight">
                Trung tâm Rèn luyện
              </Text>
              <Text className="text-[13px] font-medium text-neutral-500 font-inter mt-0.5">
                Củng cố phản xạ & chuyển từ vựng vào trí nhớ dài hạn.
              </Text>
            </View>

            {/* Snapy Học Bài Neo Thị Giác */}
            <View className="items-center justify-center shrink-0 w-16 h-16">
              <Snapy 
                pose="doc_sach" 
                animation="idle" 
                style={{ width: 64, height: 64 }} 
              />
            </View>
          </View>

          {/* Lời khuyên học tập từ Snapy (Mascot Speech Bubble) */}
          <View className="bg-mascot-50 border border-mascot-100 rounded-xl px-3.5 py-2.5 mb-4 flex-row items-center gap-2.5">
            <SparklesIcon size={16} className="text-mascot-600 shrink-0" />
            <Text className="text-[13px] font-semibold text-mascot-800 font-inter flex-1 leading-snug">
              Snapy: "Ôn tập ngắt quãng (SRS) giúp bạn nhớ lâu gấp 5 lần so với đọc thụ động!"
            </Text>
          </View>

          {/* Thanh Tiến Độ Mục Tiêu Ngày */}
          {TEST_STATE !== 'newUser' && (
            <View className="bg-white rounded-xl p-3.5 border border-neutral-200/90 border-b-2 mb-2 flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-[12px] font-extrabold text-mascot-navy uppercase tracking-wider font-nunito">
                    MỤC TIÊU HÔM NAY
                  </Text>
                  <Text className="text-[13px] font-bold text-neutral-600 font-nunito tabular-nums">
                    {data.dailyGoal.learned}/{data.dailyGoal.target} từ
                  </Text>
                </View>
                <View className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-primary-500 rounded-full" 
                    style={{ width: `${Math.min(100, (data.dailyGoal.learned / data.dailyGoal.target) * 100)}%` }}
                  />
                </View>
              </View>

              {/* Phần thưởng XP Badge */}
              <View className="flex-row items-center gap-1.5 bg-reward-50 border border-reward-200 px-2.5 py-1.5 rounded-lg shrink-0">
                <XPOrb3D size="xs" />
                <Text className="font-extrabold text-[12px] text-reward-700 font-nunito">
                  +{data.dailyGoal.xpReward} XP
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ==========================================
            NEW USER ONBOARDING BANNER (Khi là người dùng mới)
            ========================================== */}
        {TEST_STATE === 'newUser' && (
          <View className="px-5 mb-6">
            <View className="bg-white rounded-2xl p-5 border border-neutral-200/90 border-b-2 items-center">
              <Snapy 
                pose="chao_mung" 
                animation="bounce" 
                className="mb-3" 
                style={{ width: 96, height: 96 }} 
              />
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito text-center mb-1">
                Bắt đầu hành trình từ vựng!
              </Text>
              <Text className="font-medium text-[13px] text-neutral-500 font-inter text-center mb-5 px-2">
                Học từ vựng qua thẻ ghi nhớ thông minh FSRS, tự động phân phối thời gian ôn tập khoa học.
              </Text>

              {/* Box gợi ý bài học đầu tiên */}
              <View className="w-full bg-primary-50 rounded-xl p-3.5 border border-primary-100 mb-5 flex-row items-center justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-[11px] font-extrabold text-primary-700 uppercase tracking-wider font-nunito mb-0.5">
                    GỢI Ý KHỞI ĐỘNG
                  </Text>
                  <Text className="text-[15px] font-bold text-mascot-navy font-nunito">
                    10 từ vựng Oxford cốt lõi
                  </Text>
                  <Text className="text-[12px] font-medium text-neutral-500 font-inter">
                    Ước tính: 3 phút · Thưởng +50 XP
                  </Text>
                </View>
                <MasteredBadge3D size="sm" state="in_progress" />
              </View>

              <Pressable
                onPress={() => router.push('/topics' as any)}
                className="w-full h-14 bg-primary-500 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1"
              >
                <Text className="text-white font-extrabold text-[15px] font-nunito uppercase tracking-wider">
                  BẮT ĐẦU BÀI HỌC ĐẦU TIÊN
                </Text>
                <ArrowRightIcon size={18} className="text-white" />
              </Pressable>
            </View>
          </View>
        )}

        {/* ==========================================
            SECTION 02: SMART MEMORY & SRS CENTER (FSRS Engine)
            Khác biệt hóa với Home: Quản trị sức khỏe trí nhớ & phân nhóm
            ========================================== */}
        <View className="px-5 mb-6">
          <View className={cn(
            "rounded-2xl p-5 border",
            TEST_STATE === 'newUser' || data.srs.due === 0
              ? "bg-white border-neutral-200/90 border-b-2"
              : "bg-mascot-navy border-mascot-navy/90 border-b-4 border-b-mascot-800 shadow-sm"
          )}>
            {/* Header của Khối SRS */}
            <View className="flex-row items-center justify-between mb-3.5">
              <View className="flex-row items-center gap-2">
                <RepeatIcon 
                  size={18} 
                  color={TEST_STATE === 'newUser' || data.srs.due === 0 ? "#16A34A" : "#FFC42E"} 
                />
                <Text className={cn(
                  "font-extrabold text-[12px] uppercase tracking-wider font-nunito",
                  TEST_STATE === 'newUser' || data.srs.due === 0 ? "text-neutral-500" : "text-reward-500"
                )}>
                  TRUNG TÂM TRÍ NHỚ FSRS
                </Text>
              </View>

              {/* Huy hiệu Độ bền trí nhớ */}
              {TEST_STATE !== 'newUser' && (
                <View className={cn(
                  "px-2.5 py-1 rounded-full border flex-row items-center gap-1",
                  data.srs.due === 0 
                    ? "bg-primary-50 border-primary-200" 
                    : "bg-white/10 border-white/20"
                )}>
                  <TrendingUpIcon 
                    size={12} 
                    className={data.srs.due === 0 ? "text-primary-600" : "text-reward-300"} 
                  />
                  <Text className={cn(
                    "text-[11px] font-extrabold font-nunito",
                    data.srs.due === 0 ? "text-primary-700" : "text-white"
                  )}>
                    Độ bền: {data.srs.retentionRate}%
                  </Text>
                </View>
              )}
            </View>

            {/* Trạng thái 1: Đã hoàn thành hoặc Người dùng mới */}
            {TEST_STATE === 'newUser' || data.srs.due === 0 ? (
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1 pr-3">
                    <Text className="font-extrabold text-[18px] text-mascot-navy font-nunito mb-1">
                      Trí nhớ đạt trạng thái tối ưu!
                    </Text>
                    <Text className="font-medium text-[13px] text-neutral-500 font-inter leading-relaxed">
                      Bạn không có từ vựng nào bị quá hạn. Thuật toán FSRS đang bảo toàn ký ức dài hạn của bạn.
                    </Text>
                  </View>
                  <Snapy 
                    pose="tu_hao" 
                    animation="idle" 
                    className="shrink-0" 
                    style={{ width: 56, height: 56 }} 
                  />
                </View>

                {/* Sub-card thống kê ngắn */}
                <View className="flex-row gap-2.5 mb-4">
                  <View className="flex-1 bg-neutral-50 rounded-xl p-2.5 border border-neutral-200 items-center">
                    <Text className="text-[16px] font-extrabold text-mascot-navy font-nunito tabular-nums">0</Text>
                    <Text className="text-[11px] font-medium text-neutral-500 font-inter">Cần ôn hôm nay</Text>
                  </View>
                  <View className="flex-1 bg-primary-50 rounded-xl p-2.5 border border-primary-100 items-center">
                    <Text className="text-[16px] font-extrabold text-primary-600 font-nunito tabular-nums">{data.srs.mastered}</Text>
                    <Text className="text-[11px] font-medium text-primary-700 font-inter">Đã ghi nhớ sâu</Text>
                  </View>
                </View>

                <Pressable 
                  onPress={() => router.push('/topics' as any)}
                  className="h-13 bg-neutral-100 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-neutral-300 active:border-b-0 active:translate-y-1"
                >
                  <Text className="text-mascot-navy font-extrabold text-[14px] font-nunito uppercase tracking-wider">
                    HỌC THÊM TỪ VỰNG MỚI
                  </Text>
                  <ArrowRightIcon size={16} className="text-mascot-navy" />
                </Pressable>
              </View>
            ) : (
              /* Trạng thái 2: Có từ vựng đến hạn cần ôn tập (Urgent) */
              <View>
                <View className="mb-3">
                  <Text className="font-extrabold text-[22px] text-white font-nunito mb-1 tabular-nums">
                    {data.srs.due} từ vựng đến hạn ôn
                  </Text>
                  <Text className="font-medium text-[13px] text-neutral-300 font-inter leading-relaxed">
                    Ôn lại ngay trước khi đường cong lãng quên làm giảm hiệu suất phản xạ của bạn.
                  </Text>
                </View>

                {/* Bảng phân loại mức độ khẩn cấp (Memory Health Breakdown) */}
                <View className="flex-row gap-2 mb-4">
                  <View className="flex-1 bg-white/10 rounded-xl p-2.5 border border-white/10 items-center">
                    <Text className="text-[17px] font-extrabold text-reward-500 font-nunito tabular-nums">
                      {data.srs.due}
                    </Text>
                    <Text className="text-[11px] font-semibold text-neutral-300 font-inter mt-0.5">
                      Đến hạn ôn
                    </Text>
                  </View>

                  <View className="flex-1 bg-white/10 rounded-xl p-2.5 border border-white/10 items-center">
                    <Text className="text-[17px] font-extrabold text-danger-400 font-nunito tabular-nums">
                      {data.srs.critical}
                    </Text>
                    <Text className="text-[11px] font-semibold text-neutral-300 font-inter mt-0.5">
                      Từ hay quên
                    </Text>
                  </View>

                  <View className="flex-1 bg-white/10 rounded-xl p-2.5 border border-white/10 items-center">
                    <Text className="text-[17px] font-extrabold text-primary-400 font-nunito tabular-nums">
                      {data.srs.mastered}
                    </Text>
                    <Text className="text-[11px] font-semibold text-neutral-300 font-inter mt-0.5">
                      Đã thuộc lòng
                    </Text>
                  </View>
                </View>

                {/* Tactile 3D CTA Button điều hướng chuẩn sang /study/srs-review */}
                <Pressable 
                  onPress={() => router.push('/study/srs-review' as any)}
                  className="h-14 bg-primary-500 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-primary-700 active:border-b-0 active:translate-y-1"
                >
                  <Text className="text-white font-extrabold text-[15px] font-nunito uppercase tracking-wider">
                    BẮT ĐẦU ÔN TẬP THEO SRS
                  </Text>
                  <ArrowRightIcon size={18} className="text-white" />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* ==========================================
            SECTION 03: ACTIVE COURSE PROGRESSION (Khóa học hiện tại)
            Đặc tả chi tiết khóa học, chọn bài và đổi giáo trình
            ========================================== */}
        {TEST_STATE !== 'newUser' && (
          <View className="px-5 mb-6">
            <View className="bg-white rounded-2xl p-5 border border-neutral-200/90 border-b-2">
              {/* Header Khóa học */}
              <View className="flex-row items-center justify-between mb-2.5">
                <View className="flex-row items-center gap-2">
                  <Text className="font-extrabold text-[12px] text-primary-600 uppercase tracking-wider font-nunito bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                    {data.currentCourse.level}
                  </Text>
                  <Text className="font-extrabold text-[12px] text-neutral-400 uppercase tracking-wider font-nunito">
                    BÀI ĐANG HỌC
                  </Text>
                </View>
                <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                  {data.currentCourse.lastStudied}
                </Text>
              </View>

              {/* Tên Khóa & Tên Bài */}
              <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito mb-1">
                {data.currentCourse.deckName}
              </Text>
              <Text className="font-medium text-[13px] text-neutral-500 font-inter mb-3">
                Bài {data.currentCourse.lesson}: {data.currentCourse.lessonTitle} · {data.currentCourse.progress}/{data.currentCourse.total} từ vựng
              </Text>
              
              {/* Thanh tiến độ có tỷ lệ % */}
              <View className="flex-row items-center gap-3 mb-5">
                <View className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-primary-500 rounded-full" 
                    style={{ width: `${(data.currentCourse.progress / data.currentCourse.total) * 100}%` }}
                  />
                </View>
                <Text className="text-[13px] font-extrabold text-neutral-600 font-nunito tabular-nums">
                  {Math.round((data.currentCourse.progress / data.currentCourse.total) * 100)}%
                </Text>
              </View>

              {/* Action Buttons: Tiếp tục bài học + Đổi bộ thẻ */}
              <View className="gap-2.5">
                <Pressable 
                  onPress={() => router.push('/study/flashcard' as any)}
                  className="h-13 bg-neutral-100 rounded-xl flex-row items-center justify-center gap-2 border-b-4 border-neutral-300 active:border-b-0 active:translate-y-1"
                >
                  <PlayIcon size={16} fill="#1E293B" className="text-mascot-navy" />
                  <Text className="text-mascot-navy font-extrabold text-[14px] font-nunito uppercase tracking-wider">
                    TIẾP TỤC BÀI {data.currentCourse.lesson}
                  </Text>
                </Pressable>

                <Pressable 
                  onPress={() => router.push('/topics' as any)}
                  className="py-1 items-center justify-center active:opacity-70"
                >
                  <Text className="text-[13px] font-bold text-neutral-500 font-inter">
                    Đổi bộ thẻ khác hoặc duyệt tất cả chủ đề →
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* ==========================================
            SECTION 04: CORE LEARNING MODES (Asymmetric Visual Hierarchy)
            Tổ chức không đối xứng, gắn liền phần thưởng XP & Gamification
            ========================================== */}
        <View className="px-5 mb-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-extrabold text-[13px] text-neutral-400 uppercase tracking-wider font-nunito">
              CÁC CHẾ ĐỘ RÈN LUYỆN
            </Text>
            <Text className="text-[12px] font-bold text-primary-600 font-inter">
              4 Phương thức
            </Text>
          </View>

          <View className="gap-3">
            {/* Chế độ 1: Flashcards FSRS (Hero Row - Full Width) */}
            <Pressable 
              onPress={() => router.push('/study/flashcard' as any)}
              className="bg-white rounded-2xl p-4 border border-neutral-200/90 border-b-2 flex-row items-center justify-between active:scale-[0.99]"
            >
              <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                <View className="w-12 h-12 bg-danger-50 rounded-2xl items-center justify-center border border-danger-100 shrink-0">
                  <LayersIcon size={24} className="text-danger-500" />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-0.5">
                    <Text className="font-extrabold text-[17px] text-mascot-navy font-nunito">
                      Flashcards FSRS
                    </Text>
                    {/* XP Tag & Số lượng thẻ */}
                    <View className="bg-danger-50 px-2 py-0.5 rounded-md border border-danger-100 flex-row items-center gap-1">
                      <Text className="font-extrabold text-[11px] text-danger-600 font-nunito">
                        {TEST_STATE === 'newUser' ? 'Mới' : `${data.modes.flashcards} thẻ`}
                      </Text>
                    </View>
                  </View>
                  <Text className="font-medium text-[13px] text-neutral-500 font-inter">
                    Lật thẻ phản xạ nghĩa, phát âm IPA và câu mẫu ngữ cảnh.
                  </Text>
                </View>
              </View>

              <View className="items-end justify-center pl-1 shrink-0">
                <View className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center">
                  <ArrowRightIcon size={16} className="text-neutral-500" />
                </View>
              </View>
            </Pressable>

            {/* Asymmetric Split Row: Quiz & Collections */}
            <View className="flex-row gap-3">
              {/* Chế độ 2: Quiz Kiểm Tra Nhanh */}
              <Pressable 
                onPress={() => router.push('/study/quiz-setup' as any)}
                className="flex-1 bg-white rounded-2xl p-4 border border-neutral-200/90 border-b-2 justify-between active:scale-[0.99]"
              >
                <View>
                  <View className="flex-row items-center justify-between mb-2.5">
                    <View className="w-10 h-10 bg-mascot-50 rounded-xl items-center justify-center border border-mascot-100">
                      <BrainCircuitIcon size={22} className="text-mascot-500" />
                    </View>
                    <View className="bg-mascot-50 px-2 py-0.5 rounded-md border border-mascot-100">
                      <Text className="font-extrabold text-[11px] text-mascot-600 font-nunito">
                        +25 XP
                      </Text>
                    </View>
                  </View>
                  <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5">
                    Bài kiểm tra
                  </Text>
                  <Text className="font-medium text-[12px] text-neutral-400 font-inter mb-3 leading-snug">
                    {TEST_STATE === 'newUser' ? 'Cần học trước' : `${data.modes.quiz} bài test phản xạ`}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between pt-2.5 border-t border-neutral-100">
                  <Text className="font-extrabold text-[12px] text-mascot-500 font-nunito uppercase tracking-wider">
                    BẮT ĐẦU
                  </Text>
                  <ArrowRightIcon size={14} className="text-mascot-500" />
                </View>
              </Pressable>

              {/* Chế độ 3: Bộ Sưu Tập Chủ Đề */}
              <Pressable 
                onPress={() => router.push('/topics' as any)}
                className="flex-1 bg-white rounded-2xl p-4 border border-neutral-200/90 border-b-2 justify-between active:scale-[0.99]"
              >
                <View>
                  <View className="flex-row items-center justify-between mb-2.5">
                    <View className="w-10 h-10 bg-primary-50 rounded-xl items-center justify-center border border-primary-100">
                      <LibraryIcon size={22} className="text-primary-500" />
                    </View>
                    <View className="bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                      <Text className="font-extrabold text-[11px] text-primary-700 font-nunito">
                        {data.modes.collections} chủ đề
                      </Text>
                    </View>
                  </View>
                  <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito mb-0.5">
                    Bộ sưu tập
                  </Text>
                  <Text className="font-medium text-[12px] text-neutral-400 font-inter mb-3 leading-snug">
                    IELTS, TOEIC, Giao tiếp thực tế
                  </Text>
                </View>

                <View className="flex-row items-center justify-between pt-2.5 border-t border-neutral-100">
                  <Text className="font-extrabold text-[12px] text-primary-600 font-nunito uppercase tracking-wider">
                    KHÁM PHÁ
                  </Text>
                  <ArrowRightIcon size={14} className="text-primary-600" />
                </View>
              </Pressable>
            </View>

            {/* Chế độ 4: Ngân Hàng Từ Vựng Cá Nhân (Word Bank Bar) */}
            <Pressable 
              onPress={() => router.push('/decks' as any)}
              className="bg-white rounded-2xl p-4 border border-neutral-200/90 border-b-2 flex-row items-center justify-between active:scale-[0.99]"
            >
              <View className="flex-row items-center gap-3.5">
                <View className="w-10 h-10 bg-info-50 rounded-xl items-center justify-center border border-info-100">
                  <BookMarkedIcon size={20} className="text-info-500" />
                </View>
                <View>
                  <View className="flex-row items-center gap-1.5">
                    <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
                      Sổ từ vựng của tôi
                    </Text>
                  </View>
                  <Text className="font-medium text-[12px] text-neutral-400 font-inter">
                    {TEST_STATE === 'newUser' ? 0 : data.modes.vocab} từ vựng đã lưu · {data.modes.mastered} đã thuộc lòng
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-1 bg-neutral-100 px-3 py-1.5 rounded-xl">
                <Text className="font-extrabold text-[12px] text-neutral-600 font-nunito uppercase tracking-wider">
                  {TEST_STATE === 'newUser' ? 'THÊM TỪ' : 'QUẢN LÝ'}
                </Text>
                <ChevronRightIcon size={14} className="text-neutral-500" />
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
