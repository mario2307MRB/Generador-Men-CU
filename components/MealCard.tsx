import React from 'react';
import type { Meal, Snack } from '../types';
import ForkKnifeIcon from './icons/ForkKnifeIcon';

interface MealCardProps {
  meal: Meal | Snack;
  mealType: string;
}

const MealCard: React.FC<MealCardProps> = ({ meal, mealType }) => {
  const isMeal = 'recipe' in meal;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-teal-100 text-teal-600 rounded-full p-3">
            <ForkKnifeIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-teal-600 uppercase tracking-wide">{mealType}</p>
            <h3 className="text-xl font-bold text-slate-800">{meal.title}</h3>
          </div>
        </div>
        <p className="text-slate-600 mb-4">{meal.description}</p>
        {isMeal && (meal as Meal).recipe.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Preparación:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              {(meal as Meal).recipe.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealCard;