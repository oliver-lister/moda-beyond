import { Button, Container, Group, Image, SimpleGrid } from "@mantine/core";
import styles from "./hero.module.css";
import { IconArrowRight, IconCircleCheckFilled } from "@tabler/icons-react";
import heroImage from "../../../assets/images/hero_image.png";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, md: 2 }} className={styles.grid}>
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
            <Button rightSection={<IconArrowRight />}>Latest Collection</Button>
          </div>
          <div className={styles.right}>
            <Image src={heroImage} />
          </div>
        </SimpleGrid>
      </Container>
    </section>
  );
};

export default Hero;
