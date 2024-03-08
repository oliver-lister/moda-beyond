import {
  Select,
  Group,
  Stack,
  Container,
  SimpleGrid,
  Box,
  Text,
} from "@mantine/core";
import styles from "./shop.module.css";
import { useEffect, useState } from "react";
import Item from "../../components/Item/Item.tsx";
import Loading from "../../components/Loading/Loading.tsx";
import ProductProps from "../../types/ProductProps.ts";
import { useSearchParams } from "react-router-dom";

type SortOption = {
  sortBy: string;
  sortOrder: number;
};

const sortOptions: { [key: string]: SortOption } = {
  price_low_to_high: { sortBy: "price", sortOrder: 1 },
  price_high_to_low: { sortBy: "price", sortOrder: -1 },
  date_new_to_old: { sortBy: "date", sortOrder: -1 },
};

const Shop = () => {
  const [products, setProducts] = useState<ProductProps[] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("search")) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/products/fetchproducts${
              searchParams ? "?" + searchParams.toString() : ""
            }`
          );
          const productData = await response.json();
          setProducts(productData);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProducts();
    } else {
      const searchProducts = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/products/searchproducts${
              searchParams ? "?" + searchParams.toString() : ""
            }`
          );
          const productData = await response.json();
          setProducts(productData);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      searchProducts();
    }
  }, [searchParams]);

  const handleChangeSort = (value: string) => {
    const sort = sortOptions[value];
    searchParams.set("sortBy", sort.sortBy);
    searchParams.set("sortOrder", sort.sortOrder.toString());
    setSearchParams(searchParams);
  };

  if (!products) {
    return <Loading />;
  }

  return (
    <section className={styles.shop_category}>
      <Container size="xl">
        <Stack gap="lg">
          <SimpleGrid cols={3} style={{ alignItems: "center" }}>
            <Text>
              {searchParams.get("search")
                ? `Showing results for ${searchParams.get("search")}`
                : searchParams.get("category")?.toUpperCase()}
            </Text>
            <Box className={styles.index} style={{ textAlign: "center" }}>
              <Text>
                <span>Showing 1-{products.length}</span> out of{" "}
                {products.length} products.
              </Text>
            </Box>
            <Group justify="flex-end">
              <Select
                allowDeselect={false}
                data={[
                  { label: "New Arrivals", value: "date_new_to_old" },
                  {
                    label: "Price: Low to High",
                    value: "price_low_to_high",
                  },
                  { label: "Price: High to Low", value: "price_high_to_low" },
                ]}
                defaultValue={"date_new_to_old"}
                onChange={handleChangeSort}
              />
            </Group>
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
            {products.map(({ _id, ...rest }) => (
              <Item key={_id} _id={_id} {...rest} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </section>
  );
};

export default Shop;
