import styles from "./Popular.module.css";
import { SimpleGrid, Stack } from "@mantine/core";
import Item from "../item/Item.tsx";
import Product from "../../types/product.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";

const Popular = () => {
  const products = useSelector((state: RootState) => state.products.items);
  const popularProducts = products.slice(1, 7);

  return (
    <section className={styles.popular}>
      <Stack gap="sm">
        <h2 className={styles.title}>Trending Now</h2>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
          {popularProducts.map(
            ({ id, name, image, brand, price, lastPrice }: Product) => (
              <Item
                key={id}
                id={id}
                brand={brand}
                name={name}
                image={image}
                price={price}
                lastPrice={lastPrice}
              />
            )
          )}
        </SimpleGrid>
      </Stack>
    </section>
  );
};

export default Popular;
