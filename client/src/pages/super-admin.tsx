import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Phone, 
  Brain, 
  BookOpen, 
  Shield, 
  CreditCard, 
  Headphones, 
  FileText, 
  Plug, 
  Settings,
  Rocket,
  Activity,
  Globe,
  Server,
  AlertTriangle,
  TrendingUp,
  Clock,
  DollarSign
} from "lucide-react";
// Import placeholder components that will be created
const TenantManagement = () => <div className="p-6">Tenant Management - Coming Soon</div>;
const UserAgentControl = () => <div className="p-6">User & Agent Control - Coming Soon</div>;
const VoiceInfrastructure = () => <div className="p-6">Voice Infrastructure - Coming Soon</div>;
const AIEngineConfig = () => <div className="p-6">AI Engine Configuration - Coming Soon</div>;
const KnowledgeBaseControl = () => <div className="p-6">Knowledge Base Control - Coming Soon</div>;
const SecurityCompliance = () => <div className="p-6">Security & Compliance - Coming Soon</div>;
const BillingUsage = () => <div className="p-6">Billing & Usage - Coming Soon</div>;
const SupportEscalation = () => <div className="p-6">Support & Escalation - Coming Soon</div>;
const AuditLogs = () => <div className="p-6">Audit & Logs - Coming Soon</div>;
const IntegrationsManagement = () => <div className="p-6">Integrations Management - Coming Soon</div>;
const SystemSettings = () => <div className="p-6">System Settings - Coming Soon</div>;
const AdvancedFeatures = () => <div className="p-6">Advanced Features - Coming Soon</div>;

interface PlatformStats {
  totalOrganizations: number;
  totalUsers: number;
  totalAgents: number;
  totalCalls: number;
  revenue: number;
  activeConnections: number;
  systemHealth: string;
  uptime: string;
}

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not super admin
  if (user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-center">
              This area is restricted to Super Administrators only.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats: PlatformStats = {
    totalOrganizations: 25,
    totalUsers: 342,
    totalAgents: 128,
    totalCalls: 15847,
    revenue: 24750,
    activeConnections: 47,
    systemHealth: "excellent",
    uptime: "99.98%"
  };

  const adminTabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "tenants", label: "Tenant Management", icon: Building2 },
    { id: "users-agents", label: "Users & Agents", icon: Users },
    { id: "voice", label: "Voice Infrastructure", icon: Phone },
    { id: "ai-engine", label: "AI Engine", icon: Brain },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { id: "security", label: "Security & Compliance", icon: Shield },
    { id: "billing", label: "Billing & Usage", icon: CreditCard },
    { id: "support", label: "Support & Escalation", icon: Headphones },
    { id: "audit", label: "Audit & Logs", icon: FileText },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "system", label: "System Settings", icon: Settings },
    { id: "advanced", label: "Advanced Features", icon: Rocket }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-600" />
            Super Admin Console
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete platform control and visibility
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={stats.systemHealth === "excellent" ? "default" : "destructive"}>
            System: {stats.systemHealth}
          </Badge>
          <Badge variant="outline">
            Uptime: {stats.uptime}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <div className="overflow-x-auto">
          <TabsList className="grid grid-cols-13 h-auto p-1 bg-white dark:bg-gray-800 border">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
                <p className="text-xs text-muted-foreground">+3 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+28 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAgents}</div>
                <p className="text-xs text-muted-foreground">+12 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue (MTD)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+15.2% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("tenants")}>
                <Building2 className="h-4 w-4 mr-2" />
                Manage Tenants
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("voice")}>
                <Phone className="h-4 w-4 mr-2" />
                Voice Config
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("billing")}>
                <CreditCard className="h-4 w-4 mr-2" />
                Billing Overview
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("audit")}>
                <FileText className="h-4 w-4 mr-2" />
                View Logs
              </Button>
            </CardContent>
          </Card>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Real-time platform monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Response Time</span>
                  <Badge variant="default">125ms avg</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Connections</span>
                  <Badge variant="default">{stats.activeConnections}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice Quality</span>
                  <Badge variant="default">4.8/5.0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Error Rate</span>
                  <Badge variant="default">0.02%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">New tenant "Acme Corp" registered</span>
                  <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">AI agent deployed for TechStart</span>
                  <span className="text-xs text-muted-foreground ml-auto">15m ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">System maintenance completed</span>
                  <span className="text-xs text-muted-foreground ml-auto">1h ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Voice infrastructure upgraded</span>
                  <span className="text-xs text-muted-foreground ml-auto">3h ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Component Tabs */}
        <TabsContent value="tenants"><TenantManagement /></TabsContent>
        <TabsContent value="users-agents"><UserAgentControl /></TabsContent>
        <TabsContent value="voice"><VoiceInfrastructure /></TabsContent>
        <TabsContent value="ai-engine"><AIEngineConfig /></TabsContent>
        <TabsContent value="knowledge"><KnowledgeBaseControl /></TabsContent>
        <TabsContent value="security"><SecurityCompliance /></TabsContent>
        <TabsContent value="billing"><BillingUsage /></TabsContent>
        <TabsContent value="support"><SupportEscalation /></TabsContent>
        <TabsContent value="audit"><AuditLogs /></TabsContent>
        <TabsContent value="integrations"><IntegrationsManagement /></TabsContent>
        <TabsContent value="system"><SystemSettings /></TabsContent>
        <TabsContent value="advanced"><AdvancedFeatures /></TabsContent>
      </Tabs>
    </div>
  );
}