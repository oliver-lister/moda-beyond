import {
  Select,
  Group,
  Stack,
  Container,
  SimpleGrid,
  Box,
  Text,
} from "@mantine/core";
import ItemContainer from "./ItemContainer/ItemContainer.tsx";
import { useSearchParams } from "react-router-dom";
import { useFetchProducts } from "../../hooks/useFetchProducts.tsx";

type SortOption = {
  sortBy: string;
  sortOrder: number;
};

const sortOptions: { [key: string]: SortOption } = {
  price_low_to_high: { sortBy: "price", sortOrder: 1 },
  price_high_to_low: { sortBy: "price", sortOrder: -1 },
  date_new_to_old: { sortBy: "date", sortOrder: -1 },
};

const Shop = () => {
  const { products, isLoading } = useFetchProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangeSort = (value: string) => {
    const sort = sortOptions[value];
    searchParams.set("sortBy", sort.sortBy);
    searchParams.set("sortOrder", sort.sortOrder.toString());
    setSearchParams(searchParams);
  };

  return (
    <section style={{ padding: "1rem 0" }}>
      <Container size="xl">
        <Stack gap="lg">
          <SimpleGrid cols={3} style={{ alignItems: "center" }}>
            <Text>
              {searchParams.get("search")
                ? `Showing results for ${searchParams.get("search")}`
                : searchParams.get("category")?.toUpperCase()}
            </Text>
            <Box style={{ textAlign: "center" }}>
              {!isLoading && products ? (
                <Text>
                  <span style={{ fontWeight: "600" }}>
                    Showing 1-{products.length}
                  </span>{" "}
                  out of {products.length} products.
                </Text>
              ) : (
                <div>Loading</div>
              )}
            </Box>
            <Group justify="flex-end">
              <Select
                allowDeselect={false}
                data={[
                  { label: "New Arrivals", value: "date_new_to_old" },
                  {
                    label: "Price: Low to High",
                    value: "price_low_to_high",
                  },
                  { label: "Price: High to Low", value: "price_high_to_low" },
                ]}
                defaultValue={"date_new_to_old"}
                onChange={handleChangeSort}
              />
            </Group>
          </SimpleGrid>
          <ItemContainer products={products} isLoading={isLoading} />
        </Stack>
      </Container>
    </section>
  );
};

export default Shop;
