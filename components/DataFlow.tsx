import React, { useState, useEffect, useCallback } from 'react';
import type { ModuleId } from '../types';

interface DataFlowProps {
  connections: [ModuleId, ModuleId][];
}

interface FlowStyle {
  id: string;
  style: React.CSSProperties;
  duration: number;
}

const getElementCenter = (el: HTMLElement, containerRect: DOMRect): { x: number; y: number } => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
    };
};

export const DataFlow: React.FC<DataFlowProps> = ({ connections }) => {
  const [styles, setStyles] = useState<FlowStyle[]>([]);

  const calculateStyles = useCallback(() => {
    const container = document.getElementById('diagram-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newStyles: FlowStyle[] = [];

    for (const [fromId, toId] of connections) {
      const fromEl = document.getElementById(fromId);
      const toEl = document.getElementById(toId);

      if (!fromEl || !toEl) continue;

      const fromCenter = getElementCenter(fromEl, containerRect);
      const toCenter = getElementCenter(toEl, containerRect);
      
      let start = { ...fromCenter };
      let end = { ...toCenter };

      // Simple offset for return paths to avoid visual collision
      let yOffset = 0;
      if (
          (fromId === 'sherlock' && toId === 'scoreLabCore') ||
          (fromId === 'dfc' && toId === 'scoreLabCore') ||
          (fromId === 'scoreEngine' && toId === 'scoreLabCore')
      ) {
          yOffset = (fromId === 'dfc') ? 10 : -10;
      }
      start.y += yOffset;
      end.y += yOffset;

      const dx = end.x - start.x;
      const dy = end.y - start.y;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      newStyles.push({
        id: `${fromId}-${toId}`,
        style: {
          position: 'absolute',
          left: `${start.x}px`,
          top: `${start.y}px`,
          width: `${distance}px`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: '0 0',
        },
        duration: Math.max(0.5, distance / 200), // Adjust speed based on distance
      });
    }

    setStyles(newStyles);
  }, [connections]);

  useEffect(() => {
    // A small delay to ensure layout is stable
    const timer = setTimeout(calculateStyles, 50);
    window.addEventListener('resize', calculateStyles);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateStyles);
    };
  }, [calculateStyles]);

  return (
    <>
      <style>{`
        @keyframes move-particle {
          from { transform: translateX(-50%) scale(0.5); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          to { transform: translateX(calc(100% - 8px)) scale(1); opacity: 0; }
        }
        .data-particle-container {
            height: 2px;
            background: linear-gradient(to right, #38bdf833, #38bdf888);
            opacity: 0;
            animation: fade-in 0.5s forwards;
        }
        @keyframes fade-in {
            to { opacity: 1; }
        }
        .data-particle {
          position: absolute;
          top: 50%;
          left: 0;
          width: 8px;
          height: 8px;
          background-color: #38bdf8;
          border-radius: 50%;
          box-shadow: 0 0 8px #38bdf8, 0 0 12px #38bdf8;
          margin-top: -4px;
          animation-name: move-particle;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {styles.map(({ id, style, duration }) => (
          <div key={id} style={style}>
            <div className="data-particle-container">
              <div
                className="data-particle"
                style={{ animationDuration: `${duration}s` }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
