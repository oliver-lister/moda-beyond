import {
  Container,
  Flex,
  Indicator,
  Group,
  Burger,
  Menu,
  rem,
  UnstyledButton,
  Button,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconShoppingCart,
  IconUserCircle,
  IconLogout,
  IconLogin,
} from "@tabler/icons-react";
import styles from "./NavBar.module.css";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store.ts";
import { signOut } from "../../state/auth/authSlice.ts";

const navMenu = [
  { label: "Women", path: "/women" },
  { label: "Men", path: "/men" },
  { label: "Kids", path: "/kids" },
];

const NavBar = () => {
  const { pathname } = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
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
              <Title order={1}>The Shopper</Title>
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
            {user ? (
              <Menu>
                <Menu.Target>
                  <UnstyledButton className={styles.profile}>
                    <IconUserCircle
                      style={{ width: rem(32), height: rem(32) }}
                    />
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item className={styles.profile_menu_item}>
                    <Link
                      to="/profile"
                      onClick={() => opened && toggle()}
                      style={{ textDecoration: "none" }}
                    >
                      <Group>
                        <IconUserCircle
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        Profile
                      </Group>
                    </Link>
                  </Menu.Item>
                  <Menu.Item className={styles.profile_menu_item}>
                    <Link
                      to="/"
                      onClick={() => {
                        dispatch(signOut());
                      }}
                    >
                      <Group>
                        <IconLogout
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        Logout
                      </Group>
                    </Link>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button
                component={Link}
                to="/login"
                onClick={() => opened && toggle()}
                leftSection={<IconLogin />}
                variant="outline"
                c="var(--mantine-color-white)"
                styles={{
                  root: { border: "1px solid var(--mantine-color-white)" },
                }}
              >
                Login / Register
              </Button>
            )}

            <Link
              to="/cart"
              className={styles.cart}
              onClick={() => opened && toggle()}
            >
              <Group>
                {user && user.cart.length > 0 ? (
                  <Indicator inline label={user.cart.length} size={16}>
                    <IconShoppingCart
                      style={{ width: rem(32), height: rem(32) }}
                    />
                  </Indicator>
                ) : (
                  <IconShoppingCart
                    style={{ width: rem(32), height: rem(32) }}
                  />
                )}
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
