import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect } from "react";

// React Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./routes/Layout.tsx";
import ErrorPage from "./routes/error-page.tsx";
import Home from "./routes/Home/Home.tsx";
import ShopCategory from "./routes/ShopCategory/ShopCategory.tsx";
import Product from "./routes/Product/Product.tsx";
import Cart from "./routes/Cart/Cart.tsx";
import Login from "./routes/Login/Login.tsx";

// Mantine
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/dates/styles.css";

import "./index.css";

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

// Redux
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
import { initializeProducts } from "./state/products/productsSlice.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/men",
        element: <ShopCategory shopCategory="men" />,
      },
      {
        path: "/women",
        element: <ShopCategory shopCategory="women" />,
      },
      {
        path: "/kids",
        element: <ShopCategory shopCategory="kids" />,
      },
      {
        path: "/product",
        element: <ShopCategory shopCategory="kids" />,
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
        element: <Login />,
      },
    ],
  },
]);

const Root = () => {
  useEffect(() => {
    // Dispatch the initializeProducts action when the component mounts
    store.dispatch(initializeProducts());
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <MantineProvider theme={theme}>
          <Notifications />
          <RouterProvider router={router} />
        </MantineProvider>
      </Provider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
