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
import ProductProps from "../../../../types/ProductProps.ts";
import ProductAccordion from "./components/ProductAccordion.tsx";
import ProductPhotos from "./components/ProductPhotos.tsx";
import ProductForm from "./components/ProductForm.tsx";
import { Link } from "react-router-dom";
import { IconShoppingCart, IconX } from "@tabler/icons-react";
import { SerializedError } from "@reduxjs/toolkit";
import { addItemToCart } from "../../../../state/cart/cartSlice.ts";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../state/store.ts";
import { notifications } from "@mantine/notifications";

const ProductDisplay = ({ product }: { product: ProductProps }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = async (
    quantity: number,
    size: string,
    color: string
  ) => {
    try {
      dispatch(
        addItemToCart({
          cartItemId: uuidv4(),
          productId: product._id,
          color: color,
          quantity: quantity,
          size: size,
          price: product.price,
        })
      );

      notifications.show({
        title: "Success! You've added an item to your cart.",
        message: `${size} ${product.brand} ${color} ${product.name}`,
        icon: <IconShoppingCart />,
      });
    } catch (err) {
      console.log(
        "Error adding product to cart:",
        (err as SerializedError).message
      );
      notifications.show({
        title: "Error! Something went wrong.",
        message: "Please try again.",
        icon: <IconX />,
        color: "red",
      });
    }
  };

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
                  data-testid="product-brand"
                >
                  {product.brand}
                </Anchor>
              </Title>
              <Title
                order={1}
                fw={600}
                fz={{ base: "1.5rem", md: "2rem" }}
                data-testid="product-name"
              >
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
            <ProductForm product={product} handleAddToCart={handleAddToCart} />
          </Stack>
          <ProductAccordion product={product} />
        </Stack>
      </GridCol>
    </Grid>
  );
};

export default ProductDisplay;
