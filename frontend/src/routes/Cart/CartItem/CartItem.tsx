import { Image, Grid, Stack, Group, GridCol, Select } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconTrash } from "@tabler/icons-react";
import styles from "./cartitem.module.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../state/store";
import {
  removeItem,
  updateQuantity,
  updateSize,
} from "../../../state/cart/cartSlice";

const CartItem = ({
  cartId,
  image,
  productId,
  brand,
  name,
  selectedColor,
  size,
  quantity,
  price,
}: {
  cartId: string | undefined;
  image: string;
  productId: number;
  brand: string;
  name: string;
  selectedColor: string | null;
  size: string | null;
  quantity: number;
  price: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <li key={cartId}>
      <Grid align="center" className={styles.grid_row}>
        <GridCol span={{ base: 10, md: 7 }} order={{ base: 1 }}>
          <Link to={`/product/${productId}`} className={styles.link}>
            <Group wrap="nowrap">
              <Image src={image} height={100} className={styles.image} />
              <Stack gap="sm">
                <p className={styles.title}>
                  {brand} {name}
                </p>
                <p className={styles.color}>Colour: {selectedColor}</p>
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
              onChange={(newSize) =>
                dispatch(
                  updateSize({
                    cartId: cartId,
                    size: newSize,
                  })
                )
              }
              data={["INTL S", "INTL M", "INTL L", "INTL XL"]}
            />
            <Select
              className={styles.select}
              label="Quantity"
              value={`${quantity}`}
              onChange={(newQuantity) => {
                dispatch(
                  updateQuantity({
                    cartId: cartId,
                    quantity: Number(newQuantity),
                  })
                );
              }}
              data={["1", "2", "3", "4", "5"]} // Add more options as needed
            />
          </Group>
        </GridCol>
        <GridCol span={{ base: 2, md: 1 }} order={{ base: 2, md: 3 }}>
          <Stack align="flex-end">
            <p className={styles.price}>${price * quantity}</p>
            <button
              className={styles.remove}
              onClick={() => dispatch(removeItem(cartId))}
            >
              <IconTrash />
            </button>
          </Stack>
        </GridCol>
      </Grid>
    </li>
  );
};

export default CartItem;
