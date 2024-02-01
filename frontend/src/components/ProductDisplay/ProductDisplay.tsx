import styles from "./productdisplay.module.css";
import { Grid, GridCol, Stack, Accordion, Image } from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import ProductProps from "../../types/ProductProps";
import { useState } from "react";

const ProductDisplay = ({ product }: { product: ProductProps }) => {
  const [embla, setEmbla] = useState<Embla | null>(null);
  const mobile = useMediaQuery("(max-width: 768px");

  const handleImageClick = (index: number) => {
    if (embla) {
      embla.scrollTo(index);
    }
  };

  return (
    <Grid className={styles.product_display} gutter="xl">
      {!mobile && (
        <GridCol span={{ base: 0, md: 2 }}>
          <Stack className={styles.collage}>
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
      <GridCol span={{ base: 12, md: 6 }}>
        <Carousel
          withIndicators={mobile}
          withControls={mobile}
          loop
          getEmblaApi={setEmbla}
        >
          {product.image.map((img, index) => (
            <Carousel.Slide key={index}>
              <Image src={img} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </GridCol>
      <GridCol span={{ base: 12, md: 4 }}>
        <Stack>
          <Stack></Stack>
          <Accordion></Accordion>
        </Stack>
      </GridCol>
    </Grid>
  );
};

export default ProductDisplay;
