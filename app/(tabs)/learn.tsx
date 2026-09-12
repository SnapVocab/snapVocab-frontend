import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WifiOffIcon, AlertCircleIcon, SlidersHorizontalIcon } from 'lucide-react-native';
import {
  LearningHeader,
  RecommendedSessionCard,
  StudyModesGrid,
  ContinueDeckRow,
  RecentVocabularyRow,
  LearningHubSkeleton,
} from '@/components/learning';
import {
  determineHubState,
  MOCK_SUMMARY_HAS_DUE,
  MOCK_SUMMARY_NEW_USER,
  MOCK_SUMMARY_IN_PROGRESS,
  MOCK_SUMMARY_COMPLETED,
  LearningHubSummaryResponse,
} from '@/lib/learningState';

type TestStateOption = 'default' | 'newUser' | 'inProgress' | 'completed' | 'offline' | 'error';

export default function LearnHub() {
  const [testMode, setTestMode] = useState<TestStateOption>('default');
  const [showDevControls, setShowDevControls] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Chọn bộ dữ liệu theo test state
  const getActiveSummary = (): LearningHubSummaryResponse => {
    switch (testMode) {
      case 'newUser':
        return MOCK_SUMMARY_NEW_USER;
      case 'inProgress':
        return MOCK_SUMMARY_IN_PROGRESS;
      case 'completed':
        return MOCK_SUMMARY_COMPLETED;
      default:
        return MOCK_SUMMARY_HAS_DUE;
    }
  };

  const summary = getActiveSummary();
  const hubState = determineHubState(summary);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  if (loading) {
    return <LearningHubSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      {/* BANNER NGOẠI TUYẾN */}
      {testMode === 'offline' && (
        <View className="bg-neutral-800 flex-row items-center justify-center py-2 px-4 gap-2 z-20">
          <WifiOffIcon size={14} color="#FFFFFF" />
          <Text className="text-white text-[12.5px] font-bold font-inter">
            Đang ngoại tuyến — Sử dụng dữ liệu bộ nhớ đệm
          </Text>
        </View>
      )}

      {/* BANNER BÁO LỖI */}
      {testMode === 'error' && (
        <View className="bg-danger-50 flex-row items-center justify-between py-2 px-4 border-b border-danger-200 z-20">
          <View className="flex-row items-center gap-2 flex-1 pr-2">
            <AlertCircleIcon size={15} color="#DC2626" />
            <Text className="text-danger-700 text-[12px] font-bold font-inter" numberOfLines={1}>
              Không thể đồng bộ tiến độ học mới nhất.
            </Text>
          </View>
          <Pressable
            onPress={onRefresh}
            className="bg-danger-600 px-2.5 py-1 rounded-md active:bg-danger-700"
          >
            <Text className="text-white text-[11px] font-extrabold font-nunito uppercase">
              Thử lại
            </Text>
          </Pressable>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#58CC02" />
        }
      >
        {/* KHỐI 1: HEADER GỌN & TIẾN ĐỘ NGÀY */}
        <LearningHeader
          learned={summary.dailyGoal.learned}
          target={summary.dailyGoal.target}
          xpReward={summary.dailyGoal.xpReward}
          hubState={hubState}
        />

        {/* KHỐI 2: HERO RECOMMENDED SESSION (Đổi composition theo hubState) */}
        <RecommendedSessionCard
          summary={summary}
          hubState={hubState}
        />

        {/* KHỐI 3: "BẠN MUỐN HỌC THẾ NÀO?" (Lưới 2x2 với bộ icon 3D SnapVocab) */}
        <StudyModesGrid summary={summary} />

        {/* KHỐI 4: TIẾP TỤC BỘ THẺ (Ẩn khi trùng với Hero) */}
        <ContinueDeckRow
          activeSession={summary.activeSession}
          hubState={hubState}
        />

        {/* KHỐI 5: "TỪ VỰNG CỦA BẠN" (Thumbnails ảnh từ vừa lưu + nhãn nguồn) */}
        <RecentVocabularyRow words={summary.recentSavedWords} />

        {/* ========================================================
            DEV CONTROLS / STATE SWITCHER FOR TESTERS & REVIEWERS
            ======================================================== */}
        <View className="px-5 mt-4 pt-4 border-t border-neutral-200/60 items-center">
          <Pressable
            onPress={() => setShowDevControls(!showDevControls)}
            className="flex-row items-center gap-1.5 py-1 px-3 bg-neutral-100 rounded-full active:bg-neutral-200"
          >
            <SlidersHorizontalIcon size={12} color="#757793" />
            <Text className="text-[11px] font-bold text-neutral-500 font-inter">
              {showDevControls ? 'Ẩn bộ chuyển đổi trạng thái' : `Trạng thái mẫu: ${testMode}`}
            </Text>
          </Pressable>

          {showDevControls && (
            <View className="flex-row flex-wrap gap-1.5 justify-center mt-3">
              {(['default', 'newUser', 'inProgress', 'completed', 'offline', 'error'] as TestStateOption[]).map(
                (opt) => (
                  <Pressable
                    key={opt}
                    onPress={() => setTestMode(opt)}
                    className={`px-2.5 py-1 rounded-lg border ${
                      testMode === opt
                        ? 'bg-primary-500 border-primary-600'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-bold font-nunito ${
                        testMode === opt ? 'text-white' : 'text-neutral-600'
                      }`}
                    >
                      {opt === 'default' ? 'Có thẻ đến hạn (Hero SRS)' : opt}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
