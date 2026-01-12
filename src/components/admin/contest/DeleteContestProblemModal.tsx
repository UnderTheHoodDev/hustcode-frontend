'use client';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useRemoveContestProblem from '@/lib/api/contest/mutations/use-remove-contest-problem';
import type { ContestProblem } from '@/types/contest';

interface DeleteContestProblemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contestId: string;
  problem: ContestProblem | null;
}

const DeleteContestProblemModal = ({
  open,
  onOpenChange,
  contestId,
  problem,
}: DeleteContestProblemModalProps) => {
  const { mutate: removeProblem, isPending } = useRemoveContestProblem(
    contestId,
    problem?.id || ''
  );

  const handleDelete = () => {
    if (!problem) return;

    removeProblem(undefined, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  if (!problem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#3a4556] bg-[#1e293b] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-gray-100">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Remove Problem from Contest
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to remove this problem from the contest? This
            action cannot be undone. The problem will be permanently deleted
            since it&apos;s contest-only.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-lg border border-[#3a4556] bg-[#252d3d] p-4">
          <h3 className="font-medium text-gray-200">{problem.title}</h3>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
            <span>Order: {String.fromCharCode(64 + problem.order)}</span>
            <span>Points: {problem.points}</span>
            <span>Difficulty: {problem.difficulty}</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isPending ? 'Removing...' : 'Remove Problem'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteContestProblemModal;
