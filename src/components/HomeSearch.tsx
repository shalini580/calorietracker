import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Leaf, Utensils, Sparkles, Flame, HelpCircle } from "lucide-react";
import { FoodItem, FoodCategory } from "../types";
import { INDIAN_FOOD_DATABASE } from "../data/indianFoods";
import { getFoods } from "../utils/api";
import { IndianTheme } from "../utils/indianThemes";
import RangoliDecoration from "./RangoliDecoration";

interface HomeSearchProps {
  onSelectFood: (food: FoodItem) => void;
  dailyGoal: number;
  totalConsumedToday: number;
  theme: IndianTheme;
  onRotateTheme: () => void;
}

const CATEGORIES: FoodCategory[] = [
  "Roti/Bread",
  "Rice",
  "Dal/Lentils",
  "Sabzi/Curry",
  "Snacks",
  "Sweets",
  "Beverages",
];

export default function HomeSearch({
  onSelectFood,
  dailyGoal,
  totalConsumedToday,
  theme,
  onRotateTheme,
}: HomeSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | "All">("All");
  const [serverFoods, setServerFoods] = useState<FoodItem[] | null>(null);
  const [loadingServerFoods, setLoadingServerFoods] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoadingServerFoods(true);
    getFoods()
      .then((data) => {
        if (!mounted) return;
        setServerFoods(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setServerError(err.message || 'Failed to load server foods');
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingServerFoods(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Filtering foods
  const foodsSource = serverFoods ?? INDIAN_FOOD_DATABASE;

  const filteredFoods = useMemo(() => {
    return foodsSource.filter((food) => {
      const matchesSearch =
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const caloriesRemaining = dailyGoal - totalConsumedToday;
  const progressPercent = Math.min(100, Math.round((totalConsumedToday / dailyGoal) * 100)) || 0;

  return (
    <div className="flex flex-col space-y-6 animate-fade-in relative">
      {/* Decorative Indian Rangoli Banner Card */}
      <div
        className="relative overflow-hidden p-5 rounded-3xl shadow-md border transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${theme.hexPrimary}10, ${theme.hexSecondary}15)`,
          borderColor: `${theme.hexPrimary}30`,
        }}
      >
        {/* Symmetrical Rangoli drawings nested inside the card corners */}
        <RangoliDecoration theme={theme} size={110} className="absolute -top-6 -right-6 rotate-12" />
        <RangoliDecoration theme={theme} size={90} className="absolute -bottom-8 -left-8 -rotate-45" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div
                className="p-2.5 text-white rounded-2xl shadow-md transition-all duration-300"
                style={{ backgroundColor: theme.hexPrimary }}
              >
                <Leaf className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-1">
                  Aahar Sansaar
                </h1>
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  {theme.emoji} Indian Nutri-Tracker
                </p>
              </div>
            </div>

            {/* Manual Color / Theme Rotator Shifter Button */}
            <button
              onClick={onRotateTheme}
              className="px-3 py-1.5 rounded-full text-[11px] font-bold text-white transition shadow active:scale-95 flex items-center space-x-1"
              style={{
                background: `linear-gradient(to right, ${theme.hexPrimary}, ${theme.hexSecondary})`,
              }}
              title="Change Sanskriti Color Theme"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Shift Theme</span>
            </button>
          </div>

          {/* Quick Stats Grid with Dynamic Colored Values */}
          <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-dashed" style={{ borderColor: `${theme.hexPrimary}25` }}>
            <div>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-extrabold">
                Aahar Logged
              </p>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  {totalConsumedToday}
                </span>
                <span className="text-xs text-gray-400 font-bold">/ {dailyGoal} kcal</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-extrabold">
                Remaining
              </p>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span
                  className="text-2xl font-black"
                  style={{ color: caloriesRemaining >= 0 ? theme.hexPrimary : "#e11d48" }}
                >
                  {caloriesRemaining}
                </span>
                <span className="text-xs text-gray-400 font-bold">kcal</span>
              </div>
            </div>
          </div>

          {/* Animated Custom Progress Bar */}
          <div className="w-full bg-gray-200/60 dark:bg-zinc-800/80 h-2 rounded-full mt-4 overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(to right, ${theme.hexPrimary}, ${theme.hexSecondary})`,
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-gray-400 font-bold">
              Goal Completion: {progressPercent}%
            </span>
            <span className="text-[10px] text-gray-400 font-bold italic truncate max-w-[180px]">
              {theme.description}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search roti, dal, rice, paneer, dosa..."
          className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 transition-all shadow-sm text-sm"
          style={{
            borderColor: `${theme.hexPrimary}20`,
          }}
          onFocus={(e) => (e.target.style.borderColor = theme.hexPrimary)}
          onBlur={(e) => (e.target.style.borderColor = `${theme.hexPrimary}20`)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categories Horizontal Scroller */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            Indian Cuisine Categories
          </h2>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-xs font-bold transition-colors"
              style={{ color: theme.hexPrimary }}
            >
              Reset Filters
            </button>
          )}
        </div>
        <div className="flex overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 space-x-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`flex-none px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
              selectedCategory === "All"
                ? "text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-800/80 hover:border-gray-300"
            }`}
            style={{
              backgroundColor: selectedCategory === "All" ? theme.hexPrimary : undefined,
              borderColor: selectedCategory === "All" ? theme.hexPrimary : undefined,
            }}
          >
            All Foods
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-none px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
                selectedCategory === category
                  ? "text-white shadow-sm"
                  : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-800/80 hover:border-gray-300"
              }`}
              style={{
                backgroundColor: selectedCategory === category ? theme.hexPrimary : undefined,
                borderColor: selectedCategory === category ? theme.hexPrimary : undefined,
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Foods Results List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-gray-800 dark:text-zinc-200 flex items-center space-x-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: theme.hexPrimary }}
            />
            <span>
              {selectedCategory === "All" ? "Traditional Dishes" : selectedCategory} (
              {filteredFoods.length})
            </span>
          </h3>
          <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500">Tap to log</p>
        </div>

        {filteredFoods.length > 0 ? (
          <div className="grid gap-2.5">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => onSelectFood(food)}
                className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl hover:border-transparent transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
                style={{
                  outline: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.outlineColor = `${theme.hexPrimary}50`;
                  e.currentTarget.style.backgroundColor = `${theme.hexPrimary}05`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.outlineColor = "transparent";
                  e.currentTarget.style.backgroundColor = "";
                }}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div
                    className="p-2.5 rounded-xl group-hover:scale-105 transition-transform duration-200"
                    style={{
                      backgroundColor: `${theme.hexPrimary}12`,
                      color: theme.hexPrimary,
                    }}
                  >
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {food.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs font-bold" style={{ color: theme.hexPrimary }}>
                        {food.calories} kcal
                      </span>
                      <span className="text-xs text-gray-300 dark:text-zinc-700">•</span>
                      <span className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                        Per {food.defaultServing}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className="hidden xs:inline-flex text-[10px] px-2 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: `${theme.hexSecondary}15`,
                      color: theme.hexSecondary,
                    }}
                  >
                    {food.protein}g Protein
                  </span>
                  <div
                    className="p-2 rounded-full transition-all duration-200 text-white"
                    style={{
                      backgroundColor: theme.hexPrimary,
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl">
            <Utensils className="w-8 h-8 mx-auto text-gray-300 dark:text-zinc-700 mb-2" />
            <p className="text-sm font-bold text-gray-600 dark:text-zinc-400">No foods found</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
              Try searching for other local dishes or reset category filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
