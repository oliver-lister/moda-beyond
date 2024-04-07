import { Box } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import styles from "./mobileNav.module.css";
import { useSearchParams } from "react-router-dom";

const MobileNav = ({
  navMenu,
  toggle,
  opened,
}: {
  navMenu: { label: string; path: string }[];
  toggle: () => void;
  opened: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  return (
    <Box
      hiddenFrom="lg"
      className={styles.wrapper + " " + (opened ? styles.opened : "")}
    >
      <ul className={styles.menu}>
        <li>
          <Link
            to="/"
            className={`${styles.logo} ${
              pathname === "/" ? "gradient-text" : ""
            }`}
            onClick={toggle}
          >
            møda-beyond
          </Link>
        </li>
        {navMenu.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              className={`${styles.link} ${
                searchParams.get("category") === link.label.toLowerCase()
                  ? styles.active + " " + "gradient-text"
                  : ""
              }`}
              onClick={toggle}
            >
              {link.label.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default MobileNav;
