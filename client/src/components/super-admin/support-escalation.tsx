import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Headphones, MessageCircle, Phone, Play, Eye, User, AlertCircle } from "lucide-react";

export function SupportEscalation() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);

  const supportTickets = [
    {
      id: "TICK-001",
      tenant: "Acme Corp",
      subject: "AI agent not responding to calls",
      status: "open",
      priority: "high",
      assignee: "Support Agent 1",
      created: "2024-01-15 10:30",
      lastUpdate: "2024-01-15 11:45"
    },
    {
      id: "TICK-002", 
      tenant: "TechStart Inc",
      subject: "Billing discrepancy question",
      status: "in_progress",
      priority: "medium",
      assignee: "Support Agent 2",
      created: "2024-01-15 09:15",
      lastUpdate: "2024-01-15 14:20"
    },
    {
      id: "TICK-003",
      tenant: "StartupCo",
      subject: "Integration setup assistance",
      status: "resolved",
      priority: "low",
      assignee: "Support Agent 1",
      created: "2024-01-14 16:20",
      lastUpdate: "2024-01-15 08:30"
    }
  ];

  const callLogs = [
    {
      id: "CALL-001",
      tenant: "Acme Corp",
      agent: "Customer Service Bot",
      duration: "3m 45s",
      status: "completed",
      quality: 4.8,
      escalated: false,
      timestamp: "2024-01-15 14:30"
    },
    {
      id: "CALL-002",
      tenant: "TechStart Inc", 
      agent: "Tech Support AI",
      duration: "7m 22s",
      status: "escalated",
      quality: 3.2,
      escalated: true,
      timestamp: "2024-01-15 14:15"
    }
  ];

  const supportStats = {
    openTickets: 12,
    avgResponseTime: "2h 15m",
    resolutionRate: 94.5,
    escalationRate: 8.2
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support & Escalation</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage support tickets, call logs, and escalation workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportStats.openTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportStats.avgResponseTime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportStats.resolutionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalation Rate</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportStats.escalationRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="calls">Call Logs</TabsTrigger>
          <TabsTrigger value="agents">Support Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Quick Response
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Send Quick Response</DialogTitle>
                  <DialogDescription>
                    Send a quick response to a support ticket
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket">Ticket ID</Label>
                    <Input id="ticket" name="ticket" placeholder="TICK-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="response">Response</Label>
                    <Textarea id="response" name="response" rows={4} placeholder="Enter your response..." />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Send Response</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>All support tickets across tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.tenant}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <Badge variant={
                          ticket.priority === 'high' ? 'destructive' :
                          ticket.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          ticket.status === 'open' ? 'destructive' :
                          ticket.status === 'in_progress' ? 'default' : 'secondary'
                        }>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.assignee}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4" />
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

        <TabsContent value="calls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Logs</CardTitle>
              <CardDescription>Voice interaction logs with playback and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callLogs.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">{call.id}</TableCell>
                      <TableCell>{call.tenant}</TableCell>
                      <TableCell>{call.agent}</TableCell>
                      <TableCell>{call.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">{call.quality}</span>
                          <span className="text-xs text-muted-foreground">/5.0</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={call.escalated ? 'destructive' : 'default'}>
                          {call.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Agent Management</CardTitle>
              <CardDescription>Manage support team and assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Support Agent 1</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Tickets</span>
                      <Badge variant="default">8</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Resolution</span>
                      <span className="text-sm">4h 30m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Rating</span>
                      <span className="text-sm">4.7/5.0</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Support Agent 2</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Tickets</span>
                      <Badge variant="default">4</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Resolution</span>
                      <span className="text-sm">3h 15m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Rating</span>
                      <span className="text-sm">4.9/5.0</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Auto-Response</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Auto-Resolved</span>
                      <Badge variant="default">45</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Response</span>
                      <span className="text-sm">30s</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Configure
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