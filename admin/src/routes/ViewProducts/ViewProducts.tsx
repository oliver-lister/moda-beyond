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
