import { Button, Container, Group, Image } from "@mantine/core";
import heroStyles from "./Hero.module.css";
import { IconArrowRight, IconCircleCheckFilled } from "@tabler/icons-react";
import heroImage from "../../assets/images/hero_image.png"; // Import the image

const Hero = () => {
  return (
    <section className={heroStyles.hero}>
      <Container size="xl">
        <Group
          gap="xl"
          justify="space-around"
          align="center"
          className={heroStyles.grid}
        >
          <div className={heroStyles.left}>
            <div>
              <h2>New Arrivals Only</h2>
              <div>
                <Group>
                  <p>new</p>
                  <IconCircleCheckFilled size={50} />
                </Group>
              </div>
              <p>collections</p>
              <p>for everyone</p>
            </div>
            <div>
              <Button rightSection={<IconArrowRight />}>
                Latest Collection
              </Button>
            </div>
          </div>
          <div className={heroStyles.right}>
            <Image src={heroImage} />
          </div>
        </Group>
      </Container>
    </section>
  );
};

export default Hero;
