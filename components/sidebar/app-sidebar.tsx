"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Citrus,
  ChevronRight,
  ChevronsUpDown,
  Check,
  Sun,
  Moon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Import navigation config
import {
  navigationGroups,
  secondaryNav,
  userMenuItems,
  appConfig,
} from "@/config/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const handleSignOut = () => {
    // Add your sign out logic here
    console.log("Sign out clicked");
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r border-sidebar-border bg-sidebar"
    >
      {/* HEADER */}
      <SidebarHeader className="border-b border-sidebar-border pb-4 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-sidebar-accent"
            >
              <Link href={appConfig.logo.url}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/30">
                  <Citrus className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                  <span className="truncate font-bold font-display text-sidebar-foreground">
                    {appConfig.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {appConfig.version}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="pt-4 overflow-x-hidden">
        {/* Navigation Groups */}
        {navigationGroups.map((group, groupIndex) => (
          <React.Fragment key={group.label}>
            {groupIndex > 0 && (
              <SidebarSeparator className="mx-4 my-2 bg-sidebar-border" />
            )}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider text-xs text-muted-foreground">
                {group.label}
              </SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    (item.url !== "/dashboard" &&
                      pathname.startsWith(item.url));

                  // Item with submenu
                  if (item.items && item.items.length > 0) {
                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              className={
                                isActive
                                  ? "text-primary bg-sidebar-accent"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              }
                            >
                              <item.icon />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => {
                                const isSubActive = pathname === subItem.url;
                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isSubActive}
                                      className={
                                        isSubActive
                                          ? "text-primary"
                                          : "text-muted-foreground hover:text-primary"
                                      }
                                    >
                                      <Link href={subItem.url}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  // Regular item
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isActive}
                        className={
                          isActive
                            ? "text-primary bg-primary/10 border-r-2 border-primary rounded-none"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-2"
                        >
                          <item.icon />
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <Badge className="ml-auto text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-0">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </React.Fragment>
        ))}

        {/* Secondary Navigation */}
        <SidebarSeparator className="mx-4 my-2 bg-sidebar-border" />
        <SidebarGroup>
          <SidebarMenu>
            {secondaryNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER - User Menu with Dropdown */}
      <SidebarFooter className="border-t border-sidebar-border p-2 overflow-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="hover:bg-sidebar-accent"
                >
                  <Avatar className="h-8 w-8 rounded-lg border border-sidebar-border">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback className="rounded-lg bg-card">
                      NS
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                    <span className="truncate font-semibold text-sidebar-foreground">
                      Nheo So Sweet
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Pro Plan
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover border-border"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {theme === "dark" && <Moon className="size-4" />}
                    {theme === "light" && <Sun className="size-4" />}
                    {theme === "system" && <Citrus className="size-4" />}
                    Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                        {theme === "light" && (
                          <Check className="ml-auto size-4" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                        {theme === "dark" && (
                          <Check className="ml-auto size-4" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                        {theme === "system" && (
                          <Check className="ml-auto size-4" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                {userMenuItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    {item.separator && index > 0 && (
                      <DropdownMenuSeparator className="bg-border" />
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        if (item.label === "Sign out") {
                          handleSignOut();
                        } else if (item.url) {
                          router.push(item.url);
                        } else if (item.onClick) {
                          item.onClick();
                        }
                      }}
                      className={`cursor-pointer gap-2 ${
                        item.variant === "destructive"
                          ? "text-destructive focus:text-destructive"
                          : "text-popover-foreground"
                      }`}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
