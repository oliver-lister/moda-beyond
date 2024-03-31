import NewArrivals from "./NewArrivals/NewArrivals";
import { Container, Stack, Box } from "@mantine/core";
import OnSale from "./OnSale/OnSale";
import WebsiteInfo from "./WebsiteInfo/WebsiteInfo";

const Home = () => {
  return (
    <>
      <Box>
        <Container size="xl">
          <Stack gap="lg" my="xl">
            <OnSale />
            <NewArrivals />
            <WebsiteInfo />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Home;
