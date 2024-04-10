import { Skeleton, Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Item from "../../../../components/Item/Item.tsx";
import { useFetchProducts } from "../../../../hooks/useFetchProducts.tsx";

const ProductCollectionTeaser = ({
  query,
  cap,
}: {
  query: string;
  cap: number;
}) => {
  const { products, isLoading } = useFetchProducts(query);

  if (!products && !isLoading) {
    return <Text>Cannot access database.</Text>;
  }

  const productSlides = !isLoading
    ? products &&
      products.slice(0, cap).map(({ _id, ...rest }) => (
        <Carousel.Slide key={_id}>
          <Item _id={_id} {...rest} />
        </Carousel.Slide>
      ))
    : Array.from({ length: 6 }).map((_, i) => (
        <Carousel.Slide key={i}>
          <Skeleton width="100%" height="370" />
        </Carousel.Slide>
      ));

  return (
    <Carousel
      slideGap="lg"
      slideSize={250}
      align="start"
      draggable={true}
      skipSnaps={true}
      containScroll="keepSnaps"
    >
      {productSlides}
    </Carousel>
  );
};

export default ProductCollectionTeaser;
