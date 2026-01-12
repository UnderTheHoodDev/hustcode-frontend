import { flexRender, type Table as TableType } from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ContestStatus } from '@/types/contest';

interface ContestTableProps {
  table: TableType<any>;
  onRowClick: (contestId: string, status: ContestStatus) => void;
  isAdmin?: boolean;
  isProblemTable?: boolean; // When true, don't apply contest status logic
}

const ContestTable = ({
  table,
  onRowClick,
  isAdmin = false,
  isProblemTable = false,
}: ContestTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-[#3a4556] bg-[#252d3d]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-[#3a4556] hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-medium text-gray-400"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const isUpcoming = row.original.status === 'UPCOMING';
              // Only disable rows for contest list (not problem tables) and for upcoming contests (not admin)
              const shouldDisable = !isProblemTable && isUpcoming && !isAdmin;
              return (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    onRowClick(row.original.id, row.original.status)
                  }
                  className={`border-b border-[#3a4556] ${
                    shouldDisable
                      ? 'cursor-not-allowed opacity-70 hover:bg-transparent'
                      : 'cursor-pointer hover:bg-[#2a3344]'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-gray-400"
              >
                No contests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContestTable;
