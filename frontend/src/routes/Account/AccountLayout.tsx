import {
  Container,
  Grid,
  GridCol,
  NavLink,
  Stack,
  Title,
  Center,
} from "@mantine/core";
import styles from "./AccountLayout.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";
import UserProps from "../../types/UserProps.ts";

const navLinks = [
  {
    label: "Profile",
    to: "/user/account/profile",
  },
  {
    label: "Login & Security",
    to: "/user/account/login-and-security",
  },
  {
    label: "Delete Account",
    to: "/user/account/delete-account",
  },
];

type ContextType = { user: UserProps | null };

const AccountLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { pathname } = useLocation();

  // Need to add logic to redirect if user is not logged in

  return (
    <section className={styles.account}>
      <Container size="xl" py="1rem" mih="70vh">
        <Grid gutter="xl">
          <GridCol span={{ base: 12, md: 3 }}>
            <Stack>
              <Title order={1} fz="1.5rem">
                Account
              </Title>
              <Stack>
                {navLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    className={
                      styles.navlink +
                      " " +
                      (pathname === link.to ? styles.active : "")
                    }
                    c={index === 2 ? "red" : ""}
                    component={Link}
                    to={link.to}
                    label={link.label}
                    rightSection={<IconChevronRight size="1rem" stroke={1.5} />}
                  />
                ))}
              </Stack>
            </Stack>
          </GridCol>
          <GridCol span={{ base: 12, md: 9 }}>
            <Center>
              <Outlet context={{ user }} />
            </Center>
          </GridCol>
        </Grid>
      </Container>
    </section>
  );
};

export default AccountLayout;

export function useUser() {
  return useOutletContext<ContextType>();
}
