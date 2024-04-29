import { Container } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./cart.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { submitCheckoutAsync } from "../../state/cart/cartSlice";

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
  const [delivery, setDelivery] = useState<string>("standard");
  const dispatch = useDispatch<AppDispatch>();

  const handleDeliveryChange = (value: string) => {
    setDelivery(value);
  };

  const submitCheckout = async () => {
    try {
      const url = await dispatch(submitCheckoutAsync(cart.items)).unwrap();
      console.log(url);
      window.location.href = url;
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error: " + err.message);
      }
    }
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
            submitCheckout,
          }}
        />
      </Container>
    </section>
  );
};

export default Cart;
