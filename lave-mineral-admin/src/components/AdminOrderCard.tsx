"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  FaUser, FaMapMarkerAlt, FaBoxOpen, FaRupeeSign,
  FaWallet, FaFileAlt, FaTruck, FaChevronDown, FaPhone,
} from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";

type Order = {
  orderId: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  product: string;
  size: string;
  boxes: number;
  payment: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  discount?: number;
  paymentStatus: "Pending" | "Partial" | "Paid";
  status:
    | "Confirmed"
    | "Processing"
    | "Packaging"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
  notes?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt?: string;
};

export default function AdminOrderCard({
  order,
  updateOrder,
}: {
  order: Order;
  updateOrder: (
    orderId: string,
    updates: Partial<{
      status: Order["status"];
      totalAmount: number;
      discount: number;
      paidAmount: number;
      notes: string;
    }>
  ) => Promise<void>;
}) {
  const [status, setStatus] = useState(order.status);
  const [paidAmount, setPaidAmount] = useState(String(order.paidAmount || 0));
  const [notes, setNotes] = useState(order.notes || "");
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const liveRemaining = useMemo(() => {
    const total = Number(order.totalAmount || 0);
    const disc = Number(order.discount || 0);
    const paid = Number(paidAmount || 0);
    return Math.max(total - disc - paid, 0);
  }, [order.totalAmount, order.discount, paidAmount]);

  const statusBadge = useMemo(() => {
    switch (status) {
      case "Delivered": return "border-green-200 bg-green-50 text-green-700";
      case "Shipped": return "border-purple-200 bg-purple-50 text-purple-700";
      case "Cancelled": return "border-rose-200 bg-rose-50 text-rose-700";
      default: return "border-[#cfe2ff] bg-[#eef5ff] text-[#0066ff]";
    }
  }, [status]);

  const paymentBadge = useMemo(() => {
    switch (order.paymentStatus) {
      case "Paid": return "border-green-200 bg-green-50 text-green-700";
      case "Partial": return "border-yellow-200 bg-yellow-50 text-yellow-700";
      default: return "border-amber-200 bg-amber-50 text-amber-700";
    }
  }, [order.paymentStatus]);

  const normalizePhone = (phone: string) => {
    let digits = (phone || "").replace(/\D/g, "");
    if (digits.length === 10) digits = `91${digits}`;
    return digits;
  };

  const openWhatsApp = () => {
    const phone = normalizePhone(order.phone);
    if (!phone) { alert("Phone number not available."); return; }
    const msg = `Hello ${order.name},\n\nYour Lave Mineral Water order #${order.orderId} is now *${status}*.\n\nProduct: ${order.product} • ${order.size}\nQuantity: ${order.boxes} Boxes\n\nThank you for your order!\nLave Mineral Water Team`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateOrder(order.orderId, {
        status,
        paidAmount: Number(paidAmount || 0),
        notes,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
      className="group relative overflow-hidden rounded-[30px] border border-white/75 bg-white/72 backdrop-blur-2xl shadow-[0_22px_48px_rgba(15,23,42,0.08)] hover:shadow-[0_30px_60px_rgba(0,102,255,0.14)] transition-all"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(0,102,255,0.08),transparent_30%)]" />

      <div className="relative z-10 p-4 sm:p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-slate-900 break-all">#{order.orderId}</h2>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusBadge}`}>{status}</span>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${paymentBadge}`}>{order.paymentStatus}</span>
              {order.razorpayPaymentId && (
                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700">✅ Razorpay</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eef5ff] to-[#dcecff] text-[#0066ff] border border-[#d7e8ff] shrink-0">
                <FaUser size={14} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{order.name}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <FaPhone size={10} className="text-[#0066ff]" /> {order.phone}
                </p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={() => setExpanded((p) => !p)}
            className="shrink-0 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            {expanded ? "Less" : "More"}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-[#0066ff]">
              <FaChevronDown size={12} />
            </motion.span>
          </motion.button>
        </div>

        {/* Mini info */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: <FaBoxOpen size={12} />, label: "Product", value: `${order.product} • ${order.size}` },
            { icon: <FaBoxOpen size={12} />, label: "Qty", value: `${order.boxes} Boxes` },
            { icon: <FaWallet size={12} />, label: "Total", value: `₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}` },
            { icon: <FaTruck size={12} />, label: "Payment", value: order.payment },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/70 bg-white/80 p-3 shadow-sm">
              <div className="text-[#0066ff] mb-1">{item.icon}</div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className="text-sm font-semibold text-slate-800 break-words">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2">
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={openWhatsApp}
            className="flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-100 transition-all">
            <FaWhatsapp /> WhatsApp
          </motion.button>
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0058df] to-[#0066ff] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,102,255,0.20)] transition-all disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </motion.button>
        </div>

        {/* Expanded */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Address */}
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-[#0066ff] text-sm font-semibold">
                  <FaMapMarkerAlt /> Address
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {order.address}{order.city ? `, ${order.city}` : ""}{order.state ? `, ${order.state}` : ""}{order.pincode ? ` - ${order.pincode}` : ""}
                </p>
              </div>

              {/* Razorpay info */}
              {order.razorpayPaymentId && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700 mb-2">✅ Online Payment — Razorpay</p>
                  <p className="text-xs font-mono text-green-600 break-all">Payment ID: {order.razorpayPaymentId}</p>
                  {order.razorpayOrderId && <p className="text-xs font-mono text-green-600 break-all mt-1">Order ID: {order.razorpayOrderId}</p>}
                </div>
              )}

              {/* Delivery status control */}
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-[#0066ff] text-sm font-semibold">
                  <FaTruck /> Update Delivery Status
                </div>
                <select value={status} onChange={(e) => setStatus(e.target.value as Order["status"])} className="admin-mobile-input">
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment tracking */}
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-[#0066ff] text-sm font-semibold">
                  <FaWallet /> Payment Tracking
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Total Amount</p>
                    <p className="font-bold text-slate-800">₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Remaining</p>
                    <p className="font-bold text-[#0066ff]">₹{liveRemaining.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs text-slate-400 mb-1">Paid Amount (₹)</p>
                  <div className="flex items-center gap-2">
                    <FaRupeeSign className="text-[#0066ff]" size={12} />
                    <input type="number" min={0} value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      className="w-full bg-transparent outline-none text-slate-800 font-semibold" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-[#0066ff] text-sm font-semibold">
                  <FaFileAlt /> Admin Notes
                </div>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="admin-mobile-input resize-none"
                  placeholder="Tracking ID, delivery note, etc..." />
              </div>

              {/* Save + WhatsApp */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={openWhatsApp}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 hover:bg-green-100 transition-all">
                  <FaWhatsapp /> Notify Customer
                </motion.button>
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
                  className="rounded-2xl bg-gradient-to-r from-[#0058df] to-[#0066ff] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(0,102,255,0.20)] transition-all disabled:opacity-60">
                  {saving ? "Saving..." : "Save Updates"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .admin-mobile-input {
          width: 100%;
          border-radius: 0.875rem;
          border: 1px solid #dbe7f6;
          background: rgba(255,255,255,0.95);
          color: #1e293b;
          padding: 0.85rem 1rem;
          outline: none;
          transition: 0.2s ease;
        }
        .admin-mobile-input:focus {
          border-color: rgba(0,102,255,0.45);
          box-shadow: 0 0 0 3px rgba(0,102,255,0.10);
        }
      `}</style>
    </motion.div>
  );
}
