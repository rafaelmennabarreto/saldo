export function getColors(colorScheme: "light" | "dark" | undefined) {
  const colors = {
    dark: {
      primary: "#10b981",
      secondary: "#4f46e5",
      tertiary: "#ef4444",
      neutral0: "#fff",
      neutral400: "#94a3b8",
      neutral800: "#222a3d",
      neutral850: "#131b2e",
      neutral875: "#13333a",
      neutral900: "#0f172a",
    },
    light: {
      primary: "#10b981",
      secondary: "#4f46e5",
      tertiary: "#ef4444",
      neutral0: "#fff",
      neutral400: "#94a3b8",
      neutral800: "#222a3d",
      neutral850: "#131b2e",
      neutral875: "#13333a",
      neutral900: "#0f172a",
    },
  };

  if (!colorScheme) return colors["dark"];
  return colors[colorScheme];
}
