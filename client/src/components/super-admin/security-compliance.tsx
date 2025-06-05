import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Key, AlertTriangle, Eye, Lock, Globe } from "lucide-react";

export function SecurityCompliance() {
  const [activeTab, setActiveTab] = useState("policies");

  const securityEvents = [
    {
      id: 1,
      event: "Failed login attempt",
      user: "admin@tenant1.com",
      ip: "192.168.1.100",
      timestamp: "2024-01-15 10:30:00",
      severity: "medium"
    },
    {
      id: 2,
      event: "API key rotation",
      user: "system",
      ip: "internal",
      timestamp: "2024-01-15 09:15:00", 
      severity: "low"
    }
  ];

  const complianceChecks = [
    {
      category: "GDPR",
      status: "compliant",
      checks: 15,
      passed: 15,
      lastCheck: "2024-01-15"
    },
    {
      category: "CCPA",
      status: "compliant",
      checks: 12,
      passed: 12,
      lastCheck: "2024-01-14"
    },
    {
      category: "SOC2",
      status: "warning",
      checks: 25,
      passed: 23,
      lastCheck: "2024-01-13"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security & Compliance</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage security policies, compliance, and access controls
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Policies</CardTitle>
                <CardDescription>Configure password requirements for all tenants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Length</Label>
                  <Input type="number" defaultValue="8" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Require uppercase letters</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Require numbers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Require special characters</Label>
                </div>
                <div className="space-y-2">
                  <Label>Password expiry (days)</Label>
                  <Input type="number" defaultValue="90" />
                </div>
                <Button>Update Password Policy</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Factor Authentication</CardTitle>
                <CardDescription>Configure MFA requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Require MFA for all users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Require MFA for admin users</Label>
                </div>
                <div className="space-y-2">
                  <Label>MFA Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>Authenticator App</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <Label>Hardware Keys</Label>
                    </div>
                  </div>
                </div>
                <Button>Update MFA Settings</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control</CardTitle>
              <CardDescription>Configure permissions and access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Tenant Access</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Super Admin</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Full Access</Badge>
                    </TableCell>
                    <TableCell>All Tenants</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Platform Admin</TableCell>
                    <TableCell>
                      <Badge variant="default">Limited Admin</Badge>
                    </TableCell>
                    <TableCell>All Tenants</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tenant Admin</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Tenant Only</Badge>
                    </TableCell>
                    <TableCell>Own Tenant</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Events (24h)</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Abuse</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Monitor security events across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.event}</TableCell>
                      <TableCell>{event.user}</TableCell>
                      <TableCell className="font-mono">{event.ip}</TableCell>
                      <TableCell>{event.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant={
                          event.severity === 'high' ? 'destructive' :
                          event.severity === 'medium' ? 'default' : 'secondary'
                        }>
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
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

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {complianceChecks.map((check) => (
              <Card key={check.category}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{check.category}</CardTitle>
                    <Badge variant={
                      check.status === 'compliant' ? 'default' :
                      check.status === 'warning' ? 'destructive' : 'secondary'
                    }>
                      {check.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Checks Passed</div>
                    <div className="text-lg font-semibold">{check.passed}/{check.checks}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Last Check</div>
                    <div className="text-sm">{check.lastCheck}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Request Management</CardTitle>
              <CardDescription>Handle GDPR/CCPA data requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  Export User Data
                </Button>
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Delete User Data
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Data Audit Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Encryption Settings</CardTitle>
              <CardDescription>Configure encryption for data at rest and in transit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Database Encryption</div>
                    <div className="text-sm text-muted-foreground">Encrypt sensitive data in database</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Call Recording Encryption</div>
                    <div className="text-sm text-muted-foreground">Encrypt all voice recordings</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Knowledge Base Encryption</div>
                    <div className="text-sm text-muted-foreground">Encrypt knowledge base content</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">API Key Encryption</div>
                    <div className="text-sm text-muted-foreground">Encrypt stored API keys</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Encryption Key Rotation</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Every 7 days</SelectItem>
                    <SelectItem value="30">Every 30 days</SelectItem>
                    <SelectItem value="90">Every 90 days</SelectItem>
                    <SelectItem value="365">Every year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Update Encryption Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}