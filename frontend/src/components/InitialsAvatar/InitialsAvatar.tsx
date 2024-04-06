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
    <Box className={styles.initials}>
      <Text>{firstNameLetter + lastNameLetter}</Text>
    </Box>
  );
};

export default InitialsAvatar;
