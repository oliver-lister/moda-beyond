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
  CheckIcon,
  rem,
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
import { useDispatch } from "react-redux";
import { SerializedError } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../state/store.ts";
import { addToCartAsync } from "../../../state/auth/authSlice";

const ProductDisplay = ({ product }: { product: ProductProps }) => {
  const dispatch = useDispatch<AppDispatch>();
  const mobile = useMediaQuery("(max-width: 768px");

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
      await dispatch(
        addToCartAsync({
          productId: product._id,
          color: selectedColor,
          quantity: form.values.quantity,
          size: form.values.size,
        })
      ).unwrap();

      notifications.show({
        title: "Success! You've added an item to your cart.",
        message: `${form.values.size} ${product.brand} ${selectedColor} ${product.name}`,
        icon: <IconShoppingCart />,
      });
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
                {product.lastPrice && (
                  <p className={styles.lastPrice}>${product.lastPrice}</p>
                )}
                <p
                  className={`${styles.price} ${
                    product.lastPrice && styles.sale
                  }`}
                >
                  ${product.price}
                </p>
                {product.lastPrice && <Badge color="red">Sale</Badge>}
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
                        >
                          {selectedColor === color.label && (
                            <CheckIcon
                              style={{ width: rem(12), height: rem(12) }}
                            />
                          )}
                        </ColorSwatch>
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
                Mid-weight cotton-rich denim; minimal stretch; unlined; opaque -
                Slim fit; tapered leg - Zip fly with button fastening - Classic
                five-pocket design
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="Size & Fit">
              <Accordion.Control>Size & Fit</Accordion.Control>
              <Accordion.Panel className={styles.accordion_content}>
                Length: Inside Leg: 77cm, Front Rise: 27cm, Leg Opening: 32cm
                (size W32/L32). Our model is 186.7cm (6’1.5”) tall with a 96.5cm
                (38”) chest and a 81.3cm (32”) waist.
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="Material">
              <Accordion.Control>Material</Accordion.Control>
              <Accordion.Panel className={styles.accordion_content}>
                Main: 99% Cotton & 1% Elastane
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
