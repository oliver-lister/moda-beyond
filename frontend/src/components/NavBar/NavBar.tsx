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
import navStyles from "./NavBar.module.css";

import { Link, useLocation } from "react-router-dom";

const navMenu = [
  { label: "Home", path: "/" },
  { label: "Mens", path: "/mens" },
  { label: "Womens", path: "/womens" },
  { label: "Kids", path: "/kids" },
];

const NavBar = () => {
  const { pathname } = useLocation();
  const [opened, { toggle }] = useDisclosure();

  return (
    <nav className={navStyles.nav}>
      <Container size="xl">
        <Flex justify="space-between" align="center" className={navStyles.logo}>
          <Link to="/">
            <Image />
            <h1>Really Rad Rings</h1>
          </Link>
          <ul className={navStyles.list}>
            {navMenu.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className={`${navStyles.link} ${
                    pathname === link.path && navStyles.active
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Flex align="center" gap={20}>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/cart" className={navStyles.cart}>
              <Group>
                <Indicator inline label="2" size={16}>
                  <IconShoppingCart size={30} />
                </Indicator>
              </Group>
            </Link>
            <Burger
              className={navStyles.burger}
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
