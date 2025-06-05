import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Agents from "@/pages/agents";
import KnowledgeBase from "@/pages/knowledge-base";
import Conversations from "@/pages/conversations";
import Analytics from "@/pages/analytics";
import Integration from "@/pages/integration";
import Settings from "@/pages/settings";
import SuperAdminDashboard from "@/pages/super-admin-new";
import LandingPage from "@/pages/landing";

function Router() {
  return (
    <Switch>
      <Route path="/landing" component={LandingPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/agents" component={Agents} />
      <ProtectedRoute path="/knowledge" component={KnowledgeBase} />
      <ProtectedRoute path="/conversations" component={Conversations} />
      <ProtectedRoute path="/analytics" component={Analytics} />
      <ProtectedRoute path="/integration" component={Integration} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/super-admin" component={SuperAdminDashboard} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
