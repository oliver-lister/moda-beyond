import { Center, Box, Title, Stack, Text, SimpleGrid } from "@mantine/core";
import { Link } from "react-router-dom";
import { accountNavLinks } from "../data/accountNavLinks";
import styles from "./accountDashboard.module.css";

const AccountDashboard = () => {
  return (
    <Box>
      <Center>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} py="1rem" px="1rem">
          {accountNavLinks.map((link, i) => (
            <Box
              key={i}
              component={Link}
              to={link.to}
              style={{ textDecoration: "none" }}
              c="white"
              p="2rem"
              className={styles.card}
            >
              <Stack>
                <Title order={2}>{link.label}</Title>
                <Text>{link.desc}</Text>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Center>
    </Box>
  );
};

export default AccountDashboard;
