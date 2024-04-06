import { Stack } from "@mantine/core";
import styles from "./infoCard.module.css";

const InfoCard = ({ children }: { children: React.ReactNode }) => {
  return <Stack className={styles.card_inner}>{children}</Stack>;
};

export default InfoCard;
