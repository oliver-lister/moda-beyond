import { Box } from "@mantine/core";
import styles from "./infoCard.module.css";

const InfoCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className={styles.card}>
      <Box className={styles.bg_circle}></Box>
      {children}
    </Box>
  );
};

export default InfoCard;
