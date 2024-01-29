import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/Root.tsx";

// CSS Imports
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import "./index.css";

// Page imports for React Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import Home from "./routes/Home.tsx";
import ShopCategory from "./routes/ShopCategory.tsx";
import Product from "./routes/Product.tsx";
import Cart from "./routes/Cart.tsx";
import LoginSignup from "./routes/LoginSignup.tsx";

const theme = createTheme({
  fontFamily: "Figtree, sans-serif",
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/mens",
        element: <ShopCategory category="mens" />,
      },
      {
        path: "/womens",
        element: <ShopCategory category="women" />,
      },
      {
        path: "/kids",
        element: <ShopCategory category="kids" />,
      },
      {
        path: "/product",
        element: <ShopCategory category="kids" />,
        children: [
          {
            path: ":productId",
            element: <Product />,
          },
        ],
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/login",
        element: <LoginSignup />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
