import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock, CheckCircle, User, Bot } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import type { Agent, Conversation } from "@shared/schema";

export default function Conversations() {
  const [selectedAgent, setSelectedAgent] = useState<string>("");

  const { data: agents, isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const { data: conversations, isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/agents", selectedAgent, "conversations"],
    enabled: !!selectedAgent,
  });

  const isLoading = agentsLoading || conversationsLoading;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Conversations"
          description="Monitor and review customer conversations with your AI agents"
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
                  <p className="text-gray-600 dark:text-gray-400">No agents available.</p>
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedAgent && (
            <Card>
              <CardHeader>
                <CardTitle>Conversation History</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 animate-pulse text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading conversations...</p>
                  </div>
                ) : !conversations || conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No conversations yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Conversations will appear here once customers start chatting with your agent
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((conversation) => (
                      <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  Session {conversation.sessionId.slice(-8)}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Started {new Date(conversation.startedAt!).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={conversation.isResolved ? "default" : "secondary"}>
                                {conversation.isResolved ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Resolved
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-3 w-3 mr-1" />
                                    Active
                                  </>
                                )}
                              </Badge>
                            </div>
                          </div>

                          {/* Messages Preview */}
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {(conversation.messages as any[])?.slice(0, 3).map((message, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  message.role === 'user' 
                                    ? 'bg-gray-200 dark:bg-gray-700' 
                                    : 'bg-primary/10'
                                }`}>
                                  {message.role === 'user' ? (
                                    <User className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                                  ) : (
                                    <Bot className="h-3 w-3 text-primary" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-white line-clamp-1">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {(conversation.messages as any[])?.length > 3 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                +{(conversation.messages as any[]).length - 3} more messages
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
