import { Image, Grid, Stack, Group, GridCol, Select } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconTrash } from "@tabler/icons-react";
import styles from "./cartitem.module.css";
import { CartItemProps } from "../../../types/UserProps";

const CartItem = ({ product, color, size, quantity }: CartItemProps) => {
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
                <p className={styles.title}>
                  {product.brand} {product.name}
                </p>
                <p className={styles.color}>Colour: {color}</p>
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
            />
            <Select
              className={styles.select}
              label="Quantity"
              value={`${quantity}`}
              data={["1", "2", "3", "4", "5"]}
            />
          </Group>
        </GridCol>
        <GridCol span={{ base: 2, md: 1 }} order={{ base: 2, md: 3 }}>
          <Stack align="flex-end">
            <p className={styles.price}>${product.price * quantity}</p>
            <button className={styles.remove}>
              <IconTrash />
            </button>
          </Stack>
        </GridCol>
      </Grid>
    </li>
  );
};

export default CartItem;
