import {
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  Stack,
} from "@mantine/core";
import { useSearchParams } from "react-router-dom";

type Props = {
  sizeOptions: string[];
  handleSizeChange: (size: string, isChecked: boolean) => void;
};

const SizeCheckboxes: React.FC<Props> = ({ sizeOptions, handleSizeChange }) => {
  const [searchParams] = useSearchParams();

  // Get selected sizes from URL
  const selectedSizes = searchParams.getAll("size");

  return (
    <AccordionItem value="size">
      <AccordionControl>Size</AccordionControl>
      <AccordionPanel>
        <Stack>
          {sizeOptions.map((size: string) => (
            <Checkbox
              key={size}
              label={size}
              checked={selectedSizes.includes(size)}
              onChange={(event) =>
                handleSizeChange(size, event.currentTarget.checked)
              }
            />
          ))}
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default SizeCheckboxes;
