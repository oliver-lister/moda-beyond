import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state/store.ts";
import { refreshAccessTokenAsync } from "../state/auth/authSlice";

import NavBar from "../components/NavBar/NavBar";
import MessageBar from "../components/MessageBar/MessageBar";
import Footer from "../components/Footer/Footer";
import Copyright from "../components/Copyright/Copyright";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedRefreshToken) {
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
