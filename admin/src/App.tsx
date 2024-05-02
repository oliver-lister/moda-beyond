import { RouterProvider } from "react-router-dom";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "./index.css";
import router from "./router.tsx";

// Overriding orignal Mantine theme
const theme = createTheme({
  fontFamily: "Figtree, sans-serif",
  breakpoints: {
    xs: "450px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
});

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
