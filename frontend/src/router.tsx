import { createHashRouter } from "react-router-dom";
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
import Profile from "./routes/Account/Profile/Profile.tsx";
import AccountDashboard from "./routes/Account/AccountDashboard/AccountDashboard.tsx";

// Router Routes ** hash router was required for github pages
export const router = createHashRouter([
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
