import { Image, Group, Badge, Stack } from "@mantine/core";
import styles from "./Item.module.css";
import ProductProps from "../../types/ProductProps";
import { Link } from "react-router-dom";

const Item = ({ _id, images, name, brand, price, lastPrice }: ProductProps) => {
  return (
    <Link
      to={`/product/:${_id}`}
      className={styles.link}
      onClick={() => window.scrollTo(0, 0)}
    >
      <article className={styles.item}>
        <div className={styles.imageBox}>
          <Image src={images[0]} className={styles.image} />
        </div>
        <div className={styles.content}>
          <p className={styles.brand}>{brand}</p>
          <p className={styles.name}>{name}</p>
          <Stack gap="xs">
            <Group gap="xs" className={styles.prices}>
              {lastPrice && <p className={styles.lastPrice}>${lastPrice}</p>}
              <p className={`${styles.price} ${lastPrice && styles.sale}`}>
                ${price}
              </p>
              {lastPrice && <Badge color="red">Sale</Badge>}
            </Group>
          </Stack>
        </div>
      </article>
    </Link>
  );
};

export default Item;
