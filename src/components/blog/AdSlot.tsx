import React from 'react';

interface AdSlotProps {
  position: 'top' | 'middle' | 'bottom';
}

const AdSlot: React.FC<AdSlotProps> = ({ position }) => {
  return (
    <div className="my-8">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Advertisement</p>
        <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
          Ad slot - {position}
        </div>
      </div>
    </div>
  );
};

export default AdSlot;
