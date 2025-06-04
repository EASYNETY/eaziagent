import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { 
  Building2, Users, Bot, Phone, DollarSign, Shield, Activity, 
  Settings, Database, Code, AlertTriangle, CheckCircle, XCircle,
  Edit, Trash2, Plus, Eye, Download, Upload, Clock, TrendingUp
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TenantWithDetails {
  id: string;
  name: string;
  domain: string;
  subscriptionPlan: string;
  status: string;
  voiceMinutesUsed: number;
  voiceMinutesLimit: number;
  apiCallsUsed: number;
  apiCallsLimit: number;
  owner: {
    businessName: string;
    email: string;
  };
  agentCount: number;
  userCount: number;
  callsThisMonth: number;
  revenue: number;
  createdAt: string;
}

interface BillingRecord {
  id: string;
  organizationId: string;
  plan: string;
  monthlyCost: string;
  nextBillingDate: string;
  usageOverage: string;
  stripeCustomerId: string;
}

interface AuditLogRecord {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: any;
  user: {
    businessName: string;
  };
  createdAt: string;
}

interface SupportTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  organization: {
    name: string;
  };
  user: {
    businessName: string;
  };
  createdAt: string;
}

interface CallLogRecord {
  id: string;
  phoneNumber: string;
  duration: number;
  status: string;
  aiConfidence: string;
  escalated: boolean;
  organization: {
    name: string;
  };
  agent: {
    name: string;
  };
  createdAt: string;
}

export default function SuperAdminAdvanced() {
  const { toast } = useToast();
  const [selectedTenant, setSelectedTenant] = useState<TenantWithDetails | null>(null);
  const [isCreateTenantOpen, setIsCreateTenantOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  // Fetch comprehensive tenant data
  const { data: tenants = [], isLoading: tenantsLoading } = useQuery<TenantWithDetails[]>({
    queryKey: ["/api/admin/tenants"],
  });

  const { data: billing = [], isLoading: billingLoading } = useQuery<BillingRecord[]>({
    queryKey: ["/api/admin/billing"],
  });

  const { data: auditLogs = [], isLoading: auditLoading } = useQuery<AuditLogRecord[]>({
    queryKey: ["/api/admin/audit-logs"],
  });

  const { data: supportTickets = [], isLoading: ticketsLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/admin/support-tickets"],
  });

  const { data: callLogs = [], isLoading: callLogsLoading } = useQuery<CallLogRecord[]>({
    queryKey: ["/api/admin/call-logs"],
  });

  const { data: platformStats } = useQuery({
    queryKey: ["/api/admin/platform-stats"],
  });

  // Mutations for tenant management
  const updateTenantMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<TenantWithDetails> }) => {
      const res = await fetch(`/api/admin/tenants/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
      if (!res.ok) throw new Error("Failed to update tenant");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tenants"] });
      toast({ title: "Success", description: "Tenant updated successfully" });
    },
  });

  const suspendTenantMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      const res = await fetch(`/api/admin/tenants/${tenantId}/suspend`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to suspend tenant");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tenants"] });
      toast({ title: "Success", description: "Tenant suspended successfully" });
    },
  });

  const createBillingMutation = useMutation({
    mutationFn: async (data: Partial<BillingRecord>) => {
      const res = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create billing record");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/billing"] });
      toast({ title: "Success", description: "Billing record created successfully" });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const variants = {
      free: "bg-gray-100 text-gray-800",
      basic: "bg-blue-100 text-blue-800",
      pro: "bg-purple-100 text-purple-800",
      enterprise: "bg-gold-100 text-gold-800",
    };
    return (
      <Badge className={variants[plan as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {plan.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Advanced Super Admin Dashboard" 
          description="Complete platform control and tenant management"
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tenants">Tenants</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{tenants.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {tenants.filter(t => t.status === 'active').length} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {tenants.reduce((sum, t) => sum + t.userCount, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Across all tenants</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {tenants.reduce((sum, t) => sum + t.agentCount, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">AI agents deployed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${tenants.reduce((sum, t) => sum + (t.revenue || 0), 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Current month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Health */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Health & Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Voice Minutes Used</span>
                        <span>{tenants.reduce((sum, t) => sum + t.voiceMinutesUsed, 0).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{
                          width: `${Math.min(100, (tenants.reduce((sum, t) => sum + t.voiceMinutesUsed, 0) / tenants.reduce((sum, t) => sum + t.voiceMinutesLimit, 1)) * 100)}%`
                        }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>API Calls</span>
                        <span>{tenants.reduce((sum, t) => sum + t.apiCallsUsed, 0).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{
                          width: `${Math.min(100, (tenants.reduce((sum, t) => sum + t.apiCallsUsed, 0) / tenants.reduce((sum, t) => sum + t.apiCallsLimit, 1)) * 100)}%`
                        }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Active Support Tickets</span>
                        <span>{supportTickets.filter(t => t.status === 'open').length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {supportTickets.filter(t => t.priority === 'high').length} high priority
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tenants Tab */}
            <TabsContent value="tenants" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tenant Management</h3>
                <Button onClick={() => setIsCreateTenantOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Tenant
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{tenant.name}</div>
                              <div className="text-sm text-muted-foreground">{tenant.owner.businessName}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getPlanBadge(tenant.subscriptionPlan)}</TableCell>
                          <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>Voice: {tenant.voiceMinutesUsed}/{tenant.voiceMinutesLimit}</div>
                              <div>API: {tenant.apiCallsUsed}/{tenant.apiCallsLimit}</div>
                            </div>
                          </TableCell>
                          <TableCell>${tenant.revenue?.toLocaleString() || 0}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setSelectedTenant(tenant)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => suspendTenantMutation.mutate(tenant.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Billing Management</h3>
                <Button onClick={() => setIsBillingModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Billing Record
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Recurring Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${billing.reduce((sum, b) => sum + parseFloat(b.monthlyCost || "0"), 0).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Overages This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${billing.reduce((sum, b) => sum + parseFloat(b.usageOverage || "0"), 0).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{billing.length}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Monthly Cost</TableHead>
                        <TableHead>Overage</TableHead>
                        <TableHead>Next Billing</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billing.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.organizationId}</TableCell>
                          <TableCell>{getPlanBadge(record.plan)}</TableCell>
                          <TableCell>${record.monthlyCost}</TableCell>
                          <TableCell>${record.usageOverage}</TableCell>
                          <TableCell>{record.nextBillingDate}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Voice Infrastructure Tab */}
            <TabsContent value="voice" className="space-y-6">
              <h3 className="text-lg font-semibold">Voice Infrastructure Control</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Call Quality Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Average Call Quality</span>
                        <span className="font-semibold">94.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Latency</span>
                        <span className="font-semibold">120ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Drop Rate</span>
                        <span className="font-semibold">0.8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>SIP Trunk Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Twilio Primary</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Twilio Backup</span>
                        <Badge className="bg-green-100 text-green-800">Standby</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Telnyx Fallback</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Configured</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Call Logs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>AI Confidence</TableHead>
                        <TableHead>Escalated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {callLogs.slice(0, 10).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.phoneNumber}</TableCell>
                          <TableCell>{log.organization?.name}</TableCell>
                          <TableCell>{log.agent?.name}</TableCell>
                          <TableCell>{Math.floor(log.duration / 60)}:{log.duration % 60}</TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell>{log.aiConfidence}%</TableCell>
                          <TableCell>
                            {log.escalated ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <h3 className="text-lg font-semibold">Security & Compliance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Failed Login Attempts (24h)</span>
                        <span className="font-semibold text-red-600">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Suspicious API Calls</span>
                        <span className="font-semibold text-yellow-600">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Export Requests</span>
                        <span className="font-semibold">2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>GDPR Compliance</span>
                        <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>CCPA Compliance</span>
                        <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Data Encryption</span>
                        <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="space-y-6">
              <h3 className="text-lg font-semibold">Support & Escalation</h3>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supportTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>{ticket.organization?.name}</TableCell>
                          <TableCell>{ticket.user?.businessName}</TableCell>
                          <TableCell>{getPlanBadge(ticket.priority)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Tab */}
            <TabsContent value="audit" className="space-y-6">
              <h3 className="text-lg font-semibold">Audit & Logs</h3>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.slice(0, 20).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.resourceType}</TableCell>
                          <TableCell>{log.user?.businessName}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 p-1 rounded">
                              {JSON.stringify(log.details).substring(0, 50)}...
                            </code>
                          </TableCell>
                          <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <h3 className="text-lg font-semibold">System Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Maintenance Mode</Label>
                      <Switch />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>New Registrations</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Beta Features</Label>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Engine Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Default LLM Provider</Label>
                      <Select defaultValue="openai">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                          <SelectItem value="claude">Anthropic Claude</SelectItem>
                          <SelectItem value="gemini">Google Gemini</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Response Timeout (seconds)</Label>
                      <Input type="number" defaultValue="30" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Tenant Details Modal */}
      <Dialog open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tenant Details - {selectedTenant?.name}</DialogTitle>
          </DialogHeader>
          {selectedTenant && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Organization Name</Label>
                  <Input value={selectedTenant.name} />
                </div>
                <div>
                  <Label>Subscription Plan</Label>
                  <Select value={selectedTenant.subscriptionPlan}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Voice Minutes Limit</Label>
                  <Input type="number" value={selectedTenant.voiceMinutesLimit} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Select value={selectedTenant.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>API Calls Limit</Label>
                  <Input type="number" value={selectedTenant.apiCallsLimit} />
                </div>
                <div>
                  <Label>Custom Domain</Label>
                  <Input value={selectedTenant.domain || ""} placeholder="tenant.example.com" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              onClick={() => {
                if (selectedTenant) {
                  updateTenantMutation.mutate({
                    id: selectedTenant.id,
                    updates: selectedTenant
                  });
                  setSelectedTenant(null);
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}