import styles from "./Offers.module.css";
import { Button, Container, Group, Image, Stack } from "@mantine/core";
import exclusiveImg from "../../assets/images/exclusive_image.png";

const Offers = () => {
  return (
    <section>
      <Container size="xl" className={styles.offers}>
        <Group gap="xl" justify="space-around" align="center">
          <Stack className={styles.left}>
            <p className={styles.heading}>
              Exclusive <br />
              Offers For You
            </p>
            <p className={styles.subheading}>Only on best sellers</p>
            <Button>Check Now</Button>
          </Stack>
          <div className={styles.right}>
            <Image src={exclusiveImg} />
          </div>
        </Group>
      </Container>
    </section>
  );
};

export default Offers;
