import { Stack, Title, Group, Box, UnstyledButton } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import styles from "./accountPage.module.css";
import { Link } from "react-router-dom";

const AccountPage = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <section>
      <Stack pt={{ base: 0, md: "2rem" }}>
        <Box visibleFrom="md" className={styles.wrapper}>
          <Title order={2} miw="400px">
            {title}
          </Title>
        </Box>
        <Box
          hiddenFrom="md"
          bg="var(--mantine-color-grape-1)"
          p="xs"
          className={styles.mobile_header}
        >
          <Group align="center">
            <UnstyledButton
              component={Link}
              to="/user/account"
              className={styles.chevron}
            >
              <IconChevronLeft size={20} />
            </UnstyledButton>
            <Title order={2} fz="md" fw={600}>
              {title}
            </Title>
          </Group>
        </Box>
        <Box className={styles.wrapper}>{children}</Box>
      </Stack>
    </section>
  );
};

export default AccountPage;
