"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateCartQty, cartTotal } = useStore();

  const FREE = 5000;
  const left = FREE - cartTotal;
  const progressRatio = Math.min(1, Math.max(0, cartTotal / FREE));

  if (!isCartOpen) return null;

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

          <div className="tot">
            <span>Subtotal</span>
            <span id="sub">৳{cartTotal.toLocaleString("en-US")}</span>
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
