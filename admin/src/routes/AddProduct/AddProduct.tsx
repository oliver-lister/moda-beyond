import {
  Autocomplete,
  Fieldset,
  TextInput,
  SimpleGrid,
  Select,
} from "@mantine/core";

const AddProduct = () => {
  return (
    <>
      <h2>Add Product</h2>
      <form>
        <Fieldset legend="Key Product Information">
          <SimpleGrid cols={{ lg: 1, xl: 2 }}>
            <Autocomplete
              label="Brand"
              description="Begin searching and pick an existing brand or create a new one."
              placeholder="Nike"
              data={["React", "Angular", "Vue", "Svelte"]}
            />
            <TextInput
              label="Product Name"
              description="Type in the product's name."
              placeholder="Input placeholder"
            />
            <Select
              label="Category"
              description="Select the product's category."
              defaultValue="Men"
              data={["Men", "React", "Angular", "Vue", "Svelte"]}
            />
          </SimpleGrid>
        </Fieldset>
      </form>
    </>
  );
};

export default AddProduct;
