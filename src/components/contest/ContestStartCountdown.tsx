'use client';

import { ArrowLeft, Clock, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

interface ContestStartCountdownProps {
  contestId: string;
  contestTitle: string;
  startTime: string;
  onContestStart?: () => void;
}

const ContestStartCountdown = ({
  contestId,
  contestTitle,
  startTime,
  onContestStart,
}: ContestStartCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isStarted: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isStarted: false,
  });

  // Ref to track if onContestStart has been called
  const hasCalledStartRef = useRef(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const difference = start - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isStarted: true,
        });
        // Only call onContestStart once
        if (!hasCalledStartRef.current) {
          hasCalledStartRef.current = true;
          onContestStart?.();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isStarted: false,
      });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [startTime, onContestStart]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (timeLeft.isStarted) {
    return null; // Will trigger page reload via onContestStart
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f1724]">
      <div className="flex flex-col items-center gap-8 rounded-2xl border border-gray-700/50 bg-[#1a2332] p-12 shadow-xl">
        {/* Contest Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10">
          <Trophy className="h-10 w-10 text-cyan-400" />
        </div>

        {/* Contest Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{contestTitle}</h1>
          <p className="mt-2 text-gray-400">Contest has not started yet</p>
        </div>

        {/* Countdown Timer */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="h-5 w-5" />
            <span>Starts in</span>
          </div>

          <div className="flex items-center gap-3">
            {timeLeft.days > 0 && (
              <>
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#252d3d] text-2xl font-bold text-cyan-400">
                    {formatNumber(timeLeft.days)}
                  </div>
                  <span className="mt-1 text-xs text-gray-500">DAYS</span>
                </div>
                <span className="text-2xl font-bold text-gray-600">:</span>
              </>
            )}

            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#252d3d] text-2xl font-bold text-cyan-400">
                {formatNumber(timeLeft.hours)}
              </div>
              <span className="mt-1 text-xs text-gray-500">HOURS</span>
            </div>

            <span className="text-2xl font-bold text-gray-600">:</span>

            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#252d3d] text-2xl font-bold text-cyan-400">
                {formatNumber(timeLeft.minutes)}
              </div>
              <span className="mt-1 text-xs text-gray-500">MINS</span>
            </div>

            <span className="text-2xl font-bold text-gray-600">:</span>

            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#252d3d] text-2xl font-bold text-amber-400">
                {formatNumber(timeLeft.seconds)}
              </div>
              <span className="mt-1 text-xs text-gray-500">SECS</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Link href={`/contests/${contestId}`}>
          <Button
            variant="outline"
            className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contest
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ContestStartCountdown;
