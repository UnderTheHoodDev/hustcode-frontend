'use client';

import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

// Language extensions map
const languageExtensions: Record<string, any> = {
  javascript: javascript({ jsx: true, typescript: true }),
  typescript: javascript({ jsx: true, typescript: true }),
  python: python(),
  cpp: cpp(),
  'c++': cpp(),
  c: cpp(),
  java: java(),
};

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
  height?: string;
  readOnly?: boolean;
}

const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
  (
    {
      value,
      onChange,
      language = 'python',
      placeholder = 'Enter your code here...',
      className,
      height = '200px',
      readOnly = false,
    },
    ref
  ) => {
    const extensions = [
      oneDark,
      EditorView.lineWrapping,
      languageExtensions[language.toLowerCase()] || python(),
    ].filter(Boolean);

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden rounded-md border border-[#3a4556]',
          className
        )}
      >
        <CodeMirror
          value={value}
          height={height}
          theme="dark"
          extensions={extensions}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: false,
            highlightSelectionMatches: true,
          }}
          className="text-sm"
        />
      </div>
    );
  }
);

CodeEditor.displayName = 'CodeEditor';

export { CodeEditor };
