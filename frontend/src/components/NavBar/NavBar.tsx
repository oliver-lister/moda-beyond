import { Container, Flex, Indicator, Group, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconShoppingCart, IconUserCircle } from "@tabler/icons-react";
import styles from "./NavBar.module.css";

import { Link, useLocation } from "react-router-dom";

const navMenu = [
  { label: "Women", path: "/women" },
  { label: "Men", path: "/men" },
  { label: "Kids", path: "/kids" },
];

const NavBar = () => {
  const { pathname } = useLocation();
  const [opened, { toggle }] = useDisclosure();

  return (
    <nav className={styles.nav}>
      <Container size="xl">
        <Flex justify="space-between" align="center">
          <Group gap="xl">
            <Link
              to="/"
              className={`${styles.logo} ${pathname === "/" && styles.active}`}
              onClick={() => opened && toggle()}
            >
              <h1>The Shopper</h1>
            </Link>
            <ul className={`${styles.list} ${opened && styles.opened}`}>
              {navMenu.map((link, index) => (
                <li key={index} className={styles.list_item}>
                  <Link
                    to={link.path}
                    className={`${styles.link} ${
                      pathname === link.path && styles.active
                    }`}
                    onClick={toggle}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Group>
          <Flex align="center" gap={20}>
            <Link
              to="/login"
              onClick={() => opened && toggle()}
              className={styles.profile}
            >
              <IconUserCircle size={30} />
            </Link>
            <Link
              to="/cart"
              className={styles.cart}
              onClick={() => opened && toggle()}
            >
              <Group>
                <Indicator inline label="2" size={16}>
                  <IconShoppingCart size={30} />
                </Indicator>
              </Group>
            </Link>
            <Burger
              className={styles.burger}
              opened={opened}
              onClick={toggle}
              color="white"
              aria-label="Toggle navigation"
            />
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
