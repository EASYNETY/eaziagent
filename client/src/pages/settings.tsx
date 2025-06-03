import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Shield, CreditCard, LogOut } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";

export default function SettingsPage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Settings"
          description="Manage your account settings and preferences"
        />

        <div className="p-6 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={user?.username || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business">Business Name</Label>
                <Input id="business" value={user?.businessName || ""} readOnly />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" disabled>Edit Profile</Button>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Password</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" disabled>
                  Change Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Coming Soon</Badge>
                  <Button variant="outline" disabled>
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about your agents</p>
                </div>
                <Button variant="outline" disabled>
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Conversation Alerts</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of high-priority conversations</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Coming Soon</Badge>
                  <Button variant="outline" disabled>
                    Setup Alerts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Billing & Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Current Plan</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Free Trial</p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Usage This Month</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">API calls, storage, and conversations</p>
                </div>
                <Button variant="outline" disabled>
                  View Details
                </Button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Free Trial</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      You're currently on a free trial. Upgrade to unlock unlimited agents and advanced features.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-100">Sign Out</h4>
                  <p className="text-sm text-red-600 dark:text-red-400">Sign out of your account on this device</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-100">Delete Account</h4>
                  <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  disabled
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
