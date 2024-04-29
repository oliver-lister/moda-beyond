import ProductProps from "../../../types/ProductProps.ts";
import Item from "../../../components/Item/Item.tsx";
import { SimpleGrid, Center, Text, Skeleton } from "@mantine/core";
interface ItemContainerProps {
  products: ProductProps[];
  isLoading: boolean;
  error: string;
}

const ItemContainer: React.FC<ItemContainerProps> = ({
  products,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            width="100%"
            height={400}
            animate
            data-testid="skeleton"
          />
        ))}
      </SimpleGrid>
    );
  }

  if (!isLoading && !products && error) {
    return (
      <Center h="60vh">
        <Text fw={600}>{error}</Text>
      </Center>
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
