"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Check,
  CreditCard,
  Truck,
  Copy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBDT } from "@/lib/utils";
import { OrderItem } from "@/lib/types";

const BD_DISTRICTS = [
  "Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh",
  "Gazipur", "Narayanganj", "Cumilla", "Bogura", "Brahmanbaria", "Cox's Bazar", "Dinajpur",
  "Faridpur", "Feni", "Habiganj", "Jamalpur", "Jashore", "Kushtia", "Moulvibazar", "Naogaon",
  "Narsingdi", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Satkhira", "Sirajganj", "Tangail"
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartTotal,
    clearCart,
    lang,
    addOrder,
    siteSettings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    finalCartTotal,
  } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [orderNotes, setOrderNotes] = useState("");

  // Payment Gateway State: COD, bKash, Nagad, Card
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad" | "card">("cod");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Card Payment fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery charge calculation
  const freeThreshold = siteSettings?.freeShippingThreshold || 10000;
  const isFreeDelivery = cartTotal >= freeThreshold;
  const deliveryCharge = isFreeDelivery
    ? 0
    : district === "Dhaka"
    ? siteSettings?.insideDhakaShipping || 80
    : siteSettings?.outsideDhakaShipping || 130;
  const total = finalCartTotal + deliveryCharge;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponInput("");
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
    setTimeout(() => setCouponMsg(null), 3500);
  };

  const activeMerchantNumber =
    paymentMethod === "nagad"
      ? siteSettings?.nagadMerchant || "01700-000000"
      : siteSettings?.bkashMerchant || "01700-000000";

  const handleCopyNumber = (num: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(num.replace(/\D/g, ""));
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert("Please fill in your recipient name, mobile number, and delivery address.");
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone.startsWith("01") || cleanPhone.length !== 11) {
      alert("Please enter a valid 11-digit Bangladesh phone number (01XXXXXXXXX).");
      return;
    }

    // Payment validation
    if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      if (!senderNumber || !trxId) {
        alert(
          `Please provide both your ${
            paymentMethod === "bkash" ? "bKash" : "Nagad"
          } number and Transaction ID (TrxID) to confirm payment.`
        );
        return;
      }
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        alert("Please complete the card details (Card Number, Expiry, CVV).");
        return;
      }
    }

    setIsSubmitting(true);

    const orderId = `SN-${Date.now().toString().slice(-6)}`;
    const newOrder: OrderItem = {
      id: orderId,
      customer: fullName,
      phone: phone,
      district: district,
      address: address + (orderNotes ? ` (Note: ${orderNotes})` : ""),
      items:
        cart
          .map((i) => `${i.title} (${i.colorName || "Standard"}, ${i.size}) x${i.quantity}`)
          .join(", ") +
        (appliedCoupon
          ? ` · [Privilege Code: ${appliedCoupon.code} (-${appliedCoupon.discountPercent}%)]`
          : ""),
      total: total,
      payment:
        paymentMethod === "cod"
          ? "COD"
          : paymentMethod === "bkash"
          ? "bKash"
          : paymentMethod === "nagad"
          ? "Nagad"
          : ("Card" as any),
      trxId: trxId ? trxId.toUpperCase() : paymentMethod === "card" ? `CARD-${Date.now().toString().slice(-6)}` : undefined,
      senderPhone: senderNumber || (paymentMethod === "card" ? phone : undefined),
      status: paymentMethod === "cod" ? "Processing" : "Ready to Dispatch",
      date: "Just now",
    };

    addOrder(newOrder);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("sn_latest_order", JSON.stringify(newOrder));
      } catch {}
    }

    setTimeout(() => {
      clearCart();
      removeCoupon();
      router.push("/order-success");
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <h1 className="font-serif text-3xl font-medium text-text">Your bag is empty</h1>
        <p className="text-xs text-muted">Add products to your bag to proceed with checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 rounded-full bg-accent-ink text-white text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 px-4 md:px-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-text font-medium"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Return to Bag</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Delivery & Bangladesh Payment Gateway */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer & Delivery Details */}
          <div className="space-y-4 bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <h2 className="font-serif text-xl font-medium text-text">
                1. Delivery Details
              </h2>
              <span className="text-xs text-muted font-mono">Step 1 of 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-muted font-medium mb-1">Recipient Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Farhana Akter"
                  className="w-full p-3 rounded-lg bg-bg border border-border text-text focus:outline-none focus:ring-1 focus:ring-accent-ink transition-all"
                />
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">Mobile Number (11 digits) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full p-3 rounded-lg bg-bg border border-border text-text font-mono focus:outline-none focus:ring-1 focus:ring-accent-ink transition-all"
                />
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">Delivery District *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-3 rounded-lg bg-bg border border-border text-text focus:outline-none focus:ring-1 focus:ring-accent-ink transition-all"
                >
                  {BD_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} {d === "Dhaka" ? "(৳80 • 1–2 Days)" : "(৳130 • 2–4 Days)"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted font-medium mb-1">Special Order Note (Optional)</label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, urgent Eid gift"
                  className="w-full p-3 rounded-lg bg-bg border border-border text-text focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-muted font-medium mb-1">Detailed Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House number, Road number, Area, Thana / Post Office"
                  className="w-full p-3 rounded-lg bg-bg border border-border text-text focus:outline-none focus:ring-1 focus:ring-accent-ink transition-all"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Bangladesh Payment Gateway Choice */}
          <div className="space-y-5 bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <h2 className="font-serif text-xl font-medium text-text">
                2. Payment Gateway Choice
              </h2>
              <span className="text-xs text-muted font-mono">Step 2 of 2</span>
            </div>

            {/* Gateway Selection Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  paymentMethod === "cod"
                    ? "border-accent-ink bg-accent/20 ring-1 ring-accent-ink shadow-sm"
                    : "border-border/60 hover:bg-surface-2/40"
                }`}
              >
                <Truck className="h-5 w-5 text-accent-ink mb-1" />
                <div>
                  <span className="font-semibold text-xs text-text block">Cash on Delivery</span>
                  <span className="text-[10px] text-muted">Pay to courier</span>
                </div>
              </button>

              {/* bKash Gateway */}
              <button
                type="button"
                onClick={() => setPaymentMethod("bkash")}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  paymentMethod === "bkash"
                    ? "border-[#E2136E] bg-[#E2136E]/10 ring-1 ring-[#E2136E] shadow-sm"
                    : "border-border/60 hover:bg-surface-2/40"
                }`}
              >
                <div className="h-5 flex items-center font-bold text-[#E2136E] text-sm font-sans mb-1">
                  bKash
                </div>
                <div>
                  <span className="font-semibold text-xs text-text block">bKash</span>
                  <span className="text-[10px] text-muted">Direct Payment</span>
                </div>
              </button>

              {/* Nagad Gateway */}
              <button
                type="button"
                onClick={() => setPaymentMethod("nagad")}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  paymentMethod === "nagad"
                    ? "border-[#F7921E] bg-[#F7921E]/10 ring-1 ring-[#F7921E] shadow-sm"
                    : "border-border/60 hover:bg-surface-2/40"
                }`}
              >
                <div className="h-5 flex items-center font-bold text-[#F7921E] text-sm font-sans mb-1">
                  Nagad
                </div>
                <div>
                  <span className="font-semibold text-xs text-text block">Nagad</span>
                  <span className="text-[10px] text-muted">Wallet Payment</span>
                </div>
              </button>

              {/* Card Gateway */}
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  paymentMethod === "card"
                    ? "border-accent-ink bg-accent/20 ring-1 ring-accent-ink shadow-sm"
                    : "border-border/60 hover:bg-surface-2/40"
                }`}
              >
                <CreditCard className="h-5 w-5 text-accent-ink mb-1" />
                <div>
                  <span className="font-semibold text-xs text-text block">Debit / Credit</span>
                  <span className="text-[10px] text-muted">Visa / Mastercard</span>
                </div>
              </button>
            </div>

            {/* PAYMENT METHOD DETAILS BOXES */}

            {/* 1. Cash on Delivery Box */}
            {paymentMethod === "cod" && (
              <div className="p-4 rounded-xl bg-surface-2/30 border border-border/60 space-y-2 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-text font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Cash on Delivery Selected</span>
                </div>
                <p className="text-muted leading-relaxed">
                  You do not need to pay anything right now. When Steadfast Courier delivers your parcel to your address in <strong>{district}</strong>, inspect the package seal and pay <strong>{formatBDT(total)}</strong> to the delivery rider.
                </p>
              </div>
            )}

            {/* 2. bKash Gateway Interface */}
            {paymentMethod === "bkash" && (
              <div className="p-5 rounded-2xl bg-[#E2136E]/5 border border-[#E2136E]/30 space-y-4 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#E2136E]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#E2136E] animate-pulse" />
                    <span className="font-bold text-[#E2136E] uppercase tracking-wider text-[11px]">
                      bKash Merchant Payment Gateway
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#E2136E]/15 text-[#E2136E] font-mono font-bold text-[10px]">
                    Payable: {formatBDT(total)}
                  </span>
                </div>

                {/* Instruction steps */}
                <div className="space-y-2 text-muted leading-relaxed">
                  <p className="font-medium text-text">How to complete your bKash payment:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                    <li>Open your <strong>bKash App</strong> or dial <strong>*247#</strong></li>
                    <li>Select <strong>Payment</strong> (or Send Money)</li>
                    <li>
                      Enter bKash Number:{" "}
                      <strong className="text-text font-mono text-xs">{activeMerchantNumber}</strong>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(activeMerchantNumber)}
                        className="ml-2 px-2 py-0.5 rounded bg-surface border border-border text-[10px] text-text hover:bg-surface-2 inline-flex items-center gap-1 font-sans"
                      >
                        {copiedNumber ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedNumber ? "Copied!" : "Copy"}</span>
                      </button>
                    </li>
                    <li>Enter Amount: <strong className="text-text font-mono text-xs">{formatBDT(total)}</strong></li>
                    <li>Enter Reference: <code className="text-text font-mono">Noore</code></li>
                    <li>Enter your bKash PIN to confirm transaction</li>
                    <li>Copy your <strong>Transaction ID (TrxID)</strong> and enter below</li>
                  </ol>
                </div>

                {/* Input fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-text font-semibold block mb-1">Your bKash Number *</label>
                    <input
                      type="tel"
                      required
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full p-2.5 rounded-lg bg-surface border border-border text-text font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#E2136E]"
                    />
                  </div>
                  <div>
                    <label className="text-text font-semibold block mb-1">Transaction ID (TrxID) *</label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 9J47KLP3Q"
                      className="w-full p-2.5 rounded-lg bg-surface border border-border text-text font-mono uppercase text-xs focus:outline-none focus:ring-1 focus:ring-[#E2136E]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Nagad Gateway Interface */}
            {paymentMethod === "nagad" && (
              <div className="p-5 rounded-2xl bg-[#F7921E]/5 border border-[#F7921E]/30 space-y-4 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#F7921E]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#F7921E] animate-pulse" />
                    <span className="font-bold text-[#F7921E] uppercase tracking-wider text-[11px]">
                      Nagad Wallet Payment Gateway
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#F7921E]/15 text-[#F7921E] font-mono font-bold text-[10px]">
                    Payable: {formatBDT(total)}
                  </span>
                </div>

                <div className="space-y-2 text-muted leading-relaxed">
                  <p className="font-medium text-text">How to complete your Nagad payment:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                    <li>Open your <strong>Nagad App</strong> or dial <strong>*167#</strong></li>
                    <li>Select <strong>Send Money</strong> or Merchant Pay</li>
                    <li>
                      Enter Nagad Number:{" "}
                      <strong className="text-text font-mono text-xs">{activeMerchantNumber}</strong>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(activeMerchantNumber)}
                        className="ml-2 px-2 py-0.5 rounded bg-surface border border-border text-[10px] text-text hover:bg-surface-2 inline-flex items-center gap-1 font-sans"
                      >
                        {copiedNumber ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedNumber ? "Copied!" : "Copy"}</span>
                      </button>
                    </li>
                    <li>Enter Amount: <strong className="text-text font-mono text-xs">{formatBDT(total)}</strong></li>
                    <li>Enter your Nagad PIN to confirm transaction</li>
                    <li>Copy your <strong>Transaction ID (TrxID)</strong> and paste below</li>
                  </ol>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-text font-semibold block mb-1">Your Nagad Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full p-2.5 rounded-lg bg-surface border border-border text-text font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#F7921E]"
                    />
                  </div>
                  <div>
                    <label className="text-text font-semibold block mb-1">Transaction ID (TrxID) *</label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 8BL9921XP"
                      className="w-full p-2.5 rounded-lg bg-surface border border-border text-text font-mono uppercase text-xs focus:outline-none focus:ring-1 focus:ring-[#F7921E]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Debit / Credit Card Gateway Interface */}
            {paymentMethod === "card" && (
              <div className="p-5 rounded-2xl bg-surface-2/40 border border-border space-y-4 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-border/30 pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-semibold text-text uppercase tracking-wider text-[11px]">
                      SSL 256-Bit Encrypted Card Gateway
                    </span>
                  </div>
                  <span className="text-[10px] text-muted font-mono">Visa / Mastercard / Amex</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-muted block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full p-2.5 rounded-lg bg-bg border border-border text-text focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-muted block mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444"
                      className="w-full p-2.5 rounded-lg bg-bg border border-border text-text font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-muted block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-2.5 rounded-lg bg-bg border border-border text-text font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-muted block mb-1">Security Code (CVV / CVC)</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full p-2.5 rounded-lg bg-bg border border-border text-text font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-full bg-accent-ink text-white font-semibold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Securing Your Atelier Order...</span>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Confirm Order — {formatBDT(total)}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-medium text-text border-b border-border/30 pb-3">
              Order Summary ({cart.length} {cart.length === 1 ? "Item" : "Items"})
            </h3>

            {/* Cart Items List */}
            <div className="divide-y divide-border/20 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.variantId}-${item.size}`} className="py-3 flex gap-3 text-xs">
                  <div className="h-16 w-12 rounded-lg bg-surface-2 border border-border/40 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <h4 className="font-serif font-medium text-text text-sm truncate">{item.title}</h4>
                    <p className="text-muted text-[11px]">
                      Color: {item.colorName} • Size: {item.size} • Qty: {item.quantity}
                    </p>
                    <p className="font-semibold text-accent-ink">{formatBDT(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Privilege Code Box */}
            <div className="pt-3 border-t border-border/30 text-xs">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-text mb-2">
                Privilege &amp; Offer Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#DFCA9B]/15 border border-[#DFCA9B]/30 text-text">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#DFCA9B]" />
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-xs">
                        {appliedCoupon.code}
                      </span>
                      <span className="ml-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        ({appliedCoupon.discountPercent}% OFF APPLIED)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="p-1 hover:text-red-500 transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code (e.g. NOORE10)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-surface-2/60 border border-border text-xs uppercase placeholder:normal-case placeholder:text-muted focus:outline-none focus:border-text transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-text text-bg text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMsg && (
                <p
                  className={`mt-1.5 text-[11px] ${
                    couponMsg.error
                      ? "text-red-500"
                      : "text-emerald-600 dark:text-emerald-400 font-medium"
                  }`}
                >
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-border/30 text-xs">
              <div className="flex justify-between items-center text-muted">
                <span>Items Subtotal</span>
                <span className="font-mono">{formatBDT(cartTotal)}</span>
              </div>

              {appliedCoupon && discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Privilege Discount ({appliedCoupon.code})</span>
                  </span>
                  <span className="font-mono">−{formatBDT(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-muted">
                <span>
                  Delivery Charge ({district}):
                  {isFreeDelivery && <span className="text-emerald-600 font-bold ml-1">FREE</span>}
                </span>
                <span className="font-mono">
                  {isFreeDelivery ? "৳0" : formatBDT(deliveryCharge)}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-border/30">
                <span className="font-serif text-base font-semibold text-text">Total Payable</span>
                <span className="font-serif text-2xl font-bold text-accent-ink">{formatBDT(total)}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-border/20 space-y-2 text-[11px] text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>100% Authentic Quality Guarantee &amp; 3-Day Size Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-accent-ink flex-shrink-0" />
                <span>Priority Steadfast Delivery across all 64 Bangladesh districts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
