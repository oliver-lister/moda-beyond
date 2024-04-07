import { Title, Text, Stack, Box } from "@mantine/core";

const WebsiteInfo = () => {
  return (
    <section>
      <Stack gap="md">
        <Title order={3}>
          Welcome to MØDA-BEYOND, your ultimate destination for men's, women's,
          and kids' fashion from a diverse range of brands.
        </Title>
        <Box>
          <Title order={4}>Women:</Title>
          <Text>
            Explore the latest trends and timeless wardrobe essentials in
            women's clothing, shoes, and accessories. Whether you're searching
            for new-season dresses, stylish bags, or elegant heels, we've got
            you covered. Elevate your look with our selection of top-quality
            lingerie and classic watches from both local and international
            labels.
          </Text>
        </Box>
        <Box>
          <Title order={4}>Men:</Title>
          <Text>
            Discover all your menswear essentials at MØDA-BEYOND. From formal
            attire to casual wear, our collection features pants, coats,
            jackets, t-shirts, jeans, sneakers, and caps to cater to every
            occasion.
          </Text>
        </Box>
        <Box>
          <Title order={4}>Kids:</Title>
          <Text>
            Find fashion-forward kidswear for every stage of their growth, from
            babies to teens. Our extensive range includes styles for girls and
            boys, ensuring there's something for everyone. Plus, shop
            hassle-free for kids' toys all year round, without the crowds.
          </Text>
        </Box>
        <Text>
          At <span style={{ fontWeight: 600 }}>MØDA-BEYOND</span>, we're more
          than just an online clothing store – we're your one-stop shop for
          everything fashion and lifestyle-related. Enjoy the convenience of
          shopping from home with our fast and reliable delivery service.
          Experience the essence of style with MØDA-BEYOND, your trusted fashion
          destination in Australia and New Zealand.
        </Text>
      </Stack>
    </section>
  );
};

export default WebsiteInfo;
