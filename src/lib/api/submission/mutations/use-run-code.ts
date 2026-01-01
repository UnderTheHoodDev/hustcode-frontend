import { useMutation } from '@tanstack/react-query';

import { runCode } from '@/lib/api/submission';
import { RunCodePayload, RunCodeResult } from '@/types/submission';

const useRunCode = () => {
  const mutation = useMutation<RunCodeResult, Error, RunCodePayload>({
    mutationFn: runCode,
  });

  return mutation;
};

export default useRunCode;

