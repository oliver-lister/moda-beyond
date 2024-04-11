import { Box } from "@mantine/core";
import styles from "./infoCard.module.css";

const InfoCard = ({
  children,
  bg_circle,
}: {
  children: React.ReactNode;
  bg_circle?: boolean;
}) => {
  return (
    <Box className={styles.card}>
      <Box className={bg_circle ? styles.bg_circle : undefined}></Box>
      {children}
    </Box>
  );
};

export default InfoCard;
