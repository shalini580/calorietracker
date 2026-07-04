import React from "react";
import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";

import {
  FoodItem,
  LoggedFood,
  WeightLog,
  UserSettings,
  ActiveTab,
} from "./types";
import HomeSearch from "./components/HomeSearch";
import FoodDetail from "./components/FoodDetail";
import DailySummary from "./components/DailySummary";
import WeightAnalytics from "./components/WeightAnalytics";
import ProfileSettings from "./components/ProfileSettings";
import BottomNav from "./components/BottomNav";
import { X, Sparkles, RefreshCw } from "lucide-react";
import { INDIAN_THEMES } from "./utils/indianThemes";

// Pre-populate some historical dummy logs to show beautiful charts & summary instantly on first render
const DEFAULT_WEIGHT_LOGS: WeightLog[] = [
  { id: "w1", date: "2026-06-25", weight: 75.2, bodyFat: 19.8 },
  { id: "w2", date: "2026-06-26", weight: 74.8, bodyFat: 19.5 },
  { id: "w3", date: "2026-06-27", weight: 74.5, bodyFat: 19.3 },
  { id: "w4", date: "2026-06-28", weight: 74.1, bodyFat: 19.0 },
  { id: "w5", date: "2026-06-29", weight: 74.3, bodyFat: 19.1 },
  { id: "w6", date: "2026-06-30", weight: 73.8, bodyFat: 18.7 },
  { id: "w7", date: "2026-07-01", weight: 73.5, bodyFat: 18.5 },
];

const DEFAULT_LOGGED_FOODS: LoggedFood[] = [
  {
    id: "lf1",
    foodId: "roti_1",
    name: "Phulka / Chapati (Plain, no ghee)",
    calories: 140, // 2x 70 calories
    protein: 5.2,
    carbs: 30,
    fat: 0.8,
    servingSize: "1 medium",
    quantity: 2,
    timestamp: new Date(new Date().setHours(8, 30, 0)).toISOString(),
  },
  {
    id: "lf2",
    foodId: "dal_1",
    name: "Dal Tadka (Yellow Dal)",
    calories: 180, // 1.5x 120 calories
    protein: 10.5,
    carbs: 27,
    fat: 3.8,
    servingSize: "1 bowl (150ml)",
    quantity: 1.5,
    timestamp: new Date(new Date().setHours(13, 15, 0)).toISOString(),
  },
];

const DEFAULT_SETTINGS: UserSettings = {
  gender: "male",
  weight: 73.5,
  height: 172,
  age: 26,
  activityLevel: "moderate",
  dailyCalorieGoal: 1950,
  notificationsEnabled: true,
  theme: "light",
  isCloudSynced: true,
  lastBackupTime: new Date(new Date().getTime() - 600000).toISOString(), // 10 mins ago
};

export default function App() {
  const [isAuthed, setIsAuthed] = React.useState<boolean>(() => {
    const saved = localStorage.getItem("indian_calorie_auth");
    return !!saved;
  });

  const handleLogout = () => {
    localStorage.removeItem("indian_calorie_auth");
    setIsAuthed(false);
  };

  // Navigation states
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  
  // Sanskriti Dynamic Theme State (0 to 3 index)
  const [themeIndex, setThemeIndex] = useState<number>(() => {
    const saved = localStorage.getItem("indian_calorie_theme_idx");
    return saved ? parseInt(saved, 10) : 0;
  });

  const activeTheme = INDIAN_THEMES[themeIndex];

  // Helper to rotate to next Indian Theme (triggered manually or automatically with every database change)
  const rotateTheme = () => {
    setThemeIndex((prev) => {
      const next = (prev + 1) % INDIAN_THEMES.length;
      localStorage.setItem("indian_calorie_theme_idx", next.toString());
      return next;
    });
  };

  // App core states loaded from localStorage or falling back to defaults
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("indian_calorie_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>(() => {
    const saved = localStorage.getItem("indian_calorie_foods_log");
    return saved ? JSON.parse(saved) : DEFAULT_LOGGED_FOODS;
  });

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(() => {
    const saved = localStorage.getItem("indian_calorie_weight_log");
    return saved ? JSON.parse(saved) : DEFAULT_WEIGHT_LOGS;
  });

  // Selected food for detailed add/edit panel
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  
  // Local state for editing an existing logged item
  const [editingLogItem, setEditingLogItem] = useState<LoggedFood | null>(null);

  // Loading spinner for Cloud backup simulation
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Synchronize layout with visual theme mode class
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.theme]);

  // Persist states offline on modifications
  useEffect(() => {
    localStorage.setItem("indian_calorie_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("indian_calorie_foods_log", JSON.stringify(loggedFoods));
  }, [loggedFoods]);

  useEffect(() => {
    localStorage.setItem("indian_calorie_weight_log", JSON.stringify(weightLogs));
  }, [weightLogs]);

  // Sum total calories logged today
  const totalCaloriesToday = loggedFoods.reduce((acc, f) => acc + f.calories, 0);

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      isCloudSynced: false, // Mark unsynced on change
    }));
  };

  // Add food log handler
  const handleAddFoodLog = (food: FoodItem, quantity: number, unit: string) => {
    // Check if we are editing an existing item or creating a new one
    if (editingLogItem) {
      let baseMultiplier = 1;
      if (unit === "100g") {
        const match = food.defaultServing.match(/\((\d+)g\)/);
        if (match && match[1]) {
          baseMultiplier = 100 / parseInt(match[1]);
        } else if (food.name.toLowerCase().includes("roti") || food.name.toLowerCase().includes("chapati")) {
          baseMultiplier = 2.2;
        } else {
          baseMultiplier = 0.8;
        }
      }

      const mult = baseMultiplier * quantity;

      setLoggedFoods((prev) =>
        prev.map((log) =>
          log.id === editingLogItem.id
            ? {
                ...log,
                quantity,
                servingSize: unit,
                calories: Math.round(food.calories * mult),
                protein: parseFloat((food.protein * mult).toFixed(1)),
                carbs: parseFloat((food.carbs * mult).toFixed(1)),
                fat: parseFloat((food.fat * mult).toFixed(1)),
              }
            : log
        )
      );

      setEditingLogItem(null);
      setSyncNotice("Meal log entry modified successfully!");
    } else {
      let baseMultiplier = 1;
      if (unit === "100g") {
        const match = food.defaultServing.match(/\((\d+)g\)/);
        if (match && match[1]) {
          baseMultiplier = 100 / parseInt(match[1]);
        } else if (food.name.toLowerCase().includes("roti") || food.name.toLowerCase().includes("chapati")) {
          baseMultiplier = 2.2;
        } else {
          baseMultiplier = 0.8;
        }
      }

      const mult = baseMultiplier * quantity;

      const newLog: LoggedFood = {
        id: "log_" + Date.now(),
        foodId: food.id,
        name: food.name,
        calories: Math.round(food.calories * mult),
        protein: parseFloat((food.protein * mult).toFixed(1)),
        carbs: parseFloat((food.carbs * mult).toFixed(1)),
        fat: parseFloat((food.fat * mult).toFixed(1)),
        servingSize: unit,
        quantity,
        timestamp: new Date().toISOString(),
      };

      setLoggedFoods((prev) => [newLog, ...prev]);
      setSyncNotice(`Successfully logged ${food.name}!`);
    }

    // Automatically rotate theme index on database additions as requested! ("changes color with every new change")
    rotateTheme();

    setSettings((prev) => ({ ...prev, isCloudSynced: false }));
    setSelectedFood(null);
    setActiveTab("summary"); // Transition to view summary

    setTimeout(() => setSyncNotice(null), 3000);
  };

  // Delete logged food
  const handleDeleteFoodLog = (id: string) => {
    setLoggedFoods((prev) => prev.filter((log) => log.id !== id));
    setSettings((prev) => ({ ...prev, isCloudSynced: false }));
    setSyncNotice("Meal log entry removed.");
    
    // Automatically rotate color theme index on deletes! ("changes color with every new change")
    rotateTheme();

    setTimeout(() => setSyncNotice(null), 3000);
  };

  // Edit logged food trigger
  const handleEditFoodLogTrigger = (log: LoggedFood) => {
    const originalFood: FoodItem = {
      id: log.foodId,
      name: log.name,
      calories: Math.round(log.calories / log.quantity),
      protein: parseFloat((log.protein / log.quantity).toFixed(1)),
      carbs: parseFloat((log.carbs / log.quantity).toFixed(1)),
      fat: parseFloat((log.fat / log.quantity).toFixed(1)),
      defaultServing: log.servingSize,
      category: "Snacks",
    };

    setEditingLogItem(log);
    setSelectedFood(originalFood);
  };

  // Add physical metric log (weight/body fat)
  const handleAddWeightLog = (weight: number, bodyFat?: number, date?: string) => {
    const formattedDate = date || new Date().toISOString().split("T")[0];
    
    setWeightLogs((prev) => {
      const existingIdx = prev.findIndex((log) => log.date === formattedDate);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          weight,
          bodyFat: bodyFat !== undefined ? bodyFat : updated[existingIdx].bodyFat,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: "wl_" + Date.now(),
            date: formattedDate,
            weight,
            bodyFat,
          },
        ];
      }
    });

    setSettings((prev) => ({
      ...prev,
      weight,
      isCloudSynced: false,
    }));

    // Rotate theme index on weight tracking changes as well! ("changes color with every new change")
    rotateTheme();

    setSyncNotice("Physical measurements saved successfully!");
    setTimeout(() => setSyncNotice(null), 3000);
  };

  // Delete physical metric log
  const handleDeleteWeightLog = (id: string) => {
    setWeightLogs((prev) => prev.filter((log) => log.id !== id));
    setSettings((prev) => ({ ...prev, isCloudSynced: false }));
    setSyncNotice("Measurement log deleted.");
    
    // Rotate theme index on deletion changes!
    rotateTheme();

    setTimeout(() => setSyncNotice(null), 3000);
  };

  // Trigger high fidelity Cloud sync backup simulation
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncNotice("Syncing: Connecting to secure backup servers...");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSettings((prev) => ({
      ...prev,
      isCloudSynced: true,
      lastBackupTime: new Date().toISOString(),
    }));

    setIsSyncing(false);
    setSyncNotice("Cloud Synchronization Successful! Backup secure.");
    
    // Rotate theme index to visually celebrate the sync!
    rotateTheme();

    setTimeout(() => setSyncNotice(null), 4000);
  };

  if (!isAuthed) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setIsAuthed(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Centered Mobile Shell Frame (Beautifully framed layout) */}
      <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 min-h-screen relative flex flex-col shadow-2xl border-x border-gray-100 dark:border-zinc-800 pb-24">
        
        {/* Sync / Alert Toast Notice banner */}
        {syncNotice && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-zinc-800 dark:border-zinc-100 animate-slide-up">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: activeTheme.hexSecondary }} />
              <span className="text-xs font-bold leading-snug">{syncNotice}</span>
            </div>
            <button 
              onClick={() => setSyncNotice(null)}
              className="p-1 text-gray-400 hover:text-white dark:text-zinc-500 dark:hover:text-zinc-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Global Floating Header (For quick statistics or settings toggles) */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur px-5 py-3.5 border-b border-gray-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => { setActiveTab("home"); setSelectedFood(null); }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: activeTheme.hexPrimary }}
            />
            <span className="text-sm font-black tracking-wider">
              Aahar<span style={{ color: activeTheme.hexPrimary }}>Sutra</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Sync State indicator icon */}
            <button 
              onClick={handleTriggerSync}
              className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/60 transition"
              title={settings.isCloudSynced ? "Data backed up to cloud" : "Sync required"}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} style={{ color: isSyncing ? activeTheme.hexPrimary : settings.isCloudSynced ? activeTheme.hexPrimary : "#f59e0b" }} />
            </button>

            {/* Quick manual color theme spin icon */}
            <button
              onClick={rotateTheme}
              className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/60 transition flex items-center justify-center"
              title="Shift Color Palette"
            >
              <span className="text-xs animate-pulse">{activeTheme.emoji}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Screen/Container Outlet */}
        <main className="flex-1 px-5 pt-5 overflow-y-auto">
          {selectedFood ? (
            <FoodDetail
              food={selectedFood}
              theme={activeTheme}
              onBack={() => {
                setSelectedFood(null);
                setEditingLogItem(null);
              }}
              onAddLog={handleAddFoodLog}
            />
          ) : (
            <>
              {activeTab === "home" && (
                <HomeSearch
                  onSelectFood={(food) => setSelectedFood(food)}
                  dailyGoal={settings.dailyCalorieGoal}
                  totalConsumedToday={totalCaloriesToday}
                  theme={activeTheme}
                  onRotateTheme={rotateTheme}
                />
              )}

              {activeTab === "summary" && (
                <DailySummary
                  loggedFoods={loggedFoods}
                  dailyGoal={settings.dailyCalorieGoal}
                  theme={activeTheme}
                  onDeleteLog={handleDeleteFoodLog}
                  onEditLog={handleEditFoodLogTrigger}
                  onNavigateToSearch={() => setActiveTab("home")}
                />
              )}

              {activeTab === "analytics" && (
                <WeightAnalytics
                  weightLogs={weightLogs}
                  theme={activeTheme}
                  onAddWeightLog={handleAddWeightLog}
                  onDeleteWeightLog={handleDeleteWeightLog}
                />
              )}

              {activeTab === "profile" && (
                <ProfileSettings
                  settings={settings}
                  theme={activeTheme}
                  onUpdateSettings={handleUpdateSettings}
                  onTriggerSync={handleTriggerSync}
                  isSyncing={isSyncing}
                />
              )}
            </>
          )}
        </main>

        {/* Global Floating Bottom Nav Bar */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedFood(null); // Clear active item config when switching tabs
          }}
          systemTheme={settings.theme}
          indianTheme={activeTheme}
          onToggleTheme={() => handleUpdateSettings({ theme: settings.theme === "dark" ? "light" : "dark" })}
        />

      </div>
    </div>
  );
}
