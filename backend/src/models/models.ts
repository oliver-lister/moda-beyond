import mongoose, { Document, Schema } from 'mongoose';
import argon2 from 'argon2';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['men', 'women', 'kids'] },
    brand: { type: String, required: true, trim: true },
    availableSizes: { type: [String], required: true },
    availableColors: { type: [{ label: String, hex: String }], required: true },
    material: { type: String, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    lastPrice: { type: Number, min: 0 },
    images: { type: [String], default: [] },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    autoIndex: true,
  },
);

// Add full-text search index
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

// Cart Item Schema
const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  {
    timestamps: true,
  },
);

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: Date },
    address: {
      street: { type: String, trim: true },
      suburb: { type: String, trim: true },
      state: { type: String, trim: true },
      postcode: { type: String, trim: true },
    },
    shoppingPreference: { type: String, enum: ['Womenswear', 'Menswear'], required: true },
    newsletter: { type: Boolean, default: true },
    cart: { type: [cartItemSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Enable virtual fields in JSON responses
  },
);

// Pre-save hook to hash password using argon2
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    this.passwordHash = await argon2.hash(this.passwordHash);
    next();
  } catch (err) {
    if (err instanceof Error) next(err);
  }
});

// Password validation method using argon2
userSchema.methods.validPassword = async function (password: string) {
  return argon2.verify(this.passwordHash, password);
};

// Session Schema
const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refreshToken: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

// TypeScript interfaces
export interface CartItem {
  _id: mongoose.Schema.Types.ObjectId;
  productId: mongoose.Schema.Types.ObjectId;
  size: string;
  color: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  dob?: Date;
  address?: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
  };
  shoppingPreference: string;
  newsletter: boolean;
  cart: CartItem[];
  createdAt: Date;
  updatedAt: Date;
  validPassword(password: string): Promise<boolean>;
}

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model<UserDocument>('User', userSchema);
const Session = mongoose.model('Session', sessionSchema);

export { Product, User, Session };
