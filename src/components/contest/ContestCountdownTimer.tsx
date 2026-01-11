'use client';

import { AlertTriangle, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ContestCountdownTimerProps {
  endTime: string;
  onContestEnd?: () => void;
}

const ContestCountdownTimer = ({
  endTime,
  onContestEnd,
}: ContestCountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
    isUrgent: boolean;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
    isUrgent: false,
  });

  // Ref to track if onContestEnd has been called
  const hasCalledEndRef = useRef(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEnded: true,
          isUrgent: false,
        });
        // Only call onContestEnd once
        if (!hasCalledEndRef.current) {
          hasCalledEndRef.current = true;
          onContestEnd?.();
        }
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Consider urgent if less than 15 minutes remaining
      const isUrgent = difference < 15 * 60 * 1000;

      setTimeLeft({
        hours,
        minutes,
        seconds,
        isEnded: false,
        isUrgent,
      });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onContestEnd]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (timeLeft.isEnded) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5">
        <AlertTriangle className="h-4 w-4 text-red-400" />
        <span className="text-sm font-medium text-red-400">Contest Ended</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${
        timeLeft.isUrgent
          ? 'border-amber-500/30 bg-amber-500/10'
          : 'border-cyan-500/30 bg-cyan-500/10'
      }`}
    >
      <Clock
        className={`h-4 w-4 ${timeLeft.isUrgent ? 'text-amber-400' : 'text-cyan-400'}`}
      />
      <span
        className={`font-mono text-sm font-medium ${
          timeLeft.isUrgent ? 'text-amber-400' : 'text-cyan-400'
        }`}
      >
        {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:
        {formatNumber(timeLeft.seconds)}
      </span>
      {timeLeft.isUrgent && (
        <span className="text-xs text-amber-400/70">remaining</span>
      )}
    </div>
  );
};

export default ContestCountdownTimer;
