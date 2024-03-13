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
import { CartItemProps } from "../../../../types/UserProps";
import { useState, useEffect } from "react";
import ProductProps from "../../../../types/ProductProps";

const CartItem = ({
  _id,
  productId,
  color,
  size,
  quantity,
  handleRemoveFromCart,
  handleUpdateSize,
  handleUpdateQuantity,
}: CartItemProps & {
  handleRemoveFromCart: (cartItemId: string) => void;
  handleUpdateSize: (cartItemId: string, newSize: string) => void;
  handleUpdateQuantity: (cartItemId: string, newQuantity: string) => void;
}) => {
  const [product, setProduct] = useState<ProductProps | null>(null);

  useEffect(() => {
    const getProductData = async (productId: CartItemProps["productId"]) => {
      try {
        const response = await fetch(
          `http://localhost:3000/products/fetchproductbyid/${productId}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch product data: ${response.statusText}`
          );
        }
        const productData = await response.json();
        return productData as ProductProps;
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }
    };
    const fetchData = async () => {
      const data = await getProductData(productId);
      if (data) {
        setProduct(data);
      }
    };

    fetchData();
  }, [productId]);

  if (!product)
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

  return (
    <li>
      <Grid align="center" className={styles.grid_row}>
        <GridCol span={{ base: 10, md: 7 }} order={{ base: 1 }}>
          <Link to={`/product/${product._id}`} className={styles.link}>
            <Group wrap="nowrap">
              <Image
                src={product.images[0]}
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
              data={["INTL S", "INTL M", "INTL L", "INTL XL"]}
              onChange={(value) => value && _id && handleUpdateSize(_id, value)}
            />
            <Select
              className={styles.select}
              label="Quantity"
              value={`${quantity}`}
              data={["1", "2", "3", "4", "5"]}
              onChange={(value) =>
                value && _id && handleUpdateQuantity(_id, value)
              }
            />
          </Group>
        </GridCol>
        <GridCol span={{ base: 2, md: 1 }} order={{ base: 2, md: 3 }}>
          <Stack align="flex-end">
            <Text className={styles.price}>${product.price * quantity}</Text>
            <UnstyledButton
              className={styles.remove}
              onClick={() => _id && handleRemoveFromCart(_id)}
            >
              <IconTrash />
            </UnstyledButton>
          </Stack>
        </GridCol>
      </Grid>
    </li>
  );
};

export default CartItem;
