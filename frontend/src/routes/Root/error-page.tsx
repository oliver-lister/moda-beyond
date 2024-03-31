import { Box, Title, Text, Center, Stack } from "@mantine/core";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <Box id="error-page">
      <Center h="90vh">
        <Stack>
          <Title order={1} ff="EBGaramond-Regular" fz="1rem">
            MØDA-BEYOND
          </Title>
          <Title order={2}>Oops!</Title>
          <Text>Sorry, an unexpected error has occurred.</Text>
          <Text>Error: {error.statusText || error.message}</Text>
          <Link to="/">Click here to return to the Homepage</Link>
        </Stack>
      </Center>
    </Box>
  );
}
