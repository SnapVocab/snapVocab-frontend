import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MatchingQuizView, MatchingResult } from '@/components/study/MatchingQuizView';
import { FillBlankQuizView, FillBlankResult } from '@/components/study/FillBlankQuizView';
import { MultipleChoiceQuizView, MultipleChoiceResult } from '@/components/study/MultipleChoiceQuizView';

export default function QuizSessionScreen() {
  const router = useRouter();
  const rawParams = useLocalSearchParams<{
    deckId?: string;
    mode?: string;
    count?: string;
    reviewWrong?: string;
    wrongData?: string;
  }>();
  const params = rawParams || {};

  // Safe navigation back to avoid broken history
  const navigateBackSafely = () => {
    try {
      if (router && typeof router.canGoBack === 'function' && router.canGoBack()) {
        router.back();
        return;
      }
    } catch {
      // ignore
    }

    try {
      router.replace('/(tabs)/learn');
      return;
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined' && window.location) {
      window.location.href = '/learn';
    }
  };

  // Generic completion router
  const handleGenericComplete = (result: {
    score: number;
    total: number;
    xp: number;
    coin: number;
    time: string;
    deckId: string;
    mode: string;
    wrongAnswers: any[];
  }) => {
    const targetRoute = {
      pathname: '/study/quiz-result' as const,
      params: {
        score: String(result.score),
        total: String(result.total),
        xp: String(result.xp),
        coin: String(result.coin),
        time: result.time,
        deckId: result.deckId,
        mode: result.mode,
        wrongAnswers: JSON.stringify(result.wrongAnswers)
      }
    };

    try {
      router.replace(targetRoute as any);
      return;
    } catch {
      // fallback
    }

    if (typeof window !== 'undefined' && window.location) {
      window.location.href = `/study/quiz-result?score=${result.score}&total=${result.total}&xp=${result.xp}&coin=${result.coin}&time=${result.time}&mode=${result.mode}`;
    }
  };

  const parsedCount = parseInt(params.count || '5', 10) || 5;
  const isReviewWrong = params.reviewWrong === 'true';

  if (params.mode === 'MATCHING') {
    return (
      <MatchingQuizView
        count={parsedCount}
        reviewWrong={isReviewWrong}
        wrongData={params.wrongData}
        onExit={navigateBackSafely}
        onComplete={(res: MatchingResult) =>
          handleGenericComplete({
            ...res,
            deckId: params.deckId || 'd1',
            mode: 'MATCHING'
          })
        }
      />
    );
  }

  if (params.mode === 'FILL_BLANK') {
    return (
      <FillBlankQuizView
        count={parsedCount}
        reviewWrong={isReviewWrong}
        wrongData={params.wrongData}
        onExit={navigateBackSafely}
        onComplete={(res: FillBlankResult) =>
          handleGenericComplete({
            ...res,
            deckId: params.deckId || 'd1',
            mode: 'FILL_BLANK'
          })
        }
      />
    );
  }

  return (
    <MultipleChoiceQuizView
      deckId={params.deckId || 'd1'}
      count={parsedCount}
      reviewWrong={isReviewWrong}
      wrongData={params.wrongData}
      onExit={navigateBackSafely}
      onComplete={(res: MultipleChoiceResult) =>
        handleGenericComplete({
          ...res,
          deckId: params.deckId || 'd1',
          mode: 'MULTIPLE_CHOICE'
        })
      }
    />
  );
}
