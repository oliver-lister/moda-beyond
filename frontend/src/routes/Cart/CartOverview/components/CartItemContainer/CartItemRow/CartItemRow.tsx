import {
  Image,
  Grid,
  Stack,
  Group,
  GridCol,
  Select,
  UnstyledButton,
  Text,
  Skeleton,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconTrash } from "@tabler/icons-react";
import styles from "./cartitem.module.css";
import { CartItem } from "../../../../../../types/UserProps.ts";
import { notifications } from "@mantine/notifications";
import { useCart } from "../../../../../../state/cart/hooks/useCart.ts";
import { useGetProductQuery } from "../../../../../../state/productsSlice/productsSlice.ts";

const CartItemRow = ({
  productId,
  color,
  size,
  quantity,
  cartItemId,
}: CartItem) => {
  const { data: product, isLoading } = useGetProductQuery(productId);
  const { removeItemFromCart, updateItemInCart } = useCart();

  const handleUpdateSize = async (value: string | null) => {
    if (!value) return;
    try {
      await updateItemInCart({
        productId,
        color,
        size: value,
        quantity,
        cartItemId,
      });
    } catch (error) {
      console.error("Error updating cart:", error);

      notifications.show({
        title: "Update failed",
        message:
          "We encountered an error while updating your cart. Please try again.",
        color: "red",
      });
    }
  };

  const handleUpdateQuantity = async (value: string | null) => {
    if (!value) return;
    try {
      await updateItemInCart({
        productId,
        color,
        size,
        quantity: Number(value),
        cartItemId,
      });
    } catch (error) {
      console.error("Error updating cart:", error);

      notifications.show({
        title: "Update failed",
        message:
          "We encountered an error while updating your cart. Please try again.",
        color: "red",
      });
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    if (!cartItemId) return;
    try {
      await removeItemFromCart(cartItemId);
    } catch (err) {
      if (err instanceof Error)
        console.error("Error updating cart:", err.message);
      notifications.show({
        title: "Update failed",
        message:
          "We encountered an error while updating your cart. Please try again.",
        color: "red",
      });
    }
  };

  if (!product && isLoading)
    return (
      <Grid align="center" className={styles.grid_row}>
        <GridCol span={{ base: 10, md: 7 }} order={{ base: 1 }}>
          <Group wrap="nowrap">
            <Skeleton height={100} />
          </Group>
        </GridCol>
        <GridCol span={{ base: 12, md: 4 }} order={{ base: 3, md: 2 }}>
          <Group>
            <Skeleton height={40} width={100} />
            <Skeleton height={40} width={100} />
          </Group>
        </GridCol>
        <GridCol span={{ base: 2, md: 1 }} order={{ base: 2, md: 3 }}>
          <Stack align="flex-end">
            <Skeleton height={32} width={32} />
            <Skeleton height={32} width={32} />
          </Stack>
        </GridCol>
      </Grid>
    );

  if (!product) {
    return (
      <Grid align="center" className={styles.grid_row}>
        <GridCol span={{ base: 10, md: 7 }} order={{ base: 1 }}>
          <Text>No product found.</Text>
        </GridCol>
        <GridCol
          span={{ base: 12, md: 4 }}
          order={{ base: 3, md: 2 }}
        ></GridCol>
        <GridCol span={{ base: 2, md: 1 }} order={{ base: 2, md: 3 }}></GridCol>
      </Grid>
    );
  }

  return (
    <Grid align="center" className={styles.grid_row}>
      <GridCol span={{ base: 10, md: 7 }} order={{ base: 1 }}>
        <Link to={`/product/${product._id}`} className={styles.link}>
          <Group wrap="nowrap">
            <Image
              src={import.meta.env.VITE_BACKEND_HOST + product.images[0]}
              height={100}
              className={styles.image}
            />
            <Stack gap="sm">
              <Text className={styles.title}>
                {product.brand} {product.name}
              </Text>
              <Text className={styles.color}>Colour: {color}</Text>
            </Stack>
          </Group>
        </Link>
      </GridCol>
      <GridCol span={{ base: 12, md: 4 }} order={{ base: 3, md: 2 }}>
        <Group>
          <Select
            className={styles.select}
            label="Size"
            value={size}
            data={product.availableSizes}
            onChange={handleUpdateSize}
          />
          <Select
            className={styles.select}
            label="Quantity"
            value={quantity.toString()}
            data={["1", "2", "3", "4", "5"]}
            onChange={handleUpdateQuantity}
          />
        </Group>
      </GridCol>
      <GridCol span={{ base: 2, md: 1 }} order={{ base: 2, md: 3 }}>
        <Stack align="flex-end">
          <Text className={styles.price}>
            ${Math.round(product.price * quantity * 100) / 100}
          </Text>
          <UnstyledButton
            className={styles.remove}
            onClick={() => handleRemoveFromCart(cartItemId)}
          >
            <IconTrash />
          </UnstyledButton>
        </Stack>
      </GridCol>
    </Grid>
  );
};
export default CartItemRow;
