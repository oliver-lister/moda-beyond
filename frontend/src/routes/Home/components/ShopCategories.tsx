import { SimpleGrid } from "@mantine/core";
import CategoryCard from "./CategoryCard/CategoryCard";
import women_category_card from "../../../assets/images/categoryCards/women_category_card.webp";
import men_category_card from "../../../assets/images/categoryCards/men_category_card.webp";
import kids_category_card from "../../../assets/images/categoryCards/kids_category_card.webp";
import { useEffect } from "react";

// Consolidating category data
const categories = [
  {
    label: "Women",
    link: "/shop?category=women",
    image: women_category_card,
  },
  {
    label: "Men",
    link: "/shop?category=men",
    image: men_category_card,
  },
  {
    label: "Kids",
    link: "/shop?category=kids",
    image: kids_category_card,
  },
];

const preloadImages = (images: string[]) => {
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

const ShopCategories = () => {
  useEffect(() => {
    preloadImages(categories.map((category) => category.image));
  }, []);

  return (
    <section>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {categories.map(({ label, link, image }) => (
          <CategoryCard key={label} link={link} image={image} label={label} />
        ))}
      </SimpleGrid>
    </section>
  );
};

export default ShopCategories;
