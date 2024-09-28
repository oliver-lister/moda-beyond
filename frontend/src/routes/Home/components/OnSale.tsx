import { Stack, Title } from "@mantine/core";
import ProductCollectionTeaser from "../../../components/ProductCollectionTeaser/ProductCollectionTeaser.tsx";

const OnSale = () => {
  return (
    <section>
      <Stack>
        <Title order={3}>On Sale</Title>
        <ProductCollectionTeaser query="lastPrice[$exists]=true" cap={6} />
      </Stack>
    </section>
  );
};

export default OnSale;
