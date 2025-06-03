import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, MessageCircle, CheckCircle, Clock, Bot } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import type { Agent } from "@shared/schema";

interface AnalyticsData {
  analytics: any[];
  metrics: {
    totalConversations: number;
    resolvedConversations: number;
    activeConversations: number;
    resolutionRate: number;
    avgResponseTime: number;
  };
}

export default function Analytics() {
  const [selectedAgent, setSelectedAgent] = useState<string>("");

  const { data: agents, isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/agents", selectedAgent, "analytics"],
    enabled: !!selectedAgent,
  });

  const isLoading = agentsLoading || analyticsLoading;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Analytics"
          description="Monitor performance metrics and insights for your AI agents"
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
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversations</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                          {analyticsData?.metrics.totalConversations || 0}
                        </p>
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12% this week
                        </p>
                      </div>
                      <div className="bg-blue-500/10 p-3 rounded-lg">
                        <MessageCircle className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                          {analyticsData?.metrics.resolutionRate || 0}%
                        </p>
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +5% improvement
                        </p>
                      </div>
                      <div className="bg-green-500/10 p-3 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Conversations</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                          {analyticsData?.metrics.activeConversations || 0}
                        </p>
                        <p className="text-sm text-blue-600 mt-1 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Real-time
                        </p>
                      </div>
                      <div className="bg-yellow-500/10 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                          {((analyticsData?.metrics.avgResponseTime || 0) / 1000).toFixed(1)}s
                        </p>
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          -0.3s faster
                        </p>
                      </div>
                      <div className="bg-purple-500/10 p-3 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 animate-pulse text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">High Resolution Rate</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {analyticsData?.metrics.resolutionRate || 0}% of conversations resolved successfully
                              </p>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-green-500">
                            Excellent
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <Clock className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Fast Response Time</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Average {((analyticsData?.metrics.avgResponseTime || 0) / 1000).toFixed(1)}s response time
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-blue-500 text-blue-600">
                            Good
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                              <MessageCircle className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Conversation Volume</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {analyticsData?.metrics.totalConversations || 0} total conversations handled
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-purple-500 text-purple-600">
                            Active
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Detailed trend charts coming soon
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Historical data visualization will be available here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
