import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Smartphone, Database, Zap, Power, PowerOff, Signal, Edit, Trash2, Play, Settings, Users, CreditCard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import AddUSSDDialog from "@/components/AddUSSDDialog";
import { USSDCode, DualSIMStatus } from "@/types/ussd";
import { ussdService } from "@/services/ussdService";

const Index = () => {
  const navigate = useNavigate();
  const [ussdCodes, setUssdCodes] = useState<USSDCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<USSDCode | null>(null);
  const [simStatus, setSimStatus] = useState<DualSIMStatus | null>(null);
  const [simLoading, setSimLoading] = useState({ sim1: false, sim2: false });
  const { toast } = useToast();

  const categories = ["All", ...new Set(ussdCodes.map(code => code.category).filter(Boolean))];

  useEffect(() => {
    loadUSSDCodes();
    loadSIMStatus();
  }, []);

  const loadUSSDCodes = async () => {
    try {
      setLoading(true);
      const codes = await ussdService.getAllUSSDCodes();
      setUssdCodes(codes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load USSD codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddCode = async (codeData: Omit<USSDCode, 'id' | 'created_at'>) => {
    try {
      if (editingCode) {
        const updated = await ussdService.updateUSSDCode(editingCode.id, codeData);
        setUssdCodes(codes => codes.map(c => c.id === updated.id ? updated : c));
        toast({
          title: "Success",
          description: "USSD code updated successfully",
        });
      } else {
        const newCode = await ussdService.addUSSDCode(codeData);
        setUssdCodes(codes => [...codes, newCode]);
        toast({
          title: "Success", 
          description: "USSD code added successfully",
        });
      }
      setEditingCode(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save USSD code",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCode = async (id: string) => {
    try {
      await ussdService.deleteUSSDCode(id);
      setUssdCodes(codes => codes.filter(c => c.id !== id));
      toast({
        title: "Success",
        description: "USSD code deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete USSD code",
        variant: "destructive",
      });
    }
  };

  const handleEditCode = (code: USSDCode) => {
    setEditingCode(code);
    setDialogOpen(true);
  };

  const handleExecuteCode = async (code: string) => {
    return await ussdService.executeUSSDCode(code);
  };

  // Clear pending operations
  const handleClearPending = async () => {
    setLoading(true);
    try {
      await ussdService.clearPendingOperations();
      await loadUSSDCodes();
      toast({
        title: "Success",
        description: "All pending operations have been cleared.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear pending operations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCodes = ussdCodes.filter(code => {
    const matchesSearch = code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || code.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-pulse flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mx-auto">
            <Database className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading USSD codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Smartphone className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">USSD Manager</h1>
                <p className="text-sm text-muted-foreground">Execute and manage USSD codes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
              <Button onClick={() => {
                setEditingCode(null);
                setDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Code
              </Button>
              
                <Button 
                  variant="outline" 
                  onClick={handleClearPending}
                  disabled={loading || !ussdCodes.some(code => code.status === 'pending')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Pending
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Management
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/management?tab=activation")}>
                      <Zap className="h-4 w-4 mr-2" />
                      USSD Activation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/management?tab=topup")}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      USSD Top-up
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/management?tab=users")}>
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/management?tab=devices")}>
                      <Smartphone className="h-4 w-4 mr-2" />
                      Devices & SIM Cards
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/management?tab=simcards")}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      SIM Card Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Dual SIM Management */}
        {simStatus && (
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Dual SIM Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SIM 1 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      simStatus.sim1.isActive ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      <Signal className={`h-5 w-5 ${
                        simStatus.sim1.isActive ? 'text-success' : 'text-destructive'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">SIM 1</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`font-medium ${
                          simStatus.sim1.isActive ? 'text-success' : 'text-destructive'
                        }`}>
                          {simStatus.sim1.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {simStatus.sim1.carrier && (
                          <Badge variant={simStatus.sim1.carrier === 'INWI' ? 'default' : simStatus.sim1.carrier === 'ORANGE' ? 'secondary' : 'outline'}>
                            {simStatus.sim1.carrier}
                          </Badge>
                        )}
                      </div>
                      {simStatus.sim1.dailyOperations !== undefined && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Operations: {simStatus.sim1.dailyOperations}/{simStatus.sim1.operationsLimit || 20}
                          {(simStatus.sim1.dailyOperations >= (simStatus.sim1.operationsLimit || 20)) && (
                            <span className="text-destructive ml-1">(Limit reached)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
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
                
                {simStatus.sim1.phoneNumber && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Phone:</span> {simStatus.sim1.phoneNumber}
                  </div>
                )}
              </div>

              {/* SIM 2 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      simStatus.sim2.isActive ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      <Signal className={`h-5 w-5 ${
                        simStatus.sim2.isActive ? 'text-success' : 'text-destructive'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">SIM 2</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`font-medium ${
                          simStatus.sim2.isActive ? 'text-success' : 'text-destructive'
                        }`}>
                          {simStatus.sim2.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {simStatus.sim2.carrier && (
                          <Badge variant={simStatus.sim2.carrier === 'INWI' ? 'default' : simStatus.sim2.carrier === 'ORANGE' ? 'secondary' : 'outline'}>
                            {simStatus.sim2.carrier}
                          </Badge>
                        )}
                      </div>
                      {simStatus.sim2.dailyOperations !== undefined && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Operations: {simStatus.sim2.dailyOperations}/{simStatus.sim2.operationsLimit || 20}
                          {(simStatus.sim2.dailyOperations >= (simStatus.sim2.operationsLimit || 20)) && (
                            <span className="text-destructive ml-1">(Limit reached)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
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
                
                {simStatus.sim2.phoneNumber && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Phone:</span> {simStatus.sim2.phoneNumber}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ussdCodes.length}</p>
                <p className="text-sm text-muted-foreground">Total Codes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length - 1}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                simStatus?.sim1.isActive || simStatus?.sim2.isActive ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                <Smartphone className={`h-5 w-5 ${
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
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* USSD Codes Table */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>SIM</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>USSD Code</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.id}</TableCell>
                  <TableCell>
                    <Badge variant={code.type === 'TOPUP' ? 'default' : 'secondary'}>
                      {code.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={code.operator === 'INWI' ? 'default' : code.operator === 'ORANGE' ? 'secondary' : 'outline'}
                      >
                        SIM {code.sim} - {code.operator}
                      </Badge>
                      {simStatus && ussdService.canExecuteUSSD(code, code.sim, simStatus) ? (
                        <span className="text-xs text-success">✓</span>
                      ) : (
                        <span className="text-xs text-destructive">✗</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{code.device}</TableCell>
                  <TableCell className="font-mono">{code.code}</TableCell>
                  <TableCell>{code.operator}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={code.status === 'done' ? 'default' : code.status === 'failed' ? 'destructive' : 'secondary'}
                    >
                      {code.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExecuteCode(code.code)}
                        className="h-8 w-8 p-0"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCode(code)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCode(code.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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

        {filteredCodes.length === 0 && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No USSD codes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Add your first USSD code to get started"}
            </p>
            <Button onClick={() => {
              setEditingCode(null);
              setDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Code
            </Button>
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <AddUSSDDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleAddCode}
        editingCode={editingCode}
      />
    </div>
  );
};

export default Index;
