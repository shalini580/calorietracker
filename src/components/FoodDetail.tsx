import React, { useState, useMemo } from "react";
import { ArrowLeft, Plus, Minus, Scale, Flame, ShoppingBag, Sparkles } from "lucide-react";
import { FoodItem } from "../types";
import { IndianTheme } from "../utils/indianThemes";
import RangoliDecoration from "./RangoliDecoration";

interface FoodDetailProps {
  food: FoodItem;
  theme: IndianTheme;
  onBack: () => void;
  onAddLog: (food: FoodItem, quantity: number, unit: string) => void;
}

export default function FoodDetail({ food, theme, onBack, onAddLog }: FoodDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(food.defaultServing);

  // Parse default unit structure
  const units = useMemo(() => {
    const list = [food.defaultServing];
    if (!food.defaultServing.includes("g") && !food.defaultServing.includes("gram")) {
      list.push("100g");
    }
    list.push("1 serving");
    return Array.from(new Set(list)); // Deduplicate
  }, [food]);

  // Adjust calories and macros based on selected unit and quantity
  const nutritionMultiplier = useMemo(() => {
    let baseMultiplier = 1;
    if (selectedUnit === "100g") {
      const match = food.defaultServing.match(/\((\d+)g\)/);
      if (match && match[1]) {
        const grams = parseInt(match[1]);
        baseMultiplier = 100 / grams;
      } else if (food.name.toLowerCase().includes("roti") || food.name.toLowerCase().includes("chapati")) {
        baseMultiplier = 2.2;
      } else {
        baseMultiplier = 0.8;
      }
    } else if (selectedUnit === "1 serving") {
      baseMultiplier = 1;
    }
    return baseMultiplier * quantity;
  }, [selectedUnit, quantity, food]);

  const liveCalories = Math.round(food.calories * nutritionMultiplier);
  const liveProtein = parseFloat((food.protein * nutritionMultiplier).toFixed(1));
  const liveCarbs = parseFloat((food.carbs * nutritionMultiplier).toFixed(1));
  const liveFat = parseFloat((food.fat * nutritionMultiplier).toFixed(1));

  const totalMacros = liveProtein + liveCarbs + liveFat || 1;
  const proteinPercent = Math.round((liveProtein / totalMacros) * 100);
  const carbsPercent = Math.round((liveCarbs / totalMacros) * 100);
  const fatPercent = Math.round((liveFat / totalMacros) * 100);

  const increment = () => setQuantity((prev) => parseFloat((prev + 0.5).toFixed(1)));
  const decrement = () => setQuantity((prev) => (prev > 0.5 ? parseFloat((prev - 0.5).toFixed(1)) : 0.5));

  const handleAdd = () => {
    onAddLog(food, quantity, selectedUnit);
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in max-w-md mx-auto pb-8 relative">
      {/* Back Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest" style={{ color: theme.hexPrimary }}>
            {food.category}
          </span>
          <h2 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
            Configure Portion
          </h2>
        </div>
      </div>

      {/* Main Food Card */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-5 relative overflow-hidden">
        <RangoliDecoration theme={theme} size={85} className="absolute -bottom-6 -right-6 rotate-45" />
        
        <div className="relative z-10">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">{food.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Standard: {food.calories} kcal per {food.defaultServing}
          </p>
        </div>

        {/* Serving Unit Selection */}
        <div className="space-y-2 relative z-10">
          <label className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
            Unit/Serving Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {units.map((unit) => {
              const isSelected = selectedUnit === unit;
              return (
                <button
                  key={unit}
                  onClick={() => setSelectedUnit(unit)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold border text-center transition duration-300"
                  style={{
                    backgroundColor: isSelected ? `${theme.hexPrimary}12` : undefined,
                    color: isSelected ? theme.hexPrimary : undefined,
                    borderColor: isSelected ? theme.hexPrimary : "rgba(156,163,175,0.2)",
                  }}
                >
                  {unit}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-zinc-950/40 rounded-2xl border border-gray-100/60 dark:border-zinc-800/60 relative z-10">
          <div className="space-y-0.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">Quantity</span>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">Tap buttons to adjust</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={decrement}
              className="p-2 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800 transition shadow-sm active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-black text-gray-900 dark:text-white min-w-[2.5rem] text-center">
              {quantity}x
            </span>
            <button
              onClick={increment}
              className="p-2 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800 transition shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Multiplier Chips */}
        <div className="flex justify-end space-x-1.5 relative z-10">
          {[0.5, 1, 1.5, 2, 3].map((val) => {
            const isSelected = quantity === val;
            return (
              <button
                key={val}
                onClick={() => setQuantity(val)}
                className="px-3 py-1 rounded-lg text-xs font-bold border transition duration-300"
                style={{
                  backgroundColor: isSelected ? theme.hexPrimary : undefined,
                  color: isSelected ? "white" : undefined,
                  borderColor: isSelected ? theme.hexPrimary : "rgba(156,163,175,0.2)",
                }}
              >
                {val}x
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Results Card */}
      <div
        className="rounded-3xl p-5 text-white shadow-md space-y-4 transition-all duration-300 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.hexPrimary}, ${theme.hexSecondary})`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-white animate-pulse" />
            <span className="text-xs font-bold text-white/95 uppercase tracking-wider">
              Total Energy Estimate
            </span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-black flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Live
          </span>
        </div>

        <div className="flex items-baseline space-x-1 justify-center py-2">
          <span className="text-4xl font-black tracking-tight">{liveCalories}</span>
          <span className="text-sm font-bold opacity-90">kcal</span>
        </div>

        {/* Macro breakdown split */}
        <div className="space-y-3 pt-3.5 border-t border-white/10">
          <div className="flex justify-between text-[11px] text-white/90 font-bold">
            <span>Macro Breakdown</span>
            <span>Sum: {Math.round(liveProtein + liveCarbs + liveFat)}g</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Protein */}
            <div className="bg-white/10 rounded-xl p-2 text-center border border-white/5">
              <span className="block text-[9px] text-white/80 uppercase font-black tracking-wider">
                Protein
              </span>
              <span className="block text-sm font-black mt-0.5">{liveProtein}g</span>
              <span className="block text-[9px] text-white/75 mt-0.5 font-semibold">
                {proteinPercent || 0}%
              </span>
            </div>
            {/* Carbs */}
            <div className="bg-white/10 rounded-xl p-2 text-center border border-white/5">
              <span className="block text-[9px] text-white/80 uppercase font-black tracking-wider">
                Carbs
              </span>
              <span className="block text-sm font-black mt-0.5">{liveCarbs}g</span>
              <span className="block text-[9px] text-white/75 mt-0.5 font-semibold">
                {carbsPercent || 0}%
              </span>
            </div>
            {/* Fat */}
            <div className="bg-white/10 rounded-xl p-2 text-center border border-white/5">
              <span className="block text-[9px] text-white/80 uppercase font-black tracking-wider">
                Fat
              </span>
              <span className="block text-sm font-black mt-0.5">{liveFat}g</span>
              <span className="block text-[9px] text-white/75 mt-0.5 font-semibold">
                {fatPercent || 0}%
              </span>
            </div>
          </div>

          {/* Visual multi-segmented bar chart for macros */}
          <div className="h-2 w-full bg-white/20 rounded-full flex overflow-hidden mt-1">
            <div
              style={{ width: `${proteinPercent}%` }}
              className="bg-sky-300 h-full transition-all duration-300"
              title="Protein"
            />
            <div
              style={{ width: `${carbsPercent}%` }}
              className="bg-yellow-300 h-full transition-all duration-300"
              title="Carbs"
            />
            <div
              style={{ width: `${fatPercent}%` }}
              className="bg-red-400 h-full transition-all duration-300"
              title="Fat"
            />
          </div>
        </div>
      </div>

      {/* Primary Log Button */}
      <button
        onClick={handleAdd}
        className="w-full text-white font-bold py-4 px-6 rounded-2xl shadow-md transition-all duration-300 active:scale-[0.98] flex items-center justify-center space-x-2 text-base"
        style={{
          background: `linear-gradient(to right, ${theme.hexPrimary}, ${theme.hexSecondary})`,
        }}
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Add to Today's Log</span>
      </button>
    </div>
  );
}
