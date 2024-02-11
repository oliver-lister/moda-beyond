import { Outlet } from "react-router-dom";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavBar from "../components/NavBar/NavBar";
import styles from "./layout.module.css";

const Layout = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <h1 className={styles.logo}>
              <span>THE SHOPPER</span> ADMIN PANEL
            </h1>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <NavBar toggle={toggle} />
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
        <AppShell.Footer></AppShell.Footer>
      </AppShell>
    </>
  );
};

export default Layout;
