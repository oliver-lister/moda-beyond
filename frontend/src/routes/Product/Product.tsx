import { Link, useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Anchor,
  Container,
  Stack,
  Text,
  Loader,
  Center,
} from "@mantine/core";
import styles from "./product.module.css";
import ProductDisplay from "./components/ProductDisplay/ProductDisplay.tsx";
import SimilarProducts from "./components/SimilarProducts/SimilarProducts.tsx";
import { useGetProductQuery } from "../../state/productsSlice/productsSlice.ts";

const Product = () => {
  const { productId } = useParams();
  const { data: product, isLoading } = useGetProductQuery(productId);

  if (!productId) {
    return <div>Please search for a product</div>;
  }

  const breadcrumbItems = [
    {
      title: product && product.category && product.category.toUpperCase(),
      href: `/shop?category=${
        product && product.category
      }&sortBy=createdAt&sortOrder=-1`,
    },
    {
      title: product && product.brand && product.brand.toUpperCase(),
      href: `/shop?brand=${
        product && product.brand
      }&sortBy=createdAt&sortOrder=-1`,
    },
  ].map((item, index) => (
    <Anchor
      component={Link}
      to={item.href}
      key={index}
      fz={{ base: "xs", lg: "sm" }}
      c="gray"
    >
      {item.title}
    </Anchor>
  ));

  return (
    <section className={styles.product}>
      <Container size="xl">
        <Stack gap="lg">
          <Breadcrumbs className={styles.breadcrumbs} separatorMargin="0.5rem">
            {product && !isLoading ? (
              breadcrumbItems
            ) : (
              <Text fz={{ base: "xs", lg: "sm" }} c="gray">
                LOADING...
              </Text>
            )}
          </Breadcrumbs>
          {product && !isLoading ? (
            <>
              <ProductDisplay product={product} />
              <SimilarProducts product={product} />
            </>
          ) : (
            <Center h="70vh">
              <Loader />
            </Center>
          )}
        </Stack>
      </Container>
    </section>
  );
};

export default Product;
