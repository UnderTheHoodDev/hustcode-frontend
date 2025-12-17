'use client';

import { ArrowLeft, Loader2, Send } from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';

import CodeEditorPanel from '@/components/problem/CodeEditorPanel';
import ProblemDescription from '@/components/problem/ProblemDescription';
import ProblemListSheet from '@/components/problem/ProblemListSheet';
import TestCasePanel from '@/components/problem/TestCasePanel';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import useProblemDetailQuery from '@/lib/api/problem/queries/use-problem-detail';

// Type for problem detail from API
type ProblemDetail = {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  taskDescription: string;
  inputDescription: string;
  outputDescription: string;
  status: string;
  authorId: string;
  likeNumber: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  testcases: Array<{
    id: string;
    input: string;
    output: string;
    isSample: boolean;
  }>;
  problemConstrain: {
    id: string;
    memoryLimit: number;
    timeLimit: number;
  } | null;
  _count: {
    submissions: number;
    comments: number;
  };
};

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Fetch problem detail from API
  const { data: response, isLoading, isError } = useProblemDetailQuery(id);
  const problem = response?.data as ProblemDetail | undefined;

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert('Submission completed!');
    }, 1500);
  };

  // Loading state
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
  if (isError || !problem) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0f1724]">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
            Failed to load problem. Please try again later.
          </div>
          <Link href="/problems">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Problems
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get sample test cases for display
  const sampleTestCases =
    problem.testcases?.filter((tc) => tc.isSample).map((tc) => ({
      input: tc.input,
      expectedOutput: tc.output,
    })) || [];

  // If no sample test cases, show first 2 test cases
  const displayTestCases =
    sampleTestCases.length > 0
      ? sampleTestCases
      : problem.testcases?.slice(0, 2).map((tc) => ({
          input: tc.input,
          expectedOutput: tc.output,
        })) || [];

  return (
    <div className="flex h-screen flex-col bg-[#0f1724]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 bg-[#1a2332] px-6 py-3">
        <div className="flex items-center gap-4">
          <ProblemListSheet currentProblemId={problem.id} />
          {problem.problemConstrain && (
            <div className="hidden items-center gap-4 text-sm text-gray-400 md:flex">
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500">Time:</span>
                <span className="text-cyan-400">
                  {problem.problemConstrain.timeLimit}ms
                </span>
              </span>
              <span className="h-4 w-px bg-gray-600" />
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500">Memory:</span>
                <span className="text-cyan-400">
                  {problem.problemConstrain.memoryLimit}MB
                </span>
              </span>
            </div>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-600 text-white hover:bg-green-500"
        >
          <Send className="mr-2 h-4 w-4" />
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <ProblemDescription
              title={problem.title}
              difficulty={problem.difficulty}
              tags={problem.tags}
              description={problem.description}
              taskDescription={problem.taskDescription}
              inputDescription={problem.inputDescription}
              outputDescription={problem.outputDescription}
              submissionCount={problem._count.submissions}
              likeCount={problem.likeNumber}
            />
          </ResizablePanel>

          <ResizableHandle className="w-1 bg-gray-700/50 transition-colors hover:bg-cyan-500/50" />

          {/* Right Panel - Code Editor & Test Cases */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              {/* Code Editor */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <CodeEditorPanel />
              </ResizablePanel>

              <ResizableHandle className="h-1 bg-gray-700/50 transition-colors hover:bg-cyan-500/50" />

              {/* Test Cases */}
              <ResizablePanel defaultSize={40} minSize={15}>
                <TestCasePanel testCases={displayTestCases} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
