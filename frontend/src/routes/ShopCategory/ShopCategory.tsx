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
  Box,
  Text,
} from "@mantine/core";
import styles from "./shopCategory.module.css";
import { useEffect, useState } from "react";
import Item from "../../components/Item/Item.tsx";
import Loading from "../../components/Loading/Loading.tsx";
import ProductProps from "../../types/ProductProps.ts";
import { useLocation } from "react-router-dom";

type ShopCategoryProps = {
  shopCategory: "men" | "women" | "kids";
};

const bannerImg = {
  men: men_banner,
  women: women_banner,
  kids: kids_banner,
};

const ShopCategory = ({ shopCategory }: ShopCategoryProps) => {
  const location = useLocation();
  const [products, setProducts] = useState<ProductProps[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/products/fetchproducts${location.pathname}${location.search}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [location]);

  if (!products) {
    return <Loading />;
  }

  return (
    <section className={styles.shop_category}>
      <Container size="xl">
        <Stack gap="lg">
          <Image src={bannerImg[shopCategory]} />
          <Group justify="space-between" align="center">
            <Box className={styles.index}>
              <Text>
                <span>Showing 1-{products.length}</span> out of{" "}
                {products.length} products.
              </Text>
            </Box>
            <Select
              label="Sort By"
              data={[
                { label: "New Arrivals", value: "new" },
                { label: "Price: Low to High", value: "low-to-high" },
                { label: "Price: High to Low", value: "high-to-low" },
              ]}
            />
          </Group>
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
            {products.map(({ _id, ...rest }) => (
              <Item key={_id} _id={_id} {...rest} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </section>
  );
};

export default ShopCategory;
