'use client';

import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import { Code2, RotateCcw } from 'lucide-react';
import { useState } from 'react';

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
const DEFAULT_STARTER_CODE: Record<string, string> = {
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

interface CodeEditorPanelProps {
  starterCode?: Record<string, string>;
}

const CodeEditorPanel = ({ starterCode }: CodeEditorPanelProps) => {
  const codeTemplates = starterCode || DEFAULT_STARTER_CODE;
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(codeTemplates[language] || '');

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(codeTemplates[newLanguage] || '');
  };

  const handleReset = () => {
    setCode(codeTemplates[language] || '');
  };

  const languageMap: Record<string, string> = {
    cpp: 'C++',
    python: 'Python',
    java: 'Java',
    javascript: 'JavaScript',
  };

  // CodeMirror language extensions mapping
  const languageExtensions: Record<string, ReturnType<typeof cpp>> = {
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
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-8 w-32 border-gray-600 bg-[#252d3d] text-sm text-gray-200 hover:border-gray-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-gray-600 bg-[#252d3d]">
              {Object.entries(languageMap).map(([key, value]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="text-sm text-gray-200 hover:bg-[#2a3444]"
                >
                  {value}
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
              className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-700 hover:text-white"
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
          value={code}
          height="100%"
          theme={oneDark}
          extensions={[languageExtensions[language]]}
          onChange={(value) => setCode(value)}
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
