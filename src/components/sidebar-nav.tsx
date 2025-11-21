'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Receipt, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/admin/employees", label: "Employees", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
    const pathname = usePathname();
    return (
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="justify-start"
                        tooltip={item.label}
                    >
                        <Link href={item.href}>
                            <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", { "text-primary": pathname === item.href })} />
                            <span className="truncate">{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
