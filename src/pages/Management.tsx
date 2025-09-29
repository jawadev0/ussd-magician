import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Users, Smartphone, CreditCard, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Management = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("activation");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Management Panel</h1>
                <p className="text-sm text-muted-foreground">Manage your USSD system</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="activation" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Activation</span>
            </TabsTrigger>
            <TabsTrigger value="topup" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Top-up</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Devices</span>
            </TabsTrigger>
            <TabsTrigger value="simcards" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">SIM Cards</span>
            </TabsTrigger>
          </TabsList>

          {/* USSD Activation Tab */}
          <TabsContent value="activation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>USSD Activation Management</CardTitle>
                <CardDescription>Manage activation codes and operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Activation Code</Label>
                    <Input placeholder="*100#" />
                  </div>
                  <div className="space-y-2">
                    <Label>Operator</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INWI">INWI</SelectItem>
                        <SelectItem value="ORANGE">ORANGE</SelectItem>
                        <SelectItem value="IAM">IAM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>Add Activation Code</Button>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>SIM</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">*100#</TableCell>
                        <TableCell>
                          <Badge>INWI</Badge>
                        </TableCell>
                        <TableCell>SIM 1</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* USSD Top-up Tab */}
          <TabsContent value="topup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>USSD Top-up Management</CardTitle>
                <CardDescription>Manage top-up codes and transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Top-up Code</Label>
                    <Input placeholder="*555*123456789#" />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Operator</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INWI">INWI</SelectItem>
                        <SelectItem value="ORANGE">ORANGE</SelectItem>
                        <SelectItem value="IAM">IAM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>Add Top-up Code</Button>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>SIM</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">*555*100#</TableCell>
                        <TableCell>100 MAD</TableCell>
                        <TableCell>
                          <Badge variant="secondary">ORANGE</Badge>
                        </TableCell>
                        <TableCell>SIM 2</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage system users and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input placeholder="Enter username" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>Add User</Button>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">admin</TableCell>
                        <TableCell>
                          <Badge>Admin</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">2024-01-20 10:30</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Disable</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Management</CardTitle>
                <CardDescription>Manage connected devices and their status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Device Name</Label>
                    <Input placeholder="Enter device name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Device ID</Label>
                    <Input placeholder="DEV-001" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="modem">Modem</SelectItem>
                        <SelectItem value="gateway">Gateway</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>Add Device</Button>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device Name</TableHead>
                        <TableHead>Device ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Main Device</TableCell>
                        <TableCell className="font-mono">DEV-001</TableCell>
                        <TableCell>
                          <Badge variant="outline">Mobile</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Online</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">2024-01-20 10:45</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIM Cards Tab */}
          <TabsContent value="simcards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SIM Card Management</CardTitle>
                <CardDescription>Manage SIM cards and their configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="+212 6XX XXX XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Operator</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INWI">INWI</SelectItem>
                        <SelectItem value="ORANGE">ORANGE</SelectItem>
                        <SelectItem value="IAM">IAM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>SIM Slot</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">SIM 1</SelectItem>
                        <SelectItem value="2">SIM 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>Add SIM Card</Button>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>Slot</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Daily Ops</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">+212 6XX XXX XXX</TableCell>
                        <TableCell>
                          <Badge>INWI</Badge>
                        </TableCell>
                        <TableCell>SIM 1</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">5/20</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">+212 7XX XXX XXX</TableCell>
                        <TableCell>
                          <Badge variant="secondary">ORANGE</Badge>
                        </TableCell>
                        <TableCell>SIM 2</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">12/20</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Management;
