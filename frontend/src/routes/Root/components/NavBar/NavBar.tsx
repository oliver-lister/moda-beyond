import { Container, Flex, Group, Burger, Box, Stack, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./NavBar.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import SearchBox from "./components/SearchBox.tsx";
import ShoppingCartButton from "./components/ShoppingCartButton.tsx";
import MobileNav from "./components/MobileNav/MobileNav.tsx";
import { IconUserCircle } from "@tabler/icons-react";
import AccountMenu from "./components/AccountMenu.tsx";
import { useAppSelector } from "../../../../state/hooks.ts";
import { useCart } from "../../../../state/cart/hooks/useCart.ts";

const navMenu = [
  {
    label: "Women",
    path: "/shop?category=women",
  },
  {
    label: "Men",
    path: "/shop?category=men",
  },
  {
    label: "Kids",
    path: "/shop?category=kids",
  },
];

const NavBar = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { cartTotal } = useCart();
  const [opened, { toggle }] = useDisclosure();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState({
    text: "",
    isFocused: false,
  });

  const handleSearchValueChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputText = e.currentTarget.value;
    setSearch({ ...search, text: inputText });
  };

  const toggleSearchFocus = () => {
    setSearch({ ...search, isFocused: !search.isFocused });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.text || search.text.length === 0) return null;

    navigate("/shop");

    if (search.text.length === 0) {
      searchParams.delete("search");
      setSearchParams(searchParams, { replace: true });
      setSearch({ ...search, text: "" });
    } else {
      setSearchParams(
        {
          search: search.text,
        },
        { replace: true }
      );
      setSearch({ ...search, text: "" });
    }
  };
  return (
    <nav className={styles.nav}>
      <Container size="xl">
        <Stack gap={0}>
          <Flex justify="space-between" align="center">
            <Group gap="xl">
              <Group gap={0}>
                <Burger
                  className={styles.burger}
                  opened={opened}
                  onClick={toggle}
                  color="white"
                  aria-label="Toggle navigation"
                  hiddenFrom="lg"
                />
                <ul className={`${styles.list} ${opened && styles.opened}`}>
                  <li className={styles.list_item}>
                    <Link
                      to="/"
                      className={`${styles.link} ${styles.logo} ${
                        pathname === "/" ? styles.active : ""
                      }`}
                    >
                      møda-beyond
                    </Link>
                  </li>
                  {navMenu.map((link, index) => (
                    <li key={index} className={styles.list_item}>
                      <Link
                        to={link.path}
                        className={`${styles.link} ${
                          searchParams.get("category") ===
                          link.label.toLowerCase()
                            ? styles.active
                            : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Group>
            </Group>
            <Group align="center" justify="flex-end" gap={10}>
              <Box visibleFrom="lg">
                <SearchBox
                  searchText={search.text}
                  handleSearchSubmit={handleSearchSubmit}
                  toggleSearchFocus={toggleSearchFocus}
                  handleSearchValueChange={handleSearchValueChange}
                />
              </Box>
              {user ? (
                <AccountMenu user={user} />
              ) : (
                <Box className={styles.profile}>
                  <Link to="/login" aria-label="Click to login">
                    <IconUserCircle
                      style={{ width: rem(32), height: rem(32) }}
                    />
                  </Link>
                </Box>
              )}
              <Link
                to="/cart"
                className={styles.cart}
                onClick={() => opened && toggle()}
                aria-label="Click to view cart"
              >
                <ShoppingCartButton cartTotal={cartTotal} />
              </Link>
            </Group>
          </Flex>
          <Box mb="1rem" hiddenFrom="lg">
            <SearchBox
              searchText={search.text}
              handleSearchSubmit={handleSearchSubmit}
              toggleSearchFocus={toggleSearchFocus}
              handleSearchValueChange={handleSearchValueChange}
            />
          </Box>
        </Stack>
      </Container>
      <MobileNav navMenu={navMenu} toggle={toggle} opened={opened} />
    </nav>
  );
};

export default NavBar;
