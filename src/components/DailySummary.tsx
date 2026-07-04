import React, { useMemo } from "react";
import { Trash2, Edit2, Calendar, Coffee, Plus, Flame, Award, Apple, ArrowRight, User, Sparkles } from "lucide-react";
import { LoggedFood } from "../types";
import { IndianTheme } from "../utils/indianThemes";
import { motion } from "motion/react";
import RangoliDecoration from "./RangoliDecoration";

interface DailySummaryProps {
  loggedFoods: LoggedFood[];
  dailyGoal: number;
  theme: IndianTheme;
  onDeleteLog: (id: string) => void;
  onEditLog: (log: LoggedFood) => void;
  onNavigateToSearch: () => void;
}

export default function DailySummary({
  loggedFoods,
  dailyGoal,
  theme,
  onDeleteLog,
  onEditLog,
  onNavigateToSearch,
}: DailySummaryProps) {
  // Aggregate nutrition metrics
  const stats = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    loggedFoods.forEach((food) => {
      calories += food.calories;
      protein += food.protein;
      carbs += food.carbs;
      fat += food.fat;
    });

    return {
      calories,
      protein: parseFloat(protein.toFixed(1)),
      carbs: parseFloat(carbs.toFixed(1)),
      fat: parseFloat(fat.toFixed(1)),
    };
  }, [loggedFoods]);

  const caloriesRemaining = Math.max(0, dailyGoal - stats.calories);
  const isGoalExceeded = stats.calories > dailyGoal;
  const progressPercent = Math.min(100, Math.round((stats.calories / dailyGoal) * 100)) || 0;

  // SVG Circular progress configurations
  const radius = 64;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Guidelines goals
  const targetProtein = 80; // grams
  const targetCarbs = 200;
  const targetFat = 55;

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-8">
      {/* Profile & Date Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-3xl shadow-sm relative overflow-hidden">
        <RangoliDecoration theme={theme} size={70} className="absolute -top-4 -left-4 opacity-10" />
        
        <div className="flex items-center space-x-3.5 relative z-10">
          {/* Animated User Profile Caricature Avatar */}
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-14 h-14 rounded-full border-2 p-0.5 shadow-md overflow-hidden bg-gradient-to-tr flex-shrink-0 cursor-pointer"
            style={{
              borderColor: theme.hexPrimary,
              backgroundImage: `linear-gradient(to tr, ${theme.hexPrimary}, ${theme.hexSecondary})`,
            }}
          >
            <img
              src="/src/assets/images/indian_avatar_1782974949828.jpg"
              alt="Indian avatar caricature"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // fallback if image has issues
                e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60";
              }}
            />
            {/* Indian-inspired decorative dot (bindi/tilak accent vibe for playfulness) */}
            <div
              className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-inner animate-pulse"
              style={{ backgroundColor: theme.hexSecondary }}
            />
          </motion.div>

          <div>
            <h2 className="text-sm font-extrabold text-gray-900 dark:text-white leading-tight flex items-center gap-1">
              <span>Namaste, Swasthya!</span>
              <span className="animate-wiggle">👋</span>
            </h2>
            <p className="text-xs text-gray-400 font-bold mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToSearch}
          className="inline-flex items-center space-x-1.5 px-3 py-2 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95 z-10"
          style={{
            background: `linear-gradient(to right, ${theme.hexPrimary}, ${theme.hexSecondary})`,
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Food</span>
        </button>
      </div>

      {/* Progress Circular Card */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm relative overflow-hidden">
        <RangoliDecoration theme={theme} size={95} className="absolute -bottom-6 -right-6 opacity-15 rotate-12" />
        
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 relative z-10">
          {/* Circular Progress Ring */}
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke={theme.hexPrimary + "15"}
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="url(#circular-gradient)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="circular-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.hexPrimary} />
                  <stop offset="100%" stopColor={theme.hexSecondary} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                {stats.calories}
              </span>
              <span className="text-[9px] uppercase font-bold text-gray-400 dark:text-zinc-500 tracking-wider mt-1">
                kcal logged
              </span>
            </div>
          </div>

          {/* Calorie Progress Details */}
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 bg-gray-50 dark:bg-zinc-950/40 rounded-2xl border border-gray-100/60 dark:border-zinc-800/60">
                <span className="block text-[9px] text-gray-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest">
                  Daily Limit
                </span>
                <span className="block text-base font-black text-gray-800 dark:text-zinc-200 mt-0.5">
                  {dailyGoal} kcal
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-zinc-950/40 rounded-2xl border border-gray-100/60 dark:border-zinc-800/60">
                <span className="block text-[9px] text-gray-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest">
                  {isGoalExceeded ? "Exceeded By" : "Balance Left"}
                </span>
                <span
                  className="block text-base font-black mt-0.5"
                  style={{ color: isGoalExceeded ? "#e11d48" : theme.hexPrimary }}
                >
                  {isGoalExceeded ? Math.abs(dailyGoal - stats.calories) : caloriesRemaining} kcal
                </span>
              </div>
            </div>

            {progressPercent >= 100 ? (
              <div
                className="flex items-center space-x-2 text-xs p-3 rounded-xl border border-dashed font-bold"
                style={{
                  backgroundColor: `${theme.hexSecondary}12`,
                  borderColor: `${theme.hexSecondary}40`,
                  color: theme.hexSecondary,
                }}
              >
                <Award className="w-4 h-4 flex-shrink-0 animate-bounce" />
                <span>Calorie target filled! Mind your macro portions.</span>
              </div>
            ) : (
              <div
                className="flex items-center space-x-2 text-xs p-3 rounded-xl border border-dashed font-bold"
                style={{
                  backgroundColor: `${theme.hexPrimary}12`,
                  borderColor: `${theme.hexPrimary}40`,
                  color: theme.hexPrimary,
                }}
              >
                <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse" />
                <span>Wonderful! Logged {progressPercent}% of your optimal energy.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Macro Summary Split */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-gray-800 dark:text-zinc-200">
          Daily Macro Split
        </h3>

        {/* Triple Segment Bar */}
        <div className="space-y-4">
          <div className="h-3 w-full bg-gray-100/80 dark:bg-zinc-800/60 rounded-full flex overflow-hidden">
            {stats.protein > 0 && (
              <div
                style={{
                  width: `${Math.round(
                    (stats.protein / (stats.protein + stats.carbs + stats.fat || 1)) * 100
                  )}%`,
                  backgroundColor: theme.hexPrimary,
                }}
                className="h-full transition-all duration-300"
                title="Protein"
              />
            )}
            {stats.carbs > 0 && (
              <div
                style={{
                  width: `${Math.round(
                    (stats.carbs / (stats.protein + stats.carbs + stats.fat || 1)) * 100
                  )}%`,
                  backgroundColor: theme.hexSecondary,
                }}
                className="h-full opacity-80 transition-all duration-300"
                title="Carbohydrates"
              />
            )}
            {stats.fat > 0 && (
              <div
                style={{
                  width: `${Math.round(
                    (stats.fat / (stats.protein + stats.carbs + stats.fat || 1)) * 100
                  )}%`,
                }}
                className="bg-red-400 h-full transition-all duration-300"
                title="Fats"
              />
            )}
          </div>

          {/* Macro Breakdowns with absolute vs goals */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-100/60 dark:border-zinc-800/60">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.hexPrimary }} />
                <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider">
                  Protein
                </span>
              </div>
              <p className="text-sm font-black text-gray-800 dark:text-zinc-200 mt-1">
                {stats.protein}g <span className="text-[10px] text-gray-400 font-bold">/ {targetProtein}g</span>
              </p>
              <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: theme.hexPrimary,
                    width: `${Math.min(100, Math.round((stats.protein / targetProtein) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-100/60 dark:border-zinc-800/60">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.hexSecondary }} />
                <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider">
                  Carbs
                </span>
              </div>
              <p className="text-sm font-black text-gray-800 dark:text-zinc-200 mt-1">
                {stats.carbs}g <span className="text-[10px] text-gray-400 font-bold">/ {targetCarbs}g</span>
              </p>
              <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full opacity-80"
                  style={{
                    backgroundColor: theme.hexSecondary,
                    width: `${Math.min(100, Math.round((stats.carbs / targetCarbs) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-100/60 dark:border-zinc-800/60">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider">
                  Fat
                </span>
              </div>
              <p className="text-sm font-black text-gray-800 dark:text-zinc-200 mt-1">
                {stats.fat}g <span className="text-[10px] text-gray-400 font-bold">/ {targetFat}g</span>
              </p>
              <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-red-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.round((stats.fat / targetFat) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Logged Items */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-gray-800 dark:text-zinc-200">
          Meal Items Logged ({loggedFoods.length})
        </h3>

        {loggedFoods.length > 0 ? (
          <div className="grid gap-2.5">
            {loggedFoods.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className="p-2.5 rounded-xl flex-shrink-0"
                    style={{
                      backgroundColor: `${theme.hexPrimary}12`,
                      color: theme.hexPrimary,
                    }}
                  >
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {log.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {log.quantity}x {log.servingSize} •{" "}
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="text-right">
                    <span className="block text-sm font-black text-gray-900 dark:text-white">
                      {log.calories}
                    </span>
                    <span className="block text-[9px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-black">
                      kcal
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 border-l border-gray-100 dark:border-zinc-800 pl-3">
                    <button
                      onClick={() => onEditLog(log)}
                      className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition"
                      title="Edit Log"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                      title="Delete Log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-3xl">
            <Apple className="w-10 h-10 mx-auto text-gray-300 dark:text-zinc-700 mb-3 animate-bounce" />
            <p className="text-sm font-extrabold text-gray-700 dark:text-zinc-300">
              Your calorie book is empty
            </p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 max-w-[200px] mx-auto">
              Start searching and tracking your local meals to fill up your progress ring!
            </p>
            <button
              onClick={onNavigateToSearch}
              className="mt-4 inline-flex items-center space-x-1.5 text-xs font-bold hover:underline"
              style={{ color: theme.hexPrimary }}
            >
              <span>Explore Indian foods</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
