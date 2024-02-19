import {
  GridCol,
  Text,
  Center,
  Box,
  Stack,
  Group,
  UnstyledButton,
  Image,
} from "@mantine/core";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import { ProductProps } from "../../AddProduct/AddProductForm/AddProductForm";
import styles from "../viewProducts.module.css";

const GridRow = ({
  product,
  openImages,
  removeProduct,
}: {
  product: ProductProps;
  openImages: (product: ProductProps) => void;
  removeProduct: (id: string | undefined) => void;
}) => {
  return (
    <>
      <GridCol span={{ base: 3 }}>
        <Box className={styles.images_inner}>
          <Image
            src={product.images[0]}
            maw={150}
            onClick={() => openImages(product)}
            className={styles.image}
          />
        </Box>
      </GridCol>
      <GridCol span={{ base: 5 }}>
        <Group>
          <Stack gap="xs">
            <Box>
              <Text size="xs" style={{ fontWeight: "600" }}>
                {product.brand}
              </Text>
              <Text size="sm">{product.name}</Text>
            </Box>
            <Text size="xs">Category: {product.category}</Text>
          </Stack>
        </Group>
      </GridCol>
      <GridCol span={{ base: 2 }}>
        <Center>
          <Text size="sm">${product.price}</Text>
        </Center>
      </GridCol>
      <GridCol span={{ base: 2 }}>
        <Group justify="center">
          <UnstyledButton className={styles.edit}>
            <IconEdit />
          </UnstyledButton>
          <UnstyledButton
            onClick={() => removeProduct(product._id)}
            className={styles.remove}
          >
            <IconTrash />
          </UnstyledButton>
        </Group>
      </GridCol>
    </>
  );
};

export default GridRow;
