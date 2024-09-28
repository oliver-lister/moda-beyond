import {
  Autocomplete,
  TextInput,
  Select,
  Fieldset,
  MultiSelect,
  Textarea,
  NumberInput,
  Button,
  Stack,
  rem,
  Text,
  Loader,
  LoadingOverlay,
  Group,
  ColorInput,
  Grid,
  GridCol,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { yupResolver } from "mantine-form-yup-resolver";
import * as yup from "yup";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

export interface ProductProps {
  _id?: string;
  name: string;
  brand: string;
  category: string;
  availableSizes: string[];
  availableColorHexes: string[];
  availableColors?: [{ label: string; hex: string }];
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
  availableColorHexes: yup
    .array()
    .of(yup.string())
    .min(1, "Please select at least one colour"),
  description: yup.string(),
  material: yup.string(),
  price: yup.number(),
  images: yup
    .array()
    .of(yup.mixed())
    .required("Please upload at least one image"),
});

const EditProductForm = ({ product }: { product: ProductProps }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      ...product,
      availableColorHexes: product.availableColors
        ? product.availableColors.map((color) => color.hex)
        : [],
      colorHex: "",
    },
    validate: yupResolver(schema),
  });

  // Listen for changes to product prop, and refresh form
  useEffect(() => {
    form.setValues({
      ...product,
      availableColorHexes: product.availableColors
        ? product.availableColors.map((color) => color.hex)
        : [],
      colorHex: "",
    });
  }, [product]);

  const addColor = () => {
    if (
      form.values.colorHex === "" ||
      form.values.availableColorHexes.includes(form.values.colorHex)
    ) {
      console.log(
        "You've selected the same colour twice, or haven't selected a color at all."
      );
    } else {
      form.setValues({
        availableColorHexes: [
          ...form.values.availableColorHexes,
          form.values.colorHex,
        ],
      });
      form.setValues({ colorHex: "" });
    }
  };

  const findAvailableColors = async (
    availableColorHexes: ProductProps["availableColorHexes"]
  ) => {
    const availableColors = [];

    for (const color of availableColorHexes) {
      const response = await fetch(
        `https://www.thecolorapi.com/id?hex=${color.slice(1)}&format=json`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch color data for hex ${color}`);
      }

      const data = await response.json();
      const label = data.name.value;

      availableColors.push({ label: label, hex: color });
    }
    return availableColors;
  };

  const handleSubmit = async (values: ProductProps) => {
    setIsLoading(true);
    try {
      const availableColorHexes = form.values.availableColorHexes;
      const availableColors = await findAvailableColors(availableColorHexes);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/products/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            category: values.category,
            brand: values.brand,
            availableSizes: values.availableSizes,
            availableColors: availableColors,
            material: values.material,
            description: values.description,
            price: values.price.toString(),
          }),
        }
      );

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }

      notifications.show({
        title: "Product Edited",
        message: "The product has been edited in the database",
        icon: checkIcon,
        color: "green",
      });
      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error)
        console.error("Error submitting form:", err.message);
      setIsLoading(false);
    }
  };

  // Modal

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
      <Stack>
        <Fieldset style={{ position: "relative" }}>
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 1 }}
          />
          <Grid>
            <GridCol span={{ base: 12, xl: 6 }}>
              <TextInput
                label="Product Name"
                description="Type in the product's name."
                {...form.getInputProps("name")}
              />
            </GridCol>
            <GridCol span={{ base: 12, xl: 6 }}>
              <Autocomplete
                label="Brand"
                description="Begin searching and pick an existing brand or create a new one."
                data={["Nike", "DC", "New Balance", "Universal"]}
                {...form.getInputProps("brand")}
              />
            </GridCol>
            <GridCol span={{ base: 12, xl: 6 }}>
              <Select
                label="Category"
                description="Select the product's category."
                data={["men", "women", "kids"]}
                {...form.getInputProps("category")}
              />
            </GridCol>
            <GridCol span={{ base: 12, xl: 6 }}>
              <NumberInput
                label="Price"
                description="Input the desired price."
                prefix="$"
                decimalScale={2}
                allowNegative={false}
                {...form.getInputProps("price")}
              />
            </GridCol>
            <GridCol span={{ base: 12, xl: 6 }}>
              <MultiSelect
                label="Available Sizes"
                description="Select all available sizes."
                data={["INTL S", "INTL M", "INTL L", "INTL XL"]}
                {...form.getInputProps("availableSizes")}
              />
            </GridCol>
            <GridCol span={{ base: 12, xl: 6 }}>
              <Stack>
                <Group gap={2} align="flex-end">
                  <ColorInput
                    format="hex"
                    label="Available Colours"
                    description="Select available colours, one at a time."
                    {...form.getInputProps("colorHex")}
                  />
                  <Button size="sm" onClick={addColor}>
                    Add Colour
                  </Button>
                </Group>
                <MultiSelect {...form.getInputProps("availableColorHexes")} />
              </Stack>
            </GridCol>
            <GridCol span={{ base: 12 }}>
              <Textarea
                label="Description"
                description="Product description."
                rows={8}
                {...form.getInputProps("description")}
              />
            </GridCol>
            <GridCol span={{ base: 12 }}>
              <TextInput
                label="Material"
                description="Describe the product's materials."
                {...form.getInputProps("material")}
              />
            </GridCol>
          </Grid>
        </Fieldset>
        {isLoading ? (
          <Button disabled leftSection={<Loader size={15} />}>
            Processing
          </Button>
        ) : (
          <Button type="submit">Update Product</Button>
        )}
      </Stack>
    </form>
  );
};

export default EditProductForm;
