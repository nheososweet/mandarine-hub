import {
  Bot,
  LayoutDashboard,
  MessageSquare,
  Database,
  Settings2,
  Workflow,
  Sparkles,
  FileText,
  Users,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Key,
  HelpCircle,
  BookOpen,
  LifeBuoy,
  LogOut,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  isActive?: boolean;
  items?: NavSubItem[];
}

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Main Navigation Groups
export const navigationGroups: NavGroup[] = [
  {
    label: "Platform",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "AI Chat",
        url: "/chat",
        icon: MessageSquare,
      },
      {
        title: "Knowledge Base",
        url: "/knowledge",
        icon: Database,
      },
      {
        title: "Agents",
        url: "/agents",
        icon: Bot,
      },
      {
        title: "Workflows",
        url: "/workflows",
        icon: Workflow,
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
        items: [
          { title: "General", url: "/settings/general" },
          { title: "Appearance", url: "/settings/appearance" },
          { title: "Notifications", url: "/settings/notifications" },
          { title: "Security", url: "/settings/security" },
        ],
      },
      {
        title: "API Keys",
        url: "/api-keys",
        icon: Key,
      },
      {
        title: "Team",
        url: "/team",
        icon: Users,
      },
    ],
  },
];

// Secondary Navigation (Footer)
export const secondaryNav = [
  {
    title: "Documentation",
    url: "/docs",
    icon: BookOpen,
  },
  {
    title: "Help & Support",
    url: "/support",
    icon: LifeBuoy,
  },
];

// User Menu Items (for dropdown)
export interface UserMenuItem {
  label: string;
  icon: LucideIcon;
  url?: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
  separator?: boolean;
}

export const userMenuItems: UserMenuItem[] = [
  {
    label: "Profile",
    icon: User,
    url: "/profile",
  },
  {
    label: "Billing",
    icon: CreditCard,
    url: "/billing",
  },
  {
    label: "Settings",
    icon: Settings2,
    url: "/settings",
    separator: true,
  },
  {
    label: "Support",
    icon: LifeBuoy,
    url: "/support",
  },
  {
    label: "Sign out",
    icon: LogOut,
    variant: "destructive",
    separator: true,
  },
];

// App Header Config
export const appConfig = {
  name: "Mandarine OS",
  version: "v1.2 Beta",
  logo: {
    icon: Sparkles,
    url: "/",
  },
};
