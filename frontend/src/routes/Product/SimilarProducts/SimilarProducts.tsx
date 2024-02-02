import Item from "../../../components/Item/Item";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store.ts";
import styles from "./similarproducts.module.css";
import { Stack, SimpleGrid } from "@mantine/core";
import ProductProps from "../../../types/ProductProps.ts";

const SimilarProducts = () => {
  const products = useSelector((state: RootState) => state.products.items);
  const similarProducts = products.slice(12, 18);

  return (
    <section className={styles.similar_products}>
      <Stack>
        <h2 className={styles.title}>Similar Products</h2>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
          {similarProducts.map(
            ({ id, name, image, brand, price, lastPrice }: ProductProps) => (
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

export default SimilarProducts;
