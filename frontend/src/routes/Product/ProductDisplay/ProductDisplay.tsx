import styles from "./productdisplay.module.css";
import {
  Grid,
  GridCol,
  Stack,
  Accordion,
  Image,
  Group,
  Badge,
  ColorSwatch,
  Select,
  Button,
  Text,
} from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useViewportSize } from "@mantine/hooks";
import { useMediaQuery } from "@mantine/hooks";
import ProductProps from "../../../types/ProductProps";
import { useEffect, useRef, useState, useCallback } from "react";
import { IconShoppingCart, IconX } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { SerializedError } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../../../state/store.ts";
import { addToCartAsync, updateCartAsync } from "../../../state/auth/authSlice";
import { useNavigate } from "react-router-dom";

const ProductDisplay = ({ product }: { product: ProductProps }) => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const mobile = useMediaQuery("(max-width: 768px");
  const navigate = useNavigate();

  // THUMBNAIL CLICKS MOVE IMAGE EMBLA CAROSUEL
  const { width } = useViewportSize();
  const [colHeight, setColHeight] = useState<number | null>(null);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const handleImageClick = useCallback(
    (index: number) => {
      if (embla) {
        embla.scrollTo(index);
      }
    },
    [embla]
  );

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
      });

      navigate("/login");
    }
  };

  // Response re-sizing with thumbnails
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    if (imageElement) {
      const height = imageElement.getBoundingClientRect().height;
      setColHeight(height);
    }
  }, [width]);

  if (!product) {
    return <Text>Waiting for product.</Text>;
  }

  return (
    <Grid className={styles.product_display} gutter="xl" overflow="hidden">
      {!mobile && (
        <GridCol span={{ base: 0, md: 2 }}>
          <Stack
            className={styles.thumbnails}
            style={
              !mobile
                ? { maxHeight: colHeight ? colHeight + "px" : "none" }
                : {}
            }
          >
            {product.images.map((img, index) => (
              <Image
                key={index}
                src={img}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </Stack>
        </GridCol>
      )}
      <GridCol
        span={{ base: 12, md: 5 }}
        style={
          !mobile ? { maxHeight: colHeight ? colHeight + "px" : "none" } : {}
        }
      >
        <Carousel
          withIndicators={mobile}
          withControls={mobile}
          loop
          getEmblaApi={setEmbla}
          className={styles.carousel}
        >
          {product.images.map((img, index) => (
            <Carousel.Slide key={index}>
              <Image src={img} ref={imageRef} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </GridCol>
      <GridCol
        span={{ base: 12, md: 5 }}
        style={
          !mobile ? { maxHeight: colHeight ? colHeight + "px" : "none" } : {}
        }
      >
        <Stack>
          <Stack gap="xl">
            <div>
              <p className={styles.brand}>{product.brand}</p>
              <p className={styles.name}>{product.name}</p>

              <Group gap="xs" className={styles.prices}>
                {product.lastPrice && product.lastPrice > product.price && (
                  <p className={styles.lastPrice}>${product.lastPrice}</p>
                )}
                <p
                  className={`${styles.price} ${
                    product.lastPrice &&
                    product.lastPrice > product.price &&
                    styles.sale
                  }`}
                >
                  ${product.price}
                </p>
                {product.lastPrice && product.lastPrice > product.price && (
                  <Badge color="red">Sale</Badge>
                )}
              </Group>
            </div>

            <form
              onSubmit={form.onSubmit(() => handleSubmit())}
              className={styles.form}
            >
              <Stack gap="lg">
                <Stack gap="xs">
                  <p>
                    Colour:{" "}
                    <span className={styles.selected_color}>
                      {selectedColor}
                    </span>
                  </p>
                  <Group>
                    {product.availableColors &&
                      product.availableColors.map((color) => (
                        <ColorSwatch
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
          </Stack>
          <Accordion>
            <Accordion.Item value="Description">
              <Accordion.Control>Description</Accordion.Control>
              <Accordion.Panel className={styles.accordion_content}>
                {product.description}
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="Material">
              <Accordion.Control>Material</Accordion.Control>
              <Accordion.Panel className={styles.accordion_content}>
                {product.material}
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="Returns">
              <Accordion.Control>Returns</Accordion.Control>
              <Accordion.Panel className={styles.accordion_content}>
                *THE SHOPPER returns are free for 30 days unless marked. Find
                out more about our return policy.
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </GridCol>
    </Grid>
  );
};

export default ProductDisplay;
