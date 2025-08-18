
import React from 'react';
import type { ModuleId } from '../types';

interface ModuleCardProps {
  id: ModuleId;
  title: string;
  subTitle?: string;
  isActive: boolean;
  position?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ id, title, subTitle, isActive, position }) => {
  const baseClasses = "flex flex-col items-center justify-center p-2 rounded-lg border-2 text-center transition-all duration-500 min-w-[120px] text-sm";
  const activeClasses = "bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/20";
  const inactiveClasses = "bg-gray-700/50 border-gray-600";

  return (
    <div id={id} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${position || ''}`}>
      <span className="font-bold text-white">{title}</span>
      {subTitle && <span className="text-xs text-gray-400">{subTitle}</span>}
    </div>
  );
};
