"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Nav } from "./nav";
import { toast } from "react-hot-toast";
type Props = {};

import {
  ShoppingCart,
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
  Wallet,
  Send,
  Icon,
  LogOut,
} from "lucide-react";
import { Button } from "./button";
import { useWindowWidth } from "@react-hook/window-size";

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const lgWidth = onlyWidth < 1024;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  const handleLogout = () => {
    toast.success("Hope to see you again soon!");
    signOut({ callbackUrl: "/signin" });
  };

  return (
    <div className="relative min-w-[50px] md:min-w-[80px] border-r px-3  pb-10 pt-24">
      {!lgWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className=" rounded-full p-2"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={lgWidth ? true : isCollapsed}
        links={[
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            variant: "ghost",
          },
          {
            title: "Wallet",
            href: "/wallet",
            icon: Wallet,
            variant: "ghost",
          },
          {
            title: "P2P transfer",
            href: "/p2p",
            icon: Send,
            variant: "ghost",
          },
          {
            title: "Transactions",
            href: "/transactions",
            icon: ShoppingCart,
            variant: "ghost",
          },
          {
            title: "Log out",
            onLinkClick: handleLogout,
            icon: LogOut,
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
}
