"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tag, Check, X, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    finalCartTotal,
  } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const FREE = 5000;
  const left = FREE - cartTotal;
  const progressRatio = Math.min(1, Math.max(0, cartTotal / FREE));

  if (!isCartOpen) return null;

  const handleApply = (e: React.FormEvent) => {
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

  return (
    <>
      <div
        className="scrim on"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <aside
        className="drawer on"
        id="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drT"
      >
        <header>
          <h2 id="drT">Your selection</h2>
          <button
            className="round"
            type="button"
            id="drClose"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="items" id="items">
          {cart.length === 0 ? (
            <div className="empty">
              <h3>Your Nooré edit is waiting ✦</h3>
              <p>Add a piece to begin.</p>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={`${item.variantId}-${item.size}-${i}`} className="item">
                <div className="th overflow-hidden rounded-lg bg-surface-2 border border-border/40">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="th ph t-sage" />
                  )}
                </div>
                <div>
                  <b>{item.title}</b>
                  <small>{item.colorName} · Size {item.size}</small>
                  <div className="qty">
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.variantId, item.size, item.quantity - 1)}
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.variantId, item.size, item.quantity + 1)}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                </div>
                <b>৳{(item.price * item.quantity).toLocaleString("en-US")}</b>
              </div>
            ))
          )}
        </div>

        <div>
          {/* Free Shipping Progress Indicator */}
          <div id="shipMsg" style={{ fontSize: ".85rem", marginBottom: "6px" }}>
            {cart.length === 0
              ? `Free delivery over ৳${FREE.toLocaleString("en-US")}.`
              : left > 0
              ? `You're ৳${left.toLocaleString("en-US")} away from free delivery ✦`
              : "Free delivery unlocked ✦"}
          </div>

          <div className="prog" aria-hidden="true">
            <i
              id="prog"
              style={{
                transform: `scaleX(${progressRatio})`,
                transition: "transform .5s var(--ease-out)",
              }}
            />
          </div>

          {/* Coupon Code Section */}
          {cart.length > 0 && (
            <div className="my-3 pt-3 border-t border-border/40 text-xs">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#DFCA9B]/15 border border-[#DFCA9B]/30 text-text">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#DFCA9B]" />
                    <div>
                      <span className="font-semibold uppercase tracking-wider">{appliedCoupon.code}</span>
                      <span className="ml-1 text-[11px] opacity-80">({appliedCoupon.discountPercent}% off applied)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="p-1 hover:text-red-500 transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Privilege code (e.g. NOORE10)"
                    className="flex-1 px-3 py-1.5 rounded-full bg-surface border border-border text-xs text-text uppercase placeholder:normal-case placeholder:text-muted focus:outline-none focus:border-text"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-full bg-text text-bg text-[11px] uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMsg && (
                <p className={`mt-1.5 text-[11px] ${couponMsg.error ? "text-red-500" : "text-emerald-600 dark:text-emerald-400 font-medium"}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-1 my-2">
            <div className="flex justify-between text-xs text-muted">
              <span>Subtotal</span>
              <span>৳{cartTotal.toLocaleString("en-US")}</span>
            </div>

            {appliedCoupon && discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Privilege Discount ({appliedCoupon.code})</span>
                <span>−৳{discountAmount.toLocaleString("en-US")}</span>
              </div>
            )}

            <div className="tot pt-1 border-t border-border/40">
              <span>Total</span>
              <span id="sub">৳{finalCartTotal.toLocaleString("en-US")}</span>
            </div>
          </div>

          <Link
            className="pill"
            id="checkout"
            href="/checkout"
            onClick={() => setIsCartOpen(false)}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <span>Proceed to Checkout</span> <span className="plus">+</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
