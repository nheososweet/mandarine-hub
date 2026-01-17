"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import React from "react";

export function AppHeader() {
  const pathname = usePathname();
  // Filter out empty strings and common non-page segments if any
  const segments = pathname.split("/").filter((Boolean));

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 sticky top-0 z-50 transition-all duration-200">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-4 bg-border/60" />
        
        <Breadcrumb>
          <BreadcrumbList>
            {segments.length === 0 ? (
               <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">Dashboard</BreadcrumbPage>
               </BreadcrumbItem>
            ) : (
                segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    
                    // Format segment: "api-keys" -> "Api Keys"
                    const formattedSegment = segment
                        .replace(/-/g, " ")
                        .replace(/^\w/, c => c.toUpperCase());

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem className="hidden md:flex">
                                {isLast ? (
                                    <BreadcrumbPage className="font-medium text-foreground">
                                        {formattedSegment}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href} className="hover:text-primary transition-colors">
                                        {formattedSegment}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            
                            {!isLast && (
                                <BreadcrumbSeparator className="hidden md:flex" />
                            )}
                        </React.Fragment>
                    );
                })
            )}
             {/* Fallback for mobile if breadcrumb is too long or hidden: show active page name */}
            <div className="md:hidden">
                 <span className="font-semibold text-foreground">
                     {segments.length > 0 
                        ? segments[segments.length - 1].replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase()) 
                        : "Dashboard"}
                 </span>
            </div>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side actions placeholder (e.g. User Profile or Notifications) */}
      <div className="flex items-center gap-2">
         {/* Could put UserNav or ThemeToggle here if needed later */}
      </div>
    </header>
  );
}
