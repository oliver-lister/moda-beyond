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
} from "@mantine/core";
import { useEffect, useState } from "react";
import ItemContainer from "./ItemContainer/ItemContainer.tsx";
import { useSearchParams } from "react-router-dom";
import { useFetchProducts } from "../../hooks/useFetchProducts.tsx";
import ProductProps from "../../types/ProductProps.ts";

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
  const [searchingFor, setSearchingFor] = useState<string>("");
  const [activePage, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("date_new_to_old");

  useEffect(() => {
    // set 'Searching For' title based on searchParams
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const searchTerm = searchParams.get("search");
    if (category) {
      setSearchingFor(category.toUpperCase());
    } else if (brand) {
      setSearchingFor(brand.toUpperCase());
    } else if (searchTerm) {
      setSearchingFor(`Searching for '${searchTerm}'`);
    }

    // set Page based on searchParams
    const pageNum = Number(searchParams.get("page"));
    if (pageNum) setPage(pageNum);

    // set Sort Option based on searchParams
    const sortBy = searchParams.get("sortBy");
    const sortOrder = Number(searchParams.get("sortOrder"));

    if (sortBy && sortOrder) {
      const newSort = Object.keys(sortOptions).find((key) => {
        const option = sortOptions[key];
        return option.sortBy === sortBy && option.sortOrder === sortOrder;
      });
      if (newSort) {
        setSort(newSort);
      }
    }
  }, [searchParams]);

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
  };

  const ProductCounter = ({ products }: { products: ProductProps[] }) => {
    return (
      <Text>
        <span style={{ fontWeight: "600" }}>
          Showing{" "}
          {products.length > 0
            ? activePage > 1
              ? (activePage - 1) * 12 + 1
              : 1
            : 0}
          -{(activePage > 1 ? (activePage - 1) * 12 : 0) + products.length}
        </span>{" "}
        out of {totalCount} products.
      </Text>
    );
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
              {searchingFor}
            </Title>
            <Box style={{ textAlign: "center" }}>
              {!isLoading && products ? (
                <ProductCounter products={products} />
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
          {products && products.length > 0 ? (
            <ItemContainer products={products} isLoading={isLoading} />
          ) : (
            <Center h="60vh">
              <Text fw={600}>No products found for this search query.</Text>
            </Center>
          )}

          <Center>
            <Pagination
              total={Math.ceil(totalCount / 12)}
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
