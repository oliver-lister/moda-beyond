import { SimpleGrid } from "@mantine/core";
import CategoryCard from "../../../components/CategoryCard/CategoryCard";
import women_category_card from "../../../assets/images/categoryCards/women_category_card.webp";
import men_category_card from "../../../assets/images/categoryCards/men_category_card.webp";
import kids_category_card from "../../../assets/images/categoryCards/kids_category_card.webp";

const ShopCategories = () => {
  return (
    <section>
      <SimpleGrid cols={{ base: 1, md: 3 }}>
        <CategoryCard
          link="/shop?category=women&sortBy=date&sortOrder=-1"
          image={women_category_card}
          label="Women"
        />
        <CategoryCard
          link="/shop?category=men&sortBy=date&sortOrder=-1"
          image={men_category_card}
          label="Men"
        />
        <CategoryCard
          link="/shop?category=kids&sortBy=date&sortOrder=-1"
          image={kids_category_card}
          label="Kids"
        />
      </SimpleGrid>
    </section>
  );
};

export default ShopCategories;
