export default interface Product {
  _id: string;
  name: string;
  category: "men" | "women" | "kids" | string;
  brand: string;
  availableSizes: string[];
  availableColors: { label: string; hex: string }[];
  description: string;
  material: string;
  price: number;
  lastPrice?: number;
  images: string[];
  createdAt: Date;
  available: boolean;
}
