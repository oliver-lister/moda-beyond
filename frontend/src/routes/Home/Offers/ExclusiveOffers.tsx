import styles from "./exclusiveoffers.module.css";
import { Button, SimpleGrid, Image } from "@mantine/core";
import exclusiveImg from "../../../assets/images/exclusive_image.png";

const Offers = () => {
  return (
    <section className={styles.container}>
      <SimpleGrid cols={{ base: 1, md: 2 }} className={styles.grid}>
        <div className={styles.left}>
          <div>
            <h4>Only on best sellers</h4>
            <p>exclusive offers for you</p>
          </div>
          <Button>Check Now</Button>
        </div>
        <div className={styles.right}>
          <Image src={exclusiveImg} />
        </div>
      </SimpleGrid>
    </section>
  );
};

export default Offers;
