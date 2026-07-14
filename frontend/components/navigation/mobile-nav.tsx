"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/config/nav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden" />
        }
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 glass-card flex flex-col">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="px-2 py-6 flex-1 flex flex-col">
          <Link
            href="/"
            className="flex items-center mb-8"
            onClick={() => setOpen(false)}
          >
            <span className="font-bold text-xl tracking-tighter">NexHR<span className="text-primary">.ai</span></span>
          </Link>
          <nav className="flex flex-col space-y-2 flex-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className="w-full" onClick={() => setOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", isActive && "bg-secondary/50")}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-border/40 pt-4">
            <Button
              id="mobile-logout-btn"
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

