import React from "react";
import ReactDOM from "react-dom/client";

// React Router
import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./routes/Root/Layout.tsx";
import ErrorPage from "./routes/Root/error-page.tsx";
import Home from "./routes/Home/Home.tsx";
import Shop from "./routes/Shop/Shop.tsx";
import Product from "./routes/Product/Product.tsx";
import Cart from "./routes/User/Cart/Cart.tsx";
import LoginSignup from "./routes/Login/LoginSignup.tsx";
import AccountLayout from "./routes/User/Account/AccountLayout.tsx";
import LoginAndSecurity from "./routes/User/Account/LoginAndSecurity/LoginAndSecurity.tsx";
import DeleteAccount from "./routes/User/Account/DeleteAccount/DeleteAccount.tsx";

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
import Profile from "./routes/User/Account/Profile/Profile.tsx";
import UserDashboard from "./routes/User/UserDashboard.tsx";

// Overriding orignal Mantine theme
const theme = createTheme({
  fontFamily: "Figtree, sans-serif",
  breakpoints: {
    xs: "28em",
    sm: "40em",
    md: "48em",
    lg: "68em",
    xl: "80em",
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
        path: "user",
        children: [
          { index: true, element: <UserDashboard /> },
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
