export const colors = {
  // Primary colors
  primary: "#007AFF",
  primaryLight: "#aacfff",

  // Background colors
  background: "#f5f5f5",
  white: "#fff",
  backgroundGray: "#f9f9f9",
  backgroundInput: "#f9f9ff",

  // Text colors
  textPrimary: "#333",
  textSecondary: "#666",
  textPlaceholder: "#999",

  // Border colors
  border: "#e0e0e0",
  borderLight: "#ccc",

  // Error colors
  error: "#ff4444",
  errorBackground: "#fff5f5",

  // Shadow colors
  shadow: "#000",
  shadowPrimary: "#007AFF",

  // Other colors
  transparent: "transparent",
  cloudflare: "#f38020",
} as const;

// Export type for TypeScript support
export type ColorKeys = keyof typeof colors;
