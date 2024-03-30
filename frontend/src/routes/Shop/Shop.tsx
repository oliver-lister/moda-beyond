import {
  Select,
  Group,
  Stack,
  Container,
  SimpleGrid,
  Box,
  Text,
  Title,
  Pagination,
  Center,
} from "@mantine/core";
import { useState } from "react";
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
  const { products, isLoading, totalCount } = useFetchProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setPage] = useState<number>(1);

  const handleChangeSort = (value: string | null) => {
    if (value) {
      const sort = sortOptions[value];
      searchParams.set("sortBy", sort.sortBy);
      searchParams.set("sortOrder", sort.sortOrder.toString());
      searchParams.set("page", "1");
      setSearchParams(searchParams);
    }
  };

  const handleChangePage = (value: number) => {
    searchParams.set("page", value.toString())
    setSearchParams(searchParams);
    setPage(value);
  }

  return (
    <section style={{ padding: "1rem 0" }}>
      <Container size="xl">
        <Stack gap="lg">
          <SimpleGrid cols={3} style={{ alignItems: "center" }}>
            <Title order={2} size="1rem">
              {searchParams.get("search")
                ? `Showing results for ${searchParams.get("search")}`
                : searchParams.get("category")?.toUpperCase()}
            </Title>
            <Box style={{ textAlign: "center" }}>
              {!isLoading && products ? (
                <Text>
                  <span style={{ fontWeight: "600" }}>
                    Showing {(activePage > 1 ? (activePage - 1) * 12 + 1 : 1)}-{(activePage > 1 ? (activePage - 1) * 12 : 0) + products.length}
                  </span>{" "}
                  out of {totalCount} products.
                </Text>
              ) : (
                <Text>
                  <span style={{ fontWeight: "600" }}>Showing 1-#</span> out of
                  # products.
                </Text>
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
          <Center>
          <Pagination total={Math.ceil((totalCount / 12)) } value={activePage} onChange={handleChangePage} />
          </Center>
        </Stack>
      </Container>
    </section>
  );
};

export default Shop;
