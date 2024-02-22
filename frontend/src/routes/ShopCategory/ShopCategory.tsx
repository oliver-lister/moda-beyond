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
import { Query, useFetchProducts } from "../../hooks/useFetchProducts.tsx";

type ShopCategoryProps = {
  shopCategory: "men" | "women" | "kids";
};

const bannerImg = {
  men: men_banner,
  women: women_banner,
  kids: kids_banner,
};

const ShopCategory = ({ shopCategory }: ShopCategoryProps) => {
  const [sort, setSort] = useState<Query[]>([
    { prop: "category", value: shopCategory },
  ]);
  const { products, updateQuery } = useFetchProducts(sort);

  useEffect(() => {
    setSort((prevSort) => {
      return prevSort.map((item) => {
        if (item.prop === "category") {
          return { ...item, value: shopCategory };
        }
        return item;
      });
    });
  }, [shopCategory]);

  useEffect(() => {
    updateQuery(sort);
  }, [updateQuery, sort]);

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
                "New Arrivals",
                "Price: Low to High",
                "Price: High to Low",
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
