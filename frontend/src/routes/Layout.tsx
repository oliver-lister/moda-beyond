import { Outlet } from "react-router-dom";

import NavBar from "../components/NavBar/NavBar";
import MessageBar from "../components/MessageBar/MessageBar";
import Footer from "../components/Footer/Footer";
import Copyright from "../components/Copyright/Copyright";
import { initializeProducts } from "../state/products/productsSlice.ts";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state/store";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch all products on component mount
    dispatch(initializeProducts());
  }, [dispatch]);

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
