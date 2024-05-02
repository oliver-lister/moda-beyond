import { Outlet } from "react-router-dom";
import { AppShell, Burger, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavBar from "../components/NavBar/NavBar";
import styles from "./layout.module.css";
import { useEffect, useState } from "react";
import { ProductProps } from "./AddProduct/components/AddProductForm";

const Layout = () => {
  const [opened, { toggle }] = useDisclosure();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch all products on startup and supply to outlet context
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_HOST}/products/fetch`,
          {
            method: "GET",
          }
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`${responseData.error}, ${responseData.errorCode}`);
        }

        const { data } = responseData;

        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

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
            <Text className={styles.logo}>
              <span>ModaBeyond</span> ADMIN PANEL
            </Text>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <NavBar toggle={toggle} />
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet context={{ products: products, isLoading: isLoading }} />
        </AppShell.Main>
        <AppShell.Footer></AppShell.Footer>
      </AppShell>
    </>
  );
};

export default Layout;
