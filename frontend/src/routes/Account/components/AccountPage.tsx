import { Stack, Title, Group, Box, UnstyledButton } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import styles from "./accountPage.module.css";

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
        <Box hiddenFrom="md" bg="var(--mantine-color-gray-3)" p="xs">
          <Group align="center" justify="space-between">
            <UnstyledButton>
              <IconChevronLeft size={20} />
            </UnstyledButton>
            <Title order={2} fz="md" fw={600} mr="50%">
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
