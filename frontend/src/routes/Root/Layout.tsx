import { Outlet } from "react-router-dom";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store.ts";
import NavBar from "./components/NavBar/NavBar.tsx";
import MessageBar from "./components/MessageBar/MessageBar.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Copyright from "./components/Copyright/Copyright.tsx";
import BackendInfoModal from "./components/BackendInfoModal/BackendInfoModal.tsx";
import useAuthSync from "../../hooks/useAuthSync.ts";
import useUserSync from "../../hooks/useUserSync.ts";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  // memoized to avoid repeated access.
  const storedRefreshToken = useMemo(
    () => localStorage.getItem("refreshToken"),
    []
  );

  // Retrieve auth, user, and cart state using custom hooks
  const auth = useAuthSync(dispatch, storedRefreshToken);
  useUserSync(auth, dispatch);

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
      <BackendInfoModal isAuthenticated={auth.isAuthenticated} />
    </>
  );
};

export default Layout;
