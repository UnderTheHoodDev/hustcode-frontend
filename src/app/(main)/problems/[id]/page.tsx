'use client';

import { Send } from 'lucide-react';
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
import { problemsData } from '@/constants/mock-problem-data';

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const { id } = use(params);

  // Mock: Get problem by ID
  const problem =
    problemsData.data.find((p) => p.id === id) || problemsData.data[0];

  // Mock starter code
  const starterCode = {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
    python: `# Your code here
def solve():
    pass

if __name__ == "__main__":
    solve()`,
    java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
    javascript: `// Your code here
function solve() {
    
}

solve();`,
  };

  // Mock test cases (sử dụng inputDescription và outputDescription)
  const testCases = [
    {
      input: problem.inputDescription.split('\\n')[0] || 'Sample input 1',
      expectedOutput:
        problem.outputDescription.split('\\n')[0] || 'Sample output 1',
    },
    {
      input: 'Test case 2 input',
      expectedOutput: 'Test case 2 output',
    },
  ];

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert('Submission completed!');
    }, 1500);
  };

  return (
    <div className="flex h-screen flex-col bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-[#161b22] px-6 py-3">
        <ProblemListSheet currentProblemId={problem.id} />
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700"
        >
          <Send className="h-4 w-4" />
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <ProblemDescription
              title={problem.title}
              difficulty={problem.difficulty}
              tags={problem.tags}
              description={problem.description}
              taskDescription={problem.taskDescription}
              inputDescription={problem.inputDescription}
              outputDescription={problem.outputDescription}
            />
          </ResizablePanel>

          <ResizableHandle className="bg-gray-700" withHandle />

          {/* Right Panel - Code Editor & Test Cases */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              {/* Code Editor */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <CodeEditorPanel starterCode={starterCode} />
              </ResizablePanel>

              <ResizableHandle className="bg-gray-700" withHandle />

              {/* Test Cases */}
              <ResizablePanel defaultSize={40} minSize={20}>
                <TestCasePanel testCases={testCases} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
