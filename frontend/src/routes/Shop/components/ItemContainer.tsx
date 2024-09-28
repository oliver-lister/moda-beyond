import Product from "../../../types/ProductProps.ts";
import Item from "../../../components/Item/Item.tsx";
import { SimpleGrid, Center, Text, Skeleton } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
interface ItemContainerProps {
  products: Product[] | undefined;
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}

const ItemContainer: React.FC<ItemContainerProps> = ({
  products,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 6 }}>
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

  if (!isLoading && error) {
    return (
      <Center h="60vh">
        <Text fw={600}>Error!</Text>
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
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
      {products &&
        products.map(({ _id, ...rest }) => (
          <Item key={_id} _id={_id} {...rest} />
        ))}
    </SimpleGrid>
  );
};

export default ItemContainer;
