import { useState, useEffect } from "react";
import { Plus, Smartphone, Database, Zap, Power, PowerOff, Signal, Edit, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import AddUSSDDialog from "@/components/AddUSSDDialog";
import { USSDCode, SIMStatus } from "@/types/ussd";
import { ussdService } from "@/services/ussdService";

const Index = () => {
  const [ussdCodes, setUssdCodes] = useState<USSDCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<USSDCode | null>(null);
  const [simStatus, setSimStatus] = useState<SIMStatus | null>(null);
  const [simLoading, setSimLoading] = useState(false);
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

  const handleActivateSIM = async () => {
    try {
      setSimLoading(true);
      const success = await ussdService.activateSIM();
      if (success) {
        setSimStatus(prev => prev ? { ...prev, isActive: true } : null);
        toast({
          title: "Success",
          description: "SIM activated successfully",
        });
      } else {
        throw new Error("Activation failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate SIM",
        variant: "destructive",
      });
    } finally {
      setSimLoading(false);
    }
  };

  const handleDeactivateSIM = async () => {
    try {
      setSimLoading(true);
      const success = await ussdService.deactivateSIM();
      if (success) {
        setSimStatus(prev => prev ? { ...prev, isActive: false } : null);
        toast({
          title: "Success",
          description: "SIM deactivated successfully",
        });
      } else {
        throw new Error("Deactivation failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate SIM",
        variant: "destructive",
      });
    } finally {
      setSimLoading(false);
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
            
            <Button onClick={() => {
              setEditingCode(null);
              setDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Code
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* SIM Status Card */}
        {simStatus && (
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                  simStatus.isActive ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  <Signal className={`h-6 w-6 ${
                    simStatus.isActive ? 'text-success' : 'text-destructive'
                  }`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">SIM Status</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className={`font-medium ${
                      simStatus.isActive ? 'text-success' : 'text-destructive'
                    }`}>
                      {simStatus.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {simStatus.carrier && <span>• {simStatus.carrier}</span>}
                    {simStatus.signalStrength && <span>• {simStatus.signalStrength}% Signal</span>}
                    {simStatus.networkType && <span>• {simStatus.networkType}</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {simStatus.isActive ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeactivateSIM}
                    disabled={simLoading}
                  >
                    <PowerOff className="h-4 w-4 mr-2" />
                    {simLoading ? "Deactivating..." : "Deactivate"}
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleActivateSIM}
                    disabled={simLoading}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    {simLoading ? "Activating..." : "Activate"}
                  </Button>
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
                simStatus?.isActive ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                <Smartphone className={`h-5 w-5 ${
                  simStatus?.isActive ? 'text-success' : 'text-destructive'
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {simStatus?.isActive ? 'Active' : 'Inactive'}
                </p>
                <p className="text-sm text-muted-foreground">SIM Status</p>
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
                <TableHead>SIM Card</TableHead>
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
                    <Badge 
                      variant={code.simCard === 'INWI' ? 'default' : code.simCard === 'ORANGE' ? 'secondary' : 'outline'}
                    >
                      {code.simCard}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{code.device}</TableCell>
                  <TableCell className="font-mono">{code.code}</TableCell>
                  <TableCell>{code.operator}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={code.status === 'active' ? 'default' : code.status === 'inactive' ? 'destructive' : 'secondary'}
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
