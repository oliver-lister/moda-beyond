import Item from "../../../components/Item/Item";
import styles from "./similarproducts.module.css";
import { Stack, SimpleGrid, Text, Loader, Center } from "@mantine/core";
import ProductProps from "../../../types/ProductProps.ts";
import { useFetchProducts } from "../../../hooks/useFetchProducts.tsx";

const SimilarProducts = () => {
  const { products, isLoading } = useFetchProducts();

  return (
    <section className={styles.similar_products}>
      <Stack>
        <h2 className={styles.title}>Similar Products</h2>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
          {!isLoading ? (
            products && products.length > 0 ? (
              products.map(
                ({
                  _id,
                  name,
                  images,
                  brand,
                  price,
                  lastPrice,
                }: ProductProps) => (
                  <Item
                    key={_id}
                    _id={_id}
                    brand={brand}
                    name={name}
                    images={images}
                    price={price}
                    lastPrice={lastPrice}
                  />
                )
              )
            ) : (
              <Text>No similar products found.</Text>
            )
          ) : (
            <Center>
              <Loader />
            </Center>
          )}
        </SimpleGrid>
      </Stack>
    </section>
  );
};

export default SimilarProducts;
