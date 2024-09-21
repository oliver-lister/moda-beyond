import { Skeleton, Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Item from "../Item/Item.tsx";
import { useFetchProducts } from "../../hooks/useFetchProducts.ts";
import React, { useEffect } from "react";

interface ProductCollectionTeaserProps {
  query: string;
  cap: number;
}

const ProductCollectionTeaser: React.FC<ProductCollectionTeaserProps> = ({
  query,
  cap,
}) => {
  const [products, fetchProducts] = useFetchProducts();
  const { data, isLoading, error } = products;

  useEffect(() => {
    fetchProducts(query);
  }, [query]);

  if (!data && !isLoading) {
    return <Text>{error}</Text>;
  }

  const renderProductSlides = () => {
    if (isLoading) {
      return Array.from({ length: 6 }).map((_, i) => (
        <Carousel.Slide key={i}>
          <Skeleton width="100%" height="370" />
        </Carousel.Slide>
      ));
    }

    return data?.slice(0, cap).map(({ _id, ...rest }) => (
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
