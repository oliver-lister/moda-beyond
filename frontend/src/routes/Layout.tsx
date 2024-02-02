import { Outlet } from "react-router-dom";

import NavBar from "../components/NavBar/NavBar";
import MessageBar from "../components/MessageBar/MessageBar";
import Footer from "../components/Footer/Footer";
import Copyright from "../components/Copyright/Copyright";
import { initializeProducts } from "../state/products/productsSlice.ts";
import { store } from "../state/store.ts";
import { useEffect } from "react";

const Layout = () => {
  useEffect(() => {
    // Dispatch the initializeProducts action when the component mounts
    store.dispatch(initializeProducts());
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
