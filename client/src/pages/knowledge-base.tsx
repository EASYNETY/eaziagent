import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Trash2, BookOpen, Bot } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import type { Agent, KnowledgeBase } from "@shared/schema";

export default function KnowledgeBasePage() {
  const [selectedAgent, setSelectedAgent] = useState<string>("");

  const { data: agents, isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const { data: knowledgeBase, isLoading: kbLoading } = useQuery<KnowledgeBase[]>({
    queryKey: ["/api/agents", selectedAgent, "knowledge"],
    enabled: !!selectedAgent,
  });

  const handleFileUpload = async (file: File) => {
    if (!selectedAgent) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/agents/${selectedAgent}/knowledge`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        // Refetch knowledge base data
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const isLoading = agentsLoading || kbLoading;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Knowledge Base"
          description="Upload and manage training documents for your AI agents"
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
                  <p className="text-gray-600 dark:text-gray-400">No agents available. Create an agent first to upload knowledge.</p>
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
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Drop files here or{' '}
                      <label className="text-primary font-medium cursor-pointer hover:underline">
                        browse files
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                        />
                      </label>
                    </p>
                    <p className="text-sm text-gray-500">Supports PDF, DOC, TXT files up to 10MB</p>
                  </div>
                </CardContent>
              </Card>

              {/* Knowledge Base Files */}
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 animate-pulse text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Loading documents...</p>
                    </div>
                  ) : !knowledgeBase || knowledgeBase.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No documents uploaded yet</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Upload documents to train your AI agent with specific knowledge
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {knowledgeBase.map((kb) => (
                        <div key={kb.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{kb.fileName}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Uploaded {new Date(kb.uploadedAt!).toLocaleDateString()}
                              </p>
                              {kb.metadata && (kb.metadata as any).size && (
                                <Badge variant="outline" className="mt-1">
                                  {Math.round((kb.metadata as any).size / 1024)} KB
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
