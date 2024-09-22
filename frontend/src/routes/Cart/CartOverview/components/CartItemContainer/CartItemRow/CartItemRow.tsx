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
import { useState, useEffect } from "react";
import ProductProps from "../../../../../../types/ProductProps.ts";
import {
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "../../../../../../state/cart/cartSlice.ts";
import { useAppSelector } from "../../../../../../state/hooks.ts";

const CartItemRow = ({ _id, productId, color, size, quantity }: CartItem) => {
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteItem] = useDeleteCartItemMutation();
  const [updateItem] = useUpdateCartItemMutation();
  const userId = useAppSelector((state) => state.auth.user?._id);

  const handleRemoveFromCart = async (id: string) => {
    await deleteItem({
      userId,
      itemId: id,
    }).unwrap();
  };

  const handleUpdateSize = async (value: string | null) => {
    if (!value) return;
    await updateItem({
      userId,
      updatedItem: { _id, productId, color, quantity, size: value },
    }).unwrap();
  };

  const handleUpdateQuantity = async (value: string | null) => {
    if (!value) return;
    await updateItem({
      userId,
      updatedItem: { _id, productId, color, size, quantity: Number(value) },
    }).unwrap();
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_HOST}/products/${productId}`
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`${responseData.error}, ${responseData.errorCode}`);
        }

        const { product } = responseData;

        setProduct(product);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error)
          console.log("Error fetching product: ", err.message);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
            onClick={() => handleRemoveFromCart(_id)}
          >
            <IconTrash />
          </UnstyledButton>
        </Stack>
      </GridCol>
    </Grid>
  );
};

export default CartItemRow;
