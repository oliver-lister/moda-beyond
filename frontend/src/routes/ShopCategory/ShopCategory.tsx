import men_banner from "../../assets/images/banner/banner_mens.png";
import women_banner from "../../assets/images/banner/banner_women.png";
import kids_banner from "../../assets/images/banner/banner_kids.png";

import {
  Image,
  Select,
  Group,
  Stack,
  Container,
  SimpleGrid,
} from "@mantine/core";
import styles from "./shopCategory.module.css";
import { useState, useEffect } from "react";
import ProductProps from "../../types/ProductProps.ts";

import Item from "../../components/Item/Item.tsx";

type ShopCategoryProps = {
  shopCategory: "men" | "women" | "kids";
};

const ShopCategory = ({ shopCategory }: ShopCategoryProps) => {
  const [sort, setSort] = useState("New Arrivals");
  const [displayedProducts, setDisplayedProducts] = useState<ProductProps[]>(
    []
  );
  const [endIndex, setEndIndex] = useState<number>(displayedProducts.length);

  const bannerImg = {
    men: men_banner,
    women: women_banner,
    kids: kids_banner,
  };

  const startIndex = 1;

  useEffect(() => {
    // Calculate the range of displayed products
    setEndIndex(displayedProducts.length);
  }, [displayedProducts]);

  useEffect(() => {
    // Fetch products from backend
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/fetchproducts?category=${shopCategory}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const products = await response.json();
        console.log(products);
        setDisplayedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [shopCategory, sort]);

  useEffect(() => {
    // Update displayedProducts based on the filter (input component)
    if (sort === "New Arrivals") {
      setDisplayedProducts((prevProducts) =>
        [...prevProducts].sort((a, b) => b.date - a.date)
      );
    }
    if (sort === "Price: Low to High") {
      setDisplayedProducts((prevProducts) =>
        [...prevProducts].sort((a, b) => a.price - b.price)
      );
    } else if (sort === "Price: High to Low") {
      setDisplayedProducts((prevProducts) =>
        [...prevProducts].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <section className={styles.shop_category}>
      <Container size="xl">
        <Stack gap="lg">
          <Image src={bannerImg[shopCategory]} />
          <Group justify="space-between" align="center">
            <div className={styles.index}>
              <p>
                <span>
                  Showing {startIndex}-{endIndex}
                </span>{" "}
                out of {displayedProducts.length} products.
              </p>
            </div>
            <Select
              label="Sort By"
              value={sort}
              onChange={(value) => setSort(value || "")}
              data={[
                "New Arrivals",
                "Price: Low to High",
                "Price: High to Low",
              ]}
            />
          </Group>
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
            {displayedProducts.map(
              ({ _id, brand, name, images, price, lastPrice }) => (
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
            )}
          </SimpleGrid>
        </Stack>
      </Container>
    </section>
  );
};

export default ShopCategory;
