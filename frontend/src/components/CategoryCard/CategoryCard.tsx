import { Box, Text, Image } from "@mantine/core";
import { Link } from "react-router-dom";
import styles from "./categoryCard.module.css";

const CategoryCard = ({
  link,
  image,
  label,
}: {
  link: string;
  image: string;
  label: string;
}) => {
  return (
    <Link to={link}>
      <Box className={styles.card}>
        <Box className={styles.card__thumbnail}>
          <Image src={image} />
          <Box className={styles.card__title}>
            <Text>SHOP {label.toUpperCase()}</Text>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

export default CategoryCard;
