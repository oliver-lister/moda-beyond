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
          <Title order={2}>{title}</Title>
        </Box>
        <Box
          hiddenFrom="md"
          bg="var(--mantine-color-violet-5)"
          c="var(--mantine-color-white)"
          p="xs"
          className={styles.mobile_header}
        >
          <Group align="center">
            <UnstyledButton
              component={Link}
              to="/account"
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
