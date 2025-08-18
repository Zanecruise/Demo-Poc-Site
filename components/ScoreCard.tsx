import React, { useState, useEffect } from 'react';

interface ScoreCardProps {
  initialScore: number | null;
  finalScore: number | null;
}

const getScoreColor = (score: number | null) => {
  if (score === null) return 'text-gray-400';
  if (score > 700) return 'text-green-400';
  if (score > 500) return 'text-yellow-400';
  return 'text-red-400';
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ initialScore, finalScore }) => {
  const [displayScore, setDisplayScore] = useState(initialScore);

  useEffect(() => {
    setDisplayScore(initialScore); // Reset on initialScore change
    if (finalScore !== null && initialScore !== null) {
      const difference = initialScore - finalScore;
      if (difference === 0) return;

      const duration = 1500; // Animation duration in ms
      const stepTime = 50;
      const steps = duration / stepTime;
      const increment = difference / steps;
      
      let current = initialScore;
      const timer = setInterval(() => {
        current -= increment;
        if ((increment > 0 && current <= finalScore) || (increment < 0 && current >= finalScore)) {
          setDisplayScore(finalScore);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.round(current));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [initialScore, finalScore]);
  
  const scoreColor = getScoreColor(displayScore);
  const hasDropped = finalScore !== null && initialScore !== null && finalScore < initialScore;

  return (
    <div className={`text-center transition-all duration-500 w-[150px] ${hasDropped ? 'animate-pulse' : ''}`}>
      <h3 className="text-xs font-semibold text-gray-400 mb-1">REPUTATION SCORE</h3>
      <div className={`text-5xl font-bold tracking-tight transition-colors duration-500 ${scoreColor}`}>
        {displayScore !== null ? displayScore : '...'}
      </div>
    </div>
  );
};
