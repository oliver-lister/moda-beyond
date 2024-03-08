import ProductProps from "../../../types/ProductProps.ts";
import Item from "../../../components/Item/Item.tsx";
import { Center, Loader, SimpleGrid } from "@mantine/core";
interface ItemContainerProps {
  products: ProductProps[] | null;
  isLoading: boolean;
}

const ItemContainer: React.FC<ItemContainerProps> = ({
  products,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }
  return (
    <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
      {products &&
        products.map(({ _id, ...rest }) => (
          <Item key={_id} _id={_id} {...rest} />
        ))}
    </SimpleGrid>
  );
};

export default ItemContainer;
