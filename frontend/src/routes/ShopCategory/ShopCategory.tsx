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

import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";

import { useState, useEffect } from "react";
import ProductProps from "../../types/ProductProps.ts";

import Item from "../../components/Item/Item.tsx";

type ShopCategoryProps = {
  shopCategory: "men" | "women" | "kids";
};

const ShopCategory = ({ shopCategory }: ShopCategoryProps) => {
  const products = useSelector((state: RootState) => state.products.items);
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
    // Update displayedProducts based on the category
    setDisplayedProducts(
      products.filter((product) => product.category === shopCategory)
    );
  }, [shopCategory, products]);

  useEffect(() => {
    // Update displayedProducts based on the filter (input component)
    if (sort === "New Arrivals") {
      setDisplayedProducts((prevProducts) =>
        [...prevProducts].sort((a, b) => b.id - a.id)
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
              ({ id, brand, name, image, price, lastPrice }) => (
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

export default ShopCategory;
