import { SimpleGrid } from "@mantine/core";
import CategoryCard from "./CategoryCard/CategoryCard";
import women_category_card from "../../../assets/images/categoryCards/women_category_card.webp";
import men_category_card from "../../../assets/images/categoryCards/men_category_card.webp";
import kids_category_card from "../../../assets/images/categoryCards/kids_category_card.webp";
import { useEffect } from "react";

const categoryImages = [
  women_category_card,
  men_category_card,
  kids_category_card,
];

const ShopCategories = () => {
  useEffect(() => {
    //preloading images
    categoryImages.forEach((catImg) => {
      const img = new Image();
      img.src = catImg;
    });
  }, []);

  return (
    <section>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <CategoryCard
          link="/shop?category=women&page=1&sortBy=date&sortOrder=-1"
          image={women_category_card}
          label="Women"
        />
        <CategoryCard
          link="/shop?category=men&page=1&sortBy=date&sortOrder=-1"
          image={men_category_card}
          label="Men"
        />
        <CategoryCard
          link="/shop?category=kids&page=1&sortBy=date&sortOrder=-1"
          image={kids_category_card}
          label="Kids"
        />
      </SimpleGrid>
    </section>
  );
};

export default ShopCategories;
