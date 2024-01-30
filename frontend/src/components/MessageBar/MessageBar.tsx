import styles from "./MessageBar.module.css";
import Flickity from "react-flickity-component";
import "./flickity.css";

const messageBarItems = [
  "Limited Time Offer: Free Shipping on Orders Over $100!",
  "Exclusive Discounts for VIP Members! 🌟🛍️",
  " New Arrivals Alert: Discover Fresh Fashion Picks! 👗🆕",
];

const flickityOptions = {
  contain: true,
  autoPlay: 5000,
  prevNextButtons: false,
  pageDots: false,
};

const Carousel = ({
  items,
  flickityOptions,
}: {
  items: string[];
  flickityOptions?: object;
}) => {
  return (
    <Flickity options={flickityOptions}>
      {items.map((item, i) => (
        <div key={i} className="flickity-cell">
          {item}
        </div>
      ))}
    </Flickity>
  );
};

const MessageBar = () => {
  return (
    <div className={styles.messagebar}>
      <Carousel items={messageBarItems} flickityOptions={flickityOptions} />
    </div>
  );
};

export default MessageBar;
