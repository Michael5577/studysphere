import {
  BookOpen,
  BarChart3,
  Calendar,
  LayoutDashboard,
  ListTodo,
  Settings,
  Timer,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const primaryNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your semester",
  },
  {
    label: "Courses",
    href: "/courses",
    icon: BookOpen,
    description: "Manage your classes",
  },
  {
    label: "Assignments",
    href: "/assignments",
    icon: ListTodo,
    description: "Track deadlines and progress",
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "View your schedule",
  },
  {
    label: "Focus",
    href: "/focus",
    icon: Timer,
    description: "Pomodoro study sessions",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Focus trends and workload",
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    description: "Your account details",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Preferences and notifications",
  },
];

export const allNavItems: NavItem[] = [
  ...primaryNavItems,
  ...secondaryNavItems,
];
