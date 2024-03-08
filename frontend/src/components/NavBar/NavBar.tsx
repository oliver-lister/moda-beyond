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
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconShoppingCart,
  IconUserCircle,
  IconLogout,
  IconLogin,
  IconSearch,
} from "@tabler/icons-react";
import styles from "./NavBar.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store.ts";
import { signOut } from "../../state/auth/authSlice.ts";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";

const navMenu = [
  { label: "Women", path: "/shop?category=women&sortBy=date&sortOrder=-1" },
  { label: "Men", path: "/shop?category=men&sortBy=date&sortOrder=-1" },
  { label: "Kids", path: "/shop?category=kids&sortBy=date&sortOrder=-1" },
];

const NavBar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [opened, { toggle }] = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInputRef.current) return null;
    const text = searchInputRef.current.value;
    navigate("/shop");

    if (text.length === 0) {
      searchParams.delete("search");
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams(
        { search: text, sortBy: "date", sortOrder: "-1" },
        { replace: true }
      );
    }
    searchInputRef.current.value = "";
  };

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
          <Group align="center" gap={20}>
            <form onSubmit={handleSearchSubmit}>
              <TextInput ref={searchInputRef} leftSection={<IconSearch />} />
            </form>
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
          </Group>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
