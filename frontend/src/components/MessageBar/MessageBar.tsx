import styles from "./MessageBar.module.css";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";

const messageBarItems = [
  "Limited Time Offer: Free Shipping on Orders Over $100!",
  "Exclusive Discounts for VIP Members! 🌟🛍️",
  " New Arrivals Alert: Discover Fresh Fashion Picks! 👗🆕",
];

const MessageBar = () => {
  const autoplay = useRef(Autoplay({ delay: 6000 }));

  return (
    <Carousel
      withControls={false}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      className={styles.messagebar}
    >
      {messageBarItems.map((item, index) => (
        <Carousel.Slide key={index}>{item}</Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default MessageBar;
