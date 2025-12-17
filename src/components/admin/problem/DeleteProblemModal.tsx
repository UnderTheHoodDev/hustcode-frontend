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
import useDeleteProblem from '@/lib/api/problem/mutations/use-delete-problem';

interface DeleteProblemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problem: AdminProblem | null;
}

const DeleteProblemModal = ({
  open,
  onOpenChange,
  problem,
}: DeleteProblemModalProps) => {
  const { mutate: deleteProblem, isPending } = useDeleteProblem(
    problem?.id || ''
  );

  const handleDelete = () => {
    deleteProblem(undefined, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#3a4556] bg-[#1e293b] sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <DialogTitle className="text-center text-xl text-gray-100">
            Delete Problem
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Are you sure you want to delete this problem?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-[#3a4556] bg-[#252d3d]/50 p-4">
          <p className="text-center font-medium text-gray-200">
            {problem?.title}
          </p>
          <p className="mt-1 text-center text-sm text-gray-400">
            Difficulty:{' '}
            <span
              className={
                problem?.difficulty === 'EASY'
                  ? 'text-green-400'
                  : problem?.difficulty === 'MEDIUM'
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }
            >
              {problem?.difficulty}
            </span>
          </p>
        </div>

        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-center text-sm text-red-400">
            <strong>Warning:</strong> This action cannot be undone. All
            associated data will be permanently deleted:
          </p>
          <ul className="mt-2 list-inside list-disc text-xs text-red-400/80">
            <li>All testcases</li>
            <li>Problem constraints</li>
            <li>Solution (if exists)</li>
            <li>All comments</li>
          </ul>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d] hover:text-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
          >
            {isPending ? 'Deleting...' : 'Delete Problem'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProblemModal;

