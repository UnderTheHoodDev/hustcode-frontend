'use client';

import { type Table as TableType } from '@tanstack/react-table';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContestPaginationProps {
  table: TableType<any>;
}

const ContestPagination = ({ table }: ContestPaginationProps) => {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Select
          defaultValue="20"
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-[120px] border-[#3a4556] bg-[#252d3d] text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            className="border-[#3a4556] bg-[#252d3d]"
            position="popper"
          >
            <SelectItem value="10" className="text-gray-200">
              10 / page
            </SelectItem>
            <SelectItem value="20" className="text-gray-200">
              20 / page
            </SelectItem>
            <SelectItem value="50" className="text-gray-200">
              50 / page
            </SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-[#3a4556] bg-[#252d3d] text-gray-200 hover:bg-[#2a3344]"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) =>
            typeof pageNum === 'number' ? (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(pageNum - 1)}
                className={clsx(
                  currentPage === pageNum
                    ? 'border-cyan-500 bg-cyan-500 text-white hover:bg-cyan-600 hover:text-white'
                    : 'border-[#3a4556] bg-[#252d3d] text-gray-200 hover:bg-[#2a3344]',
                  'cursor-pointer'
                )}
              >
                {pageNum}
              </Button>
            ) : (
              <span key={index} className="px-2 text-gray-400">
                {pageNum}
              </span>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-[#3a4556] bg-[#252d3d] text-gray-200 hover:bg-[#2a3344]"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContestPagination;
