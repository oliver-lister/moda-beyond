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
  rem,
  Text,
  Loader,
  LoadingOverlay,
  Group,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconUpload, IconCheck } from "@tabler/icons-react";
import { yupResolver } from "mantine-form-yup-resolver";
import * as yup from "yup";
import { useForm } from "@mantine/form";
import { useState } from "react";

export interface ProductProps {
  _id?: string;
  name: string;
  brand: string;
  category: string;
  availableSizes: string[];
  description: string;
  material: string;
  price: number;
  images: File[];
}
const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

const schema = yup.object().shape({
  name: yup.string().required("Please enter a name"),
  brand: yup.string().required("Please enter a brand"),
  category: yup.string().required("Please select a category"),
  availableSizes: yup
    .array()
    .of(yup.string())
    .min(1, "Please select at least one size"),
  description: yup.string(),
  material: yup.string(),
  price: yup.number(),
  images: yup
    .array()
    .of(yup.mixed())
    .required("Please upload at least one image"),
});

const AddProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Mantine use form
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
    },
    validate: yupResolver(schema),
  });

  const handleSubmit = async (values: ProductProps) => {
    setIsLoading((prev) => !prev);
    try {
      const apiUrl = "http://localhost:3000/addproduct";

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("brand", values.brand);
      formData.append("availableSizes", JSON.stringify(values.availableSizes));
      formData.append("material", values.material);
      formData.append("price", String(values.price));

      values.images.forEach((image) => {
        formData.append("productImg", image, image.name);
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      setTimeout(() => {
        console.log("Server response:", responseData);
        notifications.show({
          title: "Product Added",
          message: "The product has been added to the database",
          icon: checkIcon,
          color: "green",
        });
        setIsLoading((prev) => !prev);
        form.reset();
      }, 2000);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  // Pill component for multiple image upload
  const FilePill: FileInputProps["valueComponent"] = ({ value }) => {
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

  // Modals
  const openResetModal = () =>
    modals.openConfirmModal({
      title: "Are you sure you want to clear the form?",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => form.reset(),
    });

  const openSubmitModal = (values: ProductProps) =>
    modals.openConfirmModal({
      title: "Are you sure you want to submit?",
      children: (
        <Text size="sm">
          Make sure all the data entered is correct and void of typos.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => handleSubmit(values),
    });

  return (
    <form onSubmit={form.onSubmit((values) => openSubmitModal(values))}>
      <Group justify="flex-end" mb={5}>
        <Button onClick={() => openResetModal()} color="gray">
          Clear Form
        </Button>
      </Group>
      <Stack>
        <Fieldset style={{ position: "relative" }}>
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 1 }}
          />
          <SimpleGrid cols={{ lg: 1, xl: 2 }}>
            <TextInput
              label="Product Name"
              description="Type in the product's name."
              {...form.getInputProps("name")}
            />
            <Autocomplete
              label="Brand"
              description="Begin searching and pick an existing brand or create a new one."
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
              data={["INTL S", "INTL M", "INTL L", "INTL XL"]}
              {...form.getInputProps("availableSizes")}
            />
            <Textarea
              label="Description"
              description="Product description."
              rows={8}
              {...form.getInputProps("description")}
            />
            <TextInput
              label="Material"
              description="Describe the product's materials."
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
              valueComponent={FilePill}
              clearable
              accept="image/png,image/jpeg,image/webp"
              {...form.getInputProps("images")}
            />
          </SimpleGrid>
        </Fieldset>
        {isLoading ? (
          <Button disabled leftSection={<Loader size={15} />}>
            Processing
          </Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </Stack>
    </form>
  );
};

export default AddProductForm;
