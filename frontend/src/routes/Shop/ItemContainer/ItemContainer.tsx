import ProductProps from "../../../types/ProductProps.ts";
import Item from "../../../components/Item/Item.tsx";
import { SimpleGrid, Center, Text, Skeleton } from "@mantine/core";
interface ItemContainerProps {
  products: ProductProps[] | null;
  isLoading: boolean;
}

const ItemContainer: React.FC<ItemContainerProps> = ({
  products,
  isLoading,
}) => {
  if (isLoading && !products) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} width={200} height={400} />
        ))}
      </SimpleGrid>
    );
  }

  if (products && products.length === 0 && !isLoading) {
    return (
      <Center h="60vh">
        <Text fw={600}>No products found for this search query.</Text>
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
