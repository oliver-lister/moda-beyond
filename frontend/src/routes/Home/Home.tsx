import NewArrivals from "./components/NewArrivals";
import { Container, Stack, Box } from "@mantine/core";
import OnSale from "./components/OnSale";
import WebsiteInfo from "./components/WebsiteInfo";
import ShopCategories from "./components/ShopCategories";
import ShopByBrand from "./components/ShopByBrand";

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
