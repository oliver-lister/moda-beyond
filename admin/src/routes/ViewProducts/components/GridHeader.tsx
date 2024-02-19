import { GridCol, Text, Center, Box, Stack, Group } from "@mantine/core";

const GridHeader = () => {
  return (
    <>
      <GridCol span={3}>
        <Center>
          <Text size="sm" style={{ fontWeight: "600" }}>
            Images
          </Text>
        </Center>
      </GridCol>
      <GridCol span={5}>
        <Group>
          <Stack gap="xs">
            <Box>
              <Text size="xs" style={{ fontWeight: "600" }}>
                Brand
              </Text>
              <Text size="sm">Name</Text>
            </Box>
            <Text size="xs">Category</Text>
          </Stack>
        </Group>
      </GridCol>
      <GridCol span={2}>
        <Stack gap={0} style={{ textAlign: "center" }}>
          <Text size="sm" style={{ fontWeight: "600" }}>
            Price
          </Text>
          <Text size="xs">{`($AUD)`}</Text>
        </Stack>
      </GridCol>
      <GridCol span={2}>
        <Center style={{ textAlign: "center" }}>
          <Text size="sm" style={{ fontWeight: "600" }}>
            Remove / Edit
          </Text>
        </Center>
      </GridCol>
    </>
  );
};

export default GridHeader;
