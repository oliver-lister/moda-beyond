import {
  Box,
  Stack,
  Title,
  Text,
  Grid,
  GridCol,
  UnstyledButton,
  Image,
  Center,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from "react";
import { ProductProps } from "../AddProduct/AddProductForm/AddProductForm";
import styles from "./viewProducts.module.css";

const ViewProducts = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/fetchproducts");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [products]);

  const removeProduct = async (_id: ProductProps["_id"]) => {
    try {
      const apiUrl = "http://localhost:3000/removeproduct";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: _id }),
      });

      console.log("Server response:", await response.json());
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const openImages = (clickedProduct: ProductProps) => {
    modals.open({
      title: `Product Images (${clickedProduct.images.length})`,
      centered: true,
      children: (
        <>
          {clickedProduct.images.length > 1 ? (
            <Carousel withIndicators>
              {clickedProduct.images.map((img) => (
                <Carousel.Slide>
                  <Image src={img} />
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Image src={clickedProduct.images[0]} />
          )}
        </>
      ),
    });
  };

  return (
    <Stack>
      <Box>
        <Title>View Products</Title>
        <Text c="gray.8">Review products in the MongoDB Database</Text>
      </Box>
      <Box>
        <Grid align="center" style={{ padding: "1rem 0" }}>
          <GridCol span={{ base: 2 }}>
            <Center>
              <Text>Images</Text>
            </Center>
          </GridCol>
          <GridCol span={{ base: 3 }}>
            <Text>Brand & Product Name</Text>
          </GridCol>
          <GridCol span={{ base: 2 }}>
            <Text>Category</Text>
          </GridCol>
          <GridCol span={{ base: 2 }}>
            <Text>{`Price ($AUD)`}</Text>
          </GridCol>
          <GridCol span={{ base: 2 }}>
            <Text>Remove</Text>
          </GridCol>
        </Grid>
        {products.map((product: ProductProps) => (
          <Grid
            align="center"
            key={product._id}
            style={{ borderTop: "1px solid gray", padding: "1rem 0" }}
          >
            <GridCol span={{ base: 2 }}>
              <Center className={styles.images_wrapper}>
                <Box className={styles.images_inner}>
                  <Image
                    src={product.images[0]}
                    width={100}
                    height={100}
                    onClick={() => openImages(product)}
                    className={styles.image}
                  />
                  <Image
                    src={product.images[0]}
                    width={100}
                    height={100}
                    onClick={() => openImages(product)}
                    className={styles.image_left}
                  />
                  <Image
                    src={product.images[0]}
                    width={100}
                    height={100}
                    onClick={() => openImages(product)}
                    className={styles.image_right}
                  />
                </Box>
                <Image></Image>
              </Center>
            </GridCol>
            <GridCol span={{ base: 3 }}>
              <Text size="xs" style={{ fontWeight: "600" }}>
                {product.brand}
              </Text>
              <Text size="sm">{product.name}</Text>
            </GridCol>
            <GridCol span={{ base: 2 }}>
              <Text size="sm">{product.category}</Text>
            </GridCol>
            <GridCol span={{ base: 2 }}>
              <Text size="sm">${product.price}</Text>
            </GridCol>
            <GridCol span={{ base: 2 }}>
              <UnstyledButton onClick={() => removeProduct(product._id)}>
                <IconTrash />
              </UnstyledButton>
            </GridCol>
          </Grid>
        ))}
      </Box>
    </Stack>
  );
};

export default ViewProducts;
