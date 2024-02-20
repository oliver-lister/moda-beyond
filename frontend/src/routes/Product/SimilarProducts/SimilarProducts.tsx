import Item from "../../../components/Item/Item";
import styles from "./similarproducts.module.css";
import { Stack, SimpleGrid, Text } from "@mantine/core";
import ProductProps from "../../../types/ProductProps.ts";
import { useEffect, useState } from "react";

const SimilarProducts = ({ product }: { product: ProductProps }) => {
  const [displayedProducts, setDisplayedProducts] = useState<
    ProductProps[] | null
  >(null);

  useEffect(() => {
    // Fetch similar products from backend
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/fetchproducts?category=${product.category}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const products = await response.json();

        setDisplayedProducts(
          products.filter(
            (newProduct: ProductProps) => newProduct._id !== product._id
          )
        );
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };
    fetchProduct();
  }, [product]);

  return (
    <section className={styles.similar_products}>
      <Stack>
        <h2 className={styles.title}>Similar Products</h2>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
          {displayedProducts && displayedProducts.length > 0 ? (
            displayedProducts.map(
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
          )}
        </SimpleGrid>
      </Stack>
    </section>
  );
};

export default SimilarProducts;
