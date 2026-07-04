import React from "react";
import { Search, Calendar, BarChart2, User, Moon, Sun } from "lucide-react";
import { ActiveTab } from "../types";
import { IndianTheme } from "../utils/indianThemes";

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  systemTheme: "light" | "dark";
  indianTheme: IndianTheme;
  onToggleTheme: () => void;
}

export default function BottomNav({
  activeTab,
  onTabChange,
  systemTheme,
  indianTheme,
  onToggleTheme,
}: BottomNavProps) {
  const navItems = [
    { id: "home" as ActiveTab, label: "Search", icon: Search },
    { id: "summary" as ActiveTab, label: "Summary", icon: Calendar },
    { id: "analytics" as ActiveTab, label: "Weight", icon: BarChart2 },
    { id: "profile" as ActiveTab, label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-gray-100 dark:border-zinc-900 shadow-xl px-4 py-2.5 max-w-md mx-auto rounded-t-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center justify-center p-1.5 min-w-[3.5rem] transition-all group focus:outline-none"
            >
              {/* Dynamic indicator dot/pill on top */}
              {isActive && (
                <span
                  className="absolute -top-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: indianTheme.hexPrimary }}
                />
              )}

              <div
                className={`p-1 rounded-xl transition ${
                  isActive ? "scale-105" : "text-gray-400 group-hover:text-gray-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                }`}
                style={{
                  color: isActive ? indianTheme.hexPrimary : undefined,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[9.5px] font-black mt-0.5 tracking-wide transition`}
                style={{
                  color: isActive ? indianTheme.hexPrimary : "rgba(156,163,175,1)",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Quick Dark Mode settings icon on navigation bar itself as requested! */}
        <button
          onClick={onToggleTheme}
          className="flex flex-col items-center justify-center p-1.5 min-w-[3rem] text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition focus:outline-none"
          title="Toggle Night Theme"
        >
          <div className="p-1 rounded-xl">
            {systemTheme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-500" />
            )}
          </div>
          <span className="text-[9.5px] font-black mt-0.5 tracking-wide text-gray-400 dark:text-zinc-500">
            Night Mode
          </span>
        </button>
      </div>
    </div>
  );
}
