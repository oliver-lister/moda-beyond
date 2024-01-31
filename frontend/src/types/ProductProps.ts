export default interface ProductProps {
  id: number;
  image: string;
  name: string;
  category?: string;
  brand: string;
  description?: string;
  price: number;
  lastPrice?: number;
}
