import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../state/store.ts";
import { refreshAccessTokenAsync } from "../../state/auth/authSlice.ts";

import NavBar from "./components/NavBar/NavBar.tsx";
import MessageBar from "./components/MessageBar/MessageBar.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Copyright from "./components/Copyright/Copyright.tsx";
import { setCart } from "../../state/cart/cartSlice.ts";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    // Refresh the access token upon refresh
    try {
      dispatch(refreshAccessTokenAsync(storedRefreshToken));
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("I got called!");
    const localCart = localStorage.getItem("cart");
    if (!user && !localCart) {
      return;
    }

    // If user is logged in, access cart in database
    if (user) {
      dispatch(setCart(user.cart));
      return;
    }

    // If localStorage cart exists, use that
    if (localCart) {
      dispatch(setCart(JSON.parse(localCart)));
      return;
    }
  }, [user, dispatch]);

  return (
    <>
      <header>
        <NavBar />
        <MessageBar />
      </header>
      <main>
        <div id="detail">
          <Outlet />
        </div>
      </main>
      <footer>
        <Footer />
        <Copyright />
      </footer>
    </>
  );
};

export default Layout;
