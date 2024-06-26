import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import styles from "./cart.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

export type DeliveryData = {
  standard: {
    label: string;
    isDelivery: boolean;
    fee: number;
    estDays: number;
  };
  express: { label: string; isDelivery: boolean; fee: number; estDays: number };
  pickup: { label: string; isDelivery: boolean; fee: number; estDays: number };
};

const deliveryData: DeliveryData = {
  standard: {
    label: "Standard Delivery",
    isDelivery: true,
    fee: 16,
    estDays: 7,
  },
  express: { label: "Express Delivery", isDelivery: true, fee: 22, estDays: 4 },
  pickup: { label: "Pick Up In-store", isDelivery: false, fee: 0, estDays: 0 },
};

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const auth = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.user);
  const [delivery, setDelivery] = useState<string>("standard");

  const handleDeliveryChange = (value: string) => {
    setDelivery(value);
  };

  return (
    <section className={styles.container}>
      <Container size="xl">
        <Outlet
          context={{
            cart,
            auth,
            delivery,
            handleDeliveryChange,
            deliveryData,
            user,
          }}
        />
      </Container>
    </section>
  );
};

export default Cart;
