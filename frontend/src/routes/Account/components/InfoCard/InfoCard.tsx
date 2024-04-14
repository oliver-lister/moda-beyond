import { Box } from "@mantine/core";
import styles from "./infoCard.module.css";

const InfoCard = ({ children }: { children: React.ReactNode }) => {
  return <Box className={styles.card}>{children}</Box>;
};

export default InfoCard;
