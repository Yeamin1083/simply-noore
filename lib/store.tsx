"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CartItem,
  Product,
  OrderItem,
  OrderStatus,
  SiteSettings,
  JournalArticle,
  Coupon,
} from "./types";
import { PRODUCTS, ARTICLES as INITIAL_ARTICLES } from "./data";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementText: "Occasion Cutoff: Order by 12 March for guaranteed pre-Eid delivery",
  announcementSubtext: "Complimentary courier dispatch on all atelier orders over ৳10,000",
  insideDhakaShipping: 80,
  outsideDhakaShipping: 130,
  freeShippingThreshold: 10000,
  bkashMerchant: "01700-000000",
  nagadMerchant: "01700-000000",
  contactPhone: "+880 1700 000000",
  contactEmail: "atelier@simplynoore.com",
  atelierAddress: "Road 11, Banani, Dhaka 1213, Bangladesh",
  advancePaymentRequiredThreshold: 10000,
};

export const INITIAL_COUPONS: Coupon[] = [
  { code: "NOORE10", discountPercent: 10, description: "10% Welcome privilege on first atelier order", active: true },
  { code: "EID2026", discountPercent: 15, description: "15% Eid Festive Celebration privilege", active: true },
  { code: "ATELIERVIP", discountPercent: 20, description: "20% Exclusive atelier patrons invitation", active: true },
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "SN-2610-48219",
    customer: "Farzana Yasmin",
    phone: "01712-345678",
    district: "Dhaka",
    address: "House 24, Road 7A, Dhanmondi",
    items: "Rawdah Draped Abaya (Terracotta, 54) x1",
    total: 6930,
    payment: "COD",
    status: "Processing",
    date: "10 mins ago",
  },
  {
    id: "SN-2610-48218",
    customer: "Nafisa Anjum",
    phone: "01844-987654",
    district: "Chattogram",
    address: "Plot 12, Nasirabad Housing Society",
    items: "Layla Monochrome Ensemble (Sage Olive, 56) x1, Safia Structured Corset (Oat, M) x1",
    total: 13250,
    payment: "bKash",
    trxId: "9J47KLP3Q",
    senderPhone: "01844-987654",
    status: "Ready to Dispatch",
    date: "42 mins ago",
    courier: "Steadfast Pending",
  },
  {
    id: "SN-2610-48217",
    customer: "Taslima Begum",
    phone: "01911-223344",
    district: "Sylhet",
    address: "Mirboxtula, Zindabazar",
    items: "Qamar Crinkle Silk Abaya (Oat, 54) x1",
    total: 7530,
    payment: "COD",
    status: "Shipped",
    date: "2 hours ago",
    courier: "ST-8829104",
  },
  {
    id: "SN-2610-48216",
    customer: "Sadia Rahman",
    phone: "01733-112233",
    district: "Dhaka",
    address: "Sector 4, Uttara",
    items: "Nur Minimalist Cocoon Abaya (Ink Navy, 52) x1",
    total: 5480,
    payment: "bKash",
    trxId: "8BL9921XP",
    senderPhone: "01733-112233",
    status: "Delivered",
    date: "5 hours ago",
    courier: "ST-8829091",
  },
];

interface StoreContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  lang: "en" | "bn";
  toggleLang: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string, size: string) => void;
  updateCartQty: (variantId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  // Product management
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
  importProducts: (newProducts: Product[]) => void;
  // Order management
  orders: OrderItem[];
  addOrder: (order: OrderItem) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, courier?: string) => void;
  deleteOrder: (orderId: string) => void;
  // Settings management
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  resetSiteSettings: () => void;
  // Journal articles management
  articles: JournalArticle[];
  addArticle: (article: JournalArticle) => void;
  updateArticle: (id: string, updated: Partial<JournalArticle>) => void;
  deleteArticle: (id: string) => void;
  resetArticles: () => void;
  // Coupons management
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string; discountPercent?: number };
  removeCoupon: () => void;
  discountAmount: number;
  finalCartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Core managed entities
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [articles, setArticles] = useState<JournalArticle[]>(INITIAL_ARTICLES as JournalArticle[]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Load persisted settings
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("sn_theme") as "light" | "dark";
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
      const savedLang = localStorage.getItem("sn_lang") as "en" | "bn";
      if (savedLang) setLang(savedLang);

      const savedCart = localStorage.getItem("sn_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("sn_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedProducts = localStorage.getItem("sn_products");
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }

      const savedOrders = localStorage.getItem("sn_orders");
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      }

      const savedSettings = localStorage.getItem("sn_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSiteSettings((prev) => ({ ...prev, ...parsed }));
      }

      const savedArticles = localStorage.getItem("sn_articles");
      if (savedArticles) {
        const parsed = JSON.parse(savedArticles);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles(parsed);
        }
      }

      const savedCoupons = localStorage.getItem("sn_coupons");
      if (savedCoupons) {
        const parsed = JSON.parse(savedCoupons);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCoupons(parsed);
        }
      }

      const savedAppliedCoupon = localStorage.getItem("sn_applied_coupon");
      if (savedAppliedCoupon) {
        const parsed = JSON.parse(savedAppliedCoupon);
        if (parsed && parsed.code) {
          setAppliedCoupon(parsed);
        }
      }
    } catch {
      // storage unavailable or privacy mode
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("sn_theme", next);
    } catch {}
  };

  const toggleLang = () => {
    const next = lang === "en" ? "bn" : "en";
    setLang(next);
    try {
      localStorage.setItem("sn_lang", next);
    } catch {}
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.variantId === item.variantId && i.size === item.size
      );
      let nextCart: CartItem[];
      if (existing) {
        nextCart = prev.map((i) =>
          i.variantId === item.variantId && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        nextCart = [...prev, item];
      }
      try {
        localStorage.setItem("sn_cart", JSON.stringify(nextCart));
      } catch {}
      return nextCart;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId: string, size: string) => {
    setCart((prev) => {
      const nextCart = prev.filter(
        (i) => !(i.variantId === variantId && i.size === size)
      );
      try {
        localStorage.setItem("sn_cart", JSON.stringify(nextCart));
      } catch {}
      return nextCart;
    });
  };

  const updateCartQty = (variantId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId, size);
      return;
    }
    setCart((prev) => {
      const nextCart = prev.map((i) =>
        i.variantId === variantId && i.size === size ? { ...i, quantity } : i
      );
      try {
        localStorage.setItem("sn_cart", JSON.stringify(nextCart));
      } catch {}
      return nextCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("sn_cart");
    } catch {}
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem("sn_wishlist", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // PRODUCT MANAGEMENT METHODS
  const addProduct = (product: Product) => {
    setProducts((prev) => {
      const updated = [product, ...prev];
      try {
        localStorage.setItem("sn_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      try {
        localStorage.setItem("sn_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem("sn_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetProducts = () => {
    setProducts(PRODUCTS);
    try {
      localStorage.setItem("sn_products", JSON.stringify(PRODUCTS));
    } catch {}
  };

  const importProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem("sn_products", JSON.stringify(newProducts));
    } catch {}
  };

  // ORDER MANAGEMENT METHODS
  const addOrder = (order: OrderItem) => {
    setOrders((prev) => {
      const updated = [order, ...prev];
      try {
        localStorage.setItem("sn_orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, courier?: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId ? { ...o, status, ...(courier ? { courier } : {}) } : o
      );
      try {
        localStorage.setItem("sn_orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      try {
        localStorage.setItem("sn_orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // SITE SETTINGS METHODS
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem("sn_settings", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetSiteSettings = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    try {
      localStorage.setItem("sn_settings", JSON.stringify(DEFAULT_SITE_SETTINGS));
    } catch {}
  };

  // JOURNAL MANAGEMENT METHODS
  const addArticle = (article: JournalArticle) => {
    setArticles((prev) => {
      const updated = [article, ...prev];
      try {
        localStorage.setItem("sn_articles", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateArticle = (id: string, updated: Partial<JournalArticle>) => {
    setArticles((prev) => {
      const updatedList = prev.map((a) => (a.id === id ? { ...a, ...updated } : a));
      try {
        localStorage.setItem("sn_articles", JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem("sn_articles", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetArticles = () => {
    setArticles(INITIAL_ARTICLES as JournalArticle[]);
    try {
      localStorage.setItem("sn_articles", JSON.stringify(INITIAL_ARTICLES));
    } catch {}
  };

  // COUPON MANAGEMENT METHODS
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const updated = [...prev.filter((c) => c.code !== coupon.code), coupon];
      try {
        localStorage.setItem("sn_coupons", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => {
      const updated = prev.filter((c) => c.code !== code);
      try {
        localStorage.setItem("sn_coupons", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.active);
    if (!found) {
      return { success: false, message: "Invalid or inactive privilege code." };
    }
    setAppliedCoupon(found);
    try {
      localStorage.setItem("sn_applied_coupon", JSON.stringify(found));
    } catch {}
    return {
      success: true,
      message: `Privilege code "${found.code}" applied! ${found.discountPercent}% off.`,
      discountPercent: found.discountPercent,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem("sn_applied_coupon");
    } catch {}
  };

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const discountAmount = appliedCoupon
    ? Math.round(cartTotal * (appliedCoupon.discountPercent / 100))
    : 0;
  const finalCartTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <StoreContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        toggleLang,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        // Product Management
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        importProducts,
        // Order Management
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        // Site Settings
        siteSettings,
        updateSiteSettings,
        resetSiteSettings,
        // Journal Management
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        resetArticles,
        // Coupon Management
        coupons,
        addCoupon,
        deleteCoupon,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        finalCartTotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
