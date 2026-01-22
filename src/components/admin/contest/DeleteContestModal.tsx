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
import useDeleteContest from '@/lib/api/contest/mutations/use-delete-contest';
import type { Contest } from '@/types/contest';

interface DeleteContestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contest: Contest | null;
}

const DeleteContestModal = ({
  open,
  onOpenChange,
  contest,
}: DeleteContestModalProps) => {
  const { mutate: deleteContest, isPending } = useDeleteContest();

  const handleDelete = () => {
    if (!contest) return;

    deleteContest(contest.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  if (!contest) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#3a4556] bg-[#1e293b] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-gray-100">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Contest
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete this contest? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-lg border border-[#3a4556] bg-[#252d3d] p-4">
          <h3 className="font-medium text-gray-200">{contest.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-400">
            {contest.description}
          </p>
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
            {isPending ? 'Deleting...' : 'Delete Contest'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteContestModal;
