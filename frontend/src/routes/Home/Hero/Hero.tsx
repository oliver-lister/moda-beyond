import { Button, Container, Group, Image } from "@mantine/core";
import styles from "./Hero.module.css";
import { IconArrowRight, IconCircleCheckFilled } from "@tabler/icons-react";
import heroImage from "../../../assets/images/hero_image.png";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <Container size="xl">
        <Group
          gap="xl"
          justify="space-around"
          align="center"
          className={styles.grid}
        >
          <div className={styles.left}>
            <div>
              <h2>New Arrivals Only</h2>
              <Group>
                <p>new</p>
                <IconCircleCheckFilled size={50} />
              </Group>
              <p>collections</p>
              <p>for everyone</p>
            </div>
            <div>
              <Button rightSection={<IconArrowRight />}>
                Latest Collection
              </Button>
            </div>
          </div>
          <div className={styles.right}>
            <Image src={heroImage} />
          </div>
        </Group>
      </Container>
    </section>
  );
};

export default Hero;
