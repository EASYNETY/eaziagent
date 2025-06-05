import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Settings, Key, Globe, Plus, Edit } from "lucide-react";

export function AIEngineConfig() {
  const [activeTab, setActiveTab] = useState("providers");
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);

  const aiProviders = [
    {
      id: "openai",
      name: "OpenAI",
      status: "active",
      models: ["gpt-4", "gpt-3.5-turbo"],
      usage: 75.2,
      cost: 1250.50
    },
    {
      id: "anthropic",
      name: "Anthropic Claude",
      status: "active", 
      models: ["claude-3-opus", "claude-3-sonnet"],
      usage: 45.8,
      cost: 890.25
    },
    {
      id: "google",
      name: "Google Gemini",
      status: "inactive",
      models: ["gemini-pro", "gemini-pro-vision"],
      usage: 0,
      cost: 0
    }
  ];

  const speechProviders = [
    {
      id: "openai-whisper",
      name: "OpenAI Whisper",
      type: "STT",
      status: "active",
      accuracy: 96.5
    },
    {
      id: "azure-speech",
      name: "Azure Speech Services", 
      type: "TTS/STT",
      status: "active",
      accuracy: 94.2
    }
  ];

  const systemPrompts = [
    {
      id: "customer-service",
      title: "Customer Service Base",
      description: "Professional customer service agent prompt",
      usage: 85,
      isDefault: true
    },
    {
      id: "technical-support",
      title: "Technical Support",
      description: "Technical troubleshooting and support",
      usage: 42,
      isDefault: false
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Engine Configuration</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage LLM providers, speech services, and AI configurations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="providers">LLM Providers</TabsTrigger>
          <TabsTrigger value="speech">Speech Services</TabsTrigger>
          <TabsTrigger value="prompts">System Prompts</TabsTrigger>
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isProviderDialogOpen} onOpenChange={setIsProviderDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add AI Provider</DialogTitle>
                  <DialogDescription>
                    Configure a new LLM provider for the platform
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select name="provider">
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="cohere">Cohere</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input id="apiKey" name="apiKey" type="password" placeholder="sk-..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select name="region">
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East 1</SelectItem>
                        <SelectItem value="us-west-2">US West 2</SelectItem>
                        <SelectItem value="eu-west-1">EU West 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch name="isDefault" />
                    <Label>Set as default provider</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsProviderDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Provider</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiProviders.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <Badge variant={provider.status === "active" ? "default" : "secondary"}>
                      {provider.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Models</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.models.map((model) => (
                        <Badge key={model} variant="outline" className="text-xs">{model}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Usage</div>
                      <div className="text-lg font-semibold">{provider.usage}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Cost (MTD)</div>
                      <div className="text-lg font-semibold">${provider.cost}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="speech" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {speechProviders.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <Badge variant="outline">{provider.type}</Badge>
                    </div>
                    <Badge variant={provider.status === "active" ? "default" : "secondary"}>
                      {provider.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="text-lg font-semibold">{provider.accuracy}%</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Prompt Template
            </Button>
          </div>

          <div className="space-y-4">
            {systemPrompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{prompt.title}</h3>
                        {prompt.isDefault && (
                          <Badge variant="default">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
                      <div className="text-sm text-muted-foreground mt-2">
                        Used by {prompt.usage} agents
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>
                Configure content filtering and safety guardrails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Profanity Filter</div>
                    <div className="text-sm text-muted-foreground">Block offensive language</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">PII Detection</div>
                    <div className="text-sm text-muted-foreground">Detect and mask personal information</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Topic Restrictions</div>
                    <div className="text-sm text-muted-foreground">Block sensitive topics</div>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Blocked Phrases</Label>
                <Textarea 
                  placeholder="Enter blocked phrases, one per line..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Custom Safety Rules</Label>
                <Textarea 
                  placeholder="Define custom moderation rules..."
                  rows={4}
                />
              </div>

              <Button>Save Moderation Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}