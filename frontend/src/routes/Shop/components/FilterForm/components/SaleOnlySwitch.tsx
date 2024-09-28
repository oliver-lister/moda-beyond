import { Group, InputLabel, Switch } from "@mantine/core";
import { useSearchParams } from "react-router-dom";

type Props = {
  handleSaleOnly: React.ChangeEventHandler;
};

const SaleOnlySwitch: React.FC<Props> = ({ handleSaleOnly }) => {
  const [searchParams] = useSearchParams();

  const saleOnly = !!searchParams.get("onSale");

  return (
    <Group
      align="center"
      justify="space-between"
      pt="xs"
      pb="xs"
      style={{
        borderBottom: "1px solid var(--mantine-color-gray-3)",
      }}
    >
      <InputLabel pl="md" size="md" htmlFor="sale-only" fw={400}>
        Sale Only
      </InputLabel>
      <Switch
        pr="md"
        id="sale-only"
        checked={saleOnly}
        onChange={handleSaleOnly}
      />
    </Group>
  );
};

export default SaleOnlySwitch;
