import { Box, Stack, Title, Text, Image, Grid, GridCol } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from "react";
import { ProductProps } from "../AddProduct/components/AddProductForm";
import GridHeader from "./components/GridHeader";
import GridRow from "./components/GridRow";

const ViewProducts = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [products]);

  const removeProduct = async (_id: ProductProps["_id"]) => {
    try {
      if (!_id) throw new Error("Product _id is undefined");
      const response = await fetch(
        `http://localhost:3000/products/remove/${_id.toString()}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }
    } catch (err) {
      console.error("Error removing product:", err);
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
        <Grid align="center" style={{ padding: "1rem 1rem" }}>
          <GridHeader />
          {products.length > 0 ? (
            products.map((product: ProductProps) => (
              <GridRow
                product={product}
                openImages={openImages}
                removeProduct={removeProduct}
                key={product._id}
              />
            ))
          ) : (
            <GridCol span={12}>
              <Text style={{ textAlign: "center" }}>
                No products in database.
              </Text>
            </GridCol>
          )}
        </Grid>
      </Box>
    </Stack>
  );
};

export default ViewProducts;
