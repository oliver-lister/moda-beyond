import styles from "../productdisplay.module.css";
import { Stack, Group, ColorSwatch, Select, Button, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import ProductProps from "../../../../types/ProductProps";
import { useState } from "react";
import { IconShoppingCart, IconX } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { SerializedError } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../../../../state/store.ts";
import {
  addToCartAsync,
  updateCartAsync,
} from "../../../../state/auth/authSlice";
import { useNavigate } from "react-router-dom";

const ProductForm = ({ product }: { product: ProductProps }) => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // ADD TO CART FORM
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.availableColors && product.availableColors.length > 0
      ? product.availableColors[0].label
      : null
  );

  const form = useForm({
    initialValues: {
      product,
      selectedColor: selectedColor,
      size: null,
      quantity: 1,
    },
    validate: {
      size: (value) => (value ? null : "Please pick a size."),
    },
  });

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex === selectedColor ? selectedColor : hex);
  };

  const handleSubmit = async () => {
    try {
      if (!auth.user) throw new Error("No user signed in.");
      // See if the same item exists in the users cart
      const sameItemIndex = auth.user.cart.findIndex(
        (item) =>
          item.productId === product._id &&
          item.color === selectedColor &&
          item.size === form.values.size
      );
      // If it doesn't exist, dispatch the new item to be added
      if (sameItemIndex === -1) {
        await dispatch(
          addToCartAsync({
            productId: product._id,
            color: selectedColor,
            quantity: form.values.quantity,
            size: form.values.size,
            price: product.price,
          })
        ).unwrap();

        notifications.show({
          title: "Success! You've added an item to your cart.",
          message: `${form.values.size} ${product.brand} ${selectedColor} ${product.name}`,
          icon: <IconShoppingCart />,
        });
      }
      // If it does exist, add to its quantity.
      if (sameItemIndex >= 0) {
        const newCart = auth.user.cart.map((item, index) => {
          if (index === sameItemIndex) {
            const updatedQuantity = Number(item.quantity) + 1;
            return { ...item, quantity: updatedQuantity };
          }
          return item;
        });

        await dispatch(updateCartAsync(newCart)).unwrap();

        notifications.show({
          title: "Success! You've added an item to your cart.",
          message: `${form.values.size} ${product.brand} ${selectedColor} ${product.name}`,
          icon: <IconShoppingCart />,
        });
      }
    } catch (err) {
      console.log(
        "Error adding product to cart:",
        (err as SerializedError).message
      );

      notifications.show({
        title: "Error! Something went wrong.",
        message: "Please login and try again.",
        icon: <IconX />,
        color: "red",
      });

      navigate("/login");
    }
  };
  return (
    <form
      onSubmit={form.onSubmit(() => handleSubmit())}
      className={styles.form}
    >
      <Stack gap="lg">
        <Stack gap="xs">
          <Text>
            Colour:{" "}
            <span className={styles.selected_color}>{selectedColor}</span>
          </Text>
          <Group>
            {product.availableColors &&
              product.availableColors.map((color) => (
                <ColorSwatch
                  ml={2}
                  key={color.label}
                  component="button"
                  type="button"
                  color={color.hex}
                  onClick={() => handleColorChange(color.label)}
                  style={{ color: "#fff", cursor: "pointer" }}
                  styles={{
                    root: {
                      outline:
                        selectedColor === color.label
                          ? "2px solid var(--mantine-color-blue-4)"
                          : "",
                    },
                  }}
                />
              ))}
          </Group>
        </Stack>
        <Group align="start">
          <Select
            withAsterisk
            data={product.availableSizes}
            {...form.getInputProps("size")}
            placeholder="Pick a size..."
          />
          <Button type="submit">Add to Cart</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ProductForm;