import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs, Anchor, Container, Stack } from "@mantine/core";
import styles from "./product.module.css";
import ProductDisplay from "../../components/ProductDisplay/ProductDisplay.tsx";

const Product = () => {
  const products = useSelector((state: RootState) => state.products.items);
  const { productId } = useParams();

  if (!productId) {
    return <div>Please search for a product</div>;
  }

  const product = products.find((e) => e.id === +productId);

  if (!product) {
    return <div>Product could not be found.</div>;
  }

  const items = [
    { title: product.category, href: `/${product.category}` },
    { title: "Jumpers & Cardigans", href: "#" },
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
          <Breadcrumbs className={styles.breadcrumbs}>{items}</Breadcrumbs>
          <ProductDisplay product={product} />
        </Stack>
      </Container>
    </section>
  );
};

export default Product;
