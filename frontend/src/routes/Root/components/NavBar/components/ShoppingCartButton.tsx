import UserProps from "../../../../../types/UserProps";
import { Group, Indicator, rem } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";

const ShoppingCartButton = ({ user }: { user: UserProps | null }) => {
  const totalProductsInCart =
    user &&
    user.cart &&
    user.cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Group>
      {!user || (user && user.cart && user.cart.length === 0) ? (
        <IconShoppingCart style={{ width: rem(32), height: rem(32) }} />
      ) : (
        <Indicator inline label={totalProductsInCart} size={16} color="violet">
          <IconShoppingCart style={{ width: rem(32), height: rem(32) }} />
        </Indicator>
      )}
    </Group>
  );
};

export default ShoppingCartButton;
