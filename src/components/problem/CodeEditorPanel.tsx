'use client';

import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import { ArrowLeft, Code2, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Default starter code templates
export const DEFAULT_STARTER_CODE: Record<string, string> = {
  c: `#include <stdio.h>

int main() {
  // Your code here
  return 0;
}`,
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

// Language config for Run Code API (/submission) - lowercase IDs
export const RUN_CODE_LANGUAGE_CONFIG: Record<
  string,
  { id: string; version: string; name: string }
> = {
  c: { id: 'c', version: '12', name: 'C' },
  cpp: { id: 'cpp', version: '12', name: 'C++' },
  python: { id: 'python', version: '3.10', name: 'Python' },
  java: { id: 'java', version: '17', name: 'Java' },
  javascript: { id: 'nodejs', version: '18', name: 'JavaScript' },
};

// Language config for Submit Problem API (/problem-submission) - original IDs
export const LANGUAGE_CONFIG: Record<
  string,
  { id: string; version: string; name: string }
> = {
  c: { id: 'C', version: '12', name: 'C' },
  cpp: { id: 'Cpp', version: '12', name: 'C++' },
  python: { id: 'Python', version: '3.10', name: 'Python' },
  java: { id: 'Java', version: '17', name: 'Java' },
  javascript: { id: 'NodeJs', version: '18', name: 'JavaScript' },
};

interface CodeEditorPanelProps {
  starterCode?: Record<string, string>;
  viewingSubmission?: { code: string; language: string } | null;
  onBackToEditor?: () => void;
  // Controlled state props
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  isSubmitting?: boolean;
}

const CodeEditorPanel = ({
  starterCode,
  viewingSubmission,
  onBackToEditor,
  code,
  language,
  onCodeChange,
  onLanguageChange,
  isSubmitting = false,
}: CodeEditorPanelProps) => {
  const codeTemplates = starterCode || DEFAULT_STARTER_CODE;

  // Initialize code when language changes
  useEffect(() => {
    if (!code && !viewingSubmission) {
      onCodeChange(codeTemplates[language] || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine what to display
  const isViewingSubmission = !!viewingSubmission;
  const displayLanguage = isViewingSubmission
    ? viewingSubmission.language.toLowerCase()
    : language;
  const displayCode = isViewingSubmission ? viewingSubmission.code : code;

  const handleLanguageChange = (newLanguage: string) => {
    if (isViewingSubmission) return;
    onLanguageChange(newLanguage);
    onCodeChange(codeTemplates[newLanguage] || '');
  };

  const handleReset = () => {
    if (isViewingSubmission) return;
    onCodeChange(codeTemplates[language] || '');
  };

  // CodeMirror language extensions mapping
  const languageExtensions: Record<string, ReturnType<typeof cpp>> = {
    c: cpp(), // C uses same syntax highlighting as C++
    cpp: cpp(),
    python: python(),
    java: java(),
    javascript: javascript(),
  };

  return (
    <div className="flex h-full flex-col bg-[#1a2332]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-2">
        <div className="flex items-center gap-3">
          <Code2 className="h-4 w-4 text-cyan-400" />

          {isViewingSubmission && onBackToEditor && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackToEditor}
                  className="h-8 px-3 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Back to Editor
                </Button>
              </TooltipTrigger>
              <TooltipContent>Return to your code</TooltipContent>
            </Tooltip>
          )}

          <Select
            value={displayLanguage}
            onValueChange={handleLanguageChange}
            disabled={isViewingSubmission || isSubmitting}
          >
            <SelectTrigger className="h-8 w-32 border-gray-600 bg-[#252d3d] text-sm text-gray-200 hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-gray-600 bg-[#252d3d]">
              {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="text-sm text-gray-200 hover:bg-[#2a3444]"
                >
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={isViewingSubmission || isSubmitting}
              className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset code</TooltipContent>
        </Tooltip>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={displayCode}
          height="100%"
          theme={oneDark}
          extensions={[languageExtensions[displayLanguage] || python()]}
          onChange={(value) => !isViewingSubmission && onCodeChange(value)}
          editable={!isViewingSubmission && !isSubmitting}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          style={{
            fontSize: '14px',
            fontFamily:
              'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;
