import { Box, Text, Button } from "@mantine/core";
import { useUser } from "../AccountLayout";
import InfoCard from "../../../components/InfoCard/InfoCard";
import { IconEdit } from "@tabler/icons-react";
import AccountPage from "../components/AccountPage";

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
    <AccountPage title="Profile">
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
    </AccountPage>
  );
};

export default Profile;
