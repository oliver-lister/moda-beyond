import { Box, Text, Button, Stack } from "@mantine/core";
import { useUser } from "../AccountLayout";
import InfoCard from "../../../components/InfoCard/InfoCard";
import { IconEdit } from "@tabler/icons-react";
import AccountPage from "../components/AccountPage";
import InitialsAvatar from "../../../components/InitialsAvatar/InitialsAvatar";

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
      <InfoCard>
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
          <Button
            variant="gradient"
            gradient={{ from: "grape", to: "violet", deg: 90 }}
            leftSection={<IconEdit size={20} />}
          >
            EDIT
          </Button>
        </Stack>
      </InfoCard>
    </AccountPage>
  );
};

export default Profile;
