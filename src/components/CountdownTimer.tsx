import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: string;
}

export const CountdownTimer = ({ endTime }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const storedEndTime = localStorage.getItem('countdownEndTime');
      const targetTime = storedEndTime ? new Date(storedEndTime).getTime() : new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;
      
      if (difference > 0) {
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({
          minutes,
          seconds
        });

        // Store end time in localStorage if not already stored
        if (!storedEndTime) {
          localStorage.setItem('countdownEndTime', endTime);
        }
      } else {
        // Clear localStorage when timer expires
        localStorage.removeItem('countdownEndTime');
      }
    };

    // Initial calculation
    calculateTimeLeft();
    
    // Update timer every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Use Page Visibility API to ensure timer continues in background
    document.addEventListener('visibilitychange', calculateTimeLeft);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', calculateTimeLeft);
    };
  }, [endTime]);

  return (
    <div className="grid grid-cols-2 gap-2 text-center animate-fade-in">
      <div className="bg-secondary/30 p-2 rounded-lg hover:scale-105 transition-transform duration-300">
        <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground">Minutes</div>
      </div>
      <div className="bg-secondary/30 p-2 rounded-lg hover:scale-105 transition-transform duration-300">
        <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground">Seconds</div>
      </div>
    </div>
  );
};