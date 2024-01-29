import popularStyles from "./Popular.module.css";
import data_product from "../../assets/data/data.tsx";
import { Container, SimpleGrid, Stack } from "@mantine/core";
import Item from "../Item/Item";
import { itemProps } from "../../types/itemProps.tsx";

const Popular = () => {
  return (
    <section className={popularStyles.popular}>
      <Container size="xl">
        <Stack gap="sm">
          <h2 className={popularStyles.title}>Trending Now</h2>
          <SimpleGrid cols={{ xs: 1, sm: 3, lg: 4 }}>
            {data_product.map(
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

export default Popular;
