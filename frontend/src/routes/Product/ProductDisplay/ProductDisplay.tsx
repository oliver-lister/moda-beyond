import styles from "./productdisplay.module.css";
import {
  Grid,
  GridCol,
  Stack,
  Group,
  Badge,
  Text,
  Title,
  Anchor,
  Box,
} from "@mantine/core";
import ProductProps from "../../../types/ProductProps";
import ProductAccordion from "./components/ProductAccordion.tsx";
import ProductPhotos from "./components/ProductPhotos.tsx";
import ProductForm from "./components/ProductForm.tsx";
import { Link } from "react-router-dom";

const ProductDisplay = ({ product }: { product: ProductProps }) => {
  if (!product) {
    return <Text>Waiting for product.</Text>;
  }

  return (
    <Grid className={styles.product_display} gutter="xl" overflow="hidden">
      <ProductPhotos images={product.images} />
      <GridCol span={{ base: 12, md: 5 }}>
        <Stack>
          <Stack gap="xl">
            <Box>
              <Title order={2} fw={400} fz="1rem">
                <Anchor
                  component={Link}
                  to={`/shop?brand=${product.brand}&sortBy=date&sortOrder=-1`}
                >
                  {product.brand}
                </Anchor>
              </Title>
              <Title order={1} fw={600} fz={{ base: "1.5rem", md: "2rem" }}>
                {product.name}
              </Title>
              <Group gap="xs" className={styles.prices}>
                {product.lastPrice && product.lastPrice > product.price && (
                  <Text
                    size="lg"
                    style={{ textDecoration: "line-through" }}
                    c="gray"
                  >
                    ${product.lastPrice}
                  </Text>
                )}
                <Text
                  size="xl"
                  className={`${styles.price} ${
                    product.lastPrice &&
                    product.lastPrice > product.price &&
                    styles.sale
                  }`}
                >
                  ${product.price}
                </Text>
                {product.lastPrice && product.lastPrice > product.price && (
                  <Badge color="red">Sale</Badge>
                )}
              </Group>
            </Box>
            <ProductForm product={product} />
          </Stack>
          <ProductAccordion product={product} />
        </Stack>
      </GridCol>
    </Grid>
  );
};

export default ProductDisplay;
