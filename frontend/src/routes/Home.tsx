import Hero from "../components/Hero/Hero";
import Popular from "../components/Popular/Popular";
import Offers from "../components/Offers/Offers";
import NewCollections from "../components/NewCollections/NewCollections";
import { Stack } from "@mantine/core";

const Home = () => {
  return (
    <>
      <Stack>
        <Hero />
        <Popular />
        <Offers />
        <NewCollections />
      </Stack>
    </>
  );
};

export default Home;
