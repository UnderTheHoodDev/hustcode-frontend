/**
 * Map language name to CodeMirror language identifier
 */
export const getCodemirrorLanguage = (
  languageName: string
): 'python' | 'javascript' | 'typescript' | 'cpp' | 'java' | 'c' => {
  const name = languageName.toLowerCase();

  if (name.includes('python')) return 'python';
  if (name.includes('javascript') || name === 'js') return 'javascript';
  if (name.includes('typescript') || name === 'ts') return 'typescript';
  if (name.includes('c++') || name === 'cpp') return 'cpp';
  if (name.includes('java') && !name.includes('javascript')) return 'java';
  if (name === 'c') return 'c';

  // Default to python if unknown
  return 'python';
};

