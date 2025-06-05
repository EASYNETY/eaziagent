import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FileText, Eye, Download, Search, Filter, AlertTriangle } from "lucide-react";

export function AuditLogs() {
  const [activeTab, setActiveTab] = useState("activity");
  const [isTraceDialogOpen, setIsTraceDialogOpen] = useState(false);

  const activityLogs = [
    {
      id: "LOG-001",
      timestamp: "2024-01-15 14:30:25",
      user: "superadmin",
      action: "Updated tenant plan",
      resource: "Acme Corp",
      details: "Changed from Pro to Enterprise",
      ip: "192.168.1.100",
      result: "success"
    },
    {
      id: "LOG-002", 
      timestamp: "2024-01-15 14:25:12",
      user: "admin@acme.com",
      action: "Created AI agent",
      resource: "Customer Service Bot",
      details: "New agent with voice capabilities",
      ip: "203.0.113.42",
      result: "success"
    },
    {
      id: "LOG-003",
      timestamp: "2024-01-15 14:20:05",
      user: "system",
      action: "Failed login attempt",
      resource: "Authentication",
      details: "Invalid credentials",
      ip: "198.51.100.23",
      result: "failure"
    }
  ];

  const aiInteractions = [
    {
      id: "AI-001",
      timestamp: "2024-01-15 14:35:00",
      agent: "Customer Service Bot",
      tenant: "Acme Corp",
      conversation: "Order status inquiry",
      steps: 5,
      confidence: 0.94,
      outcome: "resolved"
    },
    {
      id: "AI-002",
      timestamp: "2024-01-15 14:32:15", 
      agent: "Tech Support AI",
      tenant: "TechStart Inc",
      conversation: "Software troubleshooting",
      steps: 8,
      confidence: 0.87,
      outcome: "escalated"
    }
  ];

  const systemLogs = [
    {
      id: "SYS-001",
      timestamp: "2024-01-15 14:30:00",
      level: "INFO",
      service: "Voice Engine",
      message: "Call processing completed successfully",
      duration: "150ms"
    },
    {
      id: "SYS-002",
      timestamp: "2024-01-15 14:28:45",
      level: "WARNING", 
      service: "Database",
      message: "High connection pool usage detected",
      duration: "N/A"
    },
    {
      id: "SYS-003",
      timestamp: "2024-01-15 14:25:30",
      level: "ERROR",
      service: "Payment Gateway",
      message: "Payment processing timeout",
      duration: "30s"
    }
  ];

  const diagnosticData = {
    totalEvents: 1247,
    errorRate: 0.8,
    avgProcessingTime: "185ms",
    systemUptime: "99.98%"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audit & Logs</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive audit trail and system diagnostics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events (24h)</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticData.totalEvents.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticData.errorRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticData.avgProcessingTime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticData.systemUptime}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="ai">AI Interactions</TabsTrigger>
          <TabsTrigger value="system">System Logs</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input placeholder="Search activity logs..." />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
              <CardDescription>Complete audit trail of user actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.resource}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      <TableCell>
                        <Badge variant={log.result === 'success' ? 'default' : 'destructive'}>
                          {log.result}
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

        <TabsContent value="ai" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isTraceDialogOpen} onOpenChange={setIsTraceDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Eye className="h-4 w-4 mr-2" />
                  View AI Trace
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>AI Interaction Trace</DialogTitle>
                  <DialogDescription>
                    Step-by-step breakdown of AI decision making process
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Conversation ID: AI-001</div>
                    <div className="text-sm text-muted-foreground">Customer Service Bot - Order Status Inquiry</div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm font-medium">Step 1: Intent Recognition</div>
                      <div className="text-sm text-muted-foreground">Identified: order_status_inquiry (confidence: 0.96)</div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm font-medium">Step 2: Knowledge Base Query</div>
                      <div className="text-sm text-muted-foreground">Found relevant documentation for order tracking</div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-sm font-medium">Step 3: Response Generation</div>
                      <div className="text-sm text-muted-foreground">Generated personalized response with order details</div>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-sm font-medium">Step 4: Quality Check</div>
                      <div className="text-sm text-muted-foreground">Response passed all safety and accuracy checks</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm font-medium">Step 5: Delivery</div>
                      <div className="text-sm text-muted-foreground">Response delivered successfully to customer</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Interaction Traces</CardTitle>
              <CardDescription>Detailed logs of AI decision-making processes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Conversation</TableHead>
                    <TableHead>Steps</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiInteractions.map((interaction) => (
                    <TableRow key={interaction.id}>
                      <TableCell className="font-mono text-sm">{interaction.timestamp}</TableCell>
                      <TableCell>{interaction.agent}</TableCell>
                      <TableCell>{interaction.tenant}</TableCell>
                      <TableCell>{interaction.conversation}</TableCell>
                      <TableCell>{interaction.steps}</TableCell>
                      <TableCell>{(interaction.confidence * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        <Badge variant={interaction.outcome === 'resolved' ? 'default' : 'destructive'}>
                          {interaction.outcome}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setIsTraceDialogOpen(true)}>
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

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Event Logs</CardTitle>
              <CardDescription>Infrastructure events, errors, and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant={
                          log.level === 'ERROR' ? 'destructive' :
                          log.level === 'WARNING' ? 'default' : 'secondary'
                        }>
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.service}</TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell className="font-mono text-sm">{log.duration}</TableCell>
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

        <TabsContent value="diagnostics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Diagnostics</CardTitle>
              <CardDescription>Generate comprehensive diagnostic reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Generate Report</h3>
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select defaultValue="performance">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance Report</SelectItem>
                        <SelectItem value="security">Security Report</SelectItem>
                        <SelectItem value="usage">Usage Report</SelectItem>
                        <SelectItem value="errors">Error Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Range</Label>
                    <Select defaultValue="24h">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">Last Hour</SelectItem>
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Generate Report</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Quick Diagnostics</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Database Health Check
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      API Performance Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Voice Infrastructure Status
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Debug Package
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}