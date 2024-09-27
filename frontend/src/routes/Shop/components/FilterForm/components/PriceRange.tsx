import {
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  RangeSlider,
  Stack,
  Text,
} from "@mantine/core";
import { useSearchParams } from "react-router-dom";

type Props = {
  handlePriceChange: (newRange: [number, number]) => void;
};

const PriceRange: React.FC<Props> = ({ handlePriceChange }) => {
  const [searchParams] = useSearchParams();

  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 2000;

  return (
    <AccordionItem value="price">
      <AccordionControl>Price</AccordionControl>
      <AccordionPanel>
        <Stack pb="md">
          <Text size="sm">
            Price Range: ${minPrice} - ${maxPrice}
          </Text>
          <RangeSlider
            min={0}
            max={500}
            step={5}
            value={[minPrice, maxPrice]}
            onChange={handlePriceChange}
            marks={[
              { value: 0, label: "$0" },
              { value: 500, label: "$500" },
            ]}
          />
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default PriceRange;
