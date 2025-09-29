import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Users, Smartphone, CreditCard, Zap, ArrowLeft, Power, PowerOff, Signal, Wifi, WifiOff, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DualSIMStatus } from "@/types/ussd";
import { ussdService } from "@/services/ussdService";

const Management = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get tab from URL params
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const initialTab = searchParams.get('tab') || 'devices';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [simStatus, setSimStatus] = useState<DualSIMStatus | null>(null);
  const [simLoading, setSimLoading] = useState({ sim1: false, sim2: false });
  const [deviceLoading, setDeviceLoading] = useState({ device1: false });

  // Form states
  const [activationForm, setActivationForm] = useState({
    code: '',
    operator: '',
    sim: '',
    description: ''
  });
  
  const [activationCodes, setActivationCodes] = useState([
    {
      id: '1',
      code: '*100#',
      operator: 'INWI',
      sim: 'SIM 1',
      status: 'Active',
      description: 'Balance Check'
    }
  ]);

  // Mock devices data - in real app this would come from API
  const [devices] = useState([
    {
      id: "DEV-001",
      name: "Main Device",
      type: "Mobile",
      status: "online",
      lastSeen: "2024-01-20 10:45",
      simSlots: 2,
      location: "Office",
    },
  ]);

  useEffect(() => {
    loadSIMStatus();
  }, []);

  const loadSIMStatus = async () => {
    try {
      const status = await ussdService.getSIMStatus();
      setSimStatus(status);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load SIM status",
        variant: "destructive",
      });
    }
  };

  const handleActivateSIM = async (simNumber: 1 | 2) => {
    try {
      setSimLoading(prev => ({ ...prev, [`sim${simNumber}`]: true }));
      const success = await ussdService.activateSIM(simNumber);
      if (success) {
        setSimStatus(prev => prev ? {
          ...prev,
          [`sim${simNumber}`]: { ...prev[`sim${simNumber}` as keyof DualSIMStatus], isActive: true }
        } : null);
        toast({
          title: "Success",
          description: `SIM ${simNumber} activated successfully`,
        });
      } else {
        throw new Error("Activation failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to activate SIM ${simNumber}`,
        variant: "destructive",
      });
    } finally {
      setSimLoading(prev => ({ ...prev, [`sim${simNumber}`]: false }));
    }
  };

  const handleDeactivateSIM = async (simNumber: 1 | 2) => {
    try {
      setSimLoading(prev => ({ ...prev, [`sim${simNumber}`]: true }));
      const success = await ussdService.deactivateSIM(simNumber);
      if (success) {
        setSimStatus(prev => prev ? {
          ...prev,
          [`sim${simNumber}`]: { ...prev[`sim${simNumber}` as keyof DualSIMStatus], isActive: false }
        } : null);
        toast({
          title: "Success",
          description: `SIM ${simNumber} deactivated successfully`,
        });
      } else {
        throw new Error("Deactivation failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to deactivate SIM ${simNumber}`,
        variant: "destructive",
      });
    } finally {
      setSimLoading(prev => ({ ...prev, [`sim${simNumber}`]: false }));
    }
  };

  const handleToggleDevice = async (deviceId: string, currentStatus: string) => {
    try {
      setDeviceLoading(prev => ({ ...prev, [deviceId]: true }));
      
      const isGoingOnline = currentStatus !== 'online';
      
      // Toggle device status
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Also toggle all SIM cards based on device status
      if (isGoingOnline) {
        // Activate both SIM cards
        await handleActivateSIM(1);
        await handleActivateSIM(2);
        toast({
          title: "Success",
          description: "Device and all SIM cards activated successfully",
        });
      } else {
        // Deactivate both SIM cards
        await handleDeactivateSIM(1);
        await handleDeactivateSIM(2);
        toast({
          title: "Success",
          description: "Device and all SIM cards deactivated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle device status",
        variant: "destructive",
      });
    } finally {
      setDeviceLoading(prev => ({ ...prev, [deviceId]: false }));
    }
  };

  const handleAddActivationCode = () => {
    if (!activationForm.code || !activationForm.operator || !activationForm.sim) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newCode = {
      id: Date.now().toString(),
      code: activationForm.code,
      operator: activationForm.operator,
      sim: activationForm.sim,
      status: 'Active',
      description: activationForm.description
    };

    setActivationCodes(prev => [...prev, newCode]);
    setActivationForm({ code: '', operator: '', sim: '', description: '' });
    
    toast({
      title: "Success",
      description: "Activation code added successfully",
    });
  };

  const handleDeleteActivationCode = (id: string) => {
    setActivationCodes(prev => prev.filter(code => code.id !== id));
    toast({
      title: "Success",
      description: "Activation code deleted successfully",
    });
  };

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
            <TabsTrigger value="devices" className="gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Devices</span>
            </TabsTrigger>
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
            <TabsTrigger value="simcards" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">SIM Cards</span>
            </TabsTrigger>
          </TabsList>

          {/* Devices & SIM Management Tab */}
          <TabsContent value="devices" className="space-y-6">
            {/* Device Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{devices.length}</p>
                      <p className="text-sm text-muted-foreground">Total Devices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      simStatus?.sim1.isActive || simStatus?.sim2.isActive ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      <Signal className={`h-5 w-5 ${
                        simStatus?.sim1.isActive || simStatus?.sim2.isActive ? 'text-success' : 'text-destructive'
                      }`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {(simStatus?.sim1.isActive ? 1 : 0) + (simStatus?.sim2.isActive ? 1 : 0)}/2
                      </p>
                      <p className="text-sm text-muted-foreground">Active SIMs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
                      <Wifi className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">1</p>
                      <p className="text-sm text-muted-foreground">Online Devices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Devices with SIM Cards */}
            {devices.map((device) => (
              <Card key={device.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                        device.status === 'online' ? 'bg-success/10' : 'bg-destructive/10'
                      }`}>
                        <Smartphone className={`h-5 w-5 ${
                          device.status === 'online' ? 'text-success' : 'text-destructive'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <CardDescription>
                          {device.type} • {device.location} • Last seen: {device.lastSeen}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                        {device.status === 'online' ? 'Online' : 'Offline'}
                      </Badge>
                      <Button
                        variant={device.status === 'online' ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => handleToggleDevice(device.id, device.status)}
                        disabled={deviceLoading[device.id as keyof typeof deviceLoading]}
                      >
                        {device.status === 'online' ? (
                          <>
                            <WifiOff className="h-4 w-4 mr-2" />
                            {deviceLoading[device.id as keyof typeof deviceLoading] ? "Disabling..." : "Disable"}
                          </>
                        ) : (
                          <>
                            <Wifi className="h-4 w-4 mr-2" />
                            {deviceLoading[device.id as keyof typeof deviceLoading] ? "Enabling..." : "Enable"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">SIM Cards Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* SIM 1 */}
                      {simStatus && (
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                                simStatus.sim1.isActive ? 'bg-success/10' : 'bg-destructive/10'
                              }`}>
                                <Signal className={`h-4 w-4 ${
                                  simStatus.sim1.isActive ? 'text-success' : 'text-destructive'
                                }`} />
                              </div>
                              <div>
                                <h5 className="font-medium text-foreground">SIM 1</h5>
                                <p className="text-sm text-muted-foreground">
                                  {simStatus.sim1.phoneNumber || "No number"}
                                </p>
                              </div>
                            </div>
                            <Badge variant={simStatus.sim1.isActive ? 'default' : 'destructive'}>
                              {simStatus.sim1.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            {simStatus.sim1.carrier && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Operator:</span>
                                <Badge variant={simStatus.sim1.carrier === 'INWI' ? 'default' : simStatus.sim1.carrier === 'ORANGE' ? 'secondary' : 'outline'}>
                                  {simStatus.sim1.carrier}
                                </Badge>
                              </div>
                            )}
                            {simStatus.sim1.dailyOperations !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Daily Operations:</span>
                                <span className={`font-medium ${
                                  (simStatus.sim1.dailyOperations >= (simStatus.sim1.operationsLimit || 20)) 
                                    ? 'text-destructive' : 'text-foreground'
                                }`}>
                                  {simStatus.sim1.dailyOperations}/{simStatus.sim1.operationsLimit || 20}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {simStatus.sim1.isActive ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeactivateSIM(1)}
                                disabled={simLoading.sim1}
                                className="flex-1"
                              >
                                <PowerOff className="h-4 w-4 mr-2" />
                                {simLoading.sim1 ? "Deactivating..." : "Deactivate"}
                              </Button>
                            ) : (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleActivateSIM(1)}
                                disabled={simLoading.sim1}
                                className="flex-1"
                              >
                                <Power className="h-4 w-4 mr-2" />
                                {simLoading.sim1 ? "Activating..." : "Activate"}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* SIM 2 */}
                      {simStatus && (
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                                simStatus.sim2.isActive ? 'bg-success/10' : 'bg-destructive/10'
                              }`}>
                                <Signal className={`h-4 w-4 ${
                                  simStatus.sim2.isActive ? 'text-success' : 'text-destructive'
                                }`} />
                              </div>
                              <div>
                                <h5 className="font-medium text-foreground">SIM 2</h5>
                                <p className="text-sm text-muted-foreground">
                                  {simStatus.sim2.phoneNumber || "No number"}
                                </p>
                              </div>
                            </div>
                            <Badge variant={simStatus.sim2.isActive ? 'default' : 'destructive'}>
                              {simStatus.sim2.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            {simStatus.sim2.carrier && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Operator:</span>
                                <Badge variant={simStatus.sim2.carrier === 'INWI' ? 'default' : simStatus.sim2.carrier === 'ORANGE' ? 'secondary' : 'outline'}>
                                  {simStatus.sim2.carrier}
                                </Badge>
                              </div>
                            )}
                            {simStatus.sim2.dailyOperations !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Daily Operations:</span>
                                <span className={`font-medium ${
                                  (simStatus.sim2.dailyOperations >= (simStatus.sim2.operationsLimit || 20)) 
                                    ? 'text-destructive' : 'text-foreground'
                                }`}>
                                  {simStatus.sim2.dailyOperations}/{simStatus.sim2.operationsLimit || 20}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {simStatus.sim2.isActive ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeactivateSIM(2)}
                                disabled={simLoading.sim2}
                                className="flex-1"
                              >
                                <PowerOff className="h-4 w-4 mr-2" />
                                {simLoading.sim2 ? "Deactivating..." : "Deactivate"}
                              </Button>
                            ) : (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleActivateSIM(2)}
                                disabled={simLoading.sim2}
                                className="flex-1"
                              >
                                <Power className="h-4 w-4 mr-2" />
                                {simLoading.sim2 ? "Activating..." : "Activate"}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* USSD Activation Tab */}
          <TabsContent value="activation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>USSD Activation Management</CardTitle>
                <CardDescription>Manage activation codes and operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Activation Code *</Label>
                    <Input 
                      placeholder="*100#" 
                      value={activationForm.code}
                      onChange={(e) => setActivationForm(prev => ({ ...prev, code: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Operator *</Label>
                    <Select value={activationForm.operator} onValueChange={(value) => setActivationForm(prev => ({ ...prev, operator: value }))}>
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
                    <Label>SIM Slot *</Label>
                    <Select value={activationForm.sim} onValueChange={(value) => setActivationForm(prev => ({ ...prev, sim: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select SIM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SIM 1">SIM 1</SelectItem>
                        <SelectItem value="SIM 2">SIM 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input 
                      placeholder="Balance check, etc." 
                      value={activationForm.description}
                      onChange={(e) => setActivationForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={handleAddActivationCode}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activation Code
                </Button>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>SIM</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activationCodes.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell className="font-mono">{code.code}</TableCell>
                          <TableCell className="text-muted-foreground">{code.description || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={code.operator === 'INWI' ? 'default' : code.operator === 'ORANGE' ? 'secondary' : 'outline'}>
                              {code.operator}
                            </Badge>
                          </TableCell>
                          <TableCell>{code.sim}</TableCell>
                          <TableCell>
                            <Badge variant="default">{code.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteActivationCode(code.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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
                      {simStatus && (
                        <>
                          <TableRow>
                            <TableCell className="font-medium">
                              {simStatus.sim1.phoneNumber || "+212 6XX XXX XXX"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={simStatus.sim1.carrier === 'INWI' ? 'default' : simStatus.sim1.carrier === 'ORANGE' ? 'secondary' : 'outline'}>
                                {simStatus.sim1.carrier || 'INWI'}
                              </Badge>
                            </TableCell>
                            <TableCell>SIM 1</TableCell>
                            <TableCell>
                              <Badge variant={simStatus.sim1.isActive ? 'default' : 'destructive'}>
                                {simStatus.sim1.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {simStatus.sim1.dailyOperations || 5}/{simStatus.sim1.operationsLimit || 20}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {simStatus.sim1.isActive ? (
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeactivateSIM(1)}
                                    disabled={simLoading.sim1}
                                  >
                                    <PowerOff className="h-4 w-4 mr-2" />
                                    {simLoading.sim1 ? "Deactivating..." : "Deactivate"}
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleActivateSIM(1)}
                                    disabled={simLoading.sim1}
                                  >
                                    <Power className="h-4 w-4 mr-2" />
                                    {simLoading.sim1 ? "Activating..." : "Activate"}
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              {simStatus.sim2.phoneNumber || "+212 7XX XXX XXX"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={simStatus.sim2.carrier === 'INWI' ? 'default' : simStatus.sim2.carrier === 'ORANGE' ? 'secondary' : 'outline'}>
                                {simStatus.sim2.carrier || 'ORANGE'}
                              </Badge>
                            </TableCell>
                            <TableCell>SIM 2</TableCell>
                            <TableCell>
                              <Badge variant={simStatus.sim2.isActive ? 'default' : 'destructive'}>
                                {simStatus.sim2.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {simStatus.sim2.dailyOperations || 12}/{simStatus.sim2.operationsLimit || 20}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {simStatus.sim2.isActive ? (
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeactivateSIM(2)}
                                    disabled={simLoading.sim2}
                                  >
                                    <PowerOff className="h-4 w-4 mr-2" />
                                    {simLoading.sim2 ? "Deactivating..." : "Deactivate"}
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleActivateSIM(2)}
                                    disabled={simLoading.sim2}
                                  >
                                    <Power className="h-4 w-4 mr-2" />
                                    {simLoading.sim2 ? "Activating..." : "Activate"}
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </>
                      )}
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
