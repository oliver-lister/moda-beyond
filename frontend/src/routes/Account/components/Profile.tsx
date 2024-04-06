import {
  Title,
  Box,
  Text,
  Stack,
  Button,
  Group,
  UnstyledButton,
} from "@mantine/core";
import { useUser } from "../AccountLayout";
import InfoCard from "../../../components/InfoCard/InfoCard";
import { IconChevronLeft, IconEdit } from "@tabler/icons-react";
import styles from "./profile.module.css";

const Profile = () => {
  const { user } = useUser();

  if (!user) {
    return;
  }

  const fullName = `${
    user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
  } ${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}`;

  // Make into reusable page component

  return (
    <section>
      <Stack pt={{ base: 0, md: "2rem" }}>
        <Box visibleFrom="md" className={styles.wrapper}>
          <Title order={2}>Profile</Title>
        </Box>
        <Box hiddenFrom="md" bg="var(--mantine-color-gray-3)" p="xs">
          <Group align="center" justify="space-between">
            <UnstyledButton>
              <IconChevronLeft size={20} />
            </UnstyledButton>
            <Title order={2} fz="md" fw={600} mr="50%">
              PROFILE
            </Title>
          </Group>
        </Box>
        <Box className={styles.wrapper}>
          <InfoCard>
            <Box>
              <Text fz="lg" fw={700}>
                {fullName}
              </Text>
              <Text fz="md">{user.email}</Text>
              <Text fz="md">0410042611</Text>
            </Box>
            <Box>
              <Text fw={600}>Birthday</Text>
              <Text>{user.dob}</Text>
            </Box>
            <Box>
              <Text fw={600}>Shopping Preference</Text>
              <Text>{user.shoppingPreference}</Text>
            </Box>
            <Button leftSection={<IconEdit size={20} />}>EDIT</Button>
          </InfoCard>
        </Box>
      </Stack>
    </section>
  );
};

export default Profile;
