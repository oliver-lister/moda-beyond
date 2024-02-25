import styles from "./Popular.module.css";
import { SimpleGrid, Stack, Text } from "@mantine/core";
import Item from "../../../components/Item/Item.tsx";
import { useFetchProducts } from "../../../hooks/useFetchProducts.tsx";
import { useEffect } from "react";

const Popular = () => {
  const { products, error } = useFetchProducts(null);

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <section className={styles.popular}>
      <Stack gap="sm">
        <h2 className={styles.title}>Trending Now</h2>
        {error ? (
          <Text>Failed to fetch products.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
            {products.map(({ _id, ...rest }) => (
              <Item key={_id} _id={_id} {...rest} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </section>
  );
};

export default Popular;
