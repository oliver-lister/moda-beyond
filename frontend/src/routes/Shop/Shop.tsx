import {
  Select,
  Stack,
  Container,
  SimpleGrid,
  Box,
  Text,
  Title,
  Pagination,
  Center,
  Group,
  Grid,
  GridCol,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import ItemContainer from "./components/ItemContainer.tsx";
import { useSearchParams } from "react-router-dom";
import ProductCounter from "./components/ProductCounter.tsx";
import { useGetProductsQuery } from "../../state/productsSlice/productsSlice.ts";
import FilterForm from "./components/FilterForm.tsx";

type SortOption = {
  sortBy: string;
  sortOrder: number;
};

const sortOptions: { [key: string]: SortOption } = {
  price_low_to_high: { sortBy: "price", sortOrder: 1 },
  price_high_to_low: { sortBy: "price", sortOrder: -1 },
  date_new_to_old: { sortBy: "createdAt", sortOrder: -1 },
};

const pageSize = 12;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("date_new_to_old");

  const getSearchingFor = () => {
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const searchTerm = searchParams.get("search");

    if (category) {
      return category.toUpperCase();
    } else if (brand) {
      return brand.toUpperCase();
    } else if (searchTerm) {
      return `Searching for '${searchTerm}'`;
    }
    return "";
  };

  // Generate the correct query params dynamically from the state
  const getUpdatedSearchParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", sortOptions[sort].sortBy);
    params.set("sortOrder", sortOptions[sort].sortOrder.toString());
    params.set("page", activePage.toString());
    params.set("pageSize", String(pageSize));
    return params.toString();
  }, [searchParams, sort, activePage]);

  useEffect(() => {
    // Update URL search params when sort or page changes
    setSearchParams(getUpdatedSearchParams());
  }, [sort, activePage]);

  const { data, isLoading, error } = useGetProductsQuery(
    getUpdatedSearchParams()
  );
  const products = data?.products || [];
  const totalCount = data?.totalCount || 0;

  const handleChangeSort = (value: string | null) => {
    if (value) {
      const sort = sortOptions[value];
      setSort(value);
      searchParams.set("sortBy", sort.sortBy);
      searchParams.set("sortOrder", sort.sortOrder.toString());
      handleChangePage(1);
      setSearchParams(searchParams);
    }
  };

  const handleChangePage = (value: number) => {
    searchParams.set("page", value.toString());
    setSearchParams(searchParams);
    setPage(value);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section style={{ padding: "1rem 0" }}>
      <Container size="xl">
        <Stack gap="lg">
          <SimpleGrid
            cols={{ base: 1, md: 3 }}
            style={{ alignItems: "center" }}
          >
            <Title order={1} size="1rem" ta={{ base: "center", md: "left" }}>
              {getSearchingFor()}
            </Title>
            <Box
              style={{ textAlign: "center" }}
              data-testid="productcounter-container"
            >
              {products ? (
                <ProductCounter
                  pageCount={products.length}
                  activePage={activePage}
                  pageSize={pageSize}
                  totalCount={totalCount}
                />
              ) : (
                <Text>Loading...</Text>
              )}
            </Box>
            <Group justify="flex-end">
              <Select
                maw={250}
                allowDeselect={false}
                data={[
                  { label: "New Arrivals", value: "date_new_to_old" },
                  {
                    label: "Price: Low to High",
                    value: "price_low_to_high",
                  },
                  { label: "Price: High to Low", value: "price_high_to_low" },
                ]}
                value={sort}
                onChange={handleChangeSort}
              />
            </Group>
          </SimpleGrid>
          <Grid>
            <GridCol span={{ base: 12, md: 3 }}>
              <FilterForm />
            </GridCol>
            <GridCol span={{ base: 12, md: 9 }}>
              <ItemContainer
                products={products}
                isLoading={isLoading}
                error={error}
              />
            </GridCol>
          </Grid>
          <Center>
            <Pagination
              total={Math.ceil(totalCount / pageSize)}
              value={activePage}
              onChange={handleChangePage}
            />
          </Center>
        </Stack>
      </Container>
    </section>
  );
};

export default Shop;
