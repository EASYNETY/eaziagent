import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Globe, Bell, Palette, Upload } from "lucide-react";

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState("platform");

  const betaFeatures = [
    {
      id: "advanced-analytics",
      name: "Advanced Analytics Dashboard",
      description: "Enhanced analytics with predictive insights",
      enabled: true
    },
    {
      id: "multi-language-tts",
      name: "Multi-Language TTS",
      description: "Text-to-speech in 50+ languages",
      enabled: false
    },
    {
      id: "ai-fine-tuning",
      name: "AI Model Fine-Tuning",
      description: "Fine-tune models for domain-specific use cases",
      enabled: false
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure global platform settings and experimental features
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="platform">Platform Settings</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="features">Beta Features</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Platform Configuration</CardTitle>
              <CardDescription>Core platform settings and defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Timezone</Label>
                  <Select defaultValue="UTC">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar</SelectItem>
                      <SelectItem value="EUR">Euro</SelectItem>
                      <SelectItem value="GBP">British Pound</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Maintenance Mode</div>
                    <div className="text-sm text-muted-foreground">Enable platform-wide maintenance mode</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">User Registration</div>
                    <div className="text-sm text-muted-foreground">Allow new user registrations</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-Scale Infrastructure</div>
                    <div className="text-sm text-muted-foreground">Automatically scale resources based on demand</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" defaultValue="60" className="w-32" />
              </div>

              <div className="space-y-2">
                <Label>Max File Upload Size (MB)</Label>
                <Input type="number" defaultValue="50" className="w-32" />
              </div>

              <Button>Save Platform Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting</CardTitle>
              <CardDescription>Configure API rate limits and throttling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>API Requests per minute</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Voice calls per hour</Label>
                  <Input type="number" defaultValue="500" />
                </div>
                <div className="space-y-2">
                  <Label>Concurrent connections</Label>
                  <Input type="number" defaultValue="100" />
                </div>
              </div>
              <Button>Update Rate Limits</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Branding</CardTitle>
              <CardDescription>Customize the platform appearance and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Platform Name</Label>
                <Input defaultValue="AI Agent Hub" />
              </div>

              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input defaultValue="Your Company" />
              </div>

              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input type="email" defaultValue="support@company.com" />
              </div>

              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">Click to upload logo or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-blue-600 rounded border-2 border-gray-300"></div>
                  <Input defaultValue="#2563eb" className="w-32" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-gray-600 rounded border-2 border-gray-300"></div>
                  <Input defaultValue="#4b5563" className="w-32" />
                </div>
              </div>

              <Button>Save Branding Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>White-Label Configuration</CardTitle>
              <CardDescription>Configure white-label options for enterprise clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Custom Domains</div>
                  <div className="text-sm text-muted-foreground">Allow tenants to use custom domains</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Custom Branding</div>
                  <div className="text-sm text-muted-foreground">Allow tenants to customize branding</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Hide Platform Branding</div>
                  <div className="text-sm text-muted-foreground">Remove platform branding for enterprise plans</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Announcements</CardTitle>
              <CardDescription>Send announcements to all tenants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Announcement Title</Label>
                <Input placeholder="Platform Maintenance Scheduled" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea 
                  rows={4} 
                  placeholder="We will be performing scheduled maintenance on..."
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch />
                <Label>Send email notification</Label>
              </div>
              <Button>Send Announcement</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Configure automatic system alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">High Error Rate Alerts</div>
                  <div className="text-sm text-muted-foreground">Alert when error rate exceeds 5%</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Resource Usage Alerts</div>
                  <div className="text-sm text-muted-foreground">Alert when resources exceed 80% usage</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Security Alerts</div>
                  <div className="text-sm text-muted-foreground">Alert on suspicious security events</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Alert Email Recipients</Label>
                <Textarea 
                  rows={2} 
                  placeholder="admin@company.com, ops@company.com"
                />
              </div>
              <Button>Save Alert Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Beta Features</CardTitle>
              <CardDescription>Enable experimental features across the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {betaFeatures.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{feature.name}</h3>
                      <Badge variant="outline">Beta</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                  <Switch 
                    checked={feature.enabled}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Rollout</CardTitle>
              <CardDescription>Control phased feature releases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rollout Strategy</Label>
                <Select defaultValue="gradual">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (All tenants)</SelectItem>
                    <SelectItem value="gradual">Gradual (10% per day)</SelectItem>
                    <SelectItem value="controlled">Controlled (Selected tenants)</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rollback Threshold (%)</Label>
                <Input type="number" defaultValue="15" className="w-32" />
                <p className="text-xs text-muted-foreground">
                  Automatically rollback if error rate exceeds this threshold
                </p>
              </div>
              <Button>Update Rollout Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}