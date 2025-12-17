'use client';

import { Check, X } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TestCaseProps {
  input: string;
  expectedOutput: string;
  userOutput?: string;
  isPassed?: boolean;
}

const TestCasePanel = ({ testCases }: { testCases: TestCaseProps[] }) => {
  return (
    <div className="flex h-full flex-col bg-[#1e2430] p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-100">Test Cases</h3>
      <Tabs defaultValue="case-0" className="flex-1">
        <TabsList className="bg-gray-800">
          {testCases.map((testCase, index) => (
            <TabsTrigger
              key={index}
              value={`case-${index}`}
              className="data-[state=active]:bg-[#2cb2eb]"
            >
              <span className="flex items-center gap-2 text-white">
                Case {index + 1}
                {testCase.isPassed !== undefined && (
                  <span>
                    {testCase.isPassed ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </span>
                )}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {testCases.map((testCase, index) => (
          <TabsContent
            key={index}
            value={`case-${index}`}
            className="mt-4 flex-1 overflow-y-auto"
          >
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-400">Input:</p>
                <pre className="rounded-lg bg-gray-900 p-4 text-sm text-gray-300">
                  {testCase.input}
                </pre>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-400">
                  Expected Output:
                </p>
                <pre className="rounded-lg bg-gray-900 p-4 text-sm text-gray-300">
                  {testCase.expectedOutput}
                </pre>
              </div>

              {testCase.userOutput && (
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-400">
                    Your Output:
                  </p>
                  <pre
                    className={`rounded-lg p-4 text-sm ${
                      testCase.isPassed
                        ? 'bg-green-900/20 text-green-300'
                        : 'bg-red-900/20 text-red-300'
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
  );
};

export default TestCasePanel;
