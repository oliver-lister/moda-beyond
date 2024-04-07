import React from "react";
import ReactDOM from "react-dom/client";

// React Router
import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./routes/Root/Layout.tsx";
import ErrorPage from "./routes/Root/error-page.tsx";
import Home from "./routes/Home/Home.tsx";
import Shop from "./routes/Shop/Shop.tsx";
import Product from "./routes/Product/Product.tsx";
import Cart from "./routes/Cart/Cart.tsx";
import LoginSignup from "./routes/Login/LoginSignup.tsx";
import AccountLayout from "./routes/Account/AccountLayout.tsx";
import LoginAndSecurity from "./routes/Account/LoginAndSecurity/LoginAndSecurity.tsx";
import DeleteAccount from "./routes/Account/DeleteAccount/DeleteAccount.tsx";

// Mantine
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "./index.css";

// Redux
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
import Profile from "./routes/Account/Profile/Profile.tsx";

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

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      {
        path: "product/:productId",
        element: <Product />,
      },
      {
        path: "/user",
        children: [
          {
            path: "account",
            element: <AccountLayout />,
            children: [
              { path: "profile", element: <Profile /> },
              { path: "login-and-security", element: <LoginAndSecurity /> },
              { path: "delete-account", element: <DeleteAccount /> },
            ],
          },
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "login",
            element: <LoginSignup />,
          },
        ],
      },
    ],
  },
]);

const rootContainer = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootContainer);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
