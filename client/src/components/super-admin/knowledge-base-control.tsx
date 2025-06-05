import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileText, Globe, Copy, Plus, Edit, Trash2 } from "lucide-react";

export function KnowledgeBaseControl() {
  const [activeTab, setActiveTab] = useState("global");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const globalKB = [
    {
      id: "general-faqs",
      title: "General Customer Service FAQs",
      description: "Common questions and answers for customer service",
      category: "Customer Service",
      size: "2.3 MB",
      usedBy: 45,
      lastUpdated: "2024-01-15"
    },
    {
      id: "tech-troubleshooting",
      title: "Technical Troubleshooting Guide",
      description: "Step-by-step technical support procedures",
      category: "Technical Support",
      size: "5.1 MB",
      usedBy: 23,
      lastUpdated: "2024-01-10"
    }
  ];

  const promptTemplates = [
    {
      id: "greeting",
      title: "Professional Greeting",
      content: "Hello! I'm here to help you today. How can I assist you?",
      category: "Greetings",
      usedBy: 67
    },
    {
      id: "escalation",
      title: "Escalation Protocol",
      content: "I understand this is important to you. Let me connect you with a specialist who can better assist you.",
      category: "Escalation",
      usedBy: 34
    }
  ];

  const dialogs = [
    {
      id: "order-inquiry",
      title: "Order Inquiry Flow",
      description: "Handles order status and tracking questions",
      steps: 5,
      usedBy: 28
    },
    {
      id: "refund-request",
      title: "Refund Request Process",
      description: "Guides through refund and return procedures",
      steps: 8,
      usedBy: 19
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Knowledge Base & Prompt Control</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage global knowledge base, prompts, and dialog flows
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="global">Global Knowledge Base</TabsTrigger>
          <TabsTrigger value="prompts">Prompt Templates</TabsTrigger>
          <TabsTrigger value="dialogs">Dialog Flows</TabsTrigger>
          <TabsTrigger value="guardrails">Guardrails</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Knowledge Base
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Global Knowledge Base</DialogTitle>
                  <DialogDescription>
                    Create a knowledge base template that tenants can copy and customize
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="Customer Service FAQs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" placeholder="Common customer service questions and answers" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" placeholder="Customer Service" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" name="content" rows={8} placeholder="Enter knowledge base content..." />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Knowledge Base</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total KB Templates</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalKB.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {globalKB.reduce((sum, kb) => sum + kb.usedBy, 0)} agents
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.4 MB</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Global Knowledge Base Templates</CardTitle>
              <CardDescription>
                Knowledge base templates that tenants can copy and customize
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Knowledge Base</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Used By</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalKB.map((kb) => (
                    <TableRow key={kb.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{kb.title}</div>
                          <div className="text-sm text-muted-foreground">{kb.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{kb.category}</Badge>
                      </TableCell>
                      <TableCell>{kb.size}</TableCell>
                      <TableCell>{kb.usedBy} agents</TableCell>
                      <TableCell>{new Date(kb.lastUpdated).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
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

        <TabsContent value="prompts" className="space-y-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Prompt Template
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Prompt Templates</CardTitle>
              <CardDescription>
                Reusable prompt templates for consistent AI behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promptTemplates.map((prompt) => (
                  <Card key={prompt.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{prompt.title}</h3>
                            <Badge variant="outline">{prompt.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            {prompt.content}
                          </p>
                          <div className="text-sm text-muted-foreground mt-2">
                            Used by {prompt.usedBy} agents
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dialogs" className="space-y-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Dialog Flow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dialogs.map((dialog) => (
              <Card key={dialog.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{dialog.title}</CardTitle>
                  <CardDescription>{dialog.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Steps</div>
                      <div className="text-lg font-semibold">{dialog.steps}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Used By</div>
                      <div className="text-lg font-semibold">{dialog.usedBy} agents</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Flow
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guardrails" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Guardrails</CardTitle>
              <CardDescription>
                Set platform-wide restrictions and safety measures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Restricted Topics</Label>
                  <Textarea 
                    placeholder="List topics that should be avoided by all agents..."
                    rows={4}
                    defaultValue="- Medical diagnoses
- Legal advice
- Financial investment advice
- Personal relationship counseling"
                  />
                </div>
                <div>
                  <Label>Mandatory Disclaimers</Label>
                  <Textarea 
                    placeholder="Disclaimers that must be included in responses..."
                    rows={3}
                    defaultValue="This information is for general guidance only and should not replace professional advice."
                  />
                </div>
                <div>
                  <Label>Escalation Triggers</Label>
                  <Textarea 
                    placeholder="Keywords or phrases that should trigger human escalation..."
                    rows={4}
                    defaultValue="- suicide
- emergency
- urgent medical
- legal threat"
                  />
                </div>
              </div>
              <Button>Save Guardrails</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}