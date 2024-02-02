import Hero from "./Hero/Hero";
import Popular from "./Popular/Popular";
import Offers from "./Offers/Offers";
import NewCollections from "./NewCollections/NewCollections";
import { Container, Stack } from "@mantine/core";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <>
      <div className={styles.home}>
        <Container size="xl">
          <Stack gap="lg">
            <Hero />
            <Popular />
            <Offers />
            <NewCollections />
          </Stack>
        </Container>
      </div>
    </>
  );
};

export default Home;
