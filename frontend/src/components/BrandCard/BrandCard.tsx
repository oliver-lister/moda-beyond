import { Box, Image } from "@mantine/core";
import { Link } from "react-router-dom";
import styles from "./brandCard.module.css";

const BrandCard = ({
  link,
  image_main,
  image_hover,
}: {
  link: string;
  image_main: string;
  image_hover: string;
}) => {
  return (
    <Link to={link}>
      <Box className={styles.card}>
        <Box className={styles.card__image_main}>
          <Image src={image_main} />
        </Box>
        <Box className={styles.card__image_hover}>
          <Image src={image_hover} />
        </Box>
      </Box>
    </Link>
  );
};

export default BrandCard;
