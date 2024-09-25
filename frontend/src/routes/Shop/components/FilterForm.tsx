import {
  Accordion,
  Group,
  Text,
  Button,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
} from "@mantine/core";

const FilterForm = () => {
  return (
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
        <Button variant="outline">Clear all</Button>
      </Group>
      <AccordionItem value="price">
        <AccordionControl>Price</AccordionControl>
        <AccordionPanel></AccordionPanel>
      </AccordionItem>
      <AccordionItem value="sale-only">
        <AccordionControl>Sale Only</AccordionControl>
        <AccordionPanel></AccordionPanel>
      </AccordionItem>
      <AccordionItem value="size">
        <AccordionControl>Size</AccordionControl>
        <AccordionPanel></AccordionPanel>
      </AccordionItem>
      <AccordionItem value="brand">
        <AccordionControl>Brand</AccordionControl>
        <AccordionPanel></AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default FilterForm;
