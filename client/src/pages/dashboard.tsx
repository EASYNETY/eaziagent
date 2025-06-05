import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  MessageCircle, 
  CheckCircle, 
  Clock,
  Plus,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useState } from "react";
import CreateAgentModal from "@/components/modals/create-agent-modal";
import ChatWidgetPreview from "@/components/chat/chat-widget-preview";

interface DashboardData {
  totalAgents: number;
  activeConversations: number;
  resolutionRate: number;
  avgResponseTime: number;
  agents: Array<{
    id: string;
    name: string;
    businessName: string;
    isActive: boolean;
  }>;
  recentActivity: Array<{
    message: string;
    time: string;
    type: string;
  }>;
}

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Bot className="h-12 w-12 animate-pulse text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData || {
    totalAgents: 0,
    activeConversations: 0,
    resolutionRate: 0,
    avgResponseTime: 0,
    agents: [],
    recentActivity: []
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Dashboard"
          description="Manage your AI agents and monitor performance"
          action={
            <Button 
              onClick={() => setShowCreateModal(true)} 
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Create Agent</span>
            </Button>
          }
        />

        <div className="p-6 space-y-6">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Agents</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                      {stats.totalAgents}
                    </p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2 this month
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
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
                      {stats.activeConversations}
                    </p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +18% from yesterday
                    </p>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-600" />
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
                      {stats.resolutionRate}%
                    </p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2.1% improvement
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-yellow-600" />
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
                      {(stats.avgResponseTime / 1000).toFixed(1)}s
                    </p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -0.2s faster
                    </p>
                  </div>
                  <div className="bg-red-500/10 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Management Panel */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>AI Agents</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  {stats.agents.length === 0 ? (
                    <div className="text-center py-8">
                      <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">No agents created yet</p>
                      <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Agent
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {stats.agents.map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Bot className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{agent.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{agent.businessName}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <Badge variant={agent.isActive ? "default" : "secondary"}>
                                  <Activity className="h-3 w-3 mr-1" />
                                  {agent.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivity.length === 0 ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                        No recent activity
                      </p>
                    ) : (
                      stats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setShowCreateModal(true)}>
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Create Agent</p>
                      <p className="text-xs text-gray-500">Build a new AI assistant</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Chat Widget Preview */}
          {stats.agents.length > 0 && (
            <ChatWidgetPreview agent={stats.agents[0]} />
          )}
        </div>

        {showCreateModal && (
          <CreateAgentModal 
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </main>
    </div>
  );
}
