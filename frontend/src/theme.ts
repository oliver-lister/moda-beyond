import { createTheme } from "@mantine/core";

// Overriding orignal Mantine theme
export const theme = createTheme({
  primaryColor: "violet",
  fontFamily: "Figtree, sans-serif",
  breakpoints: {
    xs: "28em",
    sm: "40em",
    md: "48em",
    lg: "68em",
    xl: "80em",
  },
});
