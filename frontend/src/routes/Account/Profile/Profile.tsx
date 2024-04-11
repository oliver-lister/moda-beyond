import { Box, Text, Button, Stack } from "@mantine/core";
import { useUser } from "../hooks/useUser";
import InfoCard from "../components/InfoCard/InfoCard";
import { IconEdit } from "@tabler/icons-react";
import AccountPage from "../components/AccountPage";
import InitialsAvatar from "../../../components/InitialsAvatar/InitialsAvatar";
import { format } from "date-fns";

const Profile = () => {
  const { user } = useUser();

  if (!user) {
    return;
  }

  const fullName = `${
    user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
  } ${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}`;

  return (
    <AccountPage title="Profile">
      <InfoCard bg_circle={true}>
        <InitialsAvatar
          firstNameLetter={user.firstName[0]}
          lastNameLetter={user.lastName[0]}
        />
        <Stack>
          <Box>
            <Text fz="lg" fw={700}>
              {fullName}
            </Text>
            <Text fz="md">{user.email}</Text>
            <Text fz="md">
              {user.address
                ? `${user.address.street}, ${user.address.city}, ${user.address.zipCode}`
                : null}
            </Text>
          </Box>
          <Box>
            <Text fw={600}>Birthday</Text>
            <Text>{user.dob && format(user.dob, "dd/MM/yyyy")}</Text>
          </Box>
          <Box>
            <Text fw={600}>Shopping Preference</Text>
            <Text>{user.shoppingPreference}</Text>
          </Box>
          <Button leftSection={<IconEdit size={20} />}>EDIT</Button>
        </Stack>
      </InfoCard>
    </AccountPage>
  );
};

export default Profile;
