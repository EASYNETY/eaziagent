import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, Users, Bot, Settings, Key, Zap, Database, 
  Phone, MessageSquare, Globe, Plus, Edit, Trash2, 
  Shield, Activity, TrendingUp, Clock, Eye, EyeOff 
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Organization, User, Agent, SystemSetting } from "@shared/schema";

interface DashboardStats {
  totalOrganizations: number;
  totalUsers: number;
  totalAgents: number;
  totalCallsThisMonth: number;
  activeOrganizations: number;
}

interface OrganizationWithDetails extends Organization {
  owner: User;
  agentCount: number;
  userCount: number;
  callsThisMonth: number;
}

export default function SuperAdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<SystemSetting | null>(null);
  const [settingValue, setSettingValue] = useState("");
  const [showValues, setShowValues] = useState<{ [key: string]: boolean }>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: organizations, isLoading: orgsLoading } = useQuery<OrganizationWithDetails[]>({
    queryKey: ["/api/admin/organizations"],
  });

  const { data: systemSettings, isLoading: settingsLoading } = useQuery<SystemSetting[]>({
    queryKey: ["/api/admin/settings"],
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/activity"],
  });

  // Update system setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await apiRequest("PUT", `/api/admin/settings/${key}`, { value });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Setting updated",
        description: "System setting has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      setShowSettingsModal(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateSetting = (setting: SystemSetting) => {
    setSelectedSetting(setting);
    setSettingValue(setting.value || "");
    setShowSettingsModal(true);
  };

  const handleSaveSetting = () => {
    if (!selectedSetting) return;
    updateSettingMutation.mutate({
      key: selectedSetting.key,
      value: settingValue,
    });
  };

  const toggleValueVisibility = (key: string) => {
    setShowValues(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isLoading = statsLoading || orgsLoading || settingsLoading || activityLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading super admin dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Super Admin Dashboard"
          description="Manage organizations, users, and system settings"
          action={
            <div className="flex space-x-2">
              <Button onClick={() => setShowOrgModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            </div>
          }
        />

        <div className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalOrganizations || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.activeOrganizations || 0} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Across all organizations
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalAgents || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Total deployed agents
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Calls This Month</CardTitle>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalCallsThisMonth || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Voice interactions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">System Health</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">Healthy</div>
                    <p className="text-xs text-muted-foreground">
                      All systems operational
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => setSelectedTab("organizations")}
                    >
                      <Building2 className="h-6 w-6 mb-2" />
                      Manage Organizations
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => setSelectedTab("settings")}
                    >
                      <Settings className="h-6 w-6 mb-2" />
                      System Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => setSelectedTab("activity")}
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      View Activity
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                    >
                      <Database className="h-6 w-6 mb-2" />
                      Database Health
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organizations Tab */}
            <TabsContent value="organizations" className="space-y-6">
              <div className="grid gap-6">
                {organizations?.map((org) => (
                  <Card key={org.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{org.name}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Owner: {org.owner.businessName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={org.isActive ? "default" : "secondary"}>
                            {org.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {org.plan}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{org.agentCount}</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Agents</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{org.userCount}</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{org.callsThisMonth}</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Calls</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{org.maxAgents}</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Agent Limit</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Manage Users
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bot className="h-4 w-4 mr-1" />
                          View Agents
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* System Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6">
                {/* API Keys Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Key className="h-5 w-5 mr-2" />
                      API Keys & Integrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemSettings?.filter(s => s.category === 'api_keys').map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{setting.key.replace(/_/g, ' ').toUpperCase()}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {setting.description}
                            </p>
                            <div className="flex items-center mt-2">
                              <Input
                                type={showValues[setting.key] ? "text" : "password"}
                                value={showValues[setting.key] ? (setting.value || "") : "••••••••••••"}
                                readOnly
                                className="max-w-xs"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleValueVisibility(setting.key)}
                                className="ml-2"
                              >
                                {showValues[setting.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={setting.value ? "default" : "secondary"}>
                              {setting.value ? "Configured" : "Not Set"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateSetting(setting)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Update
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Integration Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Third-Party Integrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemSettings?.filter(s => s.category === 'integrations').map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{setting.key.replace(/_/g, ' ').toUpperCase()}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {setting.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={setting.value ? "default" : "secondary"}>
                              {setting.value ? "Enabled" : "Disabled"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateSetting(setting)}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity?.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Settings Update Modal */}
        {showSettingsModal && selectedSetting && (
          <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update {selectedSetting.key.replace(/_/g, ' ').toUpperCase()}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{selectedSetting.description}</Label>
                  <Textarea
                    value={settingValue}
                    onChange={(e) => setSettingValue(e.target.value)}
                    placeholder="Enter the new value..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveSetting}
                    disabled={updateSettingMutation.isPending}
                  >
                    {updateSettingMutation.isPending ? "Updating..." : "Update Setting"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}