import styles from "./Popular.module.css";
import { Center, Loader, SimpleGrid, Stack} from "@mantine/core";
import Item from "../../../components/Item/Item.tsx";
import { useFetchProducts } from "../../../hooks/useFetchProducts.tsx";

const Popular = () => {
  const { products, isLoading } = useFetchProducts();

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <section className={styles.popular}>
      <Stack gap="sm">
        <h2 className={styles.title}>Trending Now</h2>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
          {products &&
            products.map(({ _id, ...rest }) => (
              <Item key={_id} _id={_id} {...rest} />
            ))}
        </SimpleGrid>
      </Stack>
    </section>
  );
};

export default Popular;
