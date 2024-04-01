import NewArrivals from "./NewArrivals/NewArrivals";
import { Container, Stack, Box } from "@mantine/core";
import OnSale from "./OnSale/OnSale";
import WebsiteInfo from "./WebsiteInfo/WebsiteInfo";
import ShopCategories from "./ShopCategories/ShopCategories";
import ShopByBrand from "./ShopByBrand/ShopByBrand";

const Home = () => {
  return (
    <>
      <Box>
        <Container size="xl">
          <Stack gap="lg" my="xl">
            <ShopCategories />
            <OnSale />
            <ShopByBrand />
            <NewArrivals />
            <WebsiteInfo />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Home;
