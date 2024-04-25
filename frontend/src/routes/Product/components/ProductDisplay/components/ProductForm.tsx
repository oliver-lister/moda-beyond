import styles from "../productdisplay.module.css";
import { Stack, Group, ColorSwatch, Select, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import ProductProps from "../../../../../types/ProductProps.ts";
import { useState } from "react";

const ProductForm = ({
  product,
  handleAddToCart,
}: {
  product: ProductProps;
  handleAddToCart: (quantity: number, size: string, color: string) => void;
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.availableColors[0].label
  );

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex === selectedColor ? selectedColor : hex);
  };

  const form = useForm({
    initialValues: {
      selectedColor: selectedColor,
      size: "",
      quantity: 1,
    },
    validate: {
      size: (value) => (value ? null : "Please pick a size."),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(() =>
        handleAddToCart(form.values.quantity, form.values.size, selectedColor)
      )}
      className={styles.form}
      data-testid="form-container"
    >
      <Stack gap="lg">
        <Stack gap="xs">
          <Text>
            Colour:{" "}
            <span className={styles.selected_color}>{selectedColor}</span>
          </Text>
          <Group>
            {product.availableColors &&
              product.availableColors.map((color, index) => (
                <ColorSwatch
                  ml={2}
                  key={color.label}
                  component="button"
                  type="button"
                  data-testid={`color-input-${index}`}
                  color={color.hex}
                  onClick={() => handleColorChange(color.label)}
                  style={{ color: "#fff", cursor: "pointer" }}
                  styles={{
                    root: {
                      outline:
                        selectedColor === color.label
                          ? "2px solid var(--mantine-color-violet-5)"
                          : "",
                    },
                  }}
                />
              ))}
          </Group>
        </Stack>
        <Group align="start">
          <Select
            name="size"
            data-testid="size-input"
            withAsterisk
            data={product.availableSizes}
            placeholder="Pick a size..."
            {...form.getInputProps("size")}
          />
          <Button type="submit" data-testid="submit-button">
            Add to Cart
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ProductForm;
