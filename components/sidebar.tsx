"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  BarChart3,
  TrendingUp,
  Bitcoin,
  CandlestickChart,
  Menu,
  MessageSquare,
  Landmark,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  indent = false,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pathname: string;
  indent?: boolean;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        indent && "pl-9",
        active
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

function NavContent() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/stocks", label: t("stocks"), icon: CandlestickChart },
    { href: "/research", label: t("research"), icon: FileText },
    {
      label: t("dashboard"),
      icon: BarChart3,
      children: [
        { href: "/dashboard", label: t("overview"), icon: BarChart3 },
        { href: "/dashboard/crypto", label: t("crypto"), icon: Bitcoin },
      ],
    },
    { href: "/wall-street", label: t("wallStreet"), icon: Landmark },
    { href: "/news", label: t("newsTitle"), icon: Newspaper },
    { href: "/ask", label: t("ask"), icon: MessageSquare },
  ];

  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        if ("children" in item && item.children) {
          return (
            <div key={item.label}>
              <span className="flex items-center gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </span>
              {item.children.map((child) => (
                <NavLink
                  key={child.href}
                  {...child}
                  pathname={pathname}
                  indent
                />
              ))}
            </div>
          );
        }
        return (
          <NavLink
            key={item.href}
            href={item.href!}
            label={item.label}
            icon={item.icon}
            pathname={pathname}
          />
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      {/* Mobile */}
      <div className="flex items-center gap-2 border-b px-4 py-3 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-semibold">{t("marketResearch")}</span>
            </div>
            <NavContent />
          </SheetContent>
        </Sheet>
        <TrendingUp className="h-5 w-5 text-primary" />
        <span className="font-semibold">{t("marketResearch")}</span>
        <div className="ml-auto flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-card">
        <div className="flex items-center gap-2 border-b px-4 py-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-semibold tracking-tight">{t("marketResearch")}</span>
          <div className="ml-auto flex items-center gap-0.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <NavContent />
      </aside>
    </>
  );
}
