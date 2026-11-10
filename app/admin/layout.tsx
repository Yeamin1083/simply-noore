"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Palette,
  Truck,
  Settings,
  Shield,
  ExternalLink,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Bell,
  Sparkles,
  BookOpen,
  Tag,
} from "lucide-react";
import { useStore } from "@/lib/store";

function AdminSidebarNav({
  navSections,
  setMobileMenuOpen,
}: {
  navSections: Array<{
    group: string;
    items: Array<{
      label: string;
      href: string;
      icon: any;
      badge?: string;
    }>;
  }>;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  return (
    <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
      {navSections.map((sec, idx) => (
        <div key={idx} className="space-y-1">
          <h4 className="px-3 text-[10px] uppercase tracking-wider font-semibold text-muted font-mono">
            {sec.group}
          </h4>
          <ul className="space-y-0.5">
            {sec.items.map((item, itemIdx) => {
              const Icon = item.icon;
              let isActive = false;
              if (item.href === "/admin") {
                isActive = currentTab === "overview" && (pathname === "/admin" || pathname?.endsWith("/admin/"));
              } else if (item.href.includes("?tab=")) {
                const itemTab = item.href.split("?tab=")[1];
                isActive = currentTab === itemTab;
              } else {
                isActive = pathname === item.href;
              }

              return (
                <li key={itemIdx}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-accent/15 text-accent-ink font-semibold border-l-2 border-accent-ink"
                        : "text-muted hover:text-text hover:bg-surface-2/50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navSections: Array<{
    group: string;
    items: Array<{
      label: string;
      href: string;
      icon: any;
      badge?: string;
    }>;
  }> = [
    {
      group: "Overview",
      items: [
        { label: "Operations Console", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      group: "Catalogue & Content",
      items: [
        { label: "Silhouettes & Pieces", href: "/admin?tab=products", icon: Package },
        { label: "Journal & Editorial", href: "/admin?tab=journal", icon: BookOpen },
        { label: "Fabric Library", href: "/fabrics", icon: Layers },
      ],
    },
    {
      group: "Sales & Dispatch",
      items: [
        { label: "Live Orders Queue", href: "/admin?tab=orders", icon: ShoppingBag },
        { label: "Discount Coupons", href: "/admin?tab=coupons", icon: Tag },
      ],
    },
    {
      group: "Creative Studio",
      items: [
        { label: "Scene Studio (WCAG)", href: "/admin?tab=scene", icon: Palette },
      ],
    },
    {
      group: "System & Governance",
      items: [
        { label: "Atelier Settings", href: "/admin?tab=settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col md:flex-row antialiased">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-border/60 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-surface-2 border border-border/40 text-text"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-serif font-semibold text-lg text-text">
            Simply <em>Nooré</em> <span className="text-xs uppercase font-sans tracking-widest text-muted">Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface-2 border border-border/40 text-text"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-300" />}
          </button>
          <Link
            href="/"
            className="px-2.5 py-1 text-[11px] font-medium tracking-wider uppercase rounded-full bg-accent text-bg"
          >
            Storefront
          </Link>
        </div>
      </header>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border/60 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-border/40 space-y-1">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-serif text-2xl font-medium tracking-tight text-text">
              Simply <em>Nooré</em>
            </Link>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="System Live" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent-ink font-semibold">
              Operations Console
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface-2 text-muted">v2.6</span>
          </div>
        </div>

        {/* Live Storefront Return Link */}
        <div className="px-4 pt-4">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-surface-2/60 hover:bg-surface-2 border border-border/40 text-xs text-text transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent-ink" />
              <span className="font-medium">Live Storefront</span>
            </span>
            <ExternalLink className="h-3 w-3 text-muted group-hover:text-text transition-colors" />
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[10px] uppercase tracking-wider font-semibold text-muted font-mono">
                {sec.group}
              </h4>
              <ul className="space-y-0.5">
                {sec.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href === "/admin" && pathname === "/admin");
                  return (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "bg-accent/15 text-accent-ink font-semibold border-l-2 border-accent-ink"
                            : "text-muted hover:text-text hover:bg-surface-2/50"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </span>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Admin Info */}
        <div className="p-4 border-t border-border/40 bg-surface-2/20 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <p className="font-medium text-text text-[11px]">Dhaka Atelier Master</p>
            <p className="text-[10px] text-muted">2FA Active • TOTP</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface-2 border border-border/30 text-muted hover:text-text"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5 text-amber-300" />}
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-surface border-b border-border/50 sticky top-0 z-30">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            <input
              type="text"
              placeholder="Search orders, phone, TrxID..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-bg border border-border/60 text-xs text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent-ink"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Gulshan-2 Atelier Online</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text px-3 py-1.5 rounded-lg border border-border/50 hover:bg-surface-2 transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
