'use client';

import { Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ContestCountdownCellProps {
  startTime: string;
  endTime: string;
  status: ContestStatus;
}

const ContestCountdownCell = ({
  startTime,
  endTime,
  status,
}: ContestCountdownCellProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      let targetTime: number;
      let newLabel: string;

      if (status === 'UPCOMING') {
        targetTime = start;
        newLabel = 'Starts in';
      } else if (status === 'RUNNING') {
        targetTime = end;
        newLabel = 'Ends in';
      } else {
        setTimeLeft('');
        setLabel('Ended');
        return;
      }

      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        setLabel(status === 'UPCOMING' ? 'Starting...' : 'Ending...');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let formattedTime: string;
      if (days > 0) {
        formattedTime = `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }

      setTimeLeft(formattedTime);
      setLabel(newLabel);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, status]);

  if (status === 'FINISHED') {
    return (
      <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
        <span>—</span>
      </div>
    );
  }

  const colorClass =
    status === 'UPCOMING'
      ? 'text-blue-400'
      : status === 'RUNNING'
        ? 'text-green-400'
        : 'text-gray-400';

  return (
    <div className="flex flex-col items-center gap-1 text-sm">
      <div className={`flex items-center gap-1 ${colorClass}`}>
        <Timer className="h-3 w-3" />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className={`font-mono font-medium ${colorClass}`}>{timeLeft}</div>
    </div>
  );
};

export default ContestCountdownCell;
