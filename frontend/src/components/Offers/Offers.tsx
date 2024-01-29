import offersStyles from "./Offers.module.css";
import { Button, Container, Group, Image, Stack } from "@mantine/core";
import exclusiveImg from "../../assets/images/exclusive_image.png";

const Offers = () => {
  return (
    <Container size="xl">
      <section className={offersStyles.offers}>
        <Group gap="xl" justify="space-around" align="center">
          <Stack className={offersStyles.left}>
            <p className={offersStyles.heading}>
              Exclusive <br />
              Offers For You
            </p>
            <p className={offersStyles.subheading}>Only on best sellers</p>
            <Button>Check Now</Button>
          </Stack>
          <div className={offersStyles.right}>
            <Image src={exclusiveImg} />
          </div>
        </Group>
      </section>
    </Container>
  );
};

export default Offers;
