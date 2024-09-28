import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.tsx";
import MessageBar from "./components/MessageBar/MessageBar.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Copyright from "./components/Copyright/Copyright.tsx";
import BackendInfoModal from "./components/BackendInfoModal/BackendInfoModal.tsx";
import { authApi } from "../../state/auth/authSlice.ts";
import { useAppDispatch } from "../../state/hooks.ts";
import { productsApi } from "../../state/products/productsSlice.ts";

const Layout = () => {
  const dispatch = useAppDispatch();
  dispatch(authApi.endpoints.getSession.initiate());
  dispatch(productsApi.endpoints.getProducts.initiate(""));

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
      <BackendInfoModal />
    </>
  );
};

export default Layout;
