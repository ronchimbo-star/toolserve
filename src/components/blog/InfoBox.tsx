import React from 'react';
import { AlertCircle, Lightbulb, AlertTriangle, Settings } from 'lucide-react';

type InfoBoxType = 'tip' | 'warning' | 'note' | 'regulation';

interface InfoBoxProps {
  type: InfoBoxType;
  title?: string;
  children: React.ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({ type, title, children }) => {
  const configs = {
    tip: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      icon: Lightbulb,
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      defaultTitle: 'PRO TIP'
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-500',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      titleColor: 'text-orange-900',
      defaultTitle: 'WARNING'
    },
    note: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      icon: Settings,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      defaultTitle: 'TECHNICAL NOTE'
    },
    regulation: {
      bg: 'bg-slate-800',
      border: 'border-slate-700',
      icon: AlertCircle,
      iconColor: 'text-white',
      titleColor: 'text-white',
      defaultTitle: 'UK REGULATION'
    }
  };

  const config = configs[type];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div className={`${config.bg} ${config.border} border-l-4 p-6 my-6 rounded-r-lg ${type === 'regulation' ? 'text-white' : ''}`}>
      <div className="flex gap-3">
        <Icon className={`${config.iconColor} flex-shrink-0 mt-1`} size={24} />
        <div className="flex-1">
          <h4 className={`${config.titleColor} font-bold text-sm mb-2 tracking-wide`}>
            {displayTitle}
          </h4>
          <div className={`${type === 'regulation' ? 'text-gray-200' : 'text-gray-700'} leading-relaxed`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
