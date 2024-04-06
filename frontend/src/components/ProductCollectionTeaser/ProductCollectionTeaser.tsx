import { Skeleton, Text } from "@mantine/core";
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

  if (!products && !isLoading) {
    return <Text>Cannot access database.</Text>;
  }

  const productSlides =
    products &&
    products.slice(0, cap).map(({ _id, ...rest }) => (
      <Carousel.Slide key={_id}>
        <Skeleton visible={isLoading} animate>
          <Item _id={_id} {...rest} />
        </Skeleton>
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
