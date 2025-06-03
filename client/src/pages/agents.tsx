import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Edit, BarChart3, Trash2, Activity } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import CreateAgentModal from "@/components/modals/create-agent-modal";
import type { Agent } from "@shared/schema";

export default function Agents() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: agents, isLoading, refetch } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

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

                    <div className="flex items-center space-x-2 pt-2">
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
      </main>
    </div>
  );
}
