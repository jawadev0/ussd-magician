import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ArrowLeft, Smartphone, Power, PowerOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DualSIMStatus } from "@/types/ussd";
import { ussdService } from "@/services/ussdService";

const SimCards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [simStatus, setSimStatus] = useState<DualSIMStatus | null>(null);
  const [simLoading, setSimLoading] = useState({ sim1: false, sim2: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [simFeatures, setSimFeatures] = useState({
    sim1: { topup: true, activation: true },
    sim2: { topup: false, activation: true }
  });

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

  const handleToggleSIMFeature = (simNumber: 1 | 2, feature: 'topup' | 'activation') => {
    setSimFeatures(prev => ({
      ...prev,
      [`sim${simNumber}`]: {
        ...prev[`sim${simNumber}` as keyof typeof prev],
        [feature]: !prev[`sim${simNumber}` as keyof typeof prev][feature]
      }
    }));

    const isEnabled = !simFeatures[`sim${simNumber}` as keyof typeof simFeatures][feature];
    
    toast({
      title: "Success",
      description: `${feature.charAt(0).toUpperCase() + feature.slice(1)} ${isEnabled ? 'enabled' : 'disabled'} for SIM ${simNumber}`,
    });
  };

  const shouldShowSIM1 = !searchTerm || 
    (simStatus?.sim1.phoneNumber && simStatus.sim1.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (simStatus?.sim1.carrier && simStatus.sim1.carrier.toLowerCase().includes(searchTerm.toLowerCase())) ||
    'sim 1'.includes(searchTerm.toLowerCase()) ||
    'main device'.toLowerCase().includes(searchTerm.toLowerCase());

  const shouldShowSIM2 = !searchTerm || 
    (simStatus?.sim2.phoneNumber && simStatus.sim2.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (simStatus?.sim2.carrier && simStatus.sim2.carrier.toLowerCase().includes(searchTerm.toLowerCase())) ||
    'sim 2'.includes(searchTerm.toLowerCase()) ||
    'main device'.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/management")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <CreditCard className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SIM Cards</h1>
                <p className="text-sm text-muted-foreground">Manage SIM cards and configurations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
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

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SIM cards by phone, operator, or device..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Slot</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Daily Ops</TableHead>
                    <TableHead>Top-up</TableHead>
                    <TableHead>Activation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simStatus && (
                    <>
                      {shouldShowSIM1 && (
                        <TableRow>
                          <TableCell className="font-medium">
                            {simStatus.sim1.phoneNumber || "+212 6XX XXX XXX"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={simStatus.sim1.carrier === 'INWI' ? 'default' : simStatus.sim1.carrier === 'ORANGE' ? 'secondary' : 'outline'}>
                              {simStatus.sim1.carrier || 'INWI'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded">
                                <Smartphone className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-sm font-medium">Main Device</span>
                            </div>
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
                          <TableCell>
                            <Button
                              variant={simFeatures.sim1.topup ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleSIMFeature(1, 'topup')}
                            >
                              {simFeatures.sim1.topup ? "Enabled" : "Disabled"}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={simFeatures.sim1.activation ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleSIMFeature(1, 'activation')}
                            >
                              {simFeatures.sim1.activation ? "Enabled" : "Disabled"}
                            </Button>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {shouldShowSIM2 && (
                        <TableRow>
                          <TableCell className="font-medium">
                            {simStatus.sim2.phoneNumber || "+212 7XX XXX XXX"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={simStatus.sim2.carrier === 'INWI' ? 'default' : simStatus.sim2.carrier === 'ORANGE' ? 'secondary' : 'outline'}>
                              {simStatus.sim2.carrier || 'ORANGE'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded">
                                <Smartphone className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-sm font-medium">Main Device</span>
                            </div>
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
                          <TableCell>
                            <Button
                              variant={simFeatures.sim2.topup ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleSIMFeature(2, 'topup')}
                            >
                              {simFeatures.sim2.topup ? "Enabled" : "Disabled"}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={simFeatures.sim2.activation ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleSIMFeature(2, 'activation')}
                            >
                              {simFeatures.sim2.activation ? "Enabled" : "Disabled"}
                            </Button>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )}
                  {(!shouldShowSIM1 && !shouldShowSIM2) && searchTerm && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No SIM cards found matching "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SimCards;
