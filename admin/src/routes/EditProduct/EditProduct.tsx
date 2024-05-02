import { useParams, Params } from "react-router-dom";
import { Stack, Box, Title, Text, Center, Loader, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import EditProductForm from "./components/EditProductForm";
import { ProductProps } from "./components/EditProductForm";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

const EditProduct = () => {
  const { productId }: Readonly<Params<string>> | undefined = useParams();
  const [productToEdit, setProductToEdit] = useState<ProductProps | null>(null);
  const { products, isLoading } = useProducts();
  const navigate = useNavigate();

  // Assign Product to Edit based on Url Params
  useEffect(() => {
    if (!products) return;

    const product = products.find((product) => product._id === productId);
    if (product) {
      setProductToEdit(product);
    } else {
      setProductToEdit(null);
    }
  }, [productId, products]);

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
      <Stack>
        {products ? (
          <Select
            placeholder="Please search for a product."
            data={products.map(
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
            <Text>No product selected.</Text>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default EditProduct;
