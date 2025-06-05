import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, TrendingUp, Globe, Rocket, Settings } from "lucide-react";

export function AdvancedFeatures() {
  const [activeTab, setActiveTab] = useState("fine-tuning");

  const finetuningJobs = [
    {
      id: "ft-001",
      name: "Customer Service Model",
      tenant: "Acme Corp",
      baseModel: "gpt-3.5-turbo",
      status: "training",
      progress: 65,
      accuracy: 94.2,
      estimatedCompletion: "2h 15m"
    },
    {
      id: "ft-002", 
      name: "Technical Support Model",
      tenant: "TechStart Inc",
      baseModel: "claude-3-sonnet",
      status: "completed",
      progress: 100,
      accuracy: 96.8,
      estimatedCompletion: "Completed"
    }
  ];

  const autogenJobs = [
    {
      id: "ag-001",
      tenant: "Acme Corp",
      sourceType: "Call Transcripts",
      documentsProcessed: 245,
      kbArticlesGenerated: 12,
      status: "processing",
      quality: 87.5
    },
    {
      id: "ag-002",
      tenant: "StartupCo", 
      sourceType: "Support Tickets",
      documentsProcessed: 89,
      kbArticlesGenerated: 6,
      status: "completed",
      quality: 92.1
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Features</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Cutting-edge AI capabilities and automation tools
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="fine-tuning">LLM Fine-Tuning</TabsTrigger>
          <TabsTrigger value="auto-train">AutoTrain</TabsTrigger>
          <TabsTrigger value="routing">Fallback Routing</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Dashboard</TabsTrigger>
          <TabsTrigger value="white-label">White-Label</TabsTrigger>
        </TabsList>

        <TabsContent value="fine-tuning" className="space-y-6">
          <div className="flex justify-end">
            <Button>
              <Brain className="h-4 w-4 mr-2" />
              Start Fine-Tuning Job
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {finetuningJobs.filter(job => job.status === 'training').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Models</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {finetuningJobs.filter(job => job.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(finetuningJobs.reduce((sum, job) => sum + job.accuracy, 0) / finetuningJobs.length).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fine-Tuning Console</CardTitle>
              <CardDescription>
                Fine-tune LLM models for domain-specific use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {finetuningJobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{job.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.tenant} • Base: {job.baseModel}
                      </p>
                    </div>
                    <Badge variant={job.status === 'training' ? 'default' : 'secondary'}>
                      {job.status}
                    </Badge>
                  </div>
                  
                  {job.status === 'training' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} />
                      <p className="text-xs text-muted-foreground">
                        Estimated completion: {job.estimatedCompletion}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Accuracy</span>
                      <div className="font-medium">{job.accuracy}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status</span>
                      <div className="font-medium">{job.estimatedCompletion}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-train" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AutoTrain Knowledge Base Generation</CardTitle>
              <CardDescription>
                Automatically generate and enhance knowledge bases using conversation transcripts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Start AutoTrain Job</h3>
                  <div className="space-y-2">
                    <Label>Tenant</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acme">Acme Corp</SelectItem>
                        <SelectItem value="techstart">TechStart Inc</SelectItem>
                        <SelectItem value="startup">StartupCo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Source Data</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transcripts">Call Transcripts</SelectItem>
                        <SelectItem value="tickets">Support Tickets</SelectItem>
                        <SelectItem value="chat">Chat Logs</SelectItem>
                        <SelectItem value="emails">Email Conversations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quality Threshold</Label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High (90%+)</SelectItem>
                        <SelectItem value="medium">Medium (80%+)</SelectItem>
                        <SelectItem value="low">Low (70%+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Rocket className="h-4 w-4 mr-2" />
                    Start AutoTrain
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Recent Jobs</h3>
                  {autogenJobs.map((job) => (
                    <div key={job.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{job.tenant}</span>
                        <Badge variant={job.status === 'processing' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Source: {job.sourceType}</div>
                        <div>Processed: {job.documentsProcessed} documents</div>
                        <div>Generated: {job.kbArticlesGenerated} KB articles</div>
                        <div>Quality: {job.quality}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fallback Routing Configuration</CardTitle>
              <CardDescription>
                Configure intelligent call routing and fallback mechanisms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Routing Rules</h3>
                
                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">High Call Volume Fallback</h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When concurrent calls exceed 80% capacity, route to backup AI agents
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Trigger Threshold</span>
                      <div className="font-medium">80% capacity</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fallback Target</span>
                      <div className="font-medium">Backup AI Pool</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Low Confidence Escalation</h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Escalate calls to human agents when AI confidence drops below threshold
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Confidence Threshold</span>
                      <div className="font-medium">70%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Escalation Target</span>
                      <div className="font-medium">Human Agents</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Geographic Routing</h4>
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Route calls based on caller geographic location for better latency
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Regions</span>
                      <div className="font-medium">US, EU, APAC</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Latency Target</span>
                      <div className="font-medium">&lt; 150ms</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Create Custom Routing Rule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rule Name</Label>
                    <Input placeholder="Emergency Keyword Detection" />
                  </div>
                  <div className="space-y-2">
                    <Label>Trigger Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="keyword">Keyword Detection</SelectItem>
                        <SelectItem value="confidence">Confidence Threshold</SelectItem>
                        <SelectItem value="volume">Call Volume</SelectItem>
                        <SelectItem value="time">Time-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Trigger Condition</Label>
                  <Input placeholder="emergency OR urgent OR help" />
                </div>
                <div className="space-y-2">
                  <Label>Routing Action</Label>
                  <Textarea 
                    rows={3} 
                    placeholder="Route to priority queue with human agent escalation..."
                  />
                </div>
                <Button>Create Routing Rule</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Revenue Dashboard</CardTitle>
              <CardDescription>
                Detailed revenue analytics and forecasting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">MRR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$24,750</div>
                    <p className="text-xs text-green-600">+15.2% MoM</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ARR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$297k</div>
                    <p className="text-xs text-green-600">+22.8% YoY</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Churn Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.1%</div>
                    <p className="text-xs text-red-600">+0.3% MoM</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">LTV/CAC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2x</div>
                    <p className="text-xs text-green-600">+0.8x MoM</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue by Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Enterprise</span>
                        <span className="font-medium">$18,750 (75.8%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{width: '75.8%'}}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Pro</span>
                        <span className="font-medium">$4,200 (17.0%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '17%'}}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Basic</span>
                        <span className="font-medium">$1,800 (7.2%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '7.2%'}}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Usage-Based Revenue</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Voice Minutes</span>
                        <span className="font-medium">$8,940</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>API Calls</span>
                        <span className="font-medium">$3,120</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Storage</span>
                        <span className="font-medium">$1,890</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Premium Features</span>
                        <span className="font-medium">$2,800</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="white-label" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>White-Label Solutions</CardTitle>
              <CardDescription>
                Complete white-label platform configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Custom Domain Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Domain</Label>
                    <Input defaultValue="ai.acme.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SSL Certificate</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Active</Badge>
                      <span className="text-sm text-muted-foreground">Auto-renewed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Email Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Server</Label>
                    <Input placeholder="smtp.acme.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>From Email</Label>
                    <Input placeholder="noreply@acme.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">DNS Configuration</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div>CNAME: ai.acme.com → platform.aiagent.com</div>
                    <div>TXT: _acme-challenge → verification-token-123</div>
                    <div>MX: mail.acme.com → 10 mx.platform.com</div>
                  </div>
                </div>
              </div>

              <Button>Update White-Label Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}