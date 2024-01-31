import styles from "./NewCollections.module.css";
import { Stack, SimpleGrid } from "@mantine/core";
import Product from "../../types/product.ts";
import Item from "../item/Item.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";

const NewCollections = () => {
  const products = useSelector((state: RootState) => state.products.items);
  const newCollections = products.slice(12, 18);

  return (
    <section className={styles.newcollection}>
      <Stack>
        <h2 className={styles.title}>New Collections</h2>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
          {newCollections.map(
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

export default NewCollections;
