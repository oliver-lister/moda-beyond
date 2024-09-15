import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconCheck, IconLoader } from "@tabler/icons-react";
import { useState } from "react";
const ClearSessions = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cleared, setCleared] = useState<boolean>(false);

  const handleClear = async () => {
    try {
      setIsLoading(true); // Set loading to true at the start of the request
      const url = `${import.meta.env.VITE_BACKEND_HOST}/auth/clearsessions`;

      const res = await fetch(url, {
        method: "DELETE",
      });

      if (res.ok) {
        // 204 No Content is considered an "ok" response
        console.log("All authentication sessions deleted successfully.");
      } else {
        const responseData = await res.json();
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }
    } catch (err) {
      if (err instanceof Error) console.error(`Error: ${err.message}`);
    } finally {
      setCleared((prevCleared) => !prevCleared);

      setTimeout(() => {
        setCleared((prevCleared) => !prevCleared);
      }, 1000);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack align="start">
        <Group justify="space-between" align="flex-end">
          <Box>
            <Title order={1}>Clear Database Auth Sessions</Title>
            <Text c="gray.8">
              Clear all the outstanding authenticated sessions on the MongoDB
              database
            </Text>
          </Box>
        </Group>
        <Group align="center">
          <Button
            onClick={handleClear}
            leftSection={isLoading ? <IconLoader /> : null}
          >
            {isLoading ? "Processing" : "Clear Sessions"}
          </Button>
          {cleared ? (
            <>
              <IconCheck color="green" />
              <Text c="green">Sessions Cleared</Text>
            </>
          ) : null}
        </Group>
      </Stack>
    </>
  );
};

export default ClearSessions;
