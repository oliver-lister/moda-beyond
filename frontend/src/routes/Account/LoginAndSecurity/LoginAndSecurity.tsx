import { Stack, Text, Button, Box } from "@mantine/core";
import AccountPage from "../components/AccountPage";
import InfoCard from "../components/InfoCard/InfoCard";
import { useUser } from "../../../hooks/useUser";
import { IconEdit } from "@tabler/icons-react";

const LoginAndSecurity = () => {
  const { user } = useUser();

  if (!user) {
    return;
  }

  return (
    <AccountPage title="Login & Security">
      <InfoCard>
        <Stack>
          <Box>
            <Text fz="lg" fw={600} c="violet">
              Email:
            </Text>
            <Text fz="md">{user.email}</Text>
          </Box>
          <Box>
            <Text fz="lg" fw={600} c="violet">
              Password:
            </Text>
            <Text fz="md">••••••••</Text>
          </Box>
          <Button leftSection={<IconEdit size={20} />}>Edit</Button>
        </Stack>
      </InfoCard>
    </AccountPage>
  );
};

export default LoginAndSecurity;
