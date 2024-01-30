import styles from "./Popular.module.css";
import products from "../../assets/data/all_products.tsx";
import { Container, Flex, SimpleGrid, Stack } from "@mantine/core";
import Item from "../Item/Item";
import { itemProps } from "../../types/itemProps.tsx";

const popularProducts = products.slice(1, 7);

const Popular = () => {
  return (
    <section className={styles.popular}>
      <Container size="xl">
        <Stack gap="sm">
          <h2 className={styles.title}>Trending Now</h2>
          <Flex>
            <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
              {popularProducts.map(
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
          </Flex>
        </Stack>
      </Container>
    </section>
  );
};

export default Popular;
