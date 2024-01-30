import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import MessageBar from "../components/MessageBar/MessageBar";
import Footer from "../components/Footer/Footer";

const Root = () => {
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
      </footer>
    </>
  );
};

export default Root;
