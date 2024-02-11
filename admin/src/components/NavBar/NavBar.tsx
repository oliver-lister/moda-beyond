import styles from "./navbar.module.css";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mantine/core";
import {
  IconLayoutDashboard,
  IconTablePlus,
  IconZoomScan,
} from "@tabler/icons-react";

const NavBar = ({ toggle }: { toggle: () => void }) => {
  const { pathname } = useLocation();

  const navMenu = [
    { label: "Dashboard", path: "/", left: <IconLayoutDashboard /> },
    { label: "Add Product", path: "/addproduct", left: <IconTablePlus /> },
    { label: "View Products", path: "/viewproducts", left: <IconZoomScan /> },
  ];

  return (
    <nav>
      <ul>
        {navMenu.map((link, index) => (
          <li key={index} className={styles.list_item}>
            <Button
              component={Link}
              to={link.path}
              fullWidth
              justify="left"
              size="lg"
              leftSection={link.left}
              className={`${styles.link} ${
                pathname === link.path && styles.active
              }`}
              onClick={toggle}
            >
              {link.label}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
