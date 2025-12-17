'use client';

import { Check, Terminal, X } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TestCaseProps {
  input: string;
  expectedOutput: string;
  userOutput?: string;
  isPassed?: boolean;
}

const TestCasePanel = ({ testCases }: { testCases: TestCaseProps[] }) => {
  if (testCases.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#1a2332] p-4 text-gray-500">
        <Terminal className="mb-3 h-8 w-8 text-gray-600" />
        <p className="text-sm">No test cases available</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#1a2332]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-700/50 px-4 py-3">
        <Terminal className="h-4 w-4 text-cyan-400" />
        <h3 className="text-sm font-medium text-gray-200">Test Cases</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-4">
        <Tabs defaultValue="case-0" className="flex h-full flex-col">
          <TabsList className="w-fit bg-[#252d3d] p-1">
            {testCases.map((testCase, index) => (
              <TabsTrigger
                key={index}
                value={`case-${index}`}
                className="flex items-center gap-1.5 px-3 py-1 text-xs text-gray-400 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                Case {index + 1}
                {testCase.isPassed !== undefined && (
                  <span>
                    {testCase.isPassed ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <X className="h-3 w-3 text-red-400" />
                    )}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {testCases.map((testCase, index) => (
            <TabsContent
              key={index}
              value={`case-${index}`}
              className="custom-scrollbar mt-4 flex-1 overflow-y-auto"
            >
              <div className="space-y-4">
                {/* Input */}
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-400">
                    Input:
                  </p>
                  <pre className="rounded-lg border border-gray-700/50 bg-[#0f1724] p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-300">
                    {testCase.input}
                  </pre>
                </div>

                {/* Expected Output */}
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-400">
                    Expected Output:
                  </p>
                  <pre className="rounded-lg border border-gray-700/50 bg-[#0f1724] p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-cyan-300">
                    {testCase.expectedOutput}
                  </pre>
                </div>

                {/* User Output (if available) */}
                {testCase.userOutput && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-gray-400">
                      Your Output:
                    </p>
                    <pre
                      className={`rounded-lg border p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap ${
                        testCase.isPassed
                          ? 'border-green-500/30 bg-green-500/10 text-green-300'
                          : 'border-red-500/30 bg-red-500/10 text-red-300'
                      }`}
                    >
                      {testCase.userOutput}
                    </pre>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default TestCasePanel;
