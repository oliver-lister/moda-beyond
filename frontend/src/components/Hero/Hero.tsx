import { Button, Container, Grid, Group, Image } from "@mantine/core";
import heroStyles from "./Hero.module.css";
import { IconArrowRight, IconCircleCheckFilled } from "@tabler/icons-react";

const Hero = () => {
  return (
    <section className={heroStyles.hero}>
      <Container size="xl">
        <Grid overflow="hidden" className={heroStyles.grid}>
          <Grid.Col span={{ base: 12, md: 6 }} className={heroStyles.left}>
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
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }} className={heroStyles.right}>
            <Image src="https://picsum.photos/1000" />
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  );
};

export default Hero;
