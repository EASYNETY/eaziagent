import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Building2, 
  Phone, 
  Plus, 
  Settings, 
  Users, 
  Clock, 
  ArrowRight,
  Edit,
  Trash2,
  PhoneCall,
  Route
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  phoneNumbers?: string[];
  sipExtensions?: string[];
  routingLogic?: any;
  escalationPaths?: any;
  businessHours?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Departments() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const { toast } = useToast();

  const { data: departments, isLoading } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (departmentData: any) => {
      return apiRequest("/api/departments", {
        method: "POST",
        body: JSON.stringify(departmentData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      setIsCreateModalOpen(false);
      toast({
        title: "Department Created",
        description: "New department has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive",
      });
    },
  });

  const handleCreateDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const departmentData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      phoneNumbers: (formData.get("phoneNumbers") as string)
        .split(",")
        .map(num => num.trim())
        .filter(num => num),
      businessHours: {
        monday: { start: "09:00", end: "17:00", enabled: true },
        tuesday: { start: "09:00", end: "17:00", enabled: true },
        wednesday: { start: "09:00", end: "17:00", enabled: true },
        thursday: { start: "09:00", end: "17:00", enabled: true },
        friday: { start: "09:00", end: "17:00", enabled: true },
        saturday: { start: "10:00", end: "14:00", enabled: false },
        sunday: { start: "10:00", end: "14:00", enabled: false },
      },
      routingLogic: {
        type: "round_robin",
        priority: "normal",
        maxWaitTime: 300,
      },
      escalationPaths: [
        { level: 1, action: "queue", target: "ai_agent" },
        { level: 2, action: "escalate", target: "human_agent" },
        { level: 3, action: "voicemail", target: "manager" },
      ],
    };

    createDepartmentMutation.mutate(departmentData);
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage departments and call routing for your organization
          </p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
              <DialogDescription>
                Set up a new department with call routing and business hours
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Sales, Support, Billing"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumbers">Phone Numbers</Label>
                  <Input
                    id="phoneNumbers"
                    name="phoneNumbers"
                    placeholder="+1234567890, +1234567891"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Department description and purpose"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createDepartmentMutation.isPending}
                >
                  {createDepartmentMutation.isPending ? "Creating..." : "Create Department"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Department Cards */}
      <div className="grid gap-6">
        {departments?.map((department) => (
          <Card key={department.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {department.name}
                      <Badge variant={department.isActive ? "default" : "secondary"}>
                        {department.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{department.description}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
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
                {/* Phone Numbers */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4" />
                    Phone Numbers
                  </div>
                  <div className="space-y-1">
                    {department.phoneNumbers?.length ? (
                      department.phoneNumbers.map((phone, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground font-mono">
                          {phone}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">No numbers assigned</div>
                    )}
                  </div>
                </div>

                {/* Call Routing */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Route className="h-4 w-4" />
                    Call Routing
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {department.routingLogic?.type || "Round Robin"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Max wait: {department.routingLogic?.maxWaitTime || 300}s
                  </div>
                </div>

                {/* Business Hours */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Business Hours
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mon-Fri: 9:00 AM - 5:00 PM
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Timezone: UTC
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <PhoneCall className="h-4 w-4" />
                    Quick Actions
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button variant="outline" size="sm" className="justify-start h-8">
                      <Users className="h-3 w-3 mr-2" />
                      View Agents
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start h-8">
                      <PhoneCall className="h-3 w-3 mr-2" />
                      Call Logs
                    </Button>
                  </div>
                </div>
              </div>

              {/* Escalation Flow */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <ArrowRight className="h-4 w-4" />
                  Escalation Flow
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">AI Agent</Badge>
                  <ArrowRight className="h-3 w-3" />
                  <Badge variant="outline" className="text-xs">Human Agent</Badge>
                  <ArrowRight className="h-3 w-3" />
                  <Badge variant="outline" className="text-xs">Manager</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {departments?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Departments Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first department to organize agents and manage call routing
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Department
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}