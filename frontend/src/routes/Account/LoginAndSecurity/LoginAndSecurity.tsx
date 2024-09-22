import { Stack, Text, Button, Box } from "@mantine/core";
import AccountPage from "../components/AccountPage";
import InfoCard from "../components/InfoCard/InfoCard";
import { useUser } from "../hooks/useUser";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import EditLoginAndSecurityForm from "./components/EditLoginAndSecurityForm";

const LoginAndSecurity = () => {
  const { user } = useUser();
  const [isFormOpen, SetFormOpen] = useState<boolean>(false);

  const toggleFormOpen = () => {
    SetFormOpen((prev) => !prev);
  };

  return (
    <AccountPage title="Login & Security">
      <InfoCard>
        {isFormOpen ? (
          <EditLoginAndSecurityForm
            toggleFormOpen={toggleFormOpen}
            user={user}
          />
        ) : (
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
            <Button
              onClick={toggleFormOpen}
              leftSection={<IconEdit size={20} />}
            >
              Edit
            </Button>
          </Stack>
        )}
      </InfoCard>
    </AccountPage>
  );
};

export default LoginAndSecurity;
