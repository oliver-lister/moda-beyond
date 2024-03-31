import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store.ts";
import { refreshAccessTokenAsync } from "../../state/auth/authSlice.ts";

import NavBar from "./NavBar/NavBar.tsx";
import MessageBar from "./MessageBar/MessageBar.tsx";
import Footer from "./Footer/Footer.tsx";
import Copyright from "./Copyright/Copyright.tsx";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedRefreshToken && !user) {
      // Refresh the access token upon refresh
      dispatch(refreshAccessTokenAsync(storedRefreshToken));
    }
  }, []);

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
