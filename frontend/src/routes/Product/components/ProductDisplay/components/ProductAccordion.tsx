import { Accordion } from "@mantine/core";
import styles from "../productdisplay.module.css";
import ProductProps from "../../../../../types/ProductProps";

const ProductAccordion = ({ product }: { product: ProductProps }) => {
  return (
    <Accordion>
      <Accordion.Item value="Description">
        <Accordion.Control>Description</Accordion.Control>
        <Accordion.Panel className={styles.accordion_content}>
          {product.description}
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="Material">
        <Accordion.Control>Material</Accordion.Control>
        <Accordion.Panel className={styles.accordion_content}>
          {product.material}
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="Returns">
        <Accordion.Control>Returns</Accordion.Control>
        <Accordion.Panel className={styles.accordion_content}>
          *THE SHOPPER returns are free for 30 days unless marked. Find out more
          about our return policy.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default ProductAccordion;
