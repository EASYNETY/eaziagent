import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, Bot, Code, Webhook, Zap } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useToast } from "@/hooks/use-toast";
import type { Agent } from "@shared/schema";

export default function Integration() {
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const { toast } = useToast();

  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const selectedAgentData = agents?.find(agent => agent.id === selectedAgent);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const embedCode = `<script src="${window.location.origin}/embed.js"
  data-agent-id="${selectedAgent}"
  data-theme="light"
  data-language="en"
  async>
</script>`;

  const apiExample = `// Chat with agent
const response = await fetch('${window.location.origin}/api/chat/${selectedAgent}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Hello, I need help with my order',
    sessionId: 'user_session_123',
    conversationHistory: []
  })
});

const data = await response.json();
console.log(data.response);`;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Integration"
          description="Embed your AI agents on websites and integrate with external systems"
        />

        <div className="p-6 space-y-6">
          {/* Agent Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Agent</CardTitle>
            </CardHeader>
            <CardContent>
              {!agents || agents.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No agents available. Create an agent first to get integration code.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <Card 
                      key={agent.id}
                      className={`cursor-pointer transition-colors ${
                        selectedAgent === agent.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedAgent(agent.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Bot className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{agent.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{agent.businessName}</p>
                            <Badge variant={agent.isActive ? "default" : "secondary"} className="mt-1">
                              {agent.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedAgent && selectedAgentData && (
            <Tabs defaultValue="embed" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="embed">Website Embed</TabsTrigger>
                <TabsTrigger value="api">API Integration</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              </TabsList>

              <TabsContent value="embed" className="space-y-6">
                {/* Website Embed */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>Embed Code</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-900 dark:bg-black rounded-lg p-4 text-sm font-mono overflow-x-auto">
                      <pre className="text-green-400">{embedCode}</pre>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={() => copyToClipboard(embedCode, "Embed code")}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Demo
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <div>
                          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Installation Instructions</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Copy and paste this code before the closing &lt;/body&gt; tag of your website. 
                            The chat widget will appear in the bottom-right corner.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customization Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customization Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Theme Options</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="text-sm">data-theme="light"</span>
                            <Badge variant="outline">Default</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="text-sm">data-theme="dark"</span>
                            <Badge variant="outline">Dark Mode</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Language Support</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="text-sm">data-language="en"</span>
                            <Badge variant="outline">English</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="text-sm">data-language="es"</span>
                            <Badge variant="outline">Spanish</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api" className="space-y-6">
                {/* API Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>REST API</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Endpoint</h4>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 font-mono text-sm">
                        POST {window.location.origin}/api/chat/{selectedAgent}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Example Request</h4>
                      <div className="bg-gray-900 dark:bg-black rounded-lg p-4 text-sm font-mono overflow-x-auto">
                        <pre className="text-green-400">{apiExample}</pre>
                      </div>
                    </div>

                    <Button 
                      onClick={() => copyToClipboard(apiExample, "API example")}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Example
                    </Button>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <div>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Rate Limiting</p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            API calls are limited to 100 requests per minute per agent to ensure optimal performance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="webhooks" className="space-y-6">
                {/* Webhooks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Webhook className="h-5 w-5" />
                      <span>Webhooks</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Webhooks Coming Soon
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Set up webhooks to receive real-time notifications when conversations start, 
                        end, or require human intervention.
                      </p>
                      <Button variant="outline" className="mt-4">
                        Get Notified When Available
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
