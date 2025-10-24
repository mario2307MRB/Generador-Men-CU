import React from 'react';
import type { HealthAdvice } from '../types';
import HeartPulseIcon from './icons/HeartPulseIcon';

interface HealthAdviceCardProps {
  plan: HealthAdvice;
}

const HealthAdviceCard: React.FC<HealthAdviceCardProps> = ({ plan }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-rose-100 text-rose-600 rounded-full p-3">
            <HeartPulseIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-rose-600 uppercase tracking-wide">Consejos de Bienestar</p>
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

export default HealthAdviceCard;
