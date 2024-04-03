import styles from "../productdisplay.module.css";
import { GridCol, Stack, Image } from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { useViewportSize } from "@mantine/hooks";
import { useMediaQuery } from "@mantine/hooks";
import { useState, useCallback, useRef, useEffect } from "react";

const ProductPhotos = ({ images }: { images: string[] }) => {
  const mobile = useMediaQuery("(max-width: 768px");
  const { width } = useViewportSize();
  const [colHeight, setColHeight] = useState<number | null>(null);
  const [embla, setEmbla] = useState<Embla | null>(null);

  // Response re-sizing with thumbnails
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    if (imageElement) {
      const height = imageElement.getBoundingClientRect().height;
      setColHeight(height);
    }
  }, [images, width]);

  // THUMBNAIL CLICKS MOVE IMAGE EMBLA CAROSUEL
  const handleImageClick = useCallback(
    (index: number) => {
      if (embla) {
        embla.scrollTo(index);
      }
    },
    [embla]
  );

  return (
    <>
      {!mobile && (
        <GridCol span={{ base: 0, md: 2 }}>
          <Stack
            className={styles.thumbnails}
            style={
              !mobile
                ? { maxHeight: colHeight ? colHeight + "px" : undefined }
                : undefined
            }
          >
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                onClick={() => handleImageClick(index)}
                w={200}
                h={200}
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
          {images.map((img, index) => (
            <Carousel.Slide key={index}>
              <Image src={img} ref={imageRef} w={950} h={600} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </GridCol>
    </>
  );
};

export default ProductPhotos;
