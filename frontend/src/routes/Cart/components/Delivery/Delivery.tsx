import { Stack, Group, Radio, Text } from "@mantine/core";
import styles from "./delivery.module.css";
import { DeliveryData } from "../../Cart";

const Delivery = ({
  delivery,
  handleDeliveryChange,
  getDateInFuture,
  deliveryData,
}: {
  delivery: string;
  deliveryData: DeliveryData;
  getDateInFuture: (estDays: number) => string;
  handleDeliveryChange: (value: string) => void;
}) => {
  return (
    <Stack className={styles.container} gap={0}>
      <p>Delivery Type</p>
      <Radio.Group value={delivery} onChange={handleDeliveryChange}>
        <Group
          justify="space-between"
          align="center"
          className={styles.radio_item}
        >
          <Group>
            <Radio value="standard" id="standard_delivery" />
            <Stack gap={0}>
              <label htmlFor="standard_delivery">Standard Delivery</label>
              <p className={styles.delivery_estimate}>
                Estimated:{" "}
                {getDateInFuture(
                  deliveryData["standard" as keyof DeliveryData].estDays
                )}
              </p>
            </Stack>
          </Group>
          <Text>${deliveryData["standard" as keyof DeliveryData].fee}</Text>
        </Group>
        <Group
          justify="space-between"
          align="center"
          className={styles.radio_item}
        >
          <Group>
            <Radio value="express" id="express_delivery" />
            <Stack gap={0}>
              <label htmlFor="express_delivery">Express Delivery</label>
              <p className={styles.delivery_estimate}>
                Estimated:{" "}
                {getDateInFuture(
                  deliveryData["express" as keyof DeliveryData].estDays
                )}
              </p>
            </Stack>
          </Group>
          <Text>${deliveryData["express" as keyof DeliveryData].fee}</Text>
        </Group>
        <Group
          justify="space-between"
          align="center"
          className={styles.radio_item}
        >
          <Group>
            <Radio value="pickup" id="pickup" />
            <Stack gap={0}>
              <label htmlFor="pickup">Pick Up In-store</label>
              <p className={styles.delivery_estimate}>
                Collect from MØDA-BEYOND
              </p>
            </Stack>
          </Group>
          <Text>FREE</Text>
        </Group>
      </Radio.Group>
    </Stack>
  );
};

export default Delivery;
