import { useState, useEffect } from "react";
import { Smartphone, Power, PowerOff, Signal, Wifi, WifiOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DualSIMStatus } from "@/types/ussd";
import { ussdService } from "@/services/ussdService";

const Devices = () => {
  const { toast } = useToast();
  
  const [simStatus, setSimStatus] = useState<DualSIMStatus | null>(null);
  const [simLoading, setSimLoading] = useState({ sim1: false, sim2: false });
  const [deviceLoading, setDeviceLoading] = useState({ device1: false });
  const [searchTerm, setSearchTerm] = useState('');

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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isGoingOnline) {
        await handleActivateSIM(1);
        await handleActivateSIM(2);
        toast({
          title: "Success",
          description: "Device and all SIM cards activated successfully",
        });
      } else {
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

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Devices</h1>
          <p className="text-sm text-muted-foreground">Manage devices and SIM cards</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices by name, ID, type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredDevices.map((device) => (
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
        
        {filteredDevices.length === 0 && searchTerm && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                No devices found matching "{searchTerm}"
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Devices;
