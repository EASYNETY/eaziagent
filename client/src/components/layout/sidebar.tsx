import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Bot, 
  LayoutDashboard, 
  Database, 
  MessageCircle, 
  BarChart3, 
  Code, 
  Settings,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "AI Agents", href: "/agents", icon: Bot, badge: "3" },
  { label: "Knowledge Base", href: "/knowledge", icon: Database },
  { label: "Conversations", href: "/conversations", icon: MessageCircle, badge: "12" },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Integration", href: "/integration", icon: Code },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AI Agent Hub</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Multi-Tenant Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <a className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "ml-auto text-xs px-2 py-1 rounded-full",
                        isActive 
                          ? "bg-white text-primary" 
                          : "bg-primary text-white"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
