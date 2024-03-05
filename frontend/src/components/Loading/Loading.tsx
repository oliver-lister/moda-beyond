import { Container, Loader, Center, Text, Stack } from "@mantine/core";

const Loading = () => {
  return (
    <Container size="xl">
      <Center h="80vh">
        <Stack align="center">
          <Text>Loading...</Text>
          <Loader color="blue" />
        </Stack>
      </Center>
    </Container>
  );
};

export default Loading;
