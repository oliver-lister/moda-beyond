import {
  Autocomplete,
  TextInput,
  SimpleGrid,
  Select,
  Fieldset,
  MultiSelect,
  Textarea,
  NumberInput,
  FileInput,
  FileInputProps,
  Pill,
  Center,
  Button,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUpload } from "@tabler/icons-react";
import styles from "./addproduct.module.css";

interface ProductProps {
  name: string;
  brand: string;
  category: string;
  availableSizes: string[];
  description: string;
  material: string;
  price: number;
  images: File[];
}

const AddProduct = () => {
  const form = useForm({
    initialValues: {
      name: "",
      brand: "",
      category: "Women",
      availableSizes: [],
      description: "",
      material: "",
      price: 50,
      images: [],
    } as ProductProps,
    validate: {},
  });

  const handleSubmit = async (values: ProductProps) => {
    try {
      const apiUrl = "http://localhost:3000/addproduct";

      // Prepare the data to be sent to the server
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("brand", values.brand);
      formData.append("availableSizes", JSON.stringify(values.availableSizes));
      formData.append("material", values.material);
      formData.append("price", String(values.price));

      // Append each image file to the form data
      values.images.forEach((image) => {
        formData.append("productImg", image, image.name);
      });

      // Make the POST request to the server using fetch
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      // Parse the JSON response
      const responseData = await response.json();

      console.log("Server response:", responseData);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
    if (value === null) {
      return null;
    }

    if (Array.isArray(value)) {
      return (
        <Pill.Group>
          {value.map((file, index) => (
            <Pill key={index}>
              <Center>{file.name}</Center>
            </Pill>
          ))}
        </Pill.Group>
      );
    }

    return <Pill>{value.name}</Pill>;
  };

  return (
    <>
      <h2 className={styles.heading}>Add Product</h2>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Stack>
          <Fieldset>
            <SimpleGrid cols={{ lg: 1, xl: 2 }}>
              <TextInput
                label="Product Name"
                description="Type in the product's name."
                placeholder="Flower Waistcoat"
                {...form.getInputProps("name")}
              />
              <Autocomplete
                label="Brand"
                description="Begin searching and pick an existing brand or create a new one."
                placeholder="ChicFashion"
                data={["Nike", "DC", "New Balance", "Universal"]}
                {...form.getInputProps("brand")}
              />
              <Select
                label="Category"
                description="Select the product's category."
                data={["Men", "Women", "Kids"]}
                {...form.getInputProps("category")}
              />
              <MultiSelect
                label="Available Sizes"
                description="Select all available sizes."
                placeholder="Pick sizes"
                data={["INTL S", "INTL M", "INTL L", "INTL XL"]}
                {...form.getInputProps("availableSizes")}
              />
              <Textarea
                label="Description"
                description="Product description."
                placeholder="Mid-weight cotton-rich denim with minimal stretch. Zip fly with button fastening. Classic five-pocket design"
                rows={8}
                {...form.getInputProps("description")}
              />
              <TextInput
                label="Material"
                description="Describe the product's materials."
                placeholder="Main: 99% Cotton & 1% Elastane"
                {...form.getInputProps("material")}
              />
              <NumberInput
                label="Price"
                description="Input the desired price."
                prefix="$"
                decimalScale={2}
                allowNegative={false}
                {...form.getInputProps("price")}
              />
              <FileInput
                label="Upload Images"
                description="Upload all images of the product, PNG, JPEG, WEBP are accepted."
                leftSection={<IconUpload size={15} />}
                placeholder="Click here"
                multiple={true}
                valueComponent={ValueComponent}
                clearable
                accept="image/png,image/jpeg,image/webp"
                {...form.getInputProps("images")}
              />
            </SimpleGrid>
          </Fieldset>
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </>
  );
};

export default AddProduct;
