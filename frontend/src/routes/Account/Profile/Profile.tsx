import { Box, Text, Button, Stack } from "@mantine/core";
import InfoCard from "../components/InfoCard/InfoCard";
import { IconEdit } from "@tabler/icons-react";
import AccountPage from "../components/AccountPage";
import { format } from "date-fns";
import { useState } from "react";
import EditProfileForm from "./components/EditProfileForm";
import { useUser } from "../../../hooks/useUser";

const Profile = () => {
  const user = useUser();
  const [isFormOpen, SetFormOpen] = useState<boolean>(false);

  const toggleFormOpen = () => {
    SetFormOpen((prev) => !prev);
  };

  if (!user.data) {
    return;
  }

  const fullName = `${
    user.data.firstName.charAt(0).toUpperCase() + user.data.firstName.slice(1)
  } ${
    user.data.lastName.charAt(0).toUpperCase() + user.data.lastName.slice(1)
  }`;

  const isAddressValid =
    user.data.address &&
    user.data.address.street &&
    user.data.address.suburb &&
    user.data.address.postcode &&
    user.data.address.state;

  return (
    <AccountPage title="Profile">
      <InfoCard>
        {isFormOpen ? (
          <EditProfileForm toggleFormOpen={toggleFormOpen} user={user.data} />
        ) : (
          <Stack>
            <Box>
              <Text fz="lg" fw={900} c="violet.9">
                {fullName}
              </Text>
            </Box>
            {user.data.address && isAddressValid ? (
              <Box>
                <Text size="lg" fw={600} c="violet">
                  Address:
                </Text>
                <Text size="md">
                  {`${user.data.address.street}, ${user.data.address.suburb}, ${user.data.address.state} ${user.data.address.postcode}`}
                </Text>
              </Box>
            ) : null}
            <Box>
              <Text size="lg" fw={600} c="violet">
                Birthday:
              </Text>
              <Text size="md">
                {user.data.dob && format(user.data.dob, "dd/MM/yyyy")}
              </Text>
            </Box>
            <Box>
              <Text size="lg" fw={600} c="violet">
                Shopping Preference:
              </Text>
              <Text size="md">{user.data.shoppingPreference}</Text>
            </Box>
            <Button
              leftSection={<IconEdit size={20} />}
              onClick={toggleFormOpen}
            >
              Edit
            </Button>
          </Stack>
        )}
      </InfoCard>
    </AccountPage>
  );
};

export default Profile;
