'use client';

import { useAtomValue } from 'jotai';
import { ArrowLeft, Loader2, Play, Send, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useCallback, useMemo, useState } from 'react';

import { userInfoAtom } from '@/atoms';
import ContestCountdownTimer from '@/components/contest/ContestCountdownTimer';
import ContestProblemListSheet from '@/components/contest/ContestProblemListSheet';
import ContestStartCountdown from '@/components/contest/ContestStartCountdown';
import CodeEditorPanel, {
  DEFAULT_STARTER_CODE,
  LANGUAGE_CONFIG,
  RUN_CODE_LANGUAGE_CONFIG,
} from '@/components/problem/CodeEditorPanel';
import ProblemDescription from '@/components/problem/ProblemDescription';
import TestCasePanel from '@/components/problem/TestCasePanel';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import useContest from '@/lib/api/contest/queries/use-contest';
import useProblemDetailQuery from '@/lib/api/problem/queries/use-problem-detail';
import useRunCode from '@/lib/api/submission/mutations/use-run-code';
import useSubmitProblem from '@/lib/api/submission/mutations/use-submit-problem';
import useUserContestScore from '@/lib/api/submission/queries/use-user-contest-score';
import { TestCaseResult } from '@/types/submission';
import { toastError, toastSuccess, toastWarning } from '@/utils/toaster';

type SubmissionView = {
  code: string;
  language: string;
} | null;

// Convert order number to letter (1 -> A, 2 -> B, etc.)
const orderToLetter = (order: number) => {
  return String.fromCharCode(64 + order);
};

export default function ContestProblemPage({
  params,
}: {
  params: Promise<{ id: string; problemId: string }>;
}) {
  const router = useRouter();
  const { id: contestId, problemId } = use(params);
  const userInfo = useAtomValue(userInfoAtom);

  // Fetch contest detail from API
  const {
    data: contestData,
    isLoading: isContestLoading,
    isError: isContestError,
  } = useContest(contestId);

  // Fetch problem detail from API (for full problem info including testcases)
  const {
    data: problemResponse,
    isLoading: isProblemLoading,
    isError: isProblemError,
  } = useProblemDetailQuery(problemId);

  // Extract problem detail from response
  const problemDetail = useMemo(() => {
    if (!problemResponse) return undefined;
    // API returns { data: problemObject }
    return (problemResponse as any)?.data || problemResponse;
  }, [problemResponse]);

  // Transform contest data and find the current problem's contest info (order, points)
  const { contest, contestProblemInfo, contestProblems } = useMemo(() => {
    if (!contestData) {
      return {
        contest: undefined,
        contestProblemInfo: undefined,
        contestProblems: [],
      };
    }

    const apiContest = contestData as any;

    // Transform problems array for contest info
    const transformedProblems =
      apiContest.problems?.map((item: any) => {
        const prob = item.problem || item;
        return {
          id: prob.id,
          title: prob.title,
          description: prob.description || '',
          difficulty: prob.difficulty,
          order: item.order,
          points: item.points,
          tags: prob.tags || [],
        };
      }) || [];

    // Find the current problem's contest-specific info (order, points)
    const currentProblemInfo = transformedProblems.find(
      (p: any) => p.id === problemId
    );

    // For problem list sheet
    const contestProblemsList = transformedProblems.map((p: any) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      order: p.order,
      points: p.points,
      tags: p.tags,
    }));

    return {
      contest: apiContest as ContestDetail,
      contestProblemInfo: currentProblemInfo,
      contestProblems: contestProblemsList,
    };
  }, [contestData, problemId]);

  // Prepare contest problems for score calculation
  const contestProblemsForScore = useMemo(() => {
    return contestProblems.map((p: { id: string; points: number }) => ({
      id: p.id,
      points: p.points,
    }));
  }, [contestProblems]);

  // Fetch user's contest score
  const { data: userScore, isLoading: isScoreLoading } = useUserContestScore({
    userId: userInfo?.id,
    contestProblems: contestProblemsForScore,
    contestId,
    enabled: !!userInfo?.id && contestProblems.length > 0,
  });

  // Helper to get problem status
  const getProblemStatus = useCallback(
    (probId: string) => {
      return userScore?.problemResults.get(probId)?.status || 'not_attempted';
    },
    [userScore]
  );

  // Code editor state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');

  // Initialize code when language changes
  const handleLanguageChange = useCallback((newLang: string) => {
    setLanguage(newLang);
    setCode(DEFAULT_STARTER_CODE[newLang] || '');
  }, []);

  // Submission state
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [runningCaseNumber, setRunningCaseNumber] = useState(0);
  const [runningTotal, setRunningTotal] = useState(0);
  const [submissionResults, setSubmissionResults] = useState<
    TestCaseResult[] | null
  >(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Viewing submission code
  const [viewingSubmission, setViewingSubmission] =
    useState<SubmissionView>(null);

  // Contest ended state
  const [contestEnded, setContestEnded] = useState(false);

  // Contest started state (for handling countdown completion)
  const [contestStarted, setContestStarted] = useState(false);

  // Check if contest has started
  const isContestNotStarted = useMemo(() => {
    if (!contest) return false;
    const now = new Date().getTime();
    const startTime = new Date(contest.startTime).getTime();
    return now < startTime && contest.status === 'UPCOMING';
  }, [contest]);

  // Mutations
  const runCodeMutation = useRunCode();
  const submitProblemMutation = useSubmitProblem(problemId, contestId);

  // Handle contest start (when countdown reaches zero)
  const handleContestStart = useCallback(() => {
    setContestStarted(true);
    // Force page reload to refresh data
    window.location.reload();
  }, []);

  // Handle contest end
  const handleContestEnd = useCallback(() => {
    setContestEnded(true);
    toastWarning('Contest has ended! Submissions are no longer accepted.');
  }, []);

  // Run code against sample test cases
  const handleRun = async () => {
    if (!problemDetail || !code.trim()) {
      toastError('Please write some code before running');
      return;
    }

    const sampleCasesWithIndex = (problemDetail.testcases || [])
      .map((tc: any, index: number) => ({ tc, index }))
      .filter(({ tc }: any) => tc.isSample);

    if (sampleCasesWithIndex.length === 0) {
      toastError('No sample test cases available');
      return;
    }

    setIsRunning(true);
    setSubmissionError(null);
    setSubmissionResults(null);
    setCurrentTestIndex(0);
    setRunningCaseNumber(0);
    setRunningTotal(sampleCasesWithIndex.length);

    const results: TestCaseResult[] = [];
    const runLangConfig = RUN_CODE_LANGUAGE_CONFIG[language];

    try {
      for (let i = 0; i < sampleCasesWithIndex.length; i++) {
        const { tc: testCase, index } = sampleCasesWithIndex[i];
        setRunningCaseNumber(i);
        setCurrentTestIndex(index);

        try {
          const result = await runCodeMutation.mutateAsync({
            source_code: code,
            stdin: testCase.input,
            expected_output: testCase.output,
            cpu_time_limit: problemDetail.problemConstrain?.timeLimit
              ? problemDetail.problemConstrain.timeLimit / 1000
              : 2,
            memory_limit: problemDetail.problemConstrain?.memoryLimit
              ? problemDetail.problemConstrain.memoryLimit * 1000
              : 128000,
            language: {
              id: runLangConfig.id,
              version: runLangConfig.version,
            },
          });

          results.push({
            testcaseId: testCase.id,
            input: testCase.input,
            expectedOutput: testCase.output,
            userOutput: result.stdout || result.stderr || '',
            isPassed: result.status === 'Accepted',
            time: result.time,
            memory: result.memory,
            status: result.status,
          });
        } catch {
          results.push({
            testcaseId: testCase.id,
            input: testCase.input,
            expectedOutput: testCase.output,
            userOutput: '',
            isPassed: false,
            time: null,
            memory: null,
            status: 'Runtime Error',
          });
        }

        setSubmissionResults([...results]);
      }

      const passed = results.filter((r) => r.isPassed).length;
      if (passed === results.length) {
        toastSuccess(`All ${results.length} sample test cases passed!`);
      } else {
        toastError(`${passed}/${results.length} sample test cases passed`);
      }
    } catch {
      setSubmissionError('Failed to run code. Please try again.');
      toastError('Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code with contestId
  const handleSubmit = async () => {
    if (contestEnded) {
      toastError('Contest has ended. Submissions are no longer accepted.');
      return;
    }

    if (!problemDetail || !code.trim()) {
      toastError('Please write some code before submitting');
      return;
    }

    setSubmissionError(null);
    setSubmissionResults(null);

    const langConfig = LANGUAGE_CONFIG[language];

    try {
      const response = await submitProblemMutation.mutateAsync({
        source_code: code,
        problemId: problemId,
        language: {
          id: langConfig.id,
          version: langConfig.version,
        },
        contestId: contestId, // Pass contestId for contest submissions
      });

      const results: TestCaseResult[] = response.testcaseResults.map((tc) => ({
        testcaseId: tc.testcaseId,
        userOutput: tc.stdout || tc.stderr || '',
        isPassed: tc.status === 'Accepted',
        time: tc.time,
        memory: tc.memory,
        status: tc.status,
      }));

      setSubmissionResults(results);

      const submissionStatus = response.submission.status;
      if (submissionStatus === 'ACCEPTED') {
        toastSuccess('Accepted! All test cases passed!');
      } else {
        const passed = results.filter((r) => r.isPassed).length;
        const statusLabel = getStatusLabel(submissionStatus);
        toastError(
          `${statusLabel}: ${passed}/${results.length} test cases passed`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to submit. Please try again.';
      setSubmissionError(errorMessage);
      toastError('Failed to submit');
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      WRONG_ANSWER: 'Wrong Answer',
      TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
      MEMORY_LIMIT_EXCEEDED: 'Memory Limit Exceeded',
      RUNTIME_ERROR: 'Runtime Error',
      COMPILATION_ERROR: 'Compilation Error',
    };
    return labels[status] || status;
  };

  const handleViewSubmission = (
    submissionCode: string,
    submissionLang: string
  ) => {
    setViewingSubmission({ code: submissionCode, language: submissionLang });
  };

  const handleBackToEditor = () => {
    setViewingSubmission(null);
  };

  // Loading state
  const isLoading = isContestLoading || isProblemLoading;
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f1724]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-gray-400">Loading problem...</p>
        </div>
      </div>
    );
  }

  // Error state
  const isError = isContestError || isProblemError;
  if (isError || !contest || !problemDetail || !contestProblemInfo) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0f1724]">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
            {!contestProblemInfo
              ? 'Problem not found in this contest.'
              : 'Failed to load contest. Please try again later.'}
          </div>
          <Link href={`/contests/${contestId}`}>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contest
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Contest not started - show countdown
  if (isContestNotStarted && !contestStarted) {
    return (
      <ContestStartCountdown
        contestId={contestId}
        contestTitle={contest.title}
        startTime={contest.startTime}
        onContestStart={handleContestStart}
      />
    );
  }

  // Test cases for panel
  const testCasesForPanel =
    problemDetail.testcases?.map((tc: any) => ({
      id: tc.id,
      isSample: tc.isSample,
      input: tc.isSample ? tc.input : undefined,
      expectedOutput: tc.isSample ? tc.output : undefined,
    })) || [];

  const isSubmitting = submitProblemMutation.isPending;
  const isProcessing = isSubmitting || isRunning;

  return (
    <div className="flex h-screen flex-col bg-[#0f1724]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 bg-[#1a2332] px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href={`/contests/${contestId}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Contest</span>
            </Button>
          </Link>

          {/* Contest Problem List Sheet */}
          <ContestProblemListSheet
            contestId={contestId}
            currentProblemId={problemId}
            problems={contestProblems}
            userTotalPoints={userScore?.totalPoints || 0}
            userSolvedCount={userScore?.solvedCount || 0}
            getProblemStatus={getProblemStatus}
            isScoreLoading={isScoreLoading}
          />

          {/* Problem Order Badge */}
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-cyan-500/20 text-sm font-bold text-cyan-400">
              {orderToLetter(contestProblemInfo.order)}
            </span>
          </div>

          {/* User Score Display */}
          {userInfo?.id && (
            <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5">
              <Trophy className="h-4 w-4 text-cyan-400" />
              {isScoreLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              ) : (
                <span className="text-sm font-medium text-cyan-400">
                  {userScore?.totalPoints || 0} pts
                </span>
              )}
            </div>
          )}

          {/* Problem constraints */}
          {problemDetail.problemConstrain && (
            <div className="hidden items-center gap-4 text-sm text-gray-400 lg:flex">
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500">Time:</span>
                <span className="text-cyan-400">
                  {problemDetail.problemConstrain.timeLimit}ms
                </span>
              </span>
              <span className="h-4 w-px bg-gray-600" />
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500">Memory:</span>
                <span className="text-cyan-400">
                  {problemDetail.problemConstrain.memoryLimit}MB
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Contest Countdown Timer */}
          <ContestCountdownTimer
            endTime={contest.endTime}
            onContestEnd={handleContestEnd}
          />

          {/* Run Button */}
          <Button
            onClick={handleRun}
            disabled={isProcessing}
            variant="outline"
            className="border-gray-600 bg-transparent text-gray-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRunning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isRunning ? 'Running...' : 'Run'}
          </Button>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isProcessing || contestEnded}
            className={`${
              contestEnded
                ? 'bg-gray-600 text-gray-400'
                : 'bg-green-600 hover:bg-green-500'
            } text-white disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <ProblemDescription
              problemId={problemDetail.id}
              title={`${orderToLetter(contestProblemInfo.order)}. ${problemDetail.title}`}
              difficulty={problemDetail.difficulty}
              tags={problemDetail.tags || []}
              description={problemDetail.description}
              taskDescription={problemDetail.taskDescription}
              inputDescription={problemDetail.inputDescription}
              outputDescription={problemDetail.outputDescription}
              submissionCount={problemDetail._count?.submissions || 0}
              likeCount={0}
              onViewSubmission={handleViewSubmission}
              contestId={contestId}
            />
          </ResizablePanel>

          <ResizableHandle className="w-1 bg-gray-700/50 transition-colors hover:bg-cyan-500/50" />

          {/* Right Panel - Code Editor & Test Cases */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              {/* Code Editor */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <CodeEditorPanel
                  viewingSubmission={viewingSubmission}
                  onBackToEditor={handleBackToEditor}
                  code={code}
                  language={language}
                  onCodeChange={setCode}
                  onLanguageChange={handleLanguageChange}
                  isSubmitting={isProcessing}
                />
              </ResizablePanel>

              <ResizableHandle className="h-1 bg-gray-700/50 transition-colors hover:bg-cyan-500/50" />

              {/* Test Cases */}
              <ResizablePanel defaultSize={40} minSize={15}>
                <TestCasePanel
                  testCases={testCasesForPanel}
                  isSubmitting={isProcessing}
                  submissionResults={submissionResults}
                  submissionError={submissionError}
                  currentTestIndex={isRunning ? currentTestIndex : undefined}
                  runningCaseNumber={isRunning ? runningCaseNumber : undefined}
                  runningTotal={isRunning ? runningTotal : undefined}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
