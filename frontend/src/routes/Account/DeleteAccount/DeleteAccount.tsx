import { Button, Stack, Text, Modal, Group } from "@mantine/core";
import AccountPage from "../components/AccountPage";
import InfoCard from "../components/InfoCard/InfoCard";
import { IconTrash, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleDelete = () => {
    // delete account
    setShowModal(false);
    navigate("/");
    notifications.show({
      title: "Account deleted",
      message: "We've removed your details from our system.",
      icon: <IconUser />,
    });
  };

  return (
    <>
      <AccountPage title="Delete Account">
        <InfoCard>
          <Stack>
            <Text size="lg" fw={700} c="red">
              Danger Zone:
            </Text>
            <Button
              bg="red"
              onClick={() => setShowModal(true)}
              leftSection={<IconTrash size={20} />}
            >
              Delete My Account
            </Button>
          </Stack>
        </InfoCard>
      </AccountPage>
      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Are you sure you want to delete your account?"
        centered
        styles={{ title: { fontWeight: 600 } }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text>This action cannot be reversed.</Text>
        <Group justify="end" gap="sm" mt="md">
          <Button
            onClick={() => setShowModal(false)}
            variant="outline"
            color="black"
          >
            No don't delete it
          </Button>
          <Button onClick={handleDelete} color="red">
            Delete Account
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default DeleteAccount;
