import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageCircle, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  businessName: string;
  isActive: boolean;
}

interface ChatWidgetPreviewProps {
  agent: Agent;
}

export default function ChatWidgetPreview({ agent }: ChatWidgetPreviewProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { toast } = useToast();

  const embedCode = `<script src="${window.location.origin}/embed.js"
  data-agent-id="${agent.id}"
  data-theme="${theme}"
  data-language="en"
  async>
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Chat Widget Preview</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              See how your AI agent appears to customers
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Embed Code */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Embed Code</h4>
            <div className="bg-gray-900 dark:bg-black rounded-lg p-4 text-sm font-mono overflow-x-auto">
              <pre className="text-green-400 whitespace-pre-wrap">{embedCode}</pre>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Test Widget
              </Button>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    Installation Instructions
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Copy and paste this code before the closing &lt;/body&gt; tag of your website.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Widget Preview */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Live Preview</h4>
            <div className={`relative rounded-lg p-4 h-80 ${
              theme === 'light' 
                ? 'bg-gradient-to-br from-blue-50 to-purple-50' 
                : 'bg-gradient-to-br from-gray-800 to-gray-900'
            }`}>
              {/* Simulated website background */}
              <div className="absolute inset-4">
                <div className={`h-4 rounded mb-3 ${
                  theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                }`}></div>
                <div className={`h-3 rounded mb-2 w-3/4 ${
                  theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                }`}></div>
                <div className={`h-3 rounded mb-2 w-1/2 ${
                  theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                }`}></div>
              </div>

              {/* Chat Widget */}
              <div className="absolute bottom-4 right-4">
                {/* Chat bubble */}
                <div className="relative mb-4">
                  <div className={`rounded-lg shadow-lg p-3 max-w-xs ${
                    theme === 'light' 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-800 text-white'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium">{agent.name}</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      Hi! How can I help you today?
                    </p>
                  </div>
                  <div className={`absolute -bottom-2 right-4 w-4 h-4 transform rotate-45 ${
                    theme === 'light' ? 'bg-white' : 'bg-gray-800'
                  }`}></div>
                </div>

                {/* Chat button */}
                <button className="bg-primary hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105">
                  <MessageCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Status:{' '}
                <Badge variant={agent.isActive ? "default" : "secondary"}>
                  {agent.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
              <Button variant="ghost" size="sm">
                Configure Widget
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
