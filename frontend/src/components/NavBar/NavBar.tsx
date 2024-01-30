import {
  Container,
  Flex,
  Image,
  Button,
  Indicator,
  Group,
  Burger,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconShoppingCart } from "@tabler/icons-react";
import styles from "./NavBar.module.css";

import { Link, useLocation } from "react-router-dom";

const navMenu = [
  { label: "Mens", path: "/mens" },
  { label: "Womens", path: "/womens" },
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
            <Link to="/">
              <Image />
              <h1 className={styles.logo}>The Shopper</h1>
            </Link>
            <ul className={styles.list}>
              {navMenu.map((link, index) => (
                <li key={index} className={styles.list_item}>
                  <Link
                    to={link.path}
                    className={`${styles.link} ${
                      pathname === link.path && styles.active
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Group>
          <Flex align="center" gap={20}>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/cart" className={styles.cart}>
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
              aria-label="Toggle navigation"
            />
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
