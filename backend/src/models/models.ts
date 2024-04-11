import mongoose, { Document } from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ['men', 'women', 'kids'] },
    brand: { type: String, required: true },
    availableSizes: { type: [String], required: true },
    availableColors: { type: [{ label: String, hex: String }], required: true },
    material: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    lastPrice: { type: Number },
    images: { type: [String], default: [] },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
  },
  { autoIndex: false },
);

productSchema.index({ name: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);

const cartItemSchema = new mongoose.Schema({
  cartItemId: { type: String, required: true },
  productId: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date },
  address: { street: String, city: String, zipCode: String },
  shoppingPreference: { type: String, required: true },
  newsletter: { type: Boolean, required: true, default: true },
  cart: { type: [cartItemSchema], required: true, default: [] },
});

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

const Session = mongoose.model('Session', sessionSchema);

// Define the CartItem interface
interface CartItem {
  _id?: string;
  cartItemId: string;
  productId: string;
  price: number;
  size?: string;
  color?: string;
  quantity?: number;
}

// Define the UserDocument interface
interface UserDocument extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob?: Date;
  address?: { street: string; city: string; zipCode: string };
  shoppingPreference: string;
  newsletter: boolean;
  cart: CartItem[];
}

const User = mongoose.model<UserDocument>('Users', userSchema);

export { Product, User, Session };
