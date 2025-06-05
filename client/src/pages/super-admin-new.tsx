import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Users, 
  Bot,
  Phone,
  Brain,
  Database,
  Lock,
  CreditCard,
  HeadphonesIcon,
  FileText,
  Plug,
  Settings,
  Zap,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Bell,
  Moon,
  User,
  BarChart3,
  Globe
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: BarChart3 },
  { id: "tenants", label: "Tenants", icon: Users },
  { id: "voice", label: "Voice Infrastructure", icon: Phone },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "usage", label: "Usage", icon: Activity },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings }
];

interface PlatformStats {
  totalOrganizations: number;
  totalUsers: number;
  totalAgents: number;
  totalCalls: number;
  llmCost: number;
  issuesDetected: number;
  activeConversations: number;
}

export default function SuperAdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const { user } = useAuth();

  const { data: platformStats, isLoading } = useQuery<PlatformStats>({
    queryKey: ["/api/admin/stats"],
    enabled: user?.role === "super_admin",
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/admin/activity"],
    enabled: user?.role === "super_admin",
  });

  const { data: tenants } = useQuery({
    queryKey: ["/api/admin/tenants"],
    enabled: user?.role === "super_admin" && activeSection === "tenants",
  });

  const { data: agents } = useQuery({
    queryKey: ["/api/admin/agents"],
    enabled: user?.role === "super_admin" && activeSection === "agents",
  });

  const { data: users } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "super_admin" && activeSection === "users",
  });

  if (user?.role !== "super_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-slate-600 dark:text-slate-300">
            You need super admin privileges to access this dashboard.
          </p>
        </Card>
      </div>
    );
  }

  const stats = platformStats || {
    totalOrganizations: 0,
    totalUsers: 0,
    totalAgents: 0,
    totalCalls: 0,
    llmCost: 0,
    issuesDetected: 0,
    activeConversations: 0
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Tenants</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stats.totalOrganizations}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+12% growth</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Calls Today</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  {(stats.totalCalls || 0).toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">Real-time</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl">
                <Phone className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">LLM Usage (API Cost)</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ${stats.llmCost.toFixed(2)}
                </p>
                <div className="flex items-center mt-2">
                  <Brain className="h-3 w-3 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-500">This month</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Issues Detected</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {stats.issuesDetected}
                </p>
                <div className="flex items-center mt-2">
                  {stats.issuesDetected === 0 ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">All clear</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-sm text-red-500">Requires attention</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Real-time Call Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="font-medium">Live Calls</span>
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                {stats.activeConversations}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="font-medium">Failed</span>
              </div>
              <Badge variant="secondary">2</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="font-medium">Transcribing</span>
              </div>
              <Badge variant="secondary">5</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="font-medium">Escalated</span>
              </div>
              <Badge variant="secondary">1</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity && Array.isArray(recentActivity) ? recentActivity.slice(0, 6).map((activity: any, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm flex-1">{activity.message}</span>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTenants = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tenant Management</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Add Tenant</Button>
      </div>
      
      <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {tenants && Array.isArray(tenants) ? tenants.map((tenant: any) => (
              <div key={tenant.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div>
                  <h3 className="font-semibold">{tenant.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{tenant.domain}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={tenant.isActive ? "default" : "secondary"}>
                      {tenant.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{tenant.plan}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {tenant.agentCount} agents • {tenant.userCount} users
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {tenant.monthlyUsage} calls this month
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-8">No tenants found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Management</h2>
        <div className="flex space-x-2">
          <Input placeholder="Search agents..." className="w-64" />
          <Button variant="outline">Filter</Button>
        </div>
      </div>
      
      <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {agents && Array.isArray(agents) ? agents.map((agent: any) => (
              <div key={agent.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{agent.businessName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={agent.isActive ? "default" : "secondary"}>
                    {agent.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <div className="text-right text-sm text-slate-600 dark:text-slate-400">
                    <p>{agent.conversationCount} conversations</p>
                    <p>Last used: {new Date(agent.lastUsed).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-8">No agents found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "tenants":
        return renderTenants();
      case "agents":
        return renderAgents();
      case "voice":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Voice Infrastructure</h2>
            <Card className="p-6">
              <p>Voice infrastructure management coming soon...</p>
            </Card>
          </div>
        );
      case "usage":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Usage Analytics</h2>
            <Card className="p-6">
              <p>Usage analytics dashboard coming soon...</p>
            </Card>
          </div>
        );
      case "billing":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Billing Management</h2>
            <Card className="p-6">
              <p>Billing management interface coming soon...</p>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Settings</h2>
            <Card className="p-6">
              <p>System settings panel coming soon...</p>
            </Card>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading SuperAdmin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border-r border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SuperAdmin</h1>
                <p className="text-blue-100 text-sm">CustomerCare Pro</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {sidebarItems.find(item => item.id === activeSection)?.label || "Dashboard"}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Complete control and visibility across the platform
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-10 w-64 bg-white/50 dark:bg-slate-800/50"
                  />
                </div>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}