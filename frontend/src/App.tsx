// Redux
import { Provider } from "react-redux";
import { setupStore } from "./state/store.ts";
const store = setupStore();

// Mantine
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.ts";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "./index.css";

// React Router
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

const App = () => {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
  );
};

export default App;
