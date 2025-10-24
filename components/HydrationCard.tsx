import React from 'react';
import type { HydrationPlan } from '../types';
import WaterDropIcon from './icons/WaterDropIcon';

interface HydrationCardProps {
  plan: HydrationPlan;
}

const HydrationCard: React.FC<HydrationCardProps> = ({ plan }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-sky-100 text-sky-600 rounded-full p-3">
            <WaterDropIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-sky-600 uppercase tracking-wide">Hidratación</p>
            <h3 className="text-xl font-bold text-slate-800">{plan.title}</h3>
          </div>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-600">
          {plan.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HydrationCard;