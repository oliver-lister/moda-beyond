import popularStyles from "./Popular.module.css";
import data_product from "../../assets/data/data.tsx";
import { Container, SimpleGrid } from "@mantine/core";
import Item from "../Item/Item";
import { itemProps } from "../../types/itemProps.tsx";

const Popular = () => {
  return (
    <section className={popularStyles.popular}>
      <Container size="xl">
        <h2 className={popularStyles.title}>Popular In Women</h2>
        <SimpleGrid cols={{ xs: 1, sm: 3, lg: 4 }}>
          {data_product.map(
            (
              { id, name, image, price, lastPrice }: itemProps,
              index: number
            ) => (
              <Item
                key={index}
                id={id}
                name={name}
                image={image}
                price={price}
                lastPrice={lastPrice}
              />
            )
          )}
        </SimpleGrid>
      </Container>
    </section>
  );
};

export default Popular;
