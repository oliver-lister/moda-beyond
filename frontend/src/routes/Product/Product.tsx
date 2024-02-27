import { Link, useParams } from "react-router-dom";
import { Breadcrumbs, Anchor, Container, Stack, Skeleton } from "@mantine/core";
import styles from "./product.module.css";
import ProductDisplay from "./ProductDisplay/ProductDisplay.tsx";
import SimilarProducts from "./SimilarProducts/SimilarProducts.tsx";
import { useEffect, useState } from "react";
import ProductProps from "../../types/ProductProps.ts";

const Product = () => {
  const { productId } = useParams();
  const [displayedProduct, setDisplayedProduct] = useState<ProductProps | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from backend
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/products/fetchproducts?_id=${productId?.slice(
            1
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const product = await response.json();

        setDisplayedProduct(product[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!productId) {
    return <div>Please search for a product</div>;
  }

  if (loading) {
    return <Skeleton />;
  }

  if (!displayedProduct) {
    return <div>Product could not be found.</div>;
  }

  const breadcrumbItems = [
    { title: displayedProduct.category, href: `/${displayedProduct.category}` },
    { title: displayedProduct.name, href: "#" },
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
          <ProductDisplay product={displayedProduct} />
          <SimilarProducts product={displayedProduct} />
        </Stack>
      </Container>
    </section>
  );
};

export default Product;
