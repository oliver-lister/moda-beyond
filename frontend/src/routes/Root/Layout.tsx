import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store.ts";
import { refreshAccessTokenAsync } from "../../state/auth/authSlice.ts";

import NavBar from "./components/NavBar/NavBar.tsx";
import MessageBar from "./components/MessageBar/MessageBar.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Copyright from "./components/Copyright/Copyright.tsx";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();

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
