import { Skeleton, Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Item from "../Item/Item.tsx";
import { useGetProductsQuery } from "../../state/products/productsSlice.ts";

interface ProductCollectionTeaserProps {
  query: string;
  cap: number;
}

const ProductCollectionTeaser: React.FC<ProductCollectionTeaserProps> = ({
  query,
  cap,
}) => {
  const { data, isLoading, error } = useGetProductsQuery(query);
  const products = data?.products || [];

  if (!products && !isLoading && error) {
    return <Text>Error!</Text>;
  }

  const renderProductSlides = () => {
    if (isLoading) {
      return Array.from({ length: 6 }).map((_, i) => (
        <Carousel.Slide key={i}>
          <Skeleton width="100%" height="370" />
        </Carousel.Slide>
      ));
    }

    return products?.slice(0, cap).map(({ _id, ...rest }) => (
      <Carousel.Slide key={_id}>
        <Item _id={_id} {...rest} />
      </Carousel.Slide>
    ));
  };

  return (
    <Carousel
      slideGap="lg"
      slideSize={250}
      align="start"
      draggable={true}
      skipSnaps={true}
      containScroll="keepSnaps"
    >
      {renderProductSlides()}
    </Carousel>
  );
};

export default ProductCollectionTeaser;
