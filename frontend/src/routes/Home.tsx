import Hero from "../components/hero/Hero";
import Popular from "../components/popular/Popular";
import Offers from "../components/offers/Offers";
import NewCollections from "../components/newCollections/NewCollections";
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
