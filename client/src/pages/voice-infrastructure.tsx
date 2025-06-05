import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Plus, 
  Settings, 
  Activity, 
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  Globe,
  Shield,
  Server,
  PhoneCall,
  Headphones,
  Mic,
  Volume2
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TelephonyProvider {
  id: string;
  organizationId?: string;
  providerName: string;
  isActive: boolean;
  configuration?: any;
  credentials?: any;
  phoneNumbers?: string[];
  features?: string[];
  healthStatus: string;
  lastHealthCheck?: string;
  createdAt: string;
  updatedAt: string;
}

interface SystemHealth {
  id: string;
  component: string;
  status: string;
  responseTime?: number;
  errorRate?: number;
  activeConnections?: number;
  details?: any;
  checkedAt: string;
}

export default function VoiceInfrastructure() {
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<TelephonyProvider | null>(null);
  const { toast } = useToast();

  const { data: providers, isLoading: providersLoading } = useQuery<TelephonyProvider[]>({
    queryKey: ["/api/telephony-providers"],
  });

  const { data: systemHealth, isLoading: healthLoading } = useQuery<SystemHealth[]>({
    queryKey: ["/api/system-health"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const createProviderMutation = useMutation({
    mutationFn: async (providerData: any) => {
      return apiRequest("/api/telephony-providers", {
        method: "POST",
        body: JSON.stringify(providerData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/telephony-providers"] });
      setIsProviderModalOpen(false);
      toast({
        title: "Provider Added",
        description: "Telephony provider has been successfully configured.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add telephony provider",
        variant: "destructive",
      });
    },
  });

  const testProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      return apiRequest(`/api/telephony-providers/${providerId}/test`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/telephony-providers"] });
      toast({
        title: "Test Successful",
        description: "Provider connection test completed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Test Failed",
        description: error.message || "Provider connection test failed",
        variant: "destructive",
      });
    },
  });

  const handleCreateProvider = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const providerData = {
      providerName: formData.get("providerName") as string,
      configuration: {
        region: formData.get("region") as string,
        webhook_url: formData.get("webhookUrl") as string,
        voice_model: formData.get("voiceModel") as string,
      },
      credentials: {
        api_key: formData.get("apiKey") as string,
        api_secret: formData.get("apiSecret") as string,
        account_sid: formData.get("accountSid") as string,
      },
      phoneNumbers: (formData.get("phoneNumbers") as string)
        .split(",")
        .map(num => num.trim())
        .filter(num => num),
      features: ["voice_calls", "sms", "recording", "transcription"],
    };

    createProviderMutation.mutate(providerData);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "down":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "degraded":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "down":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (providersLoading || healthLoading) {
    return (
      <div className="p-6">
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Voice Infrastructure</h1>
          <p className="text-muted-foreground">
            Manage telephony providers and voice infrastructure
          </p>
        </div>

        <Dialog open={isProviderModalOpen} onOpenChange={setIsProviderModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Telephony Provider</DialogTitle>
              <DialogDescription>
                Configure a new telephony provider for voice calls
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProvider} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="providerName">Provider</Label>
                  <Select name="providerName" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="asterisk">Asterisk</SelectItem>
                      <SelectItem value="agora">Agora</SelectItem>
                      <SelectItem value="vonage">Vonage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select name="region" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East</SelectItem>
                      <SelectItem value="us-west-1">US West</SelectItem>
                      <SelectItem value="eu-west-1">EU West</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  type="password"
                  placeholder="Your provider API key"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiSecret">API Secret</Label>
                  <Input
                    id="apiSecret"
                    name="apiSecret"
                    type="password"
                    placeholder="API secret"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountSid">Account SID</Label>
                  <Input
                    id="accountSid"
                    name="accountSid"
                    placeholder="Account SID (if applicable)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumbers">Phone Numbers</Label>
                <Input
                  id="phoneNumbers"
                  name="phoneNumbers"
                  placeholder="+1234567890, +1234567891"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  name="webhookUrl"
                  placeholder="https://your-domain.com/webhook"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProviderModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createProviderMutation.isPending}
                >
                  {createProviderMutation.isPending ? "Adding..." : "Add Provider"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="settings">Voice Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          {/* Provider Cards */}
          <div className="grid gap-4">
            {providers?.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {provider.providerName}
                          <Badge variant={provider.isActive ? "default" : "secondary"}>
                            {provider.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge className={getStatusColor(provider.healthStatus)}>
                            {getStatusIcon(provider.healthStatus)}
                            {provider.healthStatus}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {provider.phoneNumbers?.length || 0} phone numbers assigned
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testProviderMutation.mutate(provider.id)}
                        disabled={testProviderMutation.isPending}
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Globe className="h-4 w-4" />
                        Region
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {provider.configuration?.region || "Not configured"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <PhoneCall className="h-4 w-4" />
                        Phone Numbers
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {provider.phoneNumbers?.length || 0} numbers
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Shield className="h-4 w-4" />
                        Features
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {provider.features?.length || 0} features enabled
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4" />
                        Last Check
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {provider.lastHealthCheck 
                          ? new Date(provider.lastHealthCheck).toLocaleString()
                          : "Never"
                        }
                      </div>
                    </div>
                  </div>

                  {provider.phoneNumbers && provider.phoneNumbers.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm font-medium mb-2">Assigned Phone Numbers</div>
                      <div className="flex flex-wrap gap-2">
                        {provider.phoneNumbers.map((phone, idx) => (
                          <Badge key={idx} variant="outline" className="font-mono">
                            {phone}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {providers?.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Providers Configured</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first telephony provider to start handling voice calls
                  </p>
                  <Button onClick={() => setIsProviderModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Provider
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          {/* System Health Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth?.map((health) => (
              <Card key={health.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {health.component}
                    </CardTitle>
                    {getStatusIcon(health.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge className={getStatusColor(health.status)}>
                      {health.status}
                    </Badge>
                    
                    {health.responseTime && (
                      <div className="text-sm">
                        Response Time: <span className="font-mono">{health.responseTime}ms</span>
                      </div>
                    )}
                    
                    {health.errorRate !== undefined && (
                      <div className="text-sm">
                        Error Rate: <span className="font-mono">{health.errorRate}%</span>
                      </div>
                    )}
                    
                    {health.activeConnections && (
                      <div className="text-sm">
                        Active Connections: <span className="font-mono">{health.activeConnections}</span>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Last checked: {new Date(health.checkedAt).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {/* Voice Settings */}
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Recognition Settings
                </CardTitle>
                <CardDescription>
                  Configure speech-to-text and voice processing settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Speech Provider</Label>
                    <Select defaultValue="whisper">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whisper">OpenAI Whisper</SelectItem>
                        <SelectItem value="google">Google Speech-to-Text</SelectItem>
                        <SelectItem value="azure">Azure Speech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Language</Label>
                    <Select defaultValue="en-US">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Voice Synthesis Settings
                </CardTitle>
                <CardDescription>
                  Configure text-to-speech and voice generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>TTS Provider</Label>
                    <Select defaultValue="openai">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI TTS</SelectItem>
                        <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                        <SelectItem value="google">Google TTS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Voice</Label>
                    <Select defaultValue="alloy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alloy">Alloy</SelectItem>
                        <SelectItem value="echo">Echo</SelectItem>
                        <SelectItem value="fable">Fable</SelectItem>
                        <SelectItem value="onyx">Onyx</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}