import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Phone, Server, Settings, Activity, Plus, Edit, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SIPTrunk {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  isActive: boolean;
  tenantId?: string;
  callVolume: number;
  quality: number;
}

interface VoiceConfig {
  id: string;
  provider: string;
  apiKey: string;
  region: string;
  isDefault: boolean;
  features: string[];
}

export function VoiceInfrastructure() {
  const [activeTab, setActiveTab] = useState("trunks");
  const [isCreateTrunkOpen, setIsCreateTrunkOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const { data: sipTrunks = [], isLoading: trunksLoading } = useQuery({
    queryKey: ['/api/admin/voice/trunks'],
    queryFn: () => apiRequest('/api/admin/voice/trunks')
  });

  const { data: voiceConfigs = [], isLoading: configsLoading } = useQuery({
    queryKey: ['/api/admin/voice/configs'],
    queryFn: () => apiRequest('/api/admin/voice/configs')
  });

  const { data: voiceStats } = useQuery({
    queryKey: ['/api/admin/voice/stats'],
    queryFn: () => apiRequest('/api/admin/voice/stats')
  });

  const createTrunkMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/voice/trunks', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voice/trunks'] });
      setIsCreateTrunkOpen(false);
    }
  });

  const updateConfigMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/admin/voice/configs/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voice/configs'] });
      setIsConfigDialogOpen(false);
    }
  });

  const handleCreateTrunk = (formData: FormData) => {
    const data = {
      name: formData.get('name'),
      provider: formData.get('provider'),
      endpoint: formData.get('endpoint'),
      tenantId: formData.get('tenantId') || null,
      credentials: {
        username: formData.get('username'),
        password: formData.get('password')
      }
    };
    createTrunkMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Voice Infrastructure</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage SIP trunks, carriers, and voice configurations
          </p>
        </div>
      </div>

      {/* Voice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voiceStats?.activeCalls || 0}</div>
            <p className="text-xs text-muted-foreground">Real-time concurrent calls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Quality</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voiceStats?.averageQuality || 4.8}/5.0</div>
            <p className="text-xs text-muted-foreground">Average call quality score</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latency</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voiceStats?.averageLatency || 45}ms</div>
            <p className="text-xs text-muted-foreground">Average response latency</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voiceStats?.successRate || 99.7}%</div>
            <p className="text-xs text-muted-foreground">Call connection success rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="trunks">SIP Trunks</TabsTrigger>
          <TabsTrigger value="configs">Voice Configs</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="trunks" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isCreateTrunkOpen} onOpenChange={setIsCreateTrunkOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add SIP Trunk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create SIP Trunk</DialogTitle>
                  <DialogDescription>
                    Configure a new SIP trunk for voice routing
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateTrunk(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Trunk Name</Label>
                    <Input id="name" name="name" placeholder="Primary Twilio Trunk" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select name="provider">
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="telnyx">Telnyx</SelectItem>
                        <SelectItem value="bandwidth">Bandwidth</SelectItem>
                        <SelectItem value="vonage">Vonage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">SIP Endpoint</Label>
                    <Input id="endpoint" name="endpoint" placeholder="sip.twilio.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenantId">Tenant (Optional)</Label>
                    <Input id="tenantId" name="tenantId" placeholder="Leave empty for global" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateTrunkOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createTrunkMutation.isPending}>
                      {createTrunkMutation.isPending ? 'Creating...' : 'Create Trunk'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SIP Trunks</CardTitle>
              <CardDescription>
                Manage SIP trunk configurations for voice routing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trunksLoading ? (
                <div className="flex items-center justify-center h-32">Loading SIP trunks...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trunk Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sipTrunks.map((trunk: SIPTrunk) => (
                      <TableRow key={trunk.id}>
                        <TableCell className="font-medium">{trunk.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{trunk.provider}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{trunk.endpoint}</TableCell>
                        <TableCell>
                          {trunk.tenantId ? (
                            <Badge variant="secondary">Tenant-specific</Badge>
                          ) : (
                            <Badge variant="default">Global</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{trunk.callVolume} calls/day</div>
                            <div className="text-muted-foreground">Quality: {trunk.quality}/5.0</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={trunk.isActive ? "default" : "destructive"}>
                            {trunk.isActive ? "Active" : "Inactive"}
                          </Badge>
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice Engine Configurations</CardTitle>
              <CardDescription>
                Manage TTS, STT, and voice processing settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {configsLoading ? (
                <div className="flex items-center justify-center h-32">Loading voice configs...</div>
              ) : (
                <div className="space-y-4">
                  {voiceConfigs.map((config: VoiceConfig) => (
                    <Card key={config.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{config.provider}</h3>
                            <p className="text-sm text-muted-foreground">Region: {config.region}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              {config.features.map((feature) => (
                                <Badge key={feature} variant="outline">{feature}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {config.isDefault && (
                              <Badge variant="default">Default</Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Voice Monitoring</CardTitle>
              <CardDescription>
                Monitor active calls and voice infrastructure health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{voiceStats?.activeCalls || 0}</div>
                    <p className="text-sm text-muted-foreground">Active Calls</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{voiceStats?.queuedCalls || 0}</div>
                    <p className="text-sm text-muted-foreground">Queued Calls</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{voiceStats?.failedCalls || 0}</div>
                    <p className="text-sm text-muted-foreground">Failed Calls (24h)</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Recent Call Events</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-sm">Call established: +1234567890 → Agent AI-001</span>
                      <span className="text-xs text-muted-foreground">2s ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="text-sm">Call completed: Duration 3m 45s, Quality 4.9/5.0</span>
                      <span className="text-xs text-muted-foreground">1m ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <span className="text-sm">High latency detected on Twilio Trunk #2</span>
                      <span className="text-xs text-muted-foreground">3m ago</span>
                    </div>
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