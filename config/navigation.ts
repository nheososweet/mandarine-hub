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
  Highlighter,
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
        title: "RAG",
        url: "/rag",
        icon: FileText,
      },
      {
        title: "Light RAG",
        url: "/lightrag",
        icon: FileText,
      },
      {
        title: "Agno Chat",
        url: "/chat",
        icon: MessageSquare,
      },
      {
        title: "Knowledge Base",
        url: "#",
        icon: Database,
      },
      {
        title: "Agents",
        url: "#",
        icon: Bot,
      },
      {
        title: "Workflows",
        url: "#",
        icon: Workflow,
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          { title: "General", url: "#", },
          { title: "Appearance", url: "#", },
          { title: "Notifications", url: "#", },
          { title: "Security", url: "#", },
        ],
      },
      {
        title: "API Keys",
        url: "#",
        icon: Key,
      },
      {
        title: "Team",
        url: "#",
        icon: Users,
      },
    ],
  },
];

// Secondary Navigation (Footer)
export const secondaryNav = [
  {
    title: "Documentation",
    url: "#",
    icon: BookOpen,
  },
  {
    title: "Help & Support",
    url: "#",
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
    url: "#",
  },
  {
    label: "Billing",
    icon: CreditCard,
    url: "#",
  },
  {
    label: "Settings",
    icon: Settings2,
    url: "#",
    separator: true,
  },
  {
    label: "Support",
    icon: LifeBuoy,
    url: "#",
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
