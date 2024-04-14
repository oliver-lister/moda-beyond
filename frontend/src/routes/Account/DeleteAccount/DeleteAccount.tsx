import { Button, Stack, Text } from "@mantine/core";
import AccountPage from "../components/AccountPage";
import InfoCard from "../components/InfoCard/InfoCard";
import { IconTrash } from "@tabler/icons-react";

const DeleteAccount = () => {
  return (
    <AccountPage title="Delete Account">
      <InfoCard>
        <Stack>
          <Text size="lg" fw={700} c="red">
            Danger Zone:
          </Text>
          <Button bg="red" leftSection={<IconTrash size={20} />}>
            Delete My Account
          </Button>
        </Stack>
      </InfoCard>
    </AccountPage>
  );
};

export default DeleteAccount;
