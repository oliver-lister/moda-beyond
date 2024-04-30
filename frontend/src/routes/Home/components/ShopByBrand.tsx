import { SimpleGrid, Stack, Title } from "@mantine/core";
import BrandCard from "./BrandCard/BrandCard";
import adidas_hover from "../../../assets/images/brandCards/adidas_hover.webp";
import adidas_logo from "../../../assets/images/brandCards/adidas_logo.webp";
import academybrand_hover from "../../../assets/images/brandCards/academybrand_hover.webp";
import academybrand_logo from "../../../assets/images/brandCards/academybrand_logo.webp";
import assemblylabel_hover from "../../../assets/images/brandCards/assemblylabel_hover.webp";
import assemblylabel_logo from "../../../assets/images/brandCards/assemblylabel_logo.webp";
import bonds_hover from "../../../assets/images/brandCards/bonds_hover.webp";
import bonds_logo from "../../../assets/images/brandCards/bonds_logo.webp";
import cottonon_hover from "../../../assets/images/brandCards/cottonon_hover.webp";
import cottonon_logo from "../../../assets/images/brandCards/cottonon_logo.webp";
import countryroad_hover from "../../../assets/images/brandCards/countryroad_hover.webp";
import countryroad_logo from "../../../assets/images/brandCards/countryroad_logo.webp";
import nike_hover from "../../../assets/images/brandCards/nike_hover.webp";
import nike_logo from "../../../assets/images/brandCards/nike_logo.webp";
import rmwilliams_hover from "../../../assets/images/brandCards/rmwilliams_hover.webp";
import rmwilliams_logo from "../../../assets/images/brandCards/rmwilliams_logo.webp";

const brandCardData = [
  {
    title: "adidas",
    link: "/shop?brand=adidas&sortBy=date&sortOrder=-1",
    image_main: adidas_logo,
    image_hover: adidas_hover,
    logo_size: 75,
  },
  {
    title: "Academy Brand",
    link: "/shop?brand=Academy%20Brand&sortBy=date&sortOrder=-1",
    image_main: academybrand_logo,
    image_hover: academybrand_hover,
    logo_size: 150,
  },
  {
    title: "Assembly Label",
    link: "/shop?brand=Assembly%20Label&sortBy=date&sortOrder=-1",
    image_main: assemblylabel_logo,
    image_hover: assemblylabel_hover,
    logo_size: 30,
  },
  {
    title: "Bonds",
    link: "/shop?brand=Bonds&sortBy=date&sortOrder=-1",
    image_main: bonds_logo,
    image_hover: bonds_hover,
    logo_size: 200,
  },
  {
    title: "Cotton On",
    link: "/shop?brand=Cotton%20On&sortBy=date&sortOrder=-1",
    image_main: cottonon_logo,
    image_hover: cottonon_hover,
    logo_size: 30,
  },
  {
    title: "Country Road",
    link: "/shop?brand=Country%20Road&sortBy=date&sortOrder=-1",
    image_main: countryroad_logo,
    image_hover: countryroad_hover,
    logo_size: 50,
  },
  {
    title: "Nike",
    link: "/shop?brand=Nike&sortBy=date&sortOrder=-1",
    image_main: nike_logo,
    image_hover: nike_hover,
    logo_size: 50,
  },
  {
    title: "R.M.Williams",
    link: "/shop?brand=R.M.Williams&sortBy=date&sortOrder=-1",
    image_main: rmwilliams_logo,
    image_hover: rmwilliams_hover,
    logo_size: 50,
  },
];

const ShopByBrand = () => {
  return (
    <section>
      <Stack>
        <Title order={3} ta="center">
          SHOP BY BRAND
        </Title>
        <SimpleGrid cols={{ base: 1, xs: 1, sm: 2, lg: 3, xl: 4 }}>
          {brandCardData.map((item, index) => (
            <BrandCard
              key={index}
              link={item.link}
              image_main={item.image_main}
              image_hover={item.image_hover}
              logo_size={item.logo_size}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </section>
  );
};

export default ShopByBrand;
