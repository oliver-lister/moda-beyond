import { Text } from "@mantine/core";

const ProductCounter = ({
  pageCount,
  activePage,
  pageSize,
  totalCount,
}: {
  pageCount: number;
  activePage: number;
  pageSize: number;
  totalCount: number;
}) => {
  // Calculate the start and end indexes of the products being displayed
  const startIndex = pageCount > 0 ? (activePage - 1) * pageSize + 1 : 0;
  const endIndex = startIndex + pageCount - 1;

  return (
    <Text data-testid="productcounter-text">
      <span style={{ fontWeight: "600" }}>
        {`Showing ${startIndex}-${endIndex > 0 ? endIndex : 0}`}{" "}
      </span>
      out of {totalCount} products.
    </Text>
  );
};

export default ProductCounter;
