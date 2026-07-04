import React, { useState, useMemo } from "react";
import { Plus, Trash2, Calendar, Scale, Percent, Filter, Activity } from "lucide-react";
import { WeightLog } from "../types";
import { IndianTheme } from "../utils/indianThemes";
import RangoliDecoration from "./RangoliDecoration";

interface WeightAnalyticsProps {
  weightLogs: WeightLog[];
  theme: IndianTheme;
  onAddWeightLog: (weight: number, bodyFat?: number, date?: string) => void;
  onDeleteWeightLog: (id: string) => void;
}

type DateRange = "7d" | "30d" | "90d" | "all";
type ActiveMetric = "weight" | "bodyFat";

export default function WeightAnalytics({
  weightLogs,
  theme,
  onAddWeightLog,
  onDeleteWeightLog,
}: WeightAnalyticsProps) {
  const [weightInput, setWeightInput] = useState("");
  const [bodyFatInput, setBodyFatInput] = useState("");
  const [dateInput, setDateInput] = useState(new Date().toISOString().split("T")[0]);
  const [selectedRange, setSelectedRange] = useState<DateRange>("30d");
  const [activeMetric, setActiveMetric] = useState<ActiveMetric>("weight");

  // State for interactive tooltip hover/focus
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Filter logs based on range selection
  const filteredLogs = useMemo(() => {
    const sorted = [...weightLogs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (selectedRange === "all") return sorted;

    const limitDate = new Date();
    if (selectedRange === "7d") {
      limitDate.setDate(limitDate.getDate() - 7);
    } else if (selectedRange === "30d") {
      limitDate.setDate(limitDate.getDate() - 30);
    } else if (selectedRange === "90d") {
      limitDate.setDate(limitDate.getDate() - 90);
    }

    return sorted.filter((log) => new Date(log.date).getTime() >= limitDate.getTime());
  }, [weightLogs, selectedRange]);

  // Calculations for stats summary
  const analyticsSummary = useMemo(() => {
    if (filteredLogs.length === 0) return { current: 0, start: 0, diff: 0, min: 0, max: 0, avg: 0 };

    const weights = filteredLogs.map((l) => l.weight);
    const bodyFats = filteredLogs.map((l) => l.bodyFat).filter((bf): bf is number => bf !== undefined);

    const values = activeMetric === "weight" ? weights : bodyFats;

    if (values.length === 0) return { current: 0, start: 0, diff: 0, min: 0, max: 0, avg: 0 };

    const current = values[values.length - 1];
    const start = values[0];
    const diff = parseFloat((current - start).toFixed(1));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));

    return { current, start, diff, min, max, avg };
  }, [filteredLogs, activeMetric]);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weightInput);
    if (isNaN(parsedWeight) || parsedWeight <= 0) return;

    const parsedBodyFat = bodyFatInput ? parseFloat(bodyFatInput) : undefined;
    onAddWeightLog(parsedWeight, parsedBodyFat, dateInput);

    // Clear inputs except date
    setWeightInput("");
    setBodyFatInput("");
  };

  // Custom SVG Chart Builder
  const chartHeight = 220;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 30;

  const chartPathsAndPoints = useMemo(() => {
    if (filteredLogs.length < 2) return null;

    const activePoints = filteredLogs
      .map((log, index) => {
        const val = activeMetric === "weight" ? log.weight : log.bodyFat;
        return { log, val, originalIndex: index };
      })
      .filter((pt): pt is { log: WeightLog; val: number; originalIndex: number } => pt.val !== undefined && pt.val > 0);

    if (activePoints.length === 0) return null;

    const values = activePoints.map((pt) => pt.val);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const valRange = maxVal - minVal || 10;

    const yMin = Math.max(0, minVal - valRange * 0.15);
    const yMax = maxVal + valRange * 0.15;
    const yRange = yMax - yMin;

    const points = activePoints.map((pt, i) => {
      const x = paddingX + (i / (activePoints.length - 1)) * (chartWidth - paddingX * 2);
      const y = chartHeight - paddingY - ((pt.val - yMin) / yRange) * (chartHeight - paddingY * 2);

      const dateObj = new Date(pt.log.date);
      const label = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

      return {
        x,
        y,
        val: pt.val,
        label,
        date: pt.log.date,
        id: pt.log.id,
        originalIndex: pt.originalIndex,
      };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }

    const areaD = `${d} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${
      chartHeight - paddingY
    } Z`;

    return { points, linePath: d, areaPath: areaD, yMin, yMax };
  }, [filteredLogs, activeMetric]);

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-8">
      {/* Analytics Main Header */}
      <div className="flex items-center space-x-2.5">
        <div
          className="p-2.5 rounded-xl text-white"
          style={{ backgroundColor: theme.hexPrimary }}
        >
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-black text-gray-900 dark:text-white leading-tight">
            Analytics & Trends
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Track weight & body fat progress</p>
        </div>
      </div>

      {/* Metric Selector & Range Filters */}
      <div className="flex flex-col gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        {/* Metric selection tabs */}
        <div className="flex space-x-1.5 bg-gray-100 dark:bg-zinc-950/40 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveMetric("weight");
              setHoveredPointIndex(null);
            }}
            className="flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg text-xs font-bold transition duration-300"
            style={{
              backgroundColor: activeMetric === "weight" ? theme.hexPrimary : undefined,
              color: activeMetric === "weight" ? "white" : undefined,
            }}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Weight (kg)</span>
          </button>
          <button
            onClick={() => {
              setActiveMetric("bodyFat");
              setHoveredPointIndex(null);
            }}
            className="flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg text-xs font-bold transition duration-300"
            style={{
              backgroundColor: activeMetric === "bodyFat" ? theme.hexPrimary : undefined,
              color: activeMetric === "bodyFat" ? "white" : undefined,
            }}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Body Fat %</span>
          </button>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex space-x-1 items-center justify-between pt-1 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400">Range</span>
          </div>
          <div className="flex space-x-1">
            {(["7d", "30d", "90d", "all"] as DateRange[]).map((range) => {
              const isSelected = selectedRange === range;
              return (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedRange(range);
                    setHoveredPointIndex(null);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-300"
                  style={{
                    backgroundColor: isSelected ? `${theme.hexPrimary}15` : undefined,
                    color: isSelected ? theme.hexPrimary : undefined,
                  }}
                >
                  {range === "all" ? "All" : range}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm relative overflow-hidden">
        <RangoliDecoration theme={theme} size={90} className="absolute -top-6 -right-6 rotate-45" />

        <div className="relative z-10 flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            {activeMetric === "weight" ? "Weight Progression" : "Body Fat Progression"}
          </h3>
          <span className="text-[10px] text-gray-400 font-bold italic">
            Tap dots for values
          </span>
        </div>

        {chartPathsAndPoints ? (
          <div className="relative z-10">
            {/* SVG Chart */}
            <div className="w-full overflow-x-auto scrollbar-none">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[420px]">
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = paddingY + ratio * (chartHeight - paddingY * 2);
                  const val =
                    chartPathsAndPoints.yMax -
                    ratio * (chartPathsAndPoints.yMax - chartPathsAndPoints.yMin);
                  return (
                    <g key={idx}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="rgba(243, 244, 246, 0.6)"
                        className="dark:stroke-zinc-800/40"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="9.5"
                        fontWeight="bold"
                        className="fill-gray-400 dark:fill-zinc-600 font-mono"
                      >
                        {val.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area Below Line */}
                <path
                  d={chartPathsAndPoints.areaPath}
                  fill={`url(#areaGrad-${theme.id})`}
                  opacity="0.18"
                />

                {/* Line Path */}
                <path
                  d={chartPathsAndPoints.linePath}
                  fill="none"
                  stroke={theme.hexPrimary}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Definitions for gradients */}
                <defs>
                  <linearGradient id={`areaGrad-${theme.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.hexPrimary} />
                    <stop offset="100%" stopColor={theme.hexSecondary} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Interactive Points / Dots */}
                {chartPathsAndPoints.points.map((pt, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g key={idx}>
                      {/* Vertical line helper on hover */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1={paddingY}
                          x2={pt.x}
                          y2={chartHeight - paddingY}
                          stroke={theme.hexPrimary}
                          strokeOpacity="0.4"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Larger invisible hover target */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="16"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onClick={() => setHoveredPointIndex(idx)}
                      />

                      {/* Visible interactive Dot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? "6.5" : "5"}
                        fill={isHovered ? "white" : theme.hexPrimary}
                        stroke={isHovered ? theme.hexPrimary : "white"}
                        strokeWidth="3"
                        className="transition-all duration-150 cursor-pointer shadow-sm"
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onClick={() => setHoveredPointIndex(idx)}
                      />

                      {/* Date Axis Label */}
                      {(idx === 0 ||
                        idx === chartPathsAndPoints.points.length - 1 ||
                        idx === Math.floor(chartPathsAndPoints.points.length / 2)) && (
                        <text
                          x={pt.x}
                          y={chartHeight - paddingY + 16}
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="bold"
                          className="fill-gray-400 dark:fill-zinc-500 font-mono"
                        >
                          {pt.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Float Tooltip Details based on Hovered Point */}
            <div className="mt-4 p-3 bg-gray-50/50 dark:bg-zinc-950/30 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 text-center">
              {hoveredPointIndex !== null && chartPathsAndPoints.points[hoveredPointIndex] ? (
                <div>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    Record of {new Date(chartPathsAndPoints.points[hoveredPointIndex].date).toLocaleDateString("en-IN", { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-base font-black mt-1" style={{ color: theme.hexPrimary }}>
                    {chartPathsAndPoints.points[hoveredPointIndex].val} {activeMetric === "weight" ? "kg" : "%"}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 font-bold italic">
                  Tap any dot on the chart line to inspect specific values.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-14 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-3xl relative z-10">
            <Scale className="w-10 h-10 mx-auto text-gray-300 dark:text-zinc-700 mb-3" />
            <p className="text-sm font-bold text-gray-700 dark:text-zinc-300">Not enough records yet</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 max-w-[280px] mx-auto">
              Please log at least 2 measurements in this date range to visualize trends.
            </p>
          </div>
        )}
      </div>

      {/* Analytics Summary Stats Banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm text-center">
          <span className="block text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold tracking-wider">
            Current
          </span>
          <span className="block text-base font-bold text-gray-800 dark:text-zinc-200 mt-1">
            {analyticsSummary.current} {activeMetric === "weight" ? "kg" : "%"}
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm text-center">
          <span className="block text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold tracking-wider">
            Change
          </span>
          <span
            className="block text-base font-bold mt-1"
            style={{
              color:
                analyticsSummary.diff < 0
                  ? "#10b981"
                  : analyticsSummary.diff > 0
                  ? "#ea580c"
                  : undefined,
            }}
          >
            {analyticsSummary.diff > 0 ? `+${analyticsSummary.diff}` : analyticsSummary.diff}{" "}
            {activeMetric === "weight" ? "kg" : "%"}
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm text-center">
          <span className="block text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold tracking-wider">
            Average
          </span>
          <span className="block text-base font-bold text-gray-800 dark:text-zinc-200 mt-1">
            {analyticsSummary.avg} {activeMetric === "weight" ? "kg" : "%"}
          </span>
        </div>
      </div>

      {/* Log New Measurement Panel */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
        <h3 className="text-sm font-extrabold text-gray-800 dark:text-zinc-200 mb-4 flex items-center space-x-1.5">
          <Plus className="w-4 h-4" style={{ color: theme.hexPrimary }} />
          <span>Log Weight & Body Fat</span>
        </h3>

        <form onSubmit={handleLogSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-400">Weight (kg) *</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="e.g. 72.5"
                  className="block w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 text-gray-950 dark:text-white border border-gray-100 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-sm"
                  style={{
                    borderColor: `${theme.hexPrimary}20`,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = theme.hexPrimary)}
                  onBlur={(e) => (e.target.style.borderColor = `${theme.hexPrimary}20`)}
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold font-mono">kg</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-zinc-400">Body Fat %</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={bodyFatInput}
                  onChange={(e) => setBodyFatInput(e.target.value)}
                  placeholder="e.g. 18.5"
                  className="block w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 text-gray-950 dark:text-white border border-gray-100 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-sm"
                  style={{
                    borderColor: `${theme.hexPrimary}20`,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = theme.hexPrimary)}
                  onBlur={(e) => (e.target.style.borderColor = `${theme.hexPrimary}20`)}
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold font-mono">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-zinc-400">Measurement Date</label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="block w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 text-gray-950 dark:text-white border border-gray-100 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-sm font-mono"
              style={{
                borderColor: `${theme.hexPrimary}20`,
              }}
              onFocus={(e) => (e.target.style.borderColor = theme.hexPrimary)}
              onBlur={(e) => (e.target.style.borderColor = `${theme.hexPrimary}20`)}
            />
          </div>

          <button
            type="submit"
            className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-300 active:scale-[0.99] flex items-center justify-center space-x-2 text-sm"
            style={{
              background: `linear-gradient(to right, ${theme.hexPrimary}, ${theme.hexSecondary})`,
            }}
          >
            <Scale className="w-4 h-4" />
            <span>Save Measurement</span>
          </button>
        </form>
      </div>

      {/* History log entries panel with delete option */}
      {weightLogs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-gray-800 dark:text-zinc-200">
            Measurement History ({weightLogs.length})
          </h3>
          <div className="max-h-[220px] overflow-y-auto scrollbar-thin space-y-2">
            {[...weightLogs]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-xl shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2.5 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: `${theme.hexPrimary}12`,
                        color: theme.hexPrimary,
                      }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-zinc-300">
                        {new Date(log.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">
                        {log.bodyFat !== undefined
                          ? `Body Fat: ${log.bodyFat}%`
                          : "No body fat recorded"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {log.weight} kg
                    </span>
                    <button
                      onClick={() => onDeleteWeightLog(log.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
