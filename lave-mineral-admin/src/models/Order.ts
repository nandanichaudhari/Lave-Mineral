import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  orderId: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  product: string;
  size: string;
  packaging?: string;
  boxes: number;
  payment: "COD" | "Online" | "Bank Transfer";
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: "Pending" | "Partial" | "Paid";
  discount: number;
  finalAmount: number;
  notes?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status:
    | "Confirmed"
    | "Processing"
    | "Packaging"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, unique: true, required: true },
    userId: { type: String, default: null, index: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    product: { type: String, required: true },
    size: { type: String, required: true },
    packaging: { type: String, default: "" },
    boxes: { type: Number, required: true, min: 1 },
    payment: {
      type: String,
      enum: ["COD", "Online", "Bank Transfer"],
      default: "COD",
    },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      default: "Pending",
    },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpayOrderId: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "Confirmed",
        "Processing",
        "Packaging",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Confirmed",
    },
  },
  { timestamps: true }
);

// Auto-calculate remaining and payment status on save
OrderSchema.pre("save", function (this: IOrder) {
  this.finalAmount = Math.max((this.totalAmount || 0) - (this.discount || 0), 0);
  this.remainingAmount = Math.max(this.finalAmount - (this.paidAmount || 0), 0);

  if (this.paidAmount <= 0) {
    this.paymentStatus = "Pending";
  } else if (this.paidAmount < this.finalAmount) {
    this.paymentStatus = "Partial";
  } else {
    this.paymentStatus = "Paid";
  }
});

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;