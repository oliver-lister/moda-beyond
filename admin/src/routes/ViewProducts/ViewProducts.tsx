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
import React, { useEffect, useState } from "react";
import { ProductProps } from "../AddProduct/AddProductForm/AddProductForm";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <Stack>
      <Box>
        <Title>View Products</Title>
        <Text c="gray.8">Review products in the MongoDB Database</Text>
      </Box>
      <Grid align="center">
        {products.map((product: ProductProps) => (
          <React.Fragment key={product._id}>
            <GridCol span={{ base: 3 }}>
              <Center>
                <Image src={product.images[0]} width={200} height={200} />
              </Center>
            </GridCol>
            <GridCol span={{ base: 3 }}>
              <Text size="xs">{product.brand}</Text>
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
          </React.Fragment>
        ))}
      </Grid>
    </Stack>
  );
};

export default ViewProducts;
