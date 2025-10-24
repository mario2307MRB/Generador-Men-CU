
export interface UserInfo {
  name: string;
  gender: string;
  age: string;
  weight: string;
  height: string;
}

export interface Meal {
  title: string;
  description: string;
  recipe: string[];
}

export interface Snack {
  title: string;
  description: string;
}

export interface HydrationPlan {
  title: string;
  recommendations: string[];
}

export interface HealthAdvice {
    title: string;
    recommendations: string[];
}

export interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Snack[];
  hydration: HydrationPlan;
  healthAdvice: HealthAdvice;
}
