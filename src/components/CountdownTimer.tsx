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
      const difference = new Date(endTime).getTime() - new Date().getTime();
      
      if (difference > 0) {
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({
          minutes,
          seconds
        });
      }
    };

    // Initial calculation
    calculateTimeLeft();
    
    // Store the end time in localStorage
    localStorage.setItem('countdownEndTime', endTime);
    
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [endTime]);

  useEffect(() => {
    // Check for stored end time when component mounts
    const storedEndTime = localStorage.getItem('countdownEndTime');
    if (storedEndTime) {
      const now = new Date().getTime();
      const endTimeDate = new Date(storedEndTime).getTime();
      
      if (endTimeDate > now) {
        // If stored end time is in the future, use it
        const difference = endTimeDate - now;
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({
          minutes,
          seconds
        });
      }
    }
  }, []);

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