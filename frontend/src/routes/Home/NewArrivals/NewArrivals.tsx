import { Stack, Title } from "@mantine/core";
import ProductCollectionTeaser from "../../../components/ProductCollectionTeaser/ProductCollectionTeaser.tsx";

const NewArrivals = () => {
  return (
    <section>
      <Stack>
        <Title order={3}>New Arrivals</Title>
        <ProductCollectionTeaser query="sortBy=date&sortOrder=-1" cap={6} />
      </Stack>
    </section>
  );
};

export default NewArrivals;
