import { Stack, Group, Radio } from "@mantine/core";
import styles from "./delivery.module.css";

const Delivery = () => {
  return (
    <Stack className={styles.container} gap={0}>
      <p>Delivery Type</p>
      <Radio.Group value={cart.deliveryType}>
        <Group
          justify="space-between"
          align="center"
          className={styles.radio_item}
        >
          <Group>
            <Radio value="standard" id="standard_delivery" />
            <Stack gap={0}>
              <label htmlFor="standard_delivery">Standard Delivery</label>
              <p className={styles.delivery_estimate}>Estimated: Feb 06-22</p>
            </Stack>
          </Group>
          <p>$16</p>
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
              <p className={styles.delivery_estimate}>Estimated: Feb 06-15</p>
            </Stack>
          </Group>
          <p>$22</p>
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
                Collect from THE SHOPPER
              </p>
            </Stack>
          </Group>
          <p>$6</p>
        </Group>
      </Radio.Group>
    </Stack>
  );
};

export default Delivery;
