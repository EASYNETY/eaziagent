import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertAgentSchema, type InsertAgent } from "@shared/schema";
import { Upload, X } from "lucide-react";

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    description: "",
    tone: "professional" as const,
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAgentMutation = useMutation({
    mutationFn: async (data: InsertAgent) => {
      const res = await apiRequest("POST", "/api/agents", data);
      return await res.json();
    },
    onSuccess: (agent) => {
      toast({
        title: "Agent created successfully",
        description: `${agent.name} is ready to handle conversations`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Failed to create agent",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      businessName: "",
      description: "",
      tone: "professional",
    });
    setUploadedFiles([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = insertAgentSchema.parse(formData);
      createAgentMutation.mutate(validatedData);
    } catch (error) {
      toast({
        title: "Validation error",
        description: "Please check all required fields",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New AI Agent</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Agent Name</Label>
              <Input
                id="agent-name"
                placeholder="e.g., CustomerCare Pro"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                placeholder="e.g., TechStart Inc."
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Agent Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what your agent will help customers with..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Brand Tone */}
          <div className="space-y-2">
            <Label htmlFor="tone">Brand Tone</Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value as any })}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Knowledge Base Upload */}
          <div className="space-y-2">
            <Label>Upload Knowledge Base (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Drop files here or{' '}
                <label className="text-primary font-medium cursor-pointer hover:underline">
                  browse files
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Supports PDF, DOC, TXT files up to 10MB
              </p>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files</Label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAgentMutation.isPending}>
              {createAgentMutation.isPending ? "Creating Agent..." : "Create Agent"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
