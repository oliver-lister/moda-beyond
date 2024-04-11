import { Group, Indicator, rem } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";

const ShoppingCartButton = ({ cartTotal }: { cartTotal: number }) => {
  return (
    <Group>
      {cartTotal === 0 ? (
        <IconShoppingCart style={{ width: rem(32), height: rem(32) }} />
      ) : (
        <Indicator
          inline
          label={cartTotal}
          size={16}
          color="violet.5"
          zIndex={2}
        >
          <IconShoppingCart style={{ width: rem(32), height: rem(32) }} />
        </Indicator>
      )}
    </Group>
  );
};

export default ShoppingCartButton;
