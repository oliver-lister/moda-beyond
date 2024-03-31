import { Skeleton } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Item from "../Item/Item.tsx";
import { useFetchProducts } from "../../hooks/useFetchProducts.tsx";

const ProductCollectionTeaser = ({
  query,
  cap,
}: {
  query: string;
  cap: number;
}) => {
  const { products, isLoading } = useFetchProducts(query);

  const productSlides = !isLoading
    ? products &&
      products.slice(0, cap).map(({ _id, ...rest }) => (
        <Carousel.Slide key={_id}>
          <Item _id={_id} {...rest} />
        </Carousel.Slide>
      ))
    : Array.from({ length: 6 }).map((_, index) => (
        <Carousel.Slide key={index}>
          <Skeleton width={250} height={300} />
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

{
  /* <SimpleGrid cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5, xl: 6 }}>
        {products &&
          products
            .slice(0, cap)
            .map(({ _id, ...rest }) => <Item key={_id} _id={_id} {...rest} />)}
      </SimpleGrid> */
}
