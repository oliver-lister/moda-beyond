import { Button, Stack, Text } from "@mantine/core";
import AccountPage from "../components/AccountPage";
import InfoCard from "../components/InfoCard/InfoCard";
import { IconTrash, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

const DeleteAccount = () => {
  const navigate = useNavigate();

  const handleDelete = () => {
    // delete account
    navigate("/");
    notifications.show({
      title: "Account deleted",
      message: "We've removed your details from our system.",
      icon: <IconUser />,
    });
  };

  return (
    <AccountPage title="Delete Account">
      <InfoCard>
        <Stack>
          <Text size="lg" fw={700} c="red">
            Danger Zone:
          </Text>
          <Button
            bg="red"
            onClick={handleDelete}
            leftSection={<IconTrash size={20} />}
          >
            Delete My Account
          </Button>
        </Stack>
      </InfoCard>
    </AccountPage>
  );
};

export default DeleteAccount;
