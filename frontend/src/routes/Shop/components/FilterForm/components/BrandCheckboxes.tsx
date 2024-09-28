import {
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  Stack,
} from "@mantine/core";
import { useSearchParams } from "react-router-dom";

type Props = {
  brandOptions: string[];
  handleBrandChange: (brand: string, isChecked: boolean) => void;
};

const BrandCheckboxes: React.FC<Props> = ({
  brandOptions,
  handleBrandChange,
}) => {
  const [searchParams] = useSearchParams();

  const selectedBrands = searchParams.getAll("brands");

  return (
    <AccordionItem value="brand">
      <AccordionControl>Brand</AccordionControl>
      <AccordionPanel>
        <Stack>
          {brandOptions.map((brand) => (
            <Checkbox
              key={brand}
              label={brand}
              data-testid={`checkbox-${brand}`} // Add test id for each checkbox
              checked={selectedBrands.includes(brand)}
              onChange={(event) =>
                handleBrandChange(brand, event.currentTarget.checked)
              }
            />
          ))}
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default BrandCheckboxes;
