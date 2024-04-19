import styles from "./similarproducts.module.css";
import { Stack } from "@mantine/core";
import ProductProps from "../../../../types/ProductProps.ts";
import ProductCollectionTeaser from "../../../../components/ProductCollectionTeaser/ProductCollectionTeaser.tsx";

const SimilarProducts = ({ product }: { product: ProductProps }) => {
  return (
    <section className={styles.similar_products}>
      <Stack>
        <h2 className={styles.title}>Similar Products</h2>
        <ProductCollectionTeaser
          query={`category=${product.category}&brand=${product.brand}`}
          cap={6}
        />
      </Stack>
    </section>
  );
};

export default SimilarProducts;
