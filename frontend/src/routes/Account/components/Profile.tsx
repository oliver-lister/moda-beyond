import { Title, Box, Text, Stack } from "@mantine/core";
import { useUser } from "../AccountLayout";

const Profile = () => {
  const { user } = useUser();

  if (!user) {
    return;
  }

  const fullName = `${
    user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
  } ${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}`;

  // Make card into a reusable component with children input

  return (
    <>
      <Stack pt="2rem">
        <Title order={2}>Profile</Title>
        <Stack
          style={{
            backgroundColor: "var(--mantine-color-white",
            width: "500px",
            padding: "1.5rem",
          }}
        >
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
        </Stack>
      </Stack>
    </>
  );
};

export default Profile;
