import {
  Center,
  Container,
  Grid,
  GridCol,
  Loader,
  NavLink,
  Stack,
  Title,
} from "@mantine/core";
import styles from "./AccountLayout.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import {
  Link,
  Navigate,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";
import UserProps from "../../types/UserProps.ts";

const navLinks = [
  {
    label: "Profile",
    to: "/account/profile",
  },
  {
    label: "Login & Security",
    to: "/account/login-and-security",
  },
  {
    label: "Delete Account",
    to: "/account/delete-account",
  },
];

type ContextType = { user: UserProps | null };

const AccountLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const { pathname } = useLocation();

  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <section className={styles.account}>
      <Container
        size="xl"
        py={{ base: 0, md: "1rem" }}
        mih="70vh"
        styles={{ root: { paddingInline: 0 } }}
      >
        <Grid>
          <GridCol span={{ base: 12, md: 3 }} visibleFrom="md" pl="1.5rem">
            <Stack>
              <Title order={1} fz="1.5rem">
                Account
              </Title>
              <Stack gap="xs">
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
            {!isLoading ? (
              <Outlet context={{ user }} />
            ) : (
              <Center mih="60vh">
                <Loader />
              </Center>
            )}
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