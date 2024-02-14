import { Stack, Group, Text, Title, Box } from "@mantine/core";
import AddProductForm from "./AddProductForm/AddProductForm";

const AddProduct = () => {
  return (
    <>
      <Stack>
        <Group justify="space-between" align="flex-end">
          <Box>
            <Title order={1}>Add Product</Title>
            <Text c="gray.8">Add a product to the MongoDB Database</Text>
          </Box>
        </Group>
        <AddProductForm />
      </Stack>
    </>
  );
};

export default AddProduct;
