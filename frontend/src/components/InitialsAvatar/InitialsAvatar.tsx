import styles from "./initialsAvatar.module.css";
import { Box, Text } from "@mantine/core";

const InitialsAvatar = ({
  firstNameLetter,
  lastNameLetter,
}: {
  firstNameLetter: string;
  lastNameLetter: string;
}) => {
  return (
    <Box className={styles.wrapper}>
      <Box className={styles.initials}>
        <Text fw={600}>{firstNameLetter + lastNameLetter}</Text>
      </Box>
    </Box>
  );
};

export default InitialsAvatar;
