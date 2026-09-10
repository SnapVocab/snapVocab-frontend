import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated as RNAnimated, 
  Easing, 
  ScrollView, 
  Modal, 
  Pressable 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  XIcon, 
  Volume2Icon, 
  CheckCircle2Icon, 
  XCircleIcon, 
  SparklesIcon, 
  FlameIcon,
  RotateCcwIcon,
  LogOutIcon,
  ZapIcon
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Snapy, SnapyPose } from '@/components/Snapy';

// ==========================================
// TYPES & DATA POOL
// ==========================================
export interface MatchingPair {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
}

export interface MatchingResult {
  score: number;
  total: number;
  xp: number;
  coin: number;
  time: string;
  wrongAnswers: Array<{
    id: string;
    word: string;
    ipa?: string;
    correct: string;
    yours: string;
  }>;
}

const MATCHING_POOL: MatchingPair[] = [
  { id: 'm1', word: 'abandon', ipa: '/əˈbændən/', meaning: 'Từ bỏ, ruồng bỏ' },
  { id: 'm2', word: 'achieve', ipa: '/əˈtʃiːv/', meaning: 'Đạt được, hoàn thành' },
  { id: 'm3', word: 'boarding pass', ipa: '/ˈbɔːrdɪŋ pæs/', meaning: 'Thẻ lên máy bay' },
  { id: 'm4', word: 'departure', ipa: '/dɪˈpɑːrtʃər/', meaning: 'Sự khởi hành, xuất phát' },
  { id: 'm5', word: 'destination', ipa: '/ˌdestɪˈneɪʃn/', meaning: 'Điểm đến, đích đến' },
  { id: 'm6', word: 'improve', ipa: '/ɪmˈpruːv/', meaning: 'Cải thiện, tiến bộ' },
  { id: 'm7', word: 'luggage', ipa: '/ˈlʌɡɪdʒ/', meaning: 'Hành lý, vali' },
  { id: 'm8', word: 'efficient', ipa: '/ɪˈfɪʃnt/', meaning: 'Hiệu quả, năng suất' },
  { id: 'm9', word: 'flight attendant', ipa: '/ˈflaɪt əˌtendənt/', meaning: 'Tiếp viên hàng không' },
  { id: 'm10', word: 'delay', ipa: '/dɪˈleɪ/', meaning: 'Sự trì hoãn, chậm trễ' },
  { id: 'm11', word: 'itinerary', ipa: '/aɪˈtɪnəreri/', meaning: 'Lịch trình chuyến đi' },
  { id: 'm12', word: 'reservation', ipa: '/ˌrezərˈveɪʃn/', meaning: 'Sự đặt chỗ trước' },
  { id: 'm13', word: 'customs', ipa: '/ˈkʌstəmz/', meaning: 'Hải quan, kiểm thuế' },
  { id: 'm14', word: 'terminal', ipa: '/ˈtɜːrmɪnl/', meaning: 'Nhà ga sân bay' },
  { id: 'm15', word: 'passport', ipa: '/ˈpæspɔːrt/', meaning: 'Hộ chiếu xuất nhập cảnh' },
  { id: 'm16', word: 'passenger', ipa: '/ˈpæsɪndʒər/', meaning: 'Hành khách đi xe/bay' },
];

// Web Audio Synthesizer for high-fidelity audio feedback
const playSuccessChime = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Two-tone cheerful ding
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);
  } catch {
    // Ignore audio context restrictions
  }
};

const playErrorBuzz = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.2);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  } catch {
    // Ignore
  }
};

// Pronounce English word via Web Speech API
const pronounceWord = (word: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }
};

interface MatchingQuizViewProps {
  count?: number;
  reviewWrong?: boolean;
  wrongData?: string;
  onExit: () => void;
  onComplete: (result: MatchingResult) => void;
}

interface TileItem {
  id: string; // matches pair.id
  pairId: string;
  text: string;
  ipa?: string;
  type: 'word' | 'meaning';
}

export function MatchingQuizView({
  count = 5,
  reviewWrong = false,
  wrongData,
  onExit,
  onComplete,
}: MatchingQuizViewProps) {
  // 1. Prepare target pool of pairs
  const allPairs = useMemo<MatchingPair[]>(() => {
    if (reviewWrong && wrongData) {
      try {
        const parsed = JSON.parse(wrongData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            id: `rw_${idx}`,
            word: item.word,
            ipa: item.ipa || '/.../',
            meaning: item.correct || item.meaning,
          }));
        }
      } catch {
        // fallback
      }
    }
    const safeCount = Math.max(3, Math.min(count, MATCHING_POOL.length));
    return MATCHING_POOL.slice(0, safeCount);
  }, [count, reviewWrong, wrongData]);

  // Round pagination: display up to 5 pairs per round for optimal mobile screen ergonomics
  const PAIRS_PER_ROUND = 5;
  const totalRounds = Math.ceil(allPairs.length / PAIRS_PER_ROUND);
  const [currentRound, setCurrentRound] = useState(0);

  const roundPairs = useMemo<MatchingPair[]>(() => {
    const start = currentRound * PAIRS_PER_ROUND;
    return allPairs.slice(start, start + PAIRS_PER_ROUND);
  }, [allPairs, currentRound]);

  // Shuffled columns for current round
  const [wordTiles, setWordTiles] = useState<TileItem[]>([]);
  const [meaningTiles, setMeaningTiles] = useState<TileItem[]>([]);

  // Selection state
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [failedPairPairIds, setFailedPairPairIds] = useState<Set<string>>(new Set());

  // Game tracking
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalMatched, setTotalMatched] = useState(0);
  const [firstTrySuccesses, setFirstTrySuccesses] = useState(0);
  const [hasAttemptedPair, setHasAttemptedPair] = useState<{ [pairId: string]: boolean }>({});
  const [wrongAnswers, setWrongAnswers] = useState<Array<{
    id: string;
    word: string;
    ipa?: string;
    correct: string;
    yours: string;
  }>>([]);
  
  // Mascot & Modal state
  const [mascotPose, setMascotPose] = useState<SnapyPose>('tap_trung');
  const [mascotAnim, setMascotAnim] = useState<string>('idle');
  const [bubbleText, setBubbleText] = useState<string>('Chạm vào từ tiếng Anh & nghĩa tiếng Việt!');
  const [showExitModal, setShowExitModal] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Animation values
  const shakeAnim = useRef(new RNAnimated.Value(0)).current;
  const comboScale = useRef(new RNAnimated.Value(1)).current;
  const contentFade = useRef(new RNAnimated.Value(0)).current;

  // Initialize round tiles
  useEffect(() => {
    const words: TileItem[] = roundPairs.map(p => ({
      id: `w_${p.id}`,
      pairId: p.id,
      text: p.word,
      ipa: p.ipa,
      type: 'word' as const,
    })).sort(() => Math.random() - 0.5);

    const meanings: TileItem[] = roundPairs.map(p => ({
      id: `m_${p.id}`,
      pairId: p.id,
      text: p.meaning,
      type: 'meaning' as const,
    })).sort(() => Math.random() - 0.5);

    setWordTiles(words);
    setMeaningTiles(meanings);
    setSelectedWordId(null);
    setSelectedMeaningId(null);

    // Entrance fade
    contentFade.setValue(0);
    RNAnimated.timing(contentFade, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [roundPairs]);

  // Handle tile tap: Left (Word)
  const handleWordTap = (tile: TileItem) => {
    if (matchedPairIds.has(tile.pairId) || failedPairPairIds.size > 0) return;

    pronounceWord(tile.text);

    if (selectedWordId === tile.pairId) {
      // Deselect
      setSelectedWordId(null);
      return;
    }

    setSelectedWordId(tile.pairId);

    // If meaning was already selected, check match
    if (selectedMeaningId) {
      checkMatch(tile.pairId, selectedMeaningId);
    }
  };

  // Handle tile tap: Right (Meaning)
  const handleMeaningTap = (tile: TileItem) => {
    if (matchedPairIds.has(tile.pairId) || failedPairPairIds.size > 0) return;

    if (selectedMeaningId === tile.pairId) {
      // Deselect
      setSelectedMeaningId(null);
      return;
    }

    setSelectedMeaningId(tile.pairId);

    // If word was already selected, check match
    if (selectedWordId) {
      checkMatch(selectedWordId, tile.pairId);
    }
  };

  // Evaluate match
  const checkMatch = (wordPairId: string, meaningPairId: string) => {
    const isCorrect = wordPairId === meaningPairId;

    if (isCorrect) {
      // SUCCESS MATCH
      playSuccessChime();
      const updatedMatched = new Set(matchedPairIds);
      updatedMatched.add(wordPairId);
      setMatchedPairIds(updatedMatched);

      const nextMatchedCount = totalMatched + 1;
      setTotalMatched(nextMatchedCount);

      // Check first-try accuracy
      if (!hasAttemptedPair[wordPairId]) {
        setFirstTrySuccesses(s => s + 1);
      }

      // Combo handling
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);

      // Animate combo pill
      RNAnimated.sequence([
        RNAnimated.timing(comboScale, { toValue: 1.3, duration: 120, useNativeDriver: true }),
        RNAnimated.spring(comboScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
      ]).start();

      // Mascot reaction
      if (nextCombo >= 3) {
        setMascotPose('an_mung');
        setMascotAnim('celebrate');
        setBubbleText(`🔥 Tuyệt đỉnh! Combo x${nextCombo}!`);
      } else {
        setMascotPose('nhay_len');
        setMascotAnim('bounce');
        setBubbleText('Chính xác! Nối rất chuẩn! ✨');
      }

      // Clear selection
      setSelectedWordId(null);
      setSelectedMeaningId(null);

      // Check round or game finish
      const allRoundMatched = roundPairs.every(p => updatedMatched.has(p.id));
      if (allRoundMatched) {
        handleRoundOrGameEnd(nextMatchedCount);
      }
    } else {
      // INCORRECT MATCH
      playErrorBuzz();
      const failed = new Set<string>();
      failed.add(wordPairId);
      failed.add(meaningPairId);
      setFailedPairPairIds(failed);

      // Mark that this pair was attempted and failed
      setHasAttemptedPair(prev => ({
        ...prev,
        [wordPairId]: true,
        [meaningPairId]: true,
      }));

      // Record wrong answer
      const targetPair = allPairs.find(p => p.id === wordPairId);
      const chosenPair = allPairs.find(p => p.id === meaningPairId);
      if (targetPair && chosenPair) {
        setWrongAnswers(prev => [
          ...prev,
          {
            id: targetPair.id,
            word: targetPair.word,
            ipa: targetPair.ipa,
            correct: targetPair.meaning,
            yours: chosenPair.meaning,
          }
        ]);
      }

      // Combo reset
      setCombo(0);

      // Shake animation
      shakeAnim.setValue(0);
      RNAnimated.sequence([
        RNAnimated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();

      // Mascot reaction
      setMascotPose('bat_ngo');
      setMascotAnim('shake');
      setBubbleText('Chưa đúng rồi! Thử lại nhé! 🤔');

      // Clear after brief display
      setTimeout(() => {
        setFailedPairPairIds(new Set());
        setSelectedWordId(null);
        setSelectedMeaningId(null);
        setMascotPose('tap_trung');
        setMascotAnim('idle');
      }, 550);
    }
  };

  const handleRoundOrGameEnd = (finalMatchedCount: number) => {
    if (currentRound + 1 < totalRounds) {
      // Advance to next round after short delay
      setBubbleText('Xuất sắc! Chuẩn bị vòng tiếp theo...');
      setTimeout(() => {
        setCurrentRound(r => r + 1);
        setMascotPose('tu_hao');
        setBubbleText('Tiếp tục ghép các cặp từ mới nào! 🚀');
      }, 600);
    } else {
      // ALL ROUNDS COMPLETED!
      setMascotPose('tu_hao');
      setMascotAnim('celebrate');
      setBubbleText('HOÀN THÀNH TẤT CẢ! Đỉnh chóp! 🏆');

      setTimeout(() => {
        const elapsedSecs = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        const mins = Math.floor(elapsedSecs / 60);
        const secs = elapsedSecs % 60;
        const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        const finalScore = firstTrySuccesses + (wrongAnswers.length === 0 ? 0 : 0);
        const totalCount = allPairs.length;
        const xpEarned = totalCount * 10 + maxCombo * 2;
        const coinEarned = totalCount * 5;

        onComplete({
          score: Math.max(finalScore, totalCount - wrongAnswers.length),
          total: totalCount,
          xp: xpEarned,
          coin: coinEarned,
          time: timeFormatted,
          wrongAnswers,
        });
      }, 700);
    }
  };

  const progressPercent = Math.min(100, (totalMatched / allPairs.length) * 100);

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]" edges={['top', 'bottom']}>
      {/* 1. TOP HEADER & PROGRESS */}
      <View className="px-4 py-3 flex-row items-center justify-between z-10 bg-[#F7F8FA] border-b border-neutral-100">
        <TouchableOpacity 
          onPress={() => setShowExitModal(true)} 
          activeOpacity={0.7}
          className="w-10 h-10 items-center justify-center rounded-full -ml-2"
        >
          <XIcon size={24} className="text-neutral-500" />
        </TouchableOpacity>

        {/* Progress bar */}
        <View className="flex-1 mx-4">
          <View className="h-3.5 bg-neutral-200 rounded-full overflow-hidden w-full">
            <View 
              className="h-full bg-primary-500 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>

        {/* Counter */}
        <View className="flex-row items-center gap-1.5">
          {combo >= 2 && (
            <RNAnimated.View 
              style={{ transform: [{ scale: comboScale }] }}
              className="flex-row items-center gap-1 bg-warning-100 px-2 py-0.5 rounded-full border border-warning-300"
            >
              <FlameIcon size={14} className="text-warning-600 fill-warning-500" />
              <Text className="font-extrabold text-[12px] text-warning-700 font-nunito">x{combo}</Text>
            </RNAnimated.View>
          )}
          <Text className="font-extrabold text-[15px] text-neutral-600 font-nunito tabular-nums">
            {totalMatched}/{allPairs.length}
          </Text>
        </View>
      </View>

      {/* 2. ROUND INDICATOR & MASCOT PROMPT */}
      <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-xl bg-primary-100 items-center justify-center border border-primary-200">
            <ZapIcon size={16} className="text-primary-600 fill-primary-500" />
          </View>
          <View>
            <Text className="font-extrabold text-[16px] text-mascot-navy font-nunito">
              Ghép đôi từ vựng
            </Text>
            <Text className="font-bold text-[12px] text-neutral-400 font-inter">
              Vòng {currentRound + 1} / {totalRounds} • Chạm 2 thẻ tương ứng
            </Text>
          </View>
        </View>

        {/* Snapy Avatar Avatar & Bubble */}
        <View className="flex-row items-center gap-2">
          <View style={{ width: 48, height: 48 }} className="items-center justify-center">
            <Snapy pose={mascotPose} animation={mascotAnim} style={{ width: 48, height: 48 }} />
          </View>
        </View>
      </View>

      {/* Mascot Speech Helper Banner */}
      <View className="mx-4 mb-2.5 bg-white px-3.5 py-2 rounded-2xl border border-neutral-100 shadow-sm shadow-black/5 flex-row items-center gap-2">
        <SparklesIcon size={14} className="text-warning-500" />
        <Text className="font-bold text-[13px] text-neutral-600 font-inter flex-1" numberOfLines={1}>
          {bubbleText}
        </Text>
      </View>

      {/* 3. MATCHING PLAYGROUND (2 COLUMNS) */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <RNAnimated.View 
          style={{ 
            opacity: contentFade, 
            transform: [{ translateX: shakeAnim }],
            flex: 1 
          }}
          className="flex-row gap-3 pt-1"
        >
          {/* LEFT COLUMN: ENGLISH WORDS */}
          <View className="flex-1 gap-3">
            <Text className="font-extrabold text-[12px] text-neutral-400 uppercase tracking-wider text-center mb-0.5">
              Từ tiếng Anh
            </Text>
            {wordTiles.map((tile) => {
              const isMatched = matchedPairIds.has(tile.pairId);
              const isSelected = selectedWordId === tile.pairId;
              const isFailed = failedPairPairIds.has(tile.pairId) && isSelected;

              let cardBg = "bg-white border-neutral-200 border-b-[4px]";
              let textClass = "text-mascot-navy";

              if (isMatched) {
                cardBg = "bg-success-50 border-success-400 border-b-[2px]";
                textClass = "text-success-800 line-through";
              } else if (isFailed) {
                cardBg = "bg-error-50 border-error-500 border-b-[4px]";
                textClass = "text-error-700";
              } else if (isSelected) {
                cardBg = "bg-primary-50 border-primary-500 border-b-[4px]";
                textClass = "text-primary-800 font-black";
              }

              return (
                <TouchableOpacity
                  key={tile.id}
                  onPress={() => handleWordTap(tile)}
                  disabled={isMatched}
                  activeOpacity={0.8}
                  style={isMatched ? { opacity: 0.4 } : isSelected ? { transform: [{ scale: 1.02 }] } : undefined}
                  className={cn(
                    "min-h-[78px] rounded-2xl p-3 border-2 justify-center",
                    cardBg
                  )}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-1.5">
                      <Text className={cn("font-extrabold text-[15px] font-nunito leading-tight", textClass)}>
                        {tile.text}
                      </Text>
                      {tile.ipa && (
                        <Text className="font-medium text-[11px] text-neutral-400 font-inter mt-0.5">
                          {tile.ipa}
                        </Text>
                      )}
                    </View>
                    
                    {isMatched ? (
                      <CheckCircle2Icon size={18} className="text-success-500 shrink-0" />
                    ) : isFailed ? (
                      <XCircleIcon size={18} className="text-error-500 shrink-0" />
                    ) : (
                      <View className="w-6 h-6 rounded-full bg-neutral-100 items-center justify-center border border-neutral-200 shrink-0">
                        <Volume2Icon size={12} className={isSelected ? "text-primary-600" : "text-neutral-400"} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* RIGHT COLUMN: VIETNAMESE MEANINGS */}
          <View className="flex-1 gap-3">
            <Text className="font-extrabold text-[12px] text-neutral-400 uppercase tracking-wider text-center mb-0.5">
              Nghĩa tiếng Việt
            </Text>
            {meaningTiles.map((tile) => {
              const isMatched = matchedPairIds.has(tile.pairId);
              const isSelected = selectedMeaningId === tile.pairId;
              const isFailed = failedPairPairIds.has(tile.pairId) && isSelected;

              let cardBg = "bg-white border-neutral-200 border-b-[4px]";
              let textClass = "text-neutral-700";

              if (isMatched) {
                cardBg = "bg-success-50 border-success-400 border-b-[2px]";
                textClass = "text-success-800 line-through";
              } else if (isFailed) {
                cardBg = "bg-error-50 border-error-500 border-b-[4px]";
                textClass = "text-error-700";
              } else if (isSelected) {
                cardBg = "bg-primary-50 border-primary-500 border-b-[4px]";
                textClass = "text-primary-800 font-bold";
              }

              return (
                <TouchableOpacity
                  key={tile.id}
                  onPress={() => handleMeaningTap(tile)}
                  disabled={isMatched}
                  activeOpacity={0.8}
                  style={isMatched ? { opacity: 0.4 } : isSelected ? { transform: [{ scale: 1.02 }] } : undefined}
                  className={cn(
                    "min-h-[78px] rounded-2xl p-3 border-2 justify-center",
                    cardBg
                  )}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className={cn("font-bold text-[14px] font-inter flex-1 leading-snug pr-1", textClass)}>
                      {tile.text}
                    </Text>
                    {isMatched ? (
                      <CheckCircle2Icon size={18} className="text-success-500 shrink-0" />
                    ) : isFailed ? (
                      <XCircleIcon size={18} className="text-error-500 shrink-0" />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </RNAnimated.View>
      </ScrollView>

      {/* 4. BOTTOM INFO FOOTER */}
      <View className="px-5 py-3.5 bg-white border-t border-neutral-100 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-2.5 h-2.5 rounded-full bg-success-500 animate-pulse" />
          <Text className="font-bold text-[12px] text-neutral-500 font-inter">
            Đã ghép: <Text className="font-extrabold text-mascot-navy">{matchedPairIds.size}</Text> / {allPairs.length} cặp
          </Text>
        </View>

        {wrongAnswers.length > 0 ? (
          <View className="px-2 py-0.5 rounded-lg bg-error-50 border border-error-200">
            <Text className="font-bold text-[11px] text-error-600 font-inter">
              Sai: {wrongAnswers.length} lần
            </Text>
          </View>
        ) : (
          <View className="px-2 py-0.5 rounded-lg bg-success-50 border border-success-200">
            <Text className="font-bold text-[11px] text-success-700 font-inter">
              100% Chính xác ✨
            </Text>
          </View>
        )}
      </View>

      {/* 5. EXIT MODAL */}
      <Modal
        visible={showExitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
        <View 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          className="flex-1 items-center justify-center p-6"
        >
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 items-center">
            <Snapy pose="suy_nghi" animation="idle" style={{ width: 100, height: 100 }} className="mb-3" />
            
            <Text className="font-extrabold text-[20px] text-mascot-navy font-nunito text-center mb-1.5">
              Bạn muốn dừng ghép đôi?
            </Text>
            <Text className="font-medium text-[14px] text-neutral-500 font-inter text-center mb-6 px-2">
              Tiến độ và số cặp đã ghép trong lượt này sẽ không được tính.
            </Text>

            <View className="w-full gap-3">
              <Pressable
                onPress={() => setShowExitModal(false)}
                className="w-full h-12 bg-primary-500 rounded-xl border-b-[3px] border-primary-700 items-center justify-center"
              >
                <Text className="font-extrabold text-[15px] text-white uppercase font-nunito">TIẾP TỤC CHƠI</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setShowExitModal(false);
                  onExit();
                }}
                className="w-full h-12 bg-neutral-100 rounded-xl border-b-[3px] border-neutral-300 items-center justify-center flex-row gap-2"
              >
                <LogOutIcon size={16} className="text-neutral-500" />
                <Text className="font-bold text-[14px] text-neutral-600 font-nunito uppercase">THOÁT RA NGOÀI</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
