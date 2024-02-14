import React from "react";
import ReactDOM from "react-dom/client";

// React Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./routes/Layout.tsx";
import ErrorPage from "./routes/error-page.tsx";
import Dashboard from "./routes/Dashboard/Dashboard.tsx";

import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "./index.css";
import AddProduct from "./routes/AddProduct/AddProduct.tsx";
import ViewProducts from "./routes/ViewProducts/ViewProducts.tsx";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "/addproduct",
        element: <AddProduct />,
      },
      {
        path: "/viewproducts",
        element: <ViewProducts />,
      },
    ],
  },
]);

const rootContainer = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootContainer);

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
