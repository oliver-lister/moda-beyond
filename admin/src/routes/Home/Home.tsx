import { Container, Stack } from "@mantine/core";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <>
      <div className={styles.home}>
        <Container size="xl">
          <Stack gap="lg"></Stack>
        </Container>
      </div>
    </>
  );
};

export default Home;
