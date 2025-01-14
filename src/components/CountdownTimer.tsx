import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: string;
}

export const CountdownTimer = ({ endTime }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="grid grid-cols-4 gap-2 text-center animate-fade-in">
      <div className="bg-secondary/30 p-2 rounded-lg hover:scale-105 transition-transform duration-300">
        <div className="text-2xl font-bold">{timeLeft.days}</div>
        <div className="text-xs text-muted-foreground">Days</div>
      </div>
      <div className="bg-secondary/30 p-2 rounded-lg hover:scale-105 transition-transform duration-300">
        <div className="text-2xl font-bold">{timeLeft.hours}</div>
        <div className="text-xs text-muted-foreground">Hours</div>
      </div>
      <div className="bg-secondary/30 p-2 rounded-lg hover:scale-105 transition-transform duration-300">
        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
        <div className="text-xs text-muted-foreground">Minutes</div>
      </div>
      <div className="bg-secondary/30 p-2 rounded-lg hover:scale-105 transition-transform duration-300">
        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
        <div className="text-xs text-muted-foreground">Seconds</div>
      </div>
    </div>
  );
};