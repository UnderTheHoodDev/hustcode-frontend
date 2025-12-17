'use client';

import { Search, Shuffle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProblemFilterProps {
  difficulty: string;
  setDifficulty: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  availableTags: string[];
  onRandomProblem: () => void;
}

const ProblemFilter = ({
  difficulty,
  setDifficulty,
  statusFilter,
  setStatusFilter,
  setSearchQuery,
  selectedTags,
  setSelectedTags,
  availableTags,
  onRandomProblem,
}: ProblemFilterProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  // Convert tags to options format for MultiSelect
  const tagOptions = availableTags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-28 border-[#3a4556] bg-[#252d3d] text-gray-200">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent
              className="border-[#3a4556] bg-[#252d3d]"
              position="popper"
            >
              <SelectItem value="All" className="text-gray-200">
                All
              </SelectItem>
              <SelectItem value="EASY" className="text-gray-200">
                Easy
              </SelectItem>
              <SelectItem value="MEDIUM" className="text-gray-200">
                Medium
              </SelectItem>
              <SelectItem value="HARD" className="text-gray-200">
                Hard
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28 border-[#3a4556] bg-[#252d3d] text-gray-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent
              className="border-[#3a4556] bg-[#252d3d]"
              position="popper"
            >
              <SelectItem value="All" className="text-gray-200">
                All
              </SelectItem>
              <SelectItem value="Solved" className="text-gray-200">
                Solved
              </SelectItem>
              <SelectItem value="Attempted" className="text-gray-200">
                Attempted
              </SelectItem>
              <SelectItem value="Unsolved" className="text-gray-200">
                Unsolved
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <Input
              placeholder="Search problems"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-64 border-[#3a4556] bg-[#252d3d] pr-10 text-gray-200"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-3 cursor-pointer text-gray-400 transition-colors hover:text-gray-200"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={onRandomProblem}
            className="cursor-pointer bg-cyan-500 text-white hover:bg-cyan-600"
          >
            <Shuffle />
            Pick Random
          </Button>
        </div>
      </div>{' '}
      <MultiSelect
        options={tagOptions}
        selected={selectedTags}
        onChange={setSelectedTags}
        placeholder="Select tags..."
        className="mb-4 w-full"
      />
    </div>
  );
};

export default ProblemFilter;
