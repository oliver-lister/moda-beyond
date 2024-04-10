import { Stack, Title } from "@mantine/core";
import ProductCollectionTeaser from "./ProductCollectionTeaser/ProductCollectionTeaser.tsx";

const OnSale = () => {
  return (
    <section>
      <Stack>
        <Title order={3}>On Sale</Title>
        <ProductCollectionTeaser
          query="lastPrice[$exists]=true&sortBy=date&sortOrder=-1"
          cap={6}
        />
      </Stack>
    </section>
  );
};

export default OnSale;
