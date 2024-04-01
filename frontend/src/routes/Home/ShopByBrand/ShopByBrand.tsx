import { SimpleGrid, Stack, Title } from "@mantine/core";
import BrandCard from "../../../components/BrandCard/BrandCard";
import adidas_hover from "../../../assets/images/brandCards/adidas_hover.webp";
import adidas_logo from "../../../assets/images/brandCards/adidas_logo.webp";

const brandCardData = [
  {
    link: "/shop?brand=adidas&sortBy=date&sortOrder=-1",
    image_main: adidas_logo,
    image_hover: adidas_hover,
  },
];

const ShopByBrand = () => {
  return (
    <section>
      <Stack>
        <Title order={3}>Shop By Brand</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
          {brandCardData.map((item, index) => (
            <BrandCard
              key={index}
              link={item.link}
              image_main={item.image_main}
              image_hover={item.image_hover}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </section>
  );
};

export default ShopByBrand;
