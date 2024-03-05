import styles from "./NewCollections.module.css";
import { Stack, SimpleGrid } from "@mantine/core";
import Item from "../../../components/Item/Item.tsx";
import { useFetchProducts } from "../../../hooks/useFetchProducts.tsx";
import Loading from "../../../components/Loading/Loading.tsx";

const NewCollections = () => {
  const { products } = useFetchProducts(null);

  if (!products) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <section className={styles.newcollection}>
      <Stack>
        <h2 className={styles.title}>New Collections</h2>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
          {products.map(({ _id, ...rest }) => (
            <Item key={_id} _id={_id} {...rest} />
          ))}
        </SimpleGrid>
      </Stack>
    </section>
  );
};

export default NewCollections;
