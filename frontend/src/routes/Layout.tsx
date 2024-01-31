import { Outlet } from "react-router-dom";
import NavBar from "../components/navBar/NavBar";
import MessageBar from "../components/messageBar/MessageBar";
import Footer from "../components/footer/Footer";
import Copyright from "../components/copyright/Copyright";

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
        <Copyright />
      </footer>
    </>
  );
};

export default Root;
