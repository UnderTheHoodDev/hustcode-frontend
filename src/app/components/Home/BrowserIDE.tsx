import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

function BrowserIDE() {
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
      <div className="flex flex-col justify-center items-center text-xl mb-20 layout-padding">
        <span className="text-center text-2xl font-semibold text-[#F472B6]">
          In Browser IDE
        </span>
        <span className="text-center text-3xl font-semibold leading-normal mb-8">
          Hands-on Learning Experience
        </span>
        <p className="text-center w-2/3 text-neutral_content text-[18px] leading-normal mb-9">
          Practice as you learn with our built-in IDE. Each lesson is designed
          to be followed by a coding exercise to apply the concepts and gain
          immediate feedback.
        </p>
        <Link href="/#" className="landing-button mb-14">
          Get started
        </Link>
        <div className="text-sm w-5/6 lg:w-full shadow-[0px_-225px_150px_-150px_rgba(79,70,229,0.40)]">
          <div className="flex items-center px-4 justify-between h-9 bg-[#0E1527] w-full border-b border-[#272D3D]">
            <div className="flex items-center gap-2 basis-1/3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>
          <SyntaxHighlighter
            language="javascript"
            style={dracula}
            showLineNumbers
            className="overflow-x-auto bg-[#0E1527] mt-0"
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    </>
  );
}

export default BrowserIDE;
