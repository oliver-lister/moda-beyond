import p11_img from "../images/product/product_11.png";
import p12_img from "../images/product/product_12.png";
import p13_img from "../images/product/product_13.png";
import p14_img from "../images/product/product_14.png";
import { itemProps } from "../../types/itemProps";

const data_product: itemProps[] = [
  {
    id: 11,
    name: "Effortless Style Relaxed Fit Denim Jeans",
    category: "women",
    brand: "StyleHub",
    image: p11_img,
    price: 85.0,
  },
  {
    id: 12,
    name: "Polished Comfort Classic Trench Coat",
    category: "women",
    brand: "Glamora",
    image: p12_img,
    price: 85.0,
    lastPrice: 120.5,
  },
  {
    id: 13,
    name: "Dapper Edge Green Bomber Jacket",
    category: "men",
    brand: "UrbanVogue",
    image: p13_img,
    price: 85.0,
  },
  {
    id: 14,
    name: "Sleek Attire Military Style Jacket",
    category: "men",
    brand: "RuggedChic",
    image: p14_img,
    price: 85.0,
    lastPrice: 120.5,
  },
];

export default data_product;
