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
} from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useViewportSize } from "@mantine/hooks";
import { useMediaQuery } from "@mantine/hooks";
import ProductProps from "../../types/ProductProps";
import { useEffect, useRef, useState, useCallback } from "react";
import { IconShoppingCart } from "@tabler/icons-react";

const colors = [
  { label: "Burgundy", hex: "#800020" },
  { label: "Red Rose", hex: "#ff033e" },
  // Add more colors as needed
];

const ProductDisplay = ({ product }: { product: ProductProps }) => {
  const { width } = useViewportSize();
  const [colHeight, setColHeight] = useState<number | null>(null);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors[0].label
  );

  const mobile = useMediaQuery("(max-width: 768px");

  const handleImageClick = useCallback(
    (index: number) => {
      if (embla) {
        embla.scrollTo(index);
      }
    },
    [embla]
  );

  // ADD TO CART FORM

  const form = useForm({
    initialValues: {
      selectedColor: selectedColor,
      size: "",
    },

    validate: {
      size: (value) => (value ? null : "Please pick a size."),
    },
  });

  const handleColorClick = (hex: string) => {
    setSelectedColor(hex === selectedColor ? null : hex);
  };

  const handleSubmit = () => {
    notifications.show({
      title: "Success! ",
      message: `You've added a ${form.values.size} ${product.name} to your cart.`,
      icon: <IconShoppingCart />,
    });
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
            {product.image.map((img, index) => (
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
          {product.image.map((img, index) => (
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
                    {colors &&
                      colors.map((color) => (
                        <ColorSwatch
                          key={color.label}
                          component="button"
                          color={color.hex}
                          onClick={() => handleColorClick(color.label)}
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
                    data={["INTL S", "INTL M", "INTL L", "INTL XL"]}
                    {...form.getInputProps("size")}
                    placeholder="Pick a size..."
                  />
                  <Button type="submit">Add to Cart</Button>
                </Group>
              </Stack>
            </form>
          </Stack>
          <Accordion></Accordion>
        </Stack>
      </GridCol>
    </Grid>
  );
};

export default ProductDisplay;
