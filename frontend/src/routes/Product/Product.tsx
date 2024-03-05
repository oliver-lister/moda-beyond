import { Link, useParams } from "react-router-dom";
import { Breadcrumbs, Anchor, Container, Stack } from "@mantine/core";
import styles from "./product.module.css";
import ProductDisplay from "./ProductDisplay/ProductDisplay.tsx";
import SimilarProducts from "./SimilarProducts/SimilarProducts.tsx";
import { useEffect, useState } from "react";
import ProductProps from "../../types/ProductProps.ts";
import Loading from "../../components/Loading/Loading.tsx";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductProps | null>(null);

  useEffect(() => {
    // Fetch products from backend
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/products/fetchproductbyid/${productId?.slice(
            1
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const productData = await response.json();

        setProduct(productData);
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
      <>
        <Loading />
      </>
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
          <SimilarProducts product={product} />
        </Stack>
      </Container>
    </section>
  );
};

export default Product;
