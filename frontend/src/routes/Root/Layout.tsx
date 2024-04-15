import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../state/store.ts";
import { refreshAccessTokenAsync } from "../../state/auth/authSlice.ts";
import {
  fetchUserDataAsync,
  updateDBCartAsync,
} from "../../state/user/userSlice.ts";
import NavBar from "./components/NavBar/NavBar.tsx";
import MessageBar from "./components/MessageBar/MessageBar.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Copyright from "./components/Copyright/Copyright.tsx";
import { setCart } from "../../state/cart/cartSlice.ts";
import { clearUser } from "../../state/user/userSlice.ts";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    // Refresh the access token upon refresh
    const refreshAccessToken = async () => {
      await dispatch(refreshAccessTokenAsync(storedRefreshToken));
    };
    try {
      if (!auth.isAuthenticated) refreshAccessToken();
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        dispatch(clearUser());
      }
    }
  }, [auth.isAuthenticated, dispatch]);

  useEffect(() => {
    // Fetch user data if they're logged in, to store in Redux state
    if (!auth.userId) return;
    dispatch(fetchUserDataAsync());
  }, [auth.userId, dispatch]);

  useEffect(() => {
    const localCart = localStorage.getItem("cart");
    if (!auth.isAuthenticated && !localCart) {
      return;
    }

    // If user is logged in, access cart in database
    if (auth.isAuthenticated && user.data) {
      dispatch(setCart(user.data.cart));
      return;
    }

    // If localStorage cart exists, use that
    if (localCart) {
      dispatch(setCart(JSON.parse(localCart)));
      return;
    }
  }, [user, auth.isAuthenticated, dispatch]);

  useEffect(() => {
    // if user is logged in, and there's a change to the cart - update the database
    if (auth.isAuthenticated) {
      dispatch(updateDBCartAsync(cart));
    }
  }, [cart, auth.isAuthenticated, dispatch]);

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
