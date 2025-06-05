import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plug, Key, Globe, Plus, Edit, Trash2, MessageSquare } from "lucide-react";

export function IntegrationsManagement() {
  const [activeTab, setActiveTab] = useState("integrations");
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);

  const integrations = [
    {
      id: "int-001",
      name: "Slack",
      type: "Communication",
      tenant: "Acme Corp",
      status: "active",
      lastUsed: "2024-01-15",
      apiCalls: 2450
    },
    {
      id: "int-002",
      name: "Salesforce CRM",
      type: "CRM",
      tenant: "TechStart Inc",
      status: "active",
      lastUsed: "2024-01-15",
      apiCalls: 890
    },
    {
      id: "int-003",
      name: "WhatsApp Business",
      type: "Messaging",
      tenant: "StartupCo",
      status: "inactive",
      lastUsed: "2024-01-10",
      apiCalls: 0
    }
  ];

  const apiTokens = [
    {
      id: "token-001",
      name: "Production API Key",
      tenant: "Acme Corp",
      scopes: ["agents.read", "agents.write", "conversations.read"],
      lastUsed: "2024-01-15 14:30",
      status: "active"
    },
    {
      id: "token-002",
      name: "Development Key",
      tenant: "TechStart Inc",
      scopes: ["agents.read"],
      lastUsed: "2024-01-14 09:15",
      status: "active"
    }
  ];

  const webhookConfigs = [
    {
      id: "webhook-001",
      tenant: "Acme Corp",
      endpoint: "https://api.acme.com/webhooks/ai-events",
      events: ["conversation.started", "conversation.ended"],
      status: "active",
      lastTriggered: "2024-01-15 14:25"
    },
    {
      id: "webhook-002",
      tenant: "TechStart Inc",
      endpoint: "https://hooks.techstart.io/ai-callback",
      events: ["agent.escalation"],
      status: "active",
      lastTriggered: "2024-01-15 11:45"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage third-party integrations, API tokens, and webhooks
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="integrations">Third-Party Apps</TabsTrigger>
          <TabsTrigger value="tokens">API Tokens</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
                <Plug className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {integrations.filter(i => i.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + i.apiCalls, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Integration Types</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(integrations.map(i => i.type)).size}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Manage integrations across all tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Integration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>API Calls</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell className="font-medium">{integration.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{integration.type}</Badge>
                      </TableCell>
                      <TableCell>{integration.tenant}</TableCell>
                      <TableCell>{integration.apiCalls.toLocaleString()}</TableCell>
                      <TableCell>{integration.lastUsed}</TableCell>
                      <TableCell>
                        <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                          {integration.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Switch 
                            checked={integration.status === 'active'}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Token
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create API Token</DialogTitle>
                  <DialogDescription>
                    Generate a new API token for tenant access
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tokenName">Token Name</Label>
                    <Input id="tokenName" name="tokenName" placeholder="Production API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenant">Tenant</Label>
                    <Input id="tenant" name="tenant" placeholder="Select tenant..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Scopes</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <Label>agents.read</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <Label>agents.write</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <Label>conversations.read</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <Label>analytics.read</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsTokenDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Token</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Token Management</CardTitle>
              <CardDescription>Manage API tokens and access permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token Name</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Scopes</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiTokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.name}</TableCell>
                      <TableCell>{token.tenant}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {token.scopes.map((scope) => (
                            <Badge key={scope} variant="outline" className="text-xs">
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{token.lastUsed}</TableCell>
                      <TableCell>
                        <Badge variant="default">active</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="webhooks" className="space-y-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Manage webhook endpoints and event subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Last Triggered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhookConfigs.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium">{webhook.tenant}</TableCell>
                      <TableCell className="font-mono text-sm max-w-xs truncate">
                        {webhook.endpoint}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{webhook.lastTriggered}</TableCell>
                      <TableCell>
                        <Badge variant="default">active</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Global Webhook Settings</CardTitle>
              <CardDescription>Configure platform-wide webhook policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Retry Failed Webhooks</div>
                  <div className="text-sm text-muted-foreground">Automatically retry failed webhook deliveries</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Webhook Logging</div>
                  <div className="text-sm text-muted-foreground">Log all webhook delivery attempts</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Timeout (seconds)</Label>
                <Input type="number" defaultValue="30" className="w-32" />
              </div>
              <div className="space-y-2">
                <Label>Max Retry Attempts</Label>
                <Input type="number" defaultValue="3" className="w-32" />
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}