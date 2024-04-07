import { Box, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import styles from "./mobileNav.module.css";

const MobileNav = ({
  navMenu,
  toggle,
  opened,
}: {
  navMenu: { label: string; path: string }[];
  toggle: () => void;
  opened: boolean;
}) => {
  return (
    <Box
      hiddenFrom="md"
      className={styles.wrapper + " " + (opened ? styles.opened : "")}
    >
      <ul className={styles.menu}>
        <Stack gap="xl">
          <li>
            <Link to="/" className={styles.logo} onClick={toggle}>
              <Text ff="EBGaramond-Regular" fz="2rem" fw={600}>
                møda-beyond
              </Text>
            </Link>
          </li>
          {navMenu.map((link, index) => (
            <li key={index}>
              <Link to={link.path} className={styles.link} onClick={toggle}>
                {link.label.toUpperCase()}
              </Link>
            </li>
          ))}
        </Stack>
      </ul>
    </Box>
  );
};

export default MobileNav;
