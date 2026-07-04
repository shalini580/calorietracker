export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  defaultServing: string; // e.g. "1 roti", "1 cup (150g)", "100g", "1 piece"
  category: FoodCategory;
}

export type FoodCategory =
  | "Roti/Bread"
  | "Rice"
  | "Dal/Lentils"
  | "Sabzi/Curry"
  | "Snacks"
  | "Sweets"
  | "Beverages";

export interface LoggedFood {
  id: string;
  foodId: string;
  name: string;
  calories: number; // calculated as original calories * quantity
  protein: number;  // calculated
  carbs: number;    // calculated
  fat: number;      // calculated
  servingSize: string;
  quantity: number;
  timestamp: string; // ISO date string
}

export interface WeightLog {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  bodyFat?: number; // in %
}

export interface UserSettings {
  gender: "male" | "female";
  weight: number; // in kg
  height: number; // in cm
  age: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  dailyCalorieGoal: number;
  notificationsEnabled: boolean;
  theme: "light" | "dark";
  isCloudSynced: boolean;
  lastBackupTime: string | null;
  walletAddress?: string;
}

export type ActiveTab = "home" | "summary" | "analytics" | "profile";
