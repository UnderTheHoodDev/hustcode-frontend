'use client';

import Link from 'next/link';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('javascript', js);

function BrowserIDE() {
  const Highlighter = SyntaxHighlighter as unknown as React.ComponentType<any>;
  const codeString = `const INF = Number.MAX_SAFE_INTEGER; 
const N = 1000;
  
const dp = Array.from({ length: 1 << N }, () => Array(N).fill(INF));
  
function tsp(mask, i) {
  if (mask === (1 << N) - 1) {
    return dist[i][0];
  }
  if (dp[mask][i] !== INF) {
    return dp[mask][i];
  }
  for (let next = 0; next < N; next++) {
    if ((mask & (1 << next)) === 0) {
      const newMask = mask | (1 << next);
      dp[mask][i] = Math.min(dp[mask][i], dist[i][next] + tsp(newMask, next));
    }
  }
  return dp[mask][i];
}
  
function solveTSP() {
  return tsp(1, 0);
}
  
console.log(solveTSP())`;
  return (
    <>
      <div className="mb-14 flex flex-col items-center justify-center text-xl lg:mb-16">
        <span className="mb-1 text-center text-xl font-semibold text-[#F472B6] sm:mb-2 sm:text-2xl">
          In Browser IDE
        </span>
        <span className="xsm:mb-8 xsm:text-2xl mb-5 text-center text-xl leading-normal font-semibold sm:text-3xl">
          Hands-on Learning Experience
        </span>
        <p className="text-neutral_content mb-7 w-full text-center text-sm leading-normal sm:w-3/4 sm:text-base sm:text-[18px]">
          Practice as you learn with our built-in IDE. Each lesson is designed
          to be followed by a coding exercise to apply the concepts and gain
          immediate feedback.
        </p>
        <Link href="/#" className="landing-button mb-8 md:mb-14">
          Get started
        </Link>
        <div className="flex w-full flex-col items-center justify-center text-sm shadow-[0px_-225px_150px_-150px_rgba(79,70,229,0.40)] md:w-11/12 lg:w-3/4">
          <div className="flex h-9 w-full items-center justify-between border-b border-[#272D3D] bg-[#0E1527] px-4">
            <div className="flex basis-1/3 items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
          <Highlighter
            language="javascript"
            style={dracula}
            showLineNumbers
            className="xsm:h-[400px] rounded-0! m-0! h-[350px] w-full overflow-x-auto bg-[#0F172E]! text-[12px] md:h-auto md:text-sm"
          >
            {codeString}
          </Highlighter>
        </div>
      </div>
    </>
  );
}

export default BrowserIDE;
