export const THEMES = [
  { value: "dark", label: "Dark Gamer", swatch: "oklch(0.68 0.2 285)" },
  { value: "light", label: "Claro", swatch: "oklch(0.95 0.01 280)" },
  { value: "neon-purple", label: "Neon Roxo", swatch: "oklch(0.7 0.26 320)" },
  { value: "neon-green", label: "Neon Verde", swatch: "oklch(0.82 0.22 150)" },
  { value: "neon-blue", label: "Neon Azul", swatch: "oklch(0.76 0.16 225)" },
] as const;

export type ThemeValue = (typeof THEMES)[number]["value"];

export const THEME_VALUES = THEMES.map((t) => t.value);
