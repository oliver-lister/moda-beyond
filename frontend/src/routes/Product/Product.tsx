import { Link, useParams, Params } from "react-router-dom";
import {
  Breadcrumbs,
  Anchor,
  Container,
  Stack,
  Loader,
  Center,
} from "@mantine/core";
import styles from "./product.module.css";
import ProductDisplay from "./ProductDisplay/ProductDisplay.tsx";
import SimilarProducts from "./SimilarProducts/SimilarProducts.tsx";
import { useEffect, useState } from "react";
import ProductProps from "../../types/ProductProps.ts";

const Product = () => {
  const { productId }: Readonly<Params<string>> | undefined = useParams();
  const [product, setProduct] = useState<ProductProps | null>(null);

  useEffect(() => {
    // Fetch products from backend
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/products/fetchproductbyid/${productId}`,
          {
            method: "GET",
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`${responseData.error}, ${responseData.errorCode}`);
        }

        const { product } = responseData;
        setProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!productId) {
    return <div>Please search for a product</div>;
  }

  if (!product) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  const breadcrumbItems = [
    { title: product.category, href: `/${product.category}` },
    { title: product.name, href: "#" },
  ].map((item, index) => (
    <Anchor component={Link} to={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <section className={styles.product}>
      <Container size="xl">
        <Stack gap="lg">
          <Breadcrumbs className={styles.breadcrumbs}>
            {breadcrumbItems}
          </Breadcrumbs>
          <ProductDisplay product={product} />
          <SimilarProducts />
        </Stack>
      </Container>
    </section>
  );
};

export default Product;
