import { useParams, Params } from "react-router-dom";
import { Stack, Box, Title, Text, Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import EditProductForm from "./components/EditProductForm";

const EditProduct = () => {
  const { productId }: Readonly<Params<string>> | undefined = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch products from backend
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3000/products/fetchproductbyid/${productId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const productData = await response.json();

        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  return (
    <Stack>
      <Box>
        <Title>Edit Product</Title>
        <Text c="gray.8">Edit a product in the MongoDB Database</Text>
      </Box>
      <Box>
        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <EditProductForm product={product} />
        )}
      </Box>
    </Stack>
  );
};

export default EditProduct;
