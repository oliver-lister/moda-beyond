import NewArrivals from "./NewArrivals/NewArrivals";
import { Container, Stack, Box } from "@mantine/core";
import styles from "./Home.module.css";
import OnSale from "./OnSale/OnSale";

const Home = () => {
  return (
    <>
      <Box className={styles.home}>
        <Container size="xl">
          <Stack gap="lg">
            <OnSale />
            <NewArrivals />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Home;
