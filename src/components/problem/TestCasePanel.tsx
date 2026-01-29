'use client';

import {
  AlertCircle,
  Check,
  Clock,
  HardDrive,
  Loader2,
  Terminal,
  X,
} from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestCaseResult } from '@/types/submission';

interface TestCaseProps {
  id: string;
  isSample: boolean;
  input?: string;
  expectedOutput?: string;
}

interface TestCasePanelProps {
  testCases: TestCaseProps[];
  isSubmitting?: boolean;
  submissionResults?: TestCaseResult[] | null;
  submissionError?: string | null;
  currentTestIndex?: number;
  runningCaseNumber?: number;
  runningTotal?: number;
}

const TestCasePanel = ({
  testCases,
  isSubmitting = false,
  submissionResults,
  submissionError,
  currentTestIndex,
  runningCaseNumber,
  runningTotal,
}: TestCasePanelProps) => {
  // Check if we're running tests one by one (Run mode)
  const isRunningSequentially = isSubmitting && currentTestIndex !== undefined;
  // Always show all test cases (including hidden ones)
  const displayCount = testCases.length;
  const resultById = new Map(
    (submissionResults || []).map((r) => [r.testcaseId, r] as const)
  );

  // Helper to truncate output for TLE cases to prevent memory overflow
  const MAX_OUTPUT_LENGTH = 1000; // 1KB limit for TLE outputs
  const getTruncatedOutput = (output: string, status: string): string => {
    if (status === 'Time Limit Exceeded' && output.length > MAX_OUTPUT_LENGTH) {
      const truncatedLength = output.length - MAX_OUTPUT_LENGTH;
      return `${output.slice(0, MAX_OUTPUT_LENGTH)}\n\n... (${truncatedLength.toLocaleString()} characters truncated due to TLE)`;
    }
    return output;
  };

  if (testCases.length === 0 && !isSubmitting && !submissionResults) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#1a2332] p-4 text-gray-500">
        <Terminal className="mb-3 h-8 w-8 text-gray-600" />
        <p className="text-sm">No test cases available</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-400';
      case 'Wrong Answer':
        return 'text-red-400';
      case 'Time Limit Exceeded':
        return 'text-amber-400';
      case 'Memory Limit Exceeded':
        return 'text-orange-400';
      case 'Runtime Error':
        return 'text-orange-400';
      case 'Compile Error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#1a2332]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-medium text-gray-200">Test Cases</h3>
        </div>
        {isSubmitting && isRunningSequentially && (
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>
              Running test {(runningCaseNumber ?? 0) + 1}/{runningTotal ?? 0}...
            </span>
          </div>
        )}
        {isSubmitting && !isRunningSequentially && (
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Submitting...</span>
          </div>
        )}
        {submissionResults && !isSubmitting && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-400">
              {submissionResults.filter((r) => r.isPassed).length}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">{submissionResults.length}</span>
            <span className="text-gray-500">passed</span>
          </div>
        )}
      </div>

      {/* Submission Error Display */}
      {submissionError && (
        <div className="mx-4 mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Submission Error</span>
          </div>
          <p className="mt-2 text-xs text-red-300">{submissionError}</p>
        </div>
      )}

      {/* Full Submit Loading State (when not running sequentially) */}
      {isSubmitting && !isRunningSequentially && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            <p className="text-sm text-gray-400">Running all test cases...</p>
          </div>
        </div>
      )}

      {/* Content - Show results after submission or sample test cases before */}
      {/* Also show when running sequentially (Run mode) to display incremental results */}
      {(!isSubmitting || isRunningSequentially) && (
        <div className="flex-1 overflow-hidden p-4">
          <Tabs defaultValue="case-0" className="flex h-full flex-col">
            <TabsList className="w-fit bg-[#252d3d] p-1">
              {Array.from({ length: displayCount }).map((_, index) => {
                const testCase = testCases[index];
                const result = testCase ? resultById.get(testCase.id) : undefined;
                const hasResult = !!result;
                const isCurrentlyRunning =
                  isRunningSequentially && index === currentTestIndex;

                return (
                  <TabsTrigger
                    key={index}
                    value={`case-${index}`}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs text-gray-400 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
                  >
                    Case {index + 1}
                    {isCurrentlyRunning && (
                      <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />
                    )}
                    {!isCurrentlyRunning && hasResult && (
                      <span>
                        {result.isPassed ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <X className="h-3 w-3 text-red-400" />
                        )}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Array.from({ length: displayCount }).map((_, index) => {
              const testCase = testCases[index];
              const result = testCase ? resultById.get(testCase.id) : undefined;

              return (
                <TabsContent
                  key={index}
                  value={`case-${index}`}
                  className="custom-scrollbar mt-4 flex-1 overflow-y-auto"
                >
                  <div className="space-y-4">
                    {/* Status & Metrics (if results available) */}
                    {result && (
                      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-700/50 bg-[#0f1724] p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Status:</span>
                          <span
                            className={`text-sm font-medium ${getStatusColor(result.status)}`}
                          >
                            {result.status}
                          </span>
                        </div>
                        {result.time !== null && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>
                              <span className="text-cyan-400">
                                {(result.time * 1000).toFixed(2)}ms
                              </span>
                            </span>
                          </div>
                        )}
                        {result.memory !== null && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <HardDrive className="h-3 w-3" />
                            <span>
                              <span className="text-cyan-400">
                                {(result.memory / 1024).toFixed(2)}MB
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sample Input */}
                    {testCase?.isSample && (
                      <div>
                        <p className="mb-2 text-xs font-medium text-gray-400">
                          Input:
                        </p>
                        <pre className="rounded-lg border border-gray-700/50 bg-[#0f1724] p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-300">
                          {testCase.input || ''}
                        </pre>
                      </div>
                    )}

                    {/* Sample Expected Output */}
                    {testCase?.isSample && (
                      <div>
                        <p className="mb-2 text-xs font-medium text-gray-400">
                          Expected Output:
                        </p>
                        <pre className="rounded-lg border border-gray-700/50 bg-[#0f1724] p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-cyan-300">
                          {testCase.expectedOutput || ''}
                        </pre>
                      </div>
                    )}

                    {/* User Output (if available from submission results) */}
                    {result?.userOutput && (
                      <div>
                        <p className="mb-2 text-xs font-medium text-gray-400">
                          Your Output:
                        </p>
                        <pre
                          className={`rounded-lg border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap ${result.isPassed
                            ? 'border-green-500/30 bg-green-500/10 text-green-300'
                            : 'border-red-500/30 bg-red-500/10 text-red-300'
                            }`}
                        >
                          {getTruncatedOutput(result.userOutput, result.status)}
                        </pre>
                      </div>
                    )}

                    {/* Hidden test case message (non-sample) */}
                    {!testCase?.isSample && (
                      <div className="rounded-lg border border-gray-700/50 bg-[#0f1724]/50 p-4 text-center text-sm text-gray-500">
                        <p>Hidden test case</p>
                        <p className="mt-1 text-xs">
                          Input and expected output are not visible
                        </p>
                      </div>
                    )}

                    {/* Running indicator for current test */}
                    {isRunningSequentially && index === currentTestIndex && (
                      <div className="flex items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/5 py-8">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                          <p className="text-sm text-gray-400">
                            Running test case...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default TestCasePanel;
