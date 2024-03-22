import { useParams, Params } from "react-router-dom";
import { Stack, Box, Title, Text, Center, Loader, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import EditProductForm from "./components/EditProductForm";
import { ProductProps } from "./components/EditProductForm";
import { useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { productId }: Readonly<Params<string>> | undefined = useParams();
  const [productToEdit, setProductToEdit] = useState<ProductProps | null>(null);
  const [productList, setProductList] = useState<ProductProps[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all products on startup
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://localhost:3000/products/fetchproducts",
          {
            method: "GET",
          }
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`${responseData.error}, ${responseData.errorCode}`);
        }

        const { products } = responseData;
        setProductList(products);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error)
          console.error("Error fetching products:", err.message);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Assign Product to Edit based on Url Params
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productList) return;

      const product = productList.find((product) => product._id === productId);
      if (!product) return;

      setProductToEdit(product);
    };

    fetchProduct();
  }, [productId, productList]);

  const handleChange = (value: string) => {
    const newProductId = value.split("| ")[1];
    navigate(`/editproduct/${newProductId}`);
  };

  return (
    <Stack>
      <Box>
        <Title>Edit Product</Title>
        <Text c="gray.8">Edit a product in the MongoDB Database</Text>
      </Box>
      <Box>
        {productList ? (
          <Select
            placeholder="Please search for a product."
            data={productList.map(
              (product) => `${product.brand} ${product.name} | ${product._id}`
            )}
            searchable
            value={
              productToEdit
                ? `${productToEdit.brand} ${productToEdit.name} | ${productToEdit._id}`
                : null
            }
            allowDeselect={false}
            onOptionSubmit={handleChange}
          />
        ) : (
          <Text>No product list.</Text>
        )}
        {productId && productToEdit ? (
          isLoading ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <EditProductForm product={productToEdit} />
          )
        ) : (
          <Box>
            <Text></Text>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default EditProduct;
