'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminContestFilterProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onCreateContest: () => void;
}

const AdminContestFilter = ({
  statusFilter,
  setStatusFilter,
  onCreateContest,
}: AdminContestFilterProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 border-[#3a4556] bg-[#252d3d] text-gray-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent
            className="border-[#3a4556] bg-[#252d3d]"
            position="popper"
          >
            <SelectItem value="All" className="text-gray-200">
              All
            </SelectItem>
            <SelectItem value="UPCOMING" className="text-gray-200">
              Upcoming
            </SelectItem>
            <SelectItem value="RUNNING" className="text-gray-200">
              Running
            </SelectItem>
            <SelectItem value="FINISHED" className="text-gray-200">
              Finished
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={onCreateContest}
        className="bg-cyan-500 text-white hover:bg-cyan-600"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Contest
      </Button>
    </div>
  );
};

export default AdminContestFilter;
