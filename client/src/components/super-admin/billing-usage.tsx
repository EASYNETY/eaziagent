import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, DollarSign, TrendingUp, AlertTriangle, Download, Edit } from "lucide-react";

export function BillingUsage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);

  const billingData = [
    {
      tenantId: "tenant-1",
      tenantName: "Acme Corp",
      plan: "enterprise",
      usage: {
        voiceMinutes: 4250,
        apiCalls: 125000,
        storage: 45.2
      },
      limits: {
        voiceMinutes: 5000,
        apiCalls: 150000,
        storage: 100
      },
      currentBill: 2499.99,
      status: "current"
    },
    {
      tenantId: "tenant-2", 
      tenantName: "TechStart Inc",
      plan: "pro",
      usage: {
        voiceMinutes: 850,
        apiCalls: 25000,
        storage: 12.5
      },
      limits: {
        voiceMinutes: 1000,
        apiCalls: 50000,
        storage: 25
      },
      currentBill: 299.99,
      status: "current"
    },
    {
      tenantId: "tenant-3",
      tenantName: "StartupCo",
      plan: "basic",
      usage: {
        voiceMinutes: 320,
        apiCalls: 8500,
        storage: 5.2
      },
      limits: {
        voiceMinutes: 500,
        apiCalls: 10000,
        storage: 10
      },
      currentBill: 99.99,
      status: "overdue"
    }
  ];

  const revenueStats = {
    totalRevenue: 24750.99,
    monthlyGrowth: 15.2,
    totalTenants: 25,
    avgRevenuePerTenant: 990.04
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Usage Monitoring</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track tenant usage, manage billing, and monitor revenue
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="tenants">Tenant Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="integrations">Payment Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue (MTD)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{revenueStats.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paying Tenants</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenueStats.totalTenants}</div>
                <p className="text-xs text-muted-foreground">+3 new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Revenue/Tenant</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueStats.avgRevenuePerTenant.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+8.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">$399.98 total</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Plan</CardTitle>
                <CardDescription>Monthly revenue breakdown by subscription plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enterprise</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-16 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">$18,750</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pro</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-12 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">$4,200</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Basic</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-6 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">$1,800</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods across tenants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credit Card</span>
                  <Badge variant="default">78%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bank Transfer</span>
                  <Badge variant="outline">15%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">PayPal</span>
                  <Badge variant="outline">7%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6">
          <div className="flex justify-end space-x-2">
            <Dialog open={isCreditDialogOpen} onOpenChange={setIsCreditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Apply Credit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Apply Credit</DialogTitle>
                  <DialogDescription>
                    Apply a credit or discount to a tenant's account
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenant">Tenant</Label>
                    <Select name="tenant">
                      <SelectTrigger>
                        <SelectValue placeholder="Select tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tenant-1">Acme Corp</SelectItem>
                        <SelectItem value="tenant-2">TechStart Inc</SelectItem>
                        <SelectItem value="tenant-3">StartupCo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Credit Amount</Label>
                    <Input id="amount" name="amount" type="number" placeholder="100.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Input id="reason" name="reason" placeholder="Service credit for downtime" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Apply Credit</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Invoices
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tenant Billing Details</CardTitle>
              <CardDescription>Current billing status and usage for all tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Current Bill</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingData.map((tenant) => (
                    <TableRow key={tenant.tenantId}>
                      <TableCell className="font-medium">{tenant.tenantName}</TableCell>
                      <TableCell>
                        <Badge variant={
                          tenant.plan === 'enterprise' ? 'default' :
                          tenant.plan === 'pro' ? 'secondary' : 'outline'
                        }>
                          {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Voice: {tenant.usage.voiceMinutes}/{tenant.limits.voiceMinutes} min</div>
                          <div>API: {tenant.usage.apiCalls.toLocaleString()}/{tenant.limits.apiCalls.toLocaleString()}</div>
                          <div>Storage: {tenant.usage.storage}/{tenant.limits.storage} GB</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${tenant.currentBill}</TableCell>
                      <TableCell>
                        <Badge variant={tenant.status === 'current' ? 'default' : 'destructive'}>
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
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

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Usage Analytics</CardTitle>
              <CardDescription>Real-time usage metrics across all tenants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">15,420</div>
                  <p className="text-sm text-muted-foreground">Voice Minutes (24h)</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">158,500</div>
                  <p className="text-sm text-muted-foreground">API Calls (24h)</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">2.4TB</div>
                  <p className="text-sm text-muted-foreground">Total Storage Used</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Integrations</CardTitle>
              <CardDescription>Configure payment processors and billing systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stripe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge variant="default">Connected</Badge>
                    <div className="text-sm text-muted-foreground">
                      Processing 78% of payments
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">PayPal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge variant="default">Connected</Badge>
                    <div className="text-sm text-muted-foreground">
                      Processing 7% of payments
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Paystack</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge variant="secondary">Disconnected</Badge>
                    <div className="text-sm text-muted-foreground">
                      For African markets
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}