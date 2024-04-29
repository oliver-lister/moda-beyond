import mongoose, { Document } from 'mongoose';
import crypto from 'crypto';

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
  hash: String,
  salt: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date },
  address: { street: String, suburb: String, state: String, postcode: String },
  shoppingPreference: { type: String, required: true },
  newsletter: { type: Boolean, required: true, default: true },
  cart: { type: [cartItemSchema], required: true, default: [] },
});

userSchema.methods.setPassword = function (password: string) {
  // Creating a unique salt for a particular user
  this.salt = crypto.randomBytes(16).toString('hex');

  // Hashing user's salt and password with 1000 iterations,
  // 64 length and sha512 digest
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};

userSchema.methods.validPassword = function (password: string) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
  return this.hash === hash;
};

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
export interface UserDocument extends Document {
  email: string;
  hash: string;
  salt: string;
  firstName: string;
  lastName: string;
  dob?: Date;
  address?: { street: string; suburb: string; state: string; postcode: string };
  shoppingPreference: string;
  newsletter: boolean;
  cart: CartItem[];
  setPassword(password: string): void;
  validPassword(password: string): boolean;
}

const User = mongoose.model<UserDocument>('Users', userSchema);

export { Product, User, Session };
