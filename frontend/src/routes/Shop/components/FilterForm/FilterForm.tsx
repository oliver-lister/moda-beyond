import { Accordion, Group, Text, Button } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import PriceRange from "./components/PriceRange";
import SaleOnlySwitch from "./components/SaleOnlySwitch";
import SizeCheckboxes from "./components/SizeCheckboxes";
import BrandCheckboxes from "./components/BrandCheckboxes";

const FilterForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle changes in price range finder
  const handlePriceChange = (newRange: [number, number]) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("minPrice", newRange[0].toString());
    newSearchParams.set("maxPrice", newRange[1].toString());
    setSearchParams(newSearchParams);
  };

  // Handle changes to Sale Only switch
  const handleSaleOnly = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (e.currentTarget.checked) {
      newSearchParams.set("onSale", "true");
    } else {
      newSearchParams.delete("onSale");
    }
    setSearchParams(newSearchParams);
  };

  // Handle changes to Size checkboxes
  const sizeOptions = ["INTL S", "INTL M", "INTL L", "INTL XL"];
  const handleSizeChange = (size: string, isChecked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (isChecked) {
      newSearchParams.append("size", size); // Add size to URL
    } else {
      const sizes = newSearchParams.getAll("size").filter((s) => s !== size);
      newSearchParams.delete("size"); // Clear all sizes
      sizes.forEach((s) => newSearchParams.append("size", s)); // Add back remaining sizes
    }

    setSearchParams(newSearchParams);
  };

  // Handle changes to Brand checkboxes
  const brandOptions = ["Brand A", "Brand B", "Brand C"];
  const handleBrandChange = (brand: string, isChecked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (isChecked) {
      newSearchParams.append("brand", brand); // Add brand to URL
    } else {
      const brands = newSearchParams.getAll("brand").filter((b) => b !== brand);
      newSearchParams.delete("brand"); // Clear all brands
      brands.forEach((b) => newSearchParams.append("brand", b)); // Add back remaining brands
    }

    setSearchParams(newSearchParams);
  };

  // Handle clearing of filters
  const handleClear = (): void => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("minPrice");
    newSearchParams.delete("maxPrice");
    newSearchParams.delete("onSale");
    newSearchParams.delete("size");
    newSearchParams.delete("brand");
    setSearchParams(newSearchParams);
  };

  return (
    <form>
      <Accordion>
        <Group
          justify="space-between"
          align="center"
          pb="xs"
          style={{
            borderBottom: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Text pl="md" fw={600}>
            Filter
          </Text>
          <Button variant="outline" onClick={handleClear}>
            Clear all
          </Button>
        </Group>
        <PriceRange handlePriceChange={handlePriceChange} />
        <SaleOnlySwitch handleSaleOnly={handleSaleOnly} />
        <SizeCheckboxes
          sizeOptions={sizeOptions}
          handleSizeChange={handleSizeChange}
        />
        <BrandCheckboxes
          brandOptions={brandOptions}
          handleBrandChange={handleBrandChange}
        />
      </Accordion>
    </form>
  );
};

export default FilterForm;
