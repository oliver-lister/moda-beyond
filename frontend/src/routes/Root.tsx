import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

const Root = () => {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <div id="detail">
          <Outlet />
        </div>
      </main>
      <footer>Footer</footer>
    </>
  );
};

export default Root;
