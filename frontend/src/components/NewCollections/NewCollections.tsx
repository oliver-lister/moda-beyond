import all_product from "../../assets/data/all_products";
import styles from "./NewCollections.module.css";
import { Stack, SimpleGrid, Container } from "@mantine/core";
import Item from "../Item/Item";
import { itemProps } from "../../types/itemProps.tsx";

const newCollections = all_product.slice(12, 18);

const NewCollections = () => {
  return (
    <section className={styles.newcollection}>
      <Container size="xl">
        <Stack>
          <h2 className={styles.title}>New Collections</h2>
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
            {newCollections.map(
              ({ id, name, image, brand, price, lastPrice }: itemProps) => (
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
      </Container>
    </section>
  );
};

export default NewCollections;
