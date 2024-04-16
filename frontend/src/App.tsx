// Redux
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
import Profile from "./routes/Account/Profile/Profile.tsx";
import AccountDashboard from "./routes/Account/AccountDashboard/AccountDashboard.tsx";

// Mantine
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "./index.css";

// Overriding orignal Mantine theme
const theme = createTheme({
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

// React Router
import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./routes/Root/Layout.tsx";
import ErrorPage from "./routes/Root/error-page.tsx";
import Home from "./routes/Home/Home.tsx";
import Shop from "./routes/Shop/Shop.tsx";
import Product from "./routes/Product/Product.tsx";
import Cart from "./routes/Cart/Cart.tsx";
import LoginSignup from "./routes/LoginSignup/LoginSignup.tsx";
import AccountLayout from "./routes/Account/AccountLayout.tsx";
import LoginAndSecurity from "./routes/Account/LoginAndSecurity/LoginAndSecurity.tsx";
import DeleteAccount from "./routes/Account/DeleteAccount/DeleteAccount.tsx";

// Router Routes ** hash router was required for github pages

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home />, index: true },
      { path: "/shop", element: <Shop /> },
      {
        path: "/product/:productId",
        element: <Product />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/login",
        element: <LoginSignup type="login" />,
      },
      {
        path: "/signup",
        element: <LoginSignup type="signup" />,
      },
      {
        path: "/account",
        element: <AccountLayout />,
        children: [
          { path: "/account", element: <AccountDashboard />, index: true },
          { path: "profile", element: <Profile /> },
          { path: "login-and-security", element: <LoginAndSecurity /> },
          { path: "delete-account", element: <DeleteAccount /> },
        ],
      },
    ],
  },
]);

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