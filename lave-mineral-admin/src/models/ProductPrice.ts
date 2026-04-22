import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductPrice extends Document {
  productId: number;
  pricePerBox: number;
  updatedBy?: string;
  updatedAt?: Date;
}

const ProductPriceSchema = new Schema<IProductPrice>(
  {
    productId: { type: Number, required: true, unique: true, index: true },
    pricePerBox: { type: Number, required: true, min: 1 },
    updatedBy: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const ProductPrice: Model<IProductPrice> =
  mongoose.models.ProductPrice ||
  mongoose.model<IProductPrice>("ProductPrice", ProductPriceSchema);

export default ProductPrice;
