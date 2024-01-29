import p1_img from "../images/product/product_1.png";
import p2_img from "../images/product/product_2.png";
import p3_img from "../images/product/product_3.png";
import p4_img from "../images/product/product_4.png";
import { itemProps } from "../../types/itemProps";

const data_product: itemProps[] = [
  {
    id: 1,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    image: p1_img,
    price: 50.0,
    lastPrice: 80.5,
  },
  {
    id: 2,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    image: p2_img,
    price: 85.0,
    lastPrice: 120.5,
  },
  {
    id: 3,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    image: p3_img,
    price: 60.0,
    lastPrice: 100.5,
  },
  {
    id: 4,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    image: p4_img,
    price: 100.0,
    lastPrice: 150.0,
  },
];

export default data_product;
