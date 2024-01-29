import { Image, Card, Group, Badge, Stack } from "@mantine/core";
import itemStyles from "./Item.module.css";
import { itemProps } from "../../types/itemProps";

const Item = ({ image, name, brand, price, lastPrice }: itemProps) => {
  return (
    <Card padding="lg" radius="none" className={itemStyles.item}>
      <Card.Section className={itemStyles.imageBox}>
        <Image src={image} className={itemStyles.image} />
      </Card.Section>
      <Card.Section className={itemStyles.content}>
        <p className={itemStyles.brand}>{brand}</p>
        <p className={itemStyles.name}>{name}</p>
        <Stack gap="xs">
          <Group gap="xs" className={itemStyles.prices}>
            {lastPrice && <p className={itemStyles.lastPrice}>${lastPrice}</p>}
            <p
              className={`${itemStyles.price} ${lastPrice && itemStyles.sale}`}
            >
              ${price}
            </p>
          </Group>
          {lastPrice && <Badge color="red">Sale</Badge>}
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default Item;
