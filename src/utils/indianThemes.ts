export interface IndianTheme {
  id: string;
  name: string;
  emoji: string;
  primaryBg: string;         // e.g., "bg-amber-600"
  primaryText: string;       // e.g., "text-amber-600"
  primaryBorder: string;     // e.g., "border-amber-500"
  accentBg: string;          // e.g., "bg-rose-500"
  accentText: string;        // e.g., "text-rose-500"
  gradientFrom: string;      // hex or Tailwind color
  gradientTo: string;
  hexPrimary: string;        // hex values for SVG and charts
  hexSecondary: string;
  description: string;
}

export const INDIAN_THEMES: IndianTheme[] = [
  {
    id: "jaipur_marigold",
    name: "Jaipur Marigold & Gulaal",
    emoji: "🌸",
    primaryBg: "bg-pink-600",
    primaryText: "text-pink-600",
    primaryBorder: "border-pink-500",
    accentBg: "bg-amber-500",
    accentText: "text-amber-600",
    gradientFrom: "from-pink-500",
    gradientTo: "to-amber-500",
    hexPrimary: "#db2777", // pink-600
    hexSecondary: "#f59e0b", // amber-500
    description: "Inspired by Jaipur's pink palaces and festive marigold flowers.",
  },
  {
    id: "kerala_monsoon",
    name: "Kerala Monsoon Palm",
    emoji: "🌴",
    primaryBg: "bg-emerald-600",
    primaryText: "text-emerald-600",
    primaryBorder: "border-emerald-500",
    accentBg: "bg-teal-500",
    accentText: "text-teal-600",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-500",
    hexPrimary: "#059669", // emerald-600
    hexSecondary: "#0d9488", // teal-600
    description: "Verdant coconut palms and freshwater rain of beautiful Kerala.",
  },
  {
    id: "kashmiri_saffron",
    name: "Kashmiri Saffron Valley",
    emoji: "🍁",
    primaryBg: "bg-orange-600",
    primaryText: "text-orange-600",
    primaryBorder: "border-orange-500",
    accentBg: "bg-rose-600",
    accentText: "text-rose-600",
    gradientFrom: "from-orange-500",
    gradientTo: "to-rose-600",
    hexPrimary: "#ea580c", // orange-600
    hexSecondary: "#e11d48", // rose-600
    description: "Warm saffron orange fields framed by Himalayan roses.",
  },
  {
    id: "mughal_teal",
    name: "Mughal Royal Durbar",
    emoji: "🦚",
    primaryBg: "bg-teal-700",
    primaryText: "text-teal-700",
    primaryBorder: "border-teal-600",
    accentBg: "bg-yellow-500",
    accentText: "text-yellow-600",
    gradientFrom: "from-teal-700",
    gradientTo: "to-yellow-500",
    hexPrimary: "#0f766e", // teal-700
    hexSecondary: "#eab308", // yellow-500
    description: "Royal peacock teal mixed with rich golden Mughal arches.",
  },
];
