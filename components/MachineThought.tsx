import React, { useState, useEffect } from 'react';

interface MachineThoughtProps {
  thought: string;
}

const MachineThought: React.FC<MachineThoughtProps> = ({ thought }) => {
  const [displayedThought, setDisplayedThought] = useState('');

  useEffect(() => {
    setDisplayedThought(''); // Reset on new thought
    if (thought) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < thought.length) {
          setDisplayedThought(prev => prev + thought.charAt(i));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 20); // Adjust typing speed here
      return () => clearInterval(timer);
    }
  }, [thought]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex-grow flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-cyan-400">Raciocínio da Máquina</h2>
      <div className="flex-grow font-mono text-sm text-gray-300 bg-gray-900/50 rounded-md p-4 min-h-[150px]">
        <p>
          {displayedThought}
          <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
        </p>
      </div>
    </div>
  );
};

export default MachineThought;