import { Image, Card, Group } from "@mantine/core";
import itemStyles from "./Item.module.css";
import { itemProps } from "../../types/itemProps";

const Item = ({ image, name, price, lastPrice }: itemProps) => {
  return (
    <Card padding="lg" withBorder className={itemStyles.item}>
      <Card.Section className={itemStyles.imageBox}>
        <Image src={image} className={itemStyles.image} />
      </Card.Section>
      <Card.Section className={itemStyles.content}>
        <p className={itemStyles.title}>{name}</p>
        <Group gap={20} className={itemStyles.prices}>
          <p className={itemStyles.lastPrice}>${lastPrice}</p>
          <p className={itemStyles.price}>${price}</p>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default Item;
