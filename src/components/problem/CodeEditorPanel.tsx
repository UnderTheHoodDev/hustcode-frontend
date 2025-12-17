'use client';

import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CodeEditorPanelProps {
  starterCode: Record<string, string>;
}

const CodeEditorPanel = ({ starterCode }: CodeEditorPanelProps) => {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(starterCode[language] || '');

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(starterCode[newLanguage] || '');
  };

  const languageMap: Record<string, string> = {
    cpp: 'C++',
    python: 'Python',
    java: 'Java',
    javascript: 'JavaScript',
  };

  // CodeMirror language extensions mapping
  const languageExtensions: Record<string, any> = {
    cpp: cpp(),
    python: python(),
    java: java(),
    javascript: javascript(),
  };

  return (
    <div className="bg-base-200 flex h-full flex-col">
      <div className="border-b border-gray-800 p-4">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="bg-base-100 text-base-content w-40 border-gray-800 hover:border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            className="bg-base-100 border-gray-800"
            position="popper"
          >
            {Object.entries(languageMap).map(([key, value]) => (
              <SelectItem
                key={key}
                value={key}
                className="text-base-content hover:bg-base-200"
              >
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
            fontSize: '15px',
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
