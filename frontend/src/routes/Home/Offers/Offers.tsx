import styles from "./Offers.module.css";
import { Button, Group, Image, Stack } from "@mantine/core";
import exclusiveImg from "../../../assets/images/exclusive_image.png";
import { IconHeart } from "@tabler/icons-react";

const Offers = () => {
  return (
    <section className={styles.offers}>
      <Group gap="xl" justify="space-around" align="center">
        <Stack className={styles.left}>
          <div>
            <h4>Only on best sellers</h4>
            <Group>
              <p>exclusive</p>
              <IconHeart size={50} />
            </Group>
            <p>offers for you</p>
          </div>
          <Button>Check Now</Button>
        </Stack>
        <div className={styles.right}>
          <Image src={exclusiveImg} />
        </div>
      </Group>
    </section>
  );
};

export default Offers;
