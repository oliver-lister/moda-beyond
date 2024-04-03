import { Box, Image } from "@mantine/core";
import { Link } from "react-router-dom";
import styles from "./brandCard.module.css";

const BrandCard = ({
  link,
  image_main,
  image_hover,
  logo_size,
}: {
  link: string;
  image_main: string;
  image_hover: string;
  logo_size: number;
}) => {
  return (
    <Link to={link}>
      <Box className={styles.card}>
        <Box className={styles.card__image_main}>
          <Image
            src={image_main}
            width={logo_size}
            height={logo_size}
            loading="lazy"
            alt="Brand logo"
          />
        </Box>
        <Box className={styles.card__image_hover}>
          <Image
            src={image_hover}
            width={300}
            height={300}
            loading="lazy"
            alt="Brand fashion"
          />
        </Box>
      </Box>
    </Link>
  );
};

export default BrandCard;
