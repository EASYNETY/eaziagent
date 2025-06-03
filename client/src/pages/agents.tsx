import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Plus, Edit, BarChart3, Trash2, Activity, Phone, PhoneCall, Mic, MicOff, Play, MessageCircle } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import CreateAgentModal from "@/components/modals/create-agent-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Agent } from "@shared/schema";

export default function Agents() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: agents, isLoading, refetch } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const testAgentMutation = useMutation({
    mutationFn: async ({ agentId, message }: { agentId: string; message: string }) => {
      const res = await apiRequest("POST", `/api/agents/${agentId}/test`, { message });
      return await res.json();
    },
    onSuccess: (data) => {
      setTestResponse(data.response);
      toast({
        title: "Agent tested successfully",
        description: "Response generated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Test failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const makeCallMutation = useMutation({
    mutationFn: async ({ agentId, phoneNumber }: { agentId: string; phoneNumber: string }) => {
      const res = await apiRequest("POST", `/api/agents/${agentId}/call`, { phoneNumber });
      return await res.json();
    },
    onSuccess: (data) => {
      setIsCallActive(true);
      toast({
        title: "Call initiated",
        description: `Calling ${phoneNumber}...`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Call failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTestAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowTestModal(true);
    setTestMessage("");
    setTestResponse("");
  };

  const handleSendTestMessage = () => {
    if (!selectedAgent || !testMessage.trim()) return;
    testAgentMutation.mutate({
      agentId: selectedAgent.id,
      message: testMessage.trim(),
    });
  };

  const handleMakeCall = () => {
    if (!selectedAgent || !phoneNumber.trim()) return;
    makeCallMutation.mutate({
      agentId: selectedAgent.id,
      phoneNumber: phoneNumber.trim(),
    });
  };

  const handleVoiceTest = () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording and process
      toast({
        title: "Voice recording stopped",
        description: "Processing your voice message...",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak your test message...",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Bot className="h-12 w-12 animate-pulse text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading agents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="AI Agents"
          description="Create and manage your intelligent customer service agents"
          action={
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Agent</span>
            </Button>
          }
        />

        <div className="p-6">
          {!agents || agents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bot className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No AI Agents Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Create your first AI agent to start handling customer conversations automatically. 
                  Each agent can be customized for your specific business needs.
                </p>
                <Button onClick={() => setShowCreateModal(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Agent
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{agent.businessName}</p>
                        </div>
                      </div>
                      <Badge variant={agent.isActive ? "default" : "secondary"}>
                        <Activity className="h-3 w-3 mr-1" />
                        {agent.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {agent.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {agent.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Tone:</span>
                      <Badge variant="outline" className="capitalize">
                        {agent.tone}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {new Date(agent.createdAt!).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2">
                      {/* Test & Voice Actions */}
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleTestAgent(agent)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Test Agent
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedAgent(agent);
                            setPhoneNumber("");
                            // Show phone number input in test modal
                            handleTestAgent(agent);
                          }}
                        >
                          <PhoneCall className="h-4 w-4 mr-1" />
                          Call Test
                        </Button>
                      </div>
                      
                      {/* Management Actions */}
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="sm" className="px-3">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {showCreateModal && (
          <CreateAgentModal 
            isOpen={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              refetch();
            }}
          />
        )}

        {/* Agent Test Modal */}
        {showTestModal && selectedAgent && (
          <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Test Agent: {selectedAgent.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Text Testing */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="test-message">Text Message Test</Label>
                    <Textarea
                      id="test-message"
                      placeholder="Type a message to test how your agent responds..."
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleSendTestMessage}
                      disabled={!testMessage.trim() || testAgentMutation.isPending}
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {testAgentMutation.isPending ? "Testing..." : "Send Test Message"}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handleVoiceTest}
                      className={`px-4 ${isRecording ? 'bg-red-500 text-white' : ''}`}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>

                  {testResponse && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Agent Response:
                      </Label>
                      <p className="mt-2 text-gray-900 dark:text-white whitespace-pre-wrap">
                        {testResponse}
                      </p>
                    </div>
                  )}
                </div>

                {/* Voice Calling */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone-number">Voice Call Test</Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="Enter phone number (e.g., +1234567890)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={handleMakeCall}
                      disabled={!phoneNumber.trim() || makeCallMutation.isPending || isCallActive}
                      className="w-full"
                      variant={isCallActive ? "destructive" : "default"}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {isCallActive ? "End Call" : makeCallMutation.isPending ? "Calling..." : "Start Voice Call"}
                    </Button>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This will initiate a real phone call to test your agent's voice capabilities.
                    </p>
                  </div>

                  {/* Call Status */}
                  {isCallActive && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                          Call Active - {phoneNumber}
                        </span>
                      </div>
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                        Your AI agent is now handling the call
                      </p>
                    </div>
                  )}

                  {/* Agent Configuration Preview */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Agent Configuration</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Business:</span>
                        <span className="text-blue-900 dark:text-blue-100">{selectedAgent.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Tone:</span>
                        <span className="text-blue-900 dark:text-blue-100 capitalize">{selectedAgent.tone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">Status:</span>
                        <span className="text-blue-900 dark:text-blue-100">
                          {selectedAgent.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowTestModal(false)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}
