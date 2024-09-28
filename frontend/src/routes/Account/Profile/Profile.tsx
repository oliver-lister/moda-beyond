import { Box, Text, Button, Stack } from "@mantine/core";
import InfoCard from "../components/InfoCard/InfoCard";
import { IconEdit } from "@tabler/icons-react";
import AccountPage from "../components/AccountPage";
import { format } from "date-fns";
import { useState } from "react";
import EditProfileForm from "./components/EditProfileForm";
import { useUser } from "../hooks/useUser";

const Profile = () => {
  const { user } = useUser();
  const [isFormOpen, SetFormOpen] = useState<boolean>(false);

  const toggleFormOpen = () => {
    SetFormOpen((prev) => !prev);
  };

  const fullName = `${
    user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
  } ${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}`;

  const isAddressValid =
    user.address &&
    user.address.street &&
    user.address.suburb &&
    user.address.postcode &&
    user.address.state;

  return (
    <AccountPage title="Profile">
      <InfoCard>
        {isFormOpen ? (
          <EditProfileForm toggleFormOpen={toggleFormOpen} user={user} />
        ) : (
          <Stack>
            <Box>
              <Text fz="lg" fw={900} c="violet.9">
                {fullName}
              </Text>
            </Box>
            {user.address && isAddressValid ? (
              <Box>
                <Text size="lg" fw={600} c="violet">
                  Address:
                </Text>
                <Text size="md">
                  {`${user.address.street}, ${user.address.suburb}, ${user.address.state} ${user.address.postcode}`}
                </Text>
              </Box>
            ) : null}
            <Box>
              <Text size="lg" fw={600} c="violet">
                Birthday:
              </Text>
              <Text size="md">
                {user.dob && format(user.dob, "dd/MM/yyyy")}
              </Text>
            </Box>
            <Box>
              <Text size="lg" fw={600} c="violet">
                Shopping Preference:
              </Text>
              <Text size="md">{user.shoppingPreference}</Text>
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
