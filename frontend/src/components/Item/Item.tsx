import { Image, Card, Group, Badge, Stack } from "@mantine/core";
import styles from "./Item.module.css";
import ProductProps from "../../types/ProductProps";
import { Link } from "react-router-dom";

const Item = ({ id, image, name, brand, price, lastPrice }: ProductProps) => {
  return (
    <Link
      to={`/product/${id}`}
      className={styles.link}
      onClick={() => window.scrollTo(0, 0)}
    >
      <Card padding="lg" radius="none" className={styles.item}>
        <Card.Section className={styles.imageBox}>
          <Image src={image[0]} className={styles.image} />
        </Card.Section>
        <Card.Section className={styles.content}>
          <p className={styles.brand}>{brand}</p>
          <p className={styles.name}>{name}</p>
          <Stack gap="xs">
            <Group gap="xs" className={styles.prices}>
              {lastPrice && <p className={styles.lastPrice}>${lastPrice}</p>}
              <p className={`${styles.price} ${lastPrice && styles.sale}`}>
                ${price}
              </p>
            </Group>
            {lastPrice && <Badge color="red">Sale</Badge>}
          </Stack>
        </Card.Section>
      </Card>
    </Link>
  );
};

export default Item;
