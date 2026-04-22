"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaUser, FaPhone, FaMapMarkerAlt, FaCreditCard,
  FaEnvelope, FaBox, FaMagic, FaLock, FaShieldAlt,
} from "react-icons/fa";
import { PRODUCTS } from "@/app/explore/constants";

type Props = {
  product: string;
  defaultSize: string;
  type: string;
  img?: string;
  productId?: number;
};

declare global {
  interface Window { Razorpay: any; }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function OrderForm({ product, defaultSize, type, img, productId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const matched = PRODUCTS.find((p) => p.id === productId);
  const defaultPrice = matched?.pricePerBox ?? 360;
  const [pricePerBox, setPricePerBox] = useState(defaultPrice);

  // Sync with admin-set live price
  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && productId && data.prices[productId]) {
          setPricePerBox(data.prices[productId]);
        }
      })
      .catch(() => {});
  }, [productId]);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "",
    city: "", state: "", pincode: "",
    size: defaultSize || "500ML",
    boxes: 50,
    payment: "COD",
    notes: "",
  });

  const totalAmount = form.boxes * pricePerBox;
  const gstAmount = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + gstAmount;

  const inputStyle = "w-full p-3 rounded-xl border border-blue-100 bg-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition text-sm";

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) return "Enter valid 10-digit Indian phone number";
    if (!form.address.trim()) return "Address is required";
    if (form.boxes < 50) return "Minimum 50 boxes required";
    return null;
  };

  const submitOrder = async (razorpayPaymentId?: string, razorpayOrderId?: string) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        product,
        type,
        totalAmount: grandTotal,
        paidAmount: razorpayPaymentId ? grandTotal : 0,
        payment: razorpayPaymentId ? "Online" : form.payment,
        razorpayPaymentId: razorpayPaymentId || "",
        razorpayOrderId: razorpayOrderId || "",
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || data?.message || "Order failed");
    const createdOrderId = data?.orderId || data?.order?.orderId;
    if (!createdOrderId) throw new Error("Order ID not received from server");
    return createdOrderId;
  };

  const handleRazorpayPayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error("Failed to load payment gateway. Please check your connection.");

    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: grandTotal, receipt: `rcpt_${Date.now()}` }),
    });
    const data = await res.json();
    if (!res.ok || !data.orderId) throw new Error(data?.error || "Could not initiate payment.");

    return new Promise<{ paymentId: string; razorpayOrderId: string }>((resolve, reject) => {
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Lave Mineral Water",
        description: `${product} • ${form.size} • ${form.boxes} Boxes`,
        order_id: data.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#0066FF" },
        handler: (response: any) => resolve({
          paymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
        }),
        modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) { alert(error); return; }
    try {
      setLoading(true);
      let createdOrderId: string;
      if (form.payment === "Online") {
        const payment = await handleRazorpayPayment();
        createdOrderId = await submitOrder(payment.paymentId, payment.razorpayOrderId);
      } else {
        createdOrderId = await submitOrder();
      }
      router.push(`/order/success/${createdOrderId}`);
    } catch (err: any) {
      console.error("ORDER SUBMIT ERROR:", err);
      if (err?.message !== "Payment cancelled") alert(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-5 text-gray-800 tracking-wide">Place Order</h2>

      {/* Product Preview */}
      <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
        <div className="flex items-center gap-3">
          {img && <img src={img} alt={product} className="h-14 w-14 object-contain rounded-lg" />}
          <div>
            <p className="text-sm text-gray-700 font-semibold">{product}</p>
            <p className="text-xs text-gray-500">{type}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-500">Per Box</p>
            <p className="text-lg font-bold text-green-600">₹{pricePerBox.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={() => router.push("/customize")}
        className="mb-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] to-blue-500 text-white font-semibold shadow-lg hover:shadow-blue-300/50 transition"
      >
        <FaMagic /> Customize Bottle (Optional)
      </motion.button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 col-span-2">
          <FaUser className="text-gray-500" />
          <input placeholder="Full Name *" className={inputStyle} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="flex items-center gap-3 col-span-2">
          <FaEnvelope className="text-gray-500" />
          <input placeholder="Email" className={inputStyle} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>

        <div className="flex items-center gap-3 col-span-2">
          <FaPhone className="text-gray-500" />
          <input placeholder="Phone Number *" className={inputStyle} value={form.phone} maxLength={10}
            onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
        </div>

        <div className="flex items-center gap-3 col-span-2">
          <FaMapMarkerAlt className="text-gray-500" />
          <input placeholder="Full Address *" className={inputStyle} value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>

        <input placeholder="City" className={inputStyle} value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input placeholder="State" className={inputStyle} value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <input placeholder="Pincode" className={inputStyle} value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })} />

        <div className="flex items-center gap-3">
          <FaBox className="text-gray-500" />
          <input type="number" min={50} placeholder="Boxes (Min 50)" className={inputStyle}
            value={form.boxes}
            onChange={(e) => setForm({ ...form, boxes: Number(e.target.value) })} />
        </div>

        {/* Payment Method */}
        <div className="col-span-2">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <FaCreditCard className="text-[#0066FF]" /> Payment Method
          </p>
          <div className="grid grid-cols-3 gap-2">
            {["COD", "Online", "Bank Transfer"].map((method) => (
              <button key={method} type="button"
                onClick={() => setForm({ ...form, payment: method })}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  form.payment === method
                    ? "bg-[#0066FF] text-white border-[#0066FF] shadow-lg shadow-blue-300/40"
                    : "bg-white/70 text-gray-600 border-blue-100 hover:border-[#0066FF]"
                }`}
              >
                {method === "Online" ? "💳 Online" : method === "COD" ? "💰 COD" : "🏦 Bank"}
              </button>
            ))}
          </div>
          {form.payment === "Online" && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
              <FaShieldAlt /><span>Secured by Razorpay — UPI, Cards, Netbanking accepted</span>
            </div>
          )}
          {form.payment === "Bank Transfer" && (
            <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
              Bank details will be shared after order confirmation.
            </div>
          )}
        </div>

        <textarea placeholder="Special Instructions (Optional)"
          className={`${inputStyle} col-span-2`} rows={3} value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })} />

        {/* Price Summary */}
        <div className="col-span-2 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h3>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{form.boxes} boxes × ₹{pricePerBox.toLocaleString("en-IN")}</span>
            <span>₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>GST (18%)</span>
            <span>₹{gstAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#0066FF] border-t border-blue-100 pt-2 mt-2">
            <span>Grand Total</span>
            <span>₹{grandTotal.toLocaleString("en-IN")}</span>
          </div>
          {form.payment === "COD" && (
            <p className="text-xs text-gray-400 text-center pt-1">Pay on delivery</p>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}
          disabled={loading} onClick={handleSubmit}
          className={`col-span-2 w-full py-3.5 rounded-xl text-white font-semibold tracking-wide flex items-center justify-center gap-2 bg-gradient-to-r from-[#0066FF] to-blue-500 hover:from-blue-600 hover:to-[#0066FF] shadow-lg hover:shadow-blue-300/50 transition-all ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <><span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />Processing...</>
          ) : form.payment === "Online" ? (
            <><FaLock size={13} /> Pay ₹{grandTotal.toLocaleString("en-IN")} via Razorpay</>
          ) : (
            <>🚀 Place Order — ₹{grandTotal.toLocaleString("en-IN")}</>
          )}
        </motion.button>
      </div>
    </div>
  );
}
