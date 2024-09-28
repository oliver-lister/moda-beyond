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
import { Link, Navigate, useLocation } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";
import { accountNavLinks } from "./data/accountNavLinks.ts";
import { useGetSessionQuery } from "../../state/auth/authSlice.ts";

const AccountLayout = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const { isLoading } = useGetSessionQuery();
  const { pathname } = useLocation();

  if (!auth.isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  }

  return (
    <section className={styles.account}>
      <Container
        size="xl"
        py={{ base: 0, md: "1rem" }}
        mih="60vh"
        styles={{ root: { paddingInline: 0 } }}
      >
        <Grid>
          <GridCol span={{ base: 12, md: 3 }} visibleFrom="md" pl="1.5rem">
            <Stack>
              <Title order={1} fz="1.5rem">
                Account
              </Title>
              <Stack gap="xs">
                {accountNavLinks.map((link, index) => (
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
            {auth.user ? (
              <Outlet context={{ user: auth.user }} />
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
